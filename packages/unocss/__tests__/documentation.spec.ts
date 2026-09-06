import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { createGenerator, presetMini } from 'unocss';
import { compile, compileString } from '../../index/__tests__/fixtures/sass';
import { extractLegacyUtilities } from '../../index/__tests__/fixtures/utilities';
import { presetStyle } from '../src';

const documents = [
	'../../../README.md',
	'../../../docs/style/DOCUMENT.md',
	'../../../docs/unocss/DOCUMENT.md',
	'../../../docs/start/installation.md',
	'../../../docs/start/integration.md',
	'../../../docs/style/reference-examples.md',
	'../../../docs/unocss/mini.md',
	'../../index/README.md',
	'../README.md'
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));

const removedTokens = [
	'g-col', 'g-col-2',
	...Array.from({ length: 5 }, (_, total) => total + 1).flatMap(total => (
		Array.from({ length: total }, (_, part) => `g-${part + 1}of${total}`)
	)),
	'g-fw-w', 'g-fw-wr', 'g-fw-n', 'g-fw-1', 'g-row',
	'g-bs', 'g-bs-t', 'g-bs-bb', 'g-b', 'g-bt', 'g-br', 'g-bb', 'g-bl',
	'g-dp-n', 'g-dp-b', 'g-dp-i', 'g-dp-ib',
	'g-tc', 'g-tl', 'g-tr', 'g-width-full', 'g-height-full',
	'g-td-lh', 'g-td-ul', 'g-nowrap', 'g-break',
	'g-line-one', 'g-line-two', 'g-lh-one', 'g-lh-two', 'g-divide',
	'g-td-ol', 'g-td-n',
	'g-ar-sq', 'g-ar-v', 'g-od-f', 'g-od-l', 'g-od-n',
	'g-stroke-offset-2'
];

const removedPrefixes = [
	'g-img-', 'g-imgc-', 'g-imgr-',
	'g-g-x-', 'g-g-col-', 'g-g-y-', 'g-g-row-', 'g-tdo-',
	'g-stroke-dash-[', 'g-stroke-offset-('
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('public documentation', () => {
	it('covers every current Sass utility without documenting unavailable table patterns', () => {
		const reference = readFileSync(`${process.cwd()}/docs/style/DOCUMENT.md`, 'utf8');
		const tokens = extractLegacyUtilities(compile().css);
		const patterns = reference.split('\n').filter(line => line.startsWith('| `g-'))
			.flatMap(line => [...line.split('|')[1].matchAll(/`(g-[^`]+)`/g)].map(match => match[1]));
		/*
		 * 表格占位符只验证规则族覆盖，具体集合与声明继续由样式测试验证。
		 */
		const regexps = patterns.map(pattern => new RegExp(`^${escapeRegExp(pattern)
			.replace(/\\\{(?:n|part|total)\\\}/g, '\\d+')
			.replace(/\\\{(?:value|color|key)\\\}/g, '[a-z0-9-]+')}$`));
		for (const token of tokens) expect(regexps.some(pattern => pattern.test(token)), token).toBe(true);
		for (const pattern of regexps) expect(tokens.some(token => pattern.test(token)), `${pattern}`).toBe(true);
	});

	it('keeps every rule module represented in the UnoCSS reference', () => {
		const reference = readFileSync(`${process.cwd()}/docs/unocss/DOCUMENT.md`, 'utf8');
		for (const file of readdirSync(`${process.cwd()}/packages/unocss/src/rules`)) {
			if (file === 'index.ts' || file === 'utils.ts') continue;
			expect(reference, file).toContain(`rules/${file}`);
		}
	});

	it('uses generated Sass classes in the package example and Playgrounds', () => {
		const tokens = new Set(extractLegacyUtilities(compile().css));
		for (const file of ['packages/index/README.md', 'docs/style/reference-examples.md']) {
			const reference = readFileSync(`${process.cwd()}/${file}`, 'utf8');
			const blocks = [...reference.matchAll(/```(?:html|vue)\n([\s\S]*?)```/g)];
			for (const [, block] of blocks) {
				for (const [token] of block.matchAll(/\bg-[a-z0-9-]+(?:\/\d+)?/g)) {
					expect(tokens.has(token), `${file}: ${token}`).toBe(true);
				}
			}
		}
	});

	it('compiles standalone Sass configuration and API examples', () => {
		for (const file of ['packages/index/README.md', 'docs/start/installation.md', 'docs/style/reference-examples.md']) {
			const reference = readFileSync(`${process.cwd()}/${file}`, 'utf8');
			for (const [, block] of reference.matchAll(/```scss\n([\s\S]*?)```/g)) {
				expect(() => compileString(block.replaceAll('@deot/style/src/', '')), file).not.toThrow();
			}
		}
	});

	it('compiles integration themes before their global entry for px, rem and rpx', () => {
		const reference = readFileSync(`${process.cwd()}/docs/start/integration.md`, 'utf8');
		const blocks = [...reference.matchAll(/```scss\n([\s\S]*?)```/g)]
			.map(([, block]) => block).filter(block => /^\/\/ styles\/(?:theme|global)\.scss/.test(block));
		const expected = [
			'.g-pd-16{padding:16px}', '.g-pd-32{padding:32rem}', '.g-pd-32{padding:32rpx}'
		];
		expect(blocks).toHaveLength(expected.length * 2);
		for (const [index, declaration] of expected.entries()) {
			expect(blocks[index * 2]).toContain('// styles/theme.scss');
			expect(blocks[index * 2 + 1]).toContain('// styles/global.scss');
			const input = blocks.slice(index * 2, index * 2 + 2).join('\n').replaceAll('@deot/style/src/', '');
			expect(compileString(input).css).toContain(declaration);
		}
	});

	it('generates every concrete token demonstrated in the UnoCSS reference', async () => {
		const reference = readFileSync(`${process.cwd()}/docs/unocss/DOCUMENT.md`, 'utf8');
		const tokens = [...new Set([...reference.matchAll(/`(g-[^`\s]+)`/g)].map(match => match[1]))]
			.filter(token => !/[{}*]/.test(token) && !token.endsWith('[]') && !token.endsWith('()'))
			.filter(token => !/^g-[a-z-]+\/[a-z]/.test(token));
		const uno = await createGenerator({ presets: [presetStyle()] });
		const { matched } = await uno.generate(tokens);
		for (const token of tokens) expect(matched.has(token), token).toBe(true);
	});

	it('keeps Mini comparison tokens classified by their actual source', async () => {
		const reference = readFileSync(`${process.cwd()}/docs/unocss/mini.md`, 'utf8');
		const rows = reference.split('\n').filter(line => /^\| (?:\*\*覆盖|覆盖|本仓库有|Mini 有)/.test(line));
		const own = await createGenerator({ presets: [presetStyle()] });
		const mini = await createGenerator({ presets: [presetMini({ prefix: 'g-' })] });
		const presets = [presetMini({ prefix: 'g-' }), presetStyle({ variants: false })];
		const combinations = await Promise.all([
			createGenerator({ presets }), createGenerator({ presets: [...presets].reverse() })
		]);
		const compact = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, '');
		for (const row of rows) {
			const tokens = [...row.split('|')[1].matchAll(/`(g-[^`]+)`/g)].map(match => match[1]);
			const ownOutput = await own.generate(tokens, { preflights: false });
			const miniOutput = await mini.generate(tokens, { preflights: false });
			for (const token of tokens) {
				expect(ownOutput.matched.has(token), token).toBe(!row.startsWith('| Mini 有'));
				expect(miniOutput.matched.has(token), token).toBe(!row.startsWith('| 本仓库有'));
			}
			for (const combination of combinations) {
				const output = await combination.generate(tokens, { preflights: false });
				const expected = row.startsWith('| Mini 有') ? miniOutput : ownOutput;
				expect(compact(output.css), tokens.join(' ')).toBe(compact(expected.css));
			}
		}
	});

	it('resolves nested documents, existing routes and local Markdown links', () => {
		const html = readFileSync(`${process.cwd()}/index.html`, 'utf8');
		const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
		expect(script).toBeTruthy();
		const window = {} as any;
		runInNewContext(script!, {
			window,
			location: { pathname: '/zh-CN/guide/introduction', origin: 'http://localhost:5173' },
			URL
		});
		const config = window.$docs;
		const paths = [
			'README.md', 'packages/index/README.md', 'packages/unocss/README.md',
			...readdirSync(`${process.cwd()}/docs`, { recursive: true })
				.filter(file => String(file).endsWith('.md')).map(file => `docs/${file}`)
		];
		for (const path of paths) {
			expect(config.resolve.resource({ source: path, runtime: { mode: 'development' } })).toBe(`/${path}`);
			expect(config.resolve.resource({ source: path, runtime: { mode: 'production' } })).toContain(path);
			const markdown = readFileSync(`${process.cwd()}/${path}`, 'utf8');
			for (const [, href] of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
				const repositoryBase = 'https://github.com/deot/style/blob/main/';
				if (href.startsWith(repositoryBase)) {
					expect(existsSync(resolve(process.cwd(), href.slice(repositoryBase.length))), href).toBe(true);
					if (href.endsWith('.md')) {
						expect(config.resolve.link({ href, lang: 'zh-CN', source: path })).toMatch(/^\/zh-CN\/guide\//);
					}
					continue;
				}
				if (/^(?:https?:|#)/.test(href)) continue;
				const target = resolve(process.cwd(), dirname(path), href.split('#')[0]);
				expect(existsSync(target), `${path}: ${href}`).toBe(true);
				if (href.endsWith('.md') && !href.includes('.github')) {
					expect(config.resolve.link({ href, lang: 'zh-CN', source: path })).toMatch(/^\/zh-CN\/guide\//);
				}
			}
		}
		for (const route of [
			'introduction', 'getting-started', 'integration', 'unocss', 'sass',
			'utilities', 'deprecated', 'playground', 'unocss-mini', 'unocss-utilities'
		]) {
			expect(config.routes[`/guide/${route}`]).toBeTruthy();
		}
		expect(config.resolve.resource({ source: 'docs/../../package.json', runtime: { mode: 'development' } })).toBeUndefined();
		const sidebar = config.routes['/guide/introduction'].sidebar['zh-CN'];
		expect(sidebar.slice(1).map((item: any) => [item.label, item.children.length])).toEqual([
			['开始使用', 2], ['UnoCSS', 3], ['Style', 4]
		]);
	});

	it('keeps contributor documentation local links valid', () => {
		for (const file of readdirSync(`${process.cwd()}/.github`).filter(name => name.endsWith('.md'))) {
			const markdown = readFileSync(`${process.cwd()}/.github/${file}`, 'utf8');
			for (const [, href] of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
				if (/^(?:[a-z]+:|#)/i.test(href)) continue;
				expect(href, file).not.toBe('/');
				expect(existsSync(resolve(process.cwd(), '.github', href.split('#')[0])), `${file}: ${href}`).toBe(true);
			}
		}
	});

	it('documents every shipped deprecated utility in the dedicated migration table', () => {
		const migration = readFileSync(`${process.cwd()}/docs/style/deprecated.md`, 'utf8');
		const baseline = readFileSync(`${process.cwd()}/packages/index/__tests__/fixtures/deprecated.css`, 'utf8');
		const patterns = migration.split('\n')
			.filter(line => line.startsWith('| `g-'))
			.flatMap(line => [...line.split('|')[1].matchAll(/`(g-[^`]+)`/g)].map(match => match[1]))
			.map(token => new RegExp(`^${escapeRegExp(token).replace(/\\\{(?:part|total|n)\\\}/g, '\\d+')}$`));
		for (const token of extractLegacyUtilities(baseline)) {
			expect(patterns.some(pattern => pattern.test(token)), token).toBe(true);
		}
		expect(migration).toContain('无直接替代');
		expect(migration).toContain('!important');
		expect(migration).toContain('index.deprecated.css');
	});

	it('only presents current utility names', () => {
		for (const document of documents) {
			for (const token of removedTokens) {
				expect(document).not.toMatch(new RegExp(`${escapeRegExp(token)}(?![a-z0-9-])`, 'i'));
			}
			for (const prefix of removedPrefixes) expect(document).not.toContain(prefix);
		}
	});
});
