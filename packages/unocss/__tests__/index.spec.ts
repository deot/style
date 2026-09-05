import { createGenerator } from 'unocss';
import MagicString from 'magic-string';
import { presetStyle } from '../src';

const generate = async (tokens: string, options = {}) => {
	const uno = await createGenerator({ presets: [presetStyle(options)] });
	return uno.generate(tokens);
};

const generateStyleOnly = async (tokens: string) => {
	const { rules = [] } = presetStyle();
	const uno = await createGenerator({ rules });
	return uno.generate(tokens);
};

const compact = (css: string) => css.replace(/\s+/g, '').replace(/;}/g, '}');

const colorNames = [
	'red-mid', 'pink-mid', 'pink-light', 'blue-dark', 'blue-mid', 'blue-light',
	'yellow-dark', 'yellow-mid', 'yellow-light', 'orange-dark', 'orange-mid', 'orange-light',
	'gray-dark', 'gray-mid', 'gray-light', 'black-dark', 'black-mid', 'black-light',
	'purple-dark', 'purple-mid', 'purple-light', 'black', 'white', '444', '67', 'f2', 'f8', 'ef',
	'cd', 'e8', 'd9', 'f4', 'f9', '000', '333', '51', '666', '999', 'aaa', 'bbb', 'bd',
	'info', 'success', 'error', 'warning'
];

const gridUtilities = [
	'g-grid',
	...['gtc', 'gtr'].flatMap(name => [
		...Array.from({ length: 12 }, (_, index) => `g-${name}-${index + 1}`),
		`g-${name}-none`,
		`g-${name}-subgrid`
	]),
	...['gc', 'gr'].flatMap(name => [
		...Array.from({ length: 12 }, (_, index) => `g-${name}-${index + 1}`),
		...Array.from({ length: 12 }, (_, index) => `g-${name}-span-${index + 1}`),
		`g-${name}-span-full`
	]),
	...['gcs', 'gce', 'grs', 'gre'].flatMap(name => (
		Array.from({ length: 12 }, (_, index) => `g-${name}-${index + 1}`)
	)),
	'g-gaf-r', 'g-gaf-c', 'g-gaf-d', 'g-gaf-rd', 'g-gaf-cd'
];

const staticUtilities = [
	'g-reset', 'g-unset',
	'g-flex', 'g-flex-holy', 'g-flex-cc', 'g-flex-ac', 'g-f-0', 'g-f-1', 'g-f-2', 'g-f-1/1',
	...Array.from({ length: 4 }, (_, index) => index + 2).flatMap(total => (
		Array.from({ length: total - 1 }, (_, index) => `g-f-${index + 1}/${total}`)
	)),
	'g-fd-r', 'g-fd-c', 'g-fd-rr', 'g-fd-cr',
	'g-fw-w', 'g-fw-wr', 'g-fw-n',
	'g-jc-fs', 'g-jc-fe', 'g-jc-c', 'g-jc-sb', 'g-jc-sa',
	'g-ai-fs', 'g-ai-fe', 'g-ai-c', 'g-ai-b', 'g-ai-s',
	'g-ac-fs', 'g-ac-fe', 'g-ac-c', 'g-ac-sb', 'g-ac-sa', 'g-ac-s',
	'g-as-a', 'g-as-fs', 'g-as-fe', 'g-as-c', 'g-as-b', 'g-as-s',
	...gridUtilities,
	'g-row', 'g-clearfix', 'g-fl', 'g-fr',
	...Array.from({ length: 12 }, (_, index) => [`g-w-${index + 1}`, `g-fw-${index + 1}`]).flat(),
	'g-pd-s', 'g-pd-tb-s', 'g-pd-lr-s', 'g-pd-t-s', 'g-pd-r-s', 'g-pd-b-s', 'g-pd-l-s',
	'g-fw-bold', 'g-fw-400', 'g-fw-500', 'g-fw-600', 'g-fw-700',
	'g-lh-default', 'g-lh-one', 'g-lh-two', 'g-lh-1', 'g-lh-2',
	'g-tl', 'g-tc', 'g-tr', 'g-td-lh', 'g-td-ul',
	'g-line-nowrap', 'g-nowrap', 'g-line-wrap', 'g-break', 'g-line-one', 'g-line-two',
	...colorNames.flatMap(name => [`g-c-${name}`, `g-bg-${name}`]),
	'g-bg-lg-blue', 'g-bg-lg-yellow',
	'g-fixed', 'g-relative', 'g-absolute', 'g-fixed-full', 'g-absolute-full',
	'g-b', 'g-bt', 'g-br', 'g-bb', 'g-bl', 'g-br-circle', 'g-br-default', 'g-bs', 'g-bs-t',
	'g-h-full', 'g-w-full', 'g-size-full',
	'g-none', 'g-dp-n', 'g-hide', 'g-show', 'g-dp-b', 'g-block',
	'g-dp-i', 'g-inline', 'g-dp-ib', 'g-inline-block',
	'g-operable', 'g-pointer', 'g-disabled', 'g-unanimated', 'g-scroller',
	'g-divide', 'g-dot', 'g-of-h', 'g-bs-bb'
];

const numericUtilities = [
	'g-fs-37', 'g-lh-43', 'g-br-19', 'g-img-41', 'g-imgc-41', 'g-imgr-41',
	'g-f-7', 'g-f-3/7', 'g-fw-350', 'g-t-7', 'g-l-7', 'g-b-7', 'g-r-7',
	...['m', 'pd'].flatMap(name => [
		`g-${name}-7`,
		...['tb', 'lr', 't', 'r', 'b', 'l'].map(direction => `g-${name}-${direction}-7`)
	])
];

describe('presetStyle', () => {
	it('enables the Sass-compatible global reset by default and supports disabling it', async () => {
		const { css: defaultSource } = await generate('');
		const defaultCSS = compact(defaultSource);
		const expectedBody = [
			'body{width:100%;',
			'font-family:"MicrosoftYaHei","微软雅黑","HelveticaNeue",Helvetica,',
			'"PingFangSC","HiraginoSansGB",Arial,sans-serif;',
			'font-size:var(--font-size-default);',
			'-webkit-font-smoothing:antialiased;',
			'-moz-osx-font-smoothing:grayscale;',
			'line-height:var(--line-height-default);',
			'color:var(--color-default);',
			'background-color:var(--background-color-default)}'
		].join('');

		expect(defaultCSS).toContain('html{width:100%;height:100%}');
		expect(defaultCSS).toContain(expectedBody);
		expect(defaultCSS).toContain('*,*::before,*::after{padding:0;margin:0;border:none;box-sizing:border-box}');

		const { css: disabledSource } = await generate('', { reset: false });
		const disabledCSS = compact(disabledSource);

		expect(disabledCSS).not.toContain('html{width:100%;height:100%}');
		expect(disabledCSS).not.toContain('body{width:100%;font-family:');
		expect(disabledCSS).not.toContain('padding:0;margin:0;border:none;box-sizing:border-box');
		expect(disabledCSS).toContain('--font-size-default:14px;');
	});

	it('combines presetMini with @deot/style overrides', async () => {
		const { css: source, matched } = await generate('flex g-flex g-min-h-screen g-m-4 hover:g-m-l-8');
		const css = compact(source);

		expect(matched).not.toContain('flex');
		expect(matched).toEqual(new Set(['g-flex', 'g-min-h-screen', 'g-m-4', 'hover:g-m-l-8']));
		expect(css).toMatch(/\.g-flex\{[^}]*display:flex[^}]*box-sizing:border-box|\.g-flex\{[^}]*box-sizing:border-box[^}]*display:flex/);
		expect(css).toContain('.g-min-h-screen{min-height:100vh}');
		expect(css).toContain('.g-m-4{margin:4px}');
		expect(css).not.toContain('.g-m-4{margin:1rem}');
		expect(css).toContain('.hover\\:g-m-l-8:hover{margin-left:8px}');
	});

	it('expands variant groups without consuming CSS Variable shorthand', async () => {
		const code = new MagicString([
			'hover:(g-c-white g-bg-black)',
			'g-w-(--panel-width)',
			'g-c-(--brand-color)'
		].join(' '));
		const transformer = presetStyle().transformers?.[0];
		await transformer?.transform(code, 'fixture.vue', {} as never);
		const transformed = code.toString();
		const { css: source, matched } = await generate(transformed);
		const css = compact(source);

		expect(transformed).toContain('hover:g-c-white hover:g-bg-black');
		expect(transformed).toContain('g-w-(--panel-width)');
		expect(transformed).toContain('g-c-(--brand-color)');
		expect(matched).toContain('hover:g-c-white');
		expect(matched).toContain('hover:g-bg-black');
		expect(matched).toContain('g-w-(--panel-width)');
		expect(matched).toContain('g-c-(--brand-color)');
		expect(css).toContain('.hover\\:g-c-white:hover{color:#fff!important}');
		expect(css).toContain('.hover\\:g-bg-black:hover{background-color:#000!important}');
		expect(css).toContain('.g-w-\\(--panel-width\\){width:var(--panel-width)}');
		expect(css).toContain('.g-c-\\(--brand-color\\){color:var(--brand-color)!important}');
	});

	it('supports arbitrary non-negative integer dimensions', async () => {
		const { css: source } = await generate([
			'g-fs-37', 'g-lh-1', 'g-lh-2', 'g-lh-3', 'g-lh-4', 'g-lh-5', 'g-lh-6', 'g-lh-43',
			'g-m-t-7', 'g-pd-lr-13', 'g-br-19', 'g-imgc-41', 'g-imgr-27'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-fs-37{font-size:37px}');
		expect(css).toContain('.g-lh-1{line-height:1}');
		expect(css).toContain('.g-lh-2{line-height:2}');
		expect(css).toContain('.g-lh-3{line-height:3}');
		expect(css).toContain('.g-lh-4{line-height:4}');
		expect(css).toContain('.g-lh-5{line-height:5}');
		expect(css).toContain('.g-lh-6{line-height:6px}');
		expect(css).toContain('.g-lh-43{line-height:43px}');
		expect(css).toContain('.g-m-t-7{margin-top:7px}');
		expect(css).toContain('.g-pd-lr-13{padding-left:13px;padding-right:13px}');
		expect(css).toContain('.g-br-19{border-radius:19px}');
		expect(css).toMatch(/\.g-imgc-41\{[^}]*width:41px[^}]*border-radius:50%/);
		expect(css).toMatch(/\.g-imgr-27\{[^}]*width:27px[^}]*border-radius:4px/);
	});

	it('supports arbitrary values and CSS Variables for property rules', async () => {
		const { css: source } = await generate([
			'g-c-[#123456]', 'g-bg-[rgb(0_0_0)]', 'g-bg-(--surface)',
			'g-fs-[clamp(1rem,_2vw,_2rem)]', 'g-fs-(--font-size)',
			'g-lh-[1.25]', 'g-lh-(--line-height)',
			'g-m-[auto]', 'g-m-t-[-8px]', 'g-m-l-(--offset)',
			'g-pd-[calc(1rem_+_2px)]', 'g-pd-tb-(--space)'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-c-\\[\\#123456\\]{color:#123456!important}');
		expect(css).toContain('background-color:rgb(000)!important');
		expect(css).toContain('.g-bg-\\(--surface\\){background-color:var(--surface)!important}');
		expect(css).toContain('font-size:clamp(1rem,2vw,2rem)');
		expect(css).toContain('.g-fs-\\(--font-size\\){font-size:var(--font-size)}');
		expect(css).toContain('.g-lh-\\[1\\.25\\]{line-height:1.25}');
		expect(css).toContain('.g-lh-\\(--line-height\\){line-height:var(--line-height)}');
		expect(css).toContain('.g-m-\\[auto\\]{margin:auto}');
		expect(css).toContain('margin-top:-8px');
		expect(css).toContain('.g-m-l-\\(--offset\\){margin-left:var(--offset)}');
		expect(css).toContain('padding:calc(1rem+2px)');
		expect(source).toContain('padding:calc(1rem + 2px);');
		expect(css).toContain('padding-top:var(--space);padding-bottom:var(--space)');
	});

	it('generates width, height, combined size, and width fractions', async () => {
		const { css: source } = await generate([
			'g-w-4', 'g-h-8', 'g-size-12',
			'g-w-full', 'g-h-screen', 'g-size-screen',
			'g-w-min', 'g-h-max', 'g-size-fit',
			'g-w-[calc(100%_-_1rem)]', 'g-h-(--panel-height)',
			'g-size-(--avatar-size)', 'g-w-1/12', 'g-w-7/12', 'g-w-12/12'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-w-4{width:4px}');
		expect(css).toContain('.g-h-8{height:8px}');
		expect(css).toContain('.g-size-12{width:12px;height:12px}');
		expect(css).toContain('.g-w-full{width:100%}');
		expect(css).toContain('.g-h-screen{height:100vh}');
		expect(css).toContain('.g-size-screen{width:100vw;height:100vh}');
		expect(css).toContain('.g-w-min{width:min-content}');
		expect(css).toContain('.g-h-max{height:max-content}');
		expect(css).toContain('.g-size-fit{width:fit-content;height:fit-content}');
		expect(css).toContain('width:calc(100%-1rem)');
		expect(source).toContain('width:calc(100% - 1rem);');
		expect(css).toContain('.g-h-\\(--panel-height\\){height:var(--panel-height)}');
		expect(css).toContain('.g-size-\\(--avatar-size\\){width:var(--avatar-size);height:var(--avatar-size)}');
		expect(source).toContain('.g-w-1\\/12{width:8.3333333333%;}');
		expect(source).toContain('.g-w-7\\/12{width:58.3333333333%;}');
		expect(source).toContain('.g-w-12\\/12,\n.g-w-full{width:100%;}');
	});

	it('uses g-g-* for repository gap rules and keeps Mini g-gap-*', async () => {
		const { css: source } = await generate([
			'g-g-4', 'g-gap-4', 'g-g-[1.5rem]', 'g-g-(--gap)',
			'g-g-x-8', 'g-g-col-(--column-gap)', 'g-g-y-[2vh]', 'g-g-row-12'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-g-4{gap:4px}');
		expect(css).toContain('.g-gap-4{gap:1rem}');
		expect(css).toContain('.g-g-\\[1\\.5rem\\]{gap:1.5rem}');
		expect(css).toContain('.g-g-\\(--gap\\){gap:var(--gap)}');
		expect(css).toContain('.g-g-x-8{column-gap:8px}');
		expect(css).toContain('column-gap:var(--column-gap)');
		expect(css).toContain('row-gap:2vh');
		expect(css).toContain('.g-g-row-12{row-gap:12px}');
	});

	it('generates repository Grid abbreviations and keeps Mini Grid rules', async () => {
		const { css: source, matched } = await generate([
			'g-grid', 'g-inline-grid',
			'g-gtc-3', 'g-grid-cols-3',
			'g-gc-span-2', 'g-col-span-2',
			'g-gaf-rd', 'g-grid-flow-row-dense',
			'g-col-2'
		].join(' '));
		const css = compact(source);

		expect(matched).toEqual(new Set([
			'g-grid', 'g-inline-grid',
			'g-gtc-3', 'g-grid-cols-3',
			'g-gc-span-2', 'g-col-span-2',
			'g-gaf-rd', 'g-grid-flow-row-dense',
			'g-col-2'
		]));
		expect(css).toMatch(/\.g-grid\{[^}]*display:grid[^}]*box-sizing:border-box/);
		expect(css).toContain('.g-inline-grid{display:inline-grid}');
		expect(source).toMatch(/\.g-grid-cols-3,\n\.g-gtc-3\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\);}/);
		expect(source).toMatch(/\.g-col-span-2,\n\.g-gc-span-2\{grid-column:span 2\/span 2;}/);
		expect(source).toMatch(/\.g-gaf-rd,\n\.g-grid-flow-row-dense\{grid-auto-flow:row dense;}/);
		expect(css).toContain('.g-col-2{flex:2}');
		expect(css).not.toContain('.g-col-2{grid-column:2}');
	});

	it('supports dynamic Grid values and rejects invalid bare numbers', async () => {
		const { css: source } = await generateStyleOnly([
			'g-gtc-13', 'g-gtr-[auto_1fr]', 'g-gtc-(--tracks)',
			'g-gc-13', 'g-gr-[2/4]', 'g-gcs-(--start)', 'g-gce-[-1]',
			'g-grs-4', 'g-gre-(--end)', 'g-gc-span-13', 'g-gr-span-full'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-gtc-13{grid-template-columns:repeat(13,minmax(0,1fr))}');
		expect(css).toContain('grid-template-rows:auto1fr');
		expect(css).toContain('.g-gtc-\\(--tracks\\){grid-template-columns:var(--tracks)}');
		expect(css).toContain('.g-gc-13{grid-column:13}');
		expect(css).toContain('grid-row:2/4');
		expect(css).toContain('.g-gcs-\\(--start\\){grid-column-start:var(--start)}');
		expect(css).toContain('grid-column-end:-1');
		expect(css).toContain('.g-grs-4{grid-row-start:4}');
		expect(css).toContain('.g-gre-\\(--end\\){grid-row-end:var(--end)}');
		expect(css).toContain('.g-gc-span-13{grid-column:span13/span13}');
		expect(css).toContain('.g-gr-span-full{grid-row:1/-1}');

		const { matched } = await generateStyleOnly([
			'g-gtc-0', 'g-gtr-0', 'g-gc-0', 'g-gr-0',
			'g-gcs-0', 'g-gce-0', 'g-grs-0', 'g-gre-0',
			'g-gc-span-0', 'g-gr-span-0', 'g-gaf-x'
		].join(' '));
		expect(matched).toEqual(new Set());
	});

	it('generates flex values, fractions, and dynamic values', async () => {
		const { css: source } = await generate([
			'g-f-0', 'g-f-1', 'g-f-7',
			'g-f-3/7', 'g-f-7/7', 'g-f-[1_0_auto]', 'g-f-[auto]', 'g-f-(--item-flex)',
			'hover:g-f-2', 'g-flex-1', 'g-flex-1/2',
			'g-fw-4', 'g-fw-350', 'g-fw-950'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-f-0{flex:0}');
		expect(css).toContain('.g-f-1{flex:1}');
		expect(css).toContain('.g-f-7{flex:7}');
		expect(source).toContain('.g-f-3\\/7{flex:0 0 42.8571428571%;}');
		expect(source).toContain('.g-f-7\\/7{flex:0 0 100%;}');
		expect(source).toContain('.g-f-\\[1_0_auto\\]{flex:1 0 auto;}');
		expect(css).toContain('.g-f-\\[auto\\]{flex:auto}');
		expect(css).toContain('.g-f-\\(--item-flex\\){flex:var(--item-flex)}');
		expect(css).toContain('.hover\\:g-f-2:hover{flex:2}');
		expect(source).toContain('.g-flex-1{flex:1 1 0%;}');
		expect(source).toContain('.g-flex-1\\/2{flex:50%;}');
		expect(css).toContain('.g-fw-4{width:33.3333333333%;float:left}');
		expect(css).toContain('.g-fw-350{font-weight:350}');
		expect(css).toContain('.g-fw-950{font-weight:950}');

		const { matched } = await generateStyleOnly([
			'g-f--1', 'g-f-9007199254740992', 'g-f-auto',
			'g-f-0/7', 'g-f-8/7', 'g-f-9007199254740992/9007199254740992',
			'g-0of7', 'g-8of7',
			'g-w-0/7', 'g-w-8/7', 'g-w-1/0',
			'g-f-()', 'g-f-[]', 'g-f-(invalid)',
			'g-w-()', 'g-w-[]', 'g-w-(invalid)', 'g-s-4', 'g-fw-0', 'g-fw-1001'
		].join(' '));
		expect(matched).toEqual(new Set());
	});

	it('keeps source-only deprecated utilities compatible', async () => {
		const { css: source } = await generateStyleOnly('g-col g-col-2 g-col-7 g-3of7 g-height-full g-width-full');
		const css = compact(source);

		expect(css).toContain('.g-col{flex:1}');
		expect(css).toContain('.g-col-2{flex:2}');
		expect(css).toContain('.g-col-7{flex:7}');
		expect(source).toContain('.g-3of7{flex:0 0 42.8571428571%;}');
		expect(css).toContain('.g-height-full{height:100%}');
		expect(css).toContain('.g-width-full{width:100%}');
	});

	it('generates position edges and overrides Mini g-b-* by value semantics', async () => {
		const { css: source } = await generate([
			'g-b', 'g-t-8', 'g-l-[auto]', 'g-b-12', 'g-b-[-10px]', 'g-r-(--offset)',
			'g-b-1', 'g-b-[2px]', 'g-b-[calc(100%_-_10px)]', 'g-b-[var(--solid-color)]',
			'g-b-[1px_solid_red]', 'hover:g-l-4', 'g-bottom-1'
		].join(' '));
		const css = compact(source);

		expect(source).toContain('.g-b::before,.g-b::after');
		expect(css).toContain('.g-t-8{top:8px}');
		expect(css).toContain('.g-l-\\[auto\\]{left:auto}');
		expect(css).toContain('.g-b-12{bottom:12px}');
		expect(css).toContain('bottom:-10px');
		expect(css).toContain('.g-r-\\(--offset\\){right:var(--offset)}');
		expect(css).toContain('.g-b-1{bottom:1px}');
		expect(css).toContain('.g-b-\\[2px\\]{bottom:2px}');
		expect(source).toContain('bottom:calc(100% - 10px);');
		expect(css).toContain('bottom:var(--solid-color)');
		expect(source).toContain('border:1px solid red;');
		expect(css).toContain('.hover\\:g-l-4:hover{left:4px}');
		expect(css).toContain('.g-bottom-1{bottom:0.25rem}');
		expect(css).not.toContain('.g-b-1{border-width:1px}');
		expect(source).not.toContain('border-width:2px;');
	});

	it('recognizes every CSS border style in g-b-[...]', async () => {
		const styles = [
			'none', 'hidden', 'dotted', 'dashed', 'solid',
			'double', 'groove', 'ridge', 'inset', 'outset'
		];
		const utilities = styles.map(style => `g-b-[1px_${style}_red]`);
		const { css, matched } = await generateStyleOnly([
			...utilities,
			'g-b-[solid]', 'g-b-[red_solid_1px]', 'g-b-[1px_dashed_var(--color)]',
			'g-b-[1px_solid_color]', 'g-b-[1px_SOLID_red]'
		].join(' '));

		expect([...matched]).toEqual([
			...utilities,
			'g-b-[solid]', 'g-b-[red_solid_1px]', 'g-b-[1px_dashed_var(--color)]',
			'g-b-[1px_solid_color]', 'g-b-[1px_SOLID_red]'
		]);
		for (const style of styles) expect(css).toContain(`border:1px ${style} red;`);
		expect(css).toContain('border:solid;');
		expect(css).toContain('border:red solid 1px;');
		expect(css).toContain('border:1px dashed var(--color);');
		expect(css).toContain('border:1px solid color;');
		expect(css).toContain('border:1px SOLID red;');
	});

	it('rejects invalid position edge values', async () => {
		const { matched } = await generateStyleOnly([
			'g-t--1', 'g-l-1.5', 'g-b-auto', 'g-r-inherit',
			'g-t-[]', 'g-l-()', 'g-b-(invalid)', 'g-r-[]'
		].join(' '));

		expect(matched).toEqual(new Set());
	});

	it('keeps @deot/style semantics for utilities that collide with presetMini', async () => {
		const { css: source } = await generate('g-ai-c g-col g-w-12 g-fw-4 g-fw-400 g-br-4 g-bg-blue-mid g-block');
		const css = compact(source);

		expect(css).toContain('.g-ai-c{align-items:center}');
		expect(css).toContain('.g-col{flex:1}');
		expect(css).toContain('.g-w-12{width:12px}');
		expect(css).toContain('.g-fw-4{width:33.3333333333%;float:left}');
		expect(css).toContain('.g-fw-400{font-weight:400}');
		expect(css).toContain('.g-br-4{border-radius:4px}');
		expect(css).toContain('.g-bg-blue-mid{background-color:#16a3ff!important}');
		expect(css).toContain('.g-block{display:block!important}');
	});

	it('keeps historical shared abbreviations within their existing ranges', async () => {
		const { css: source } = await generate('g-fw-w g-fw-4 g-fw-400 g-bs g-bs-t g-bs-bb g-br g-br-4');
		const css = compact(source);

		expect(css).toContain('.g-fw-w{flex-wrap:wrap}');
		expect(css).toContain('.g-fw-4{width:33.3333333333%;float:left}');
		expect(css).toContain('.g-fw-400{font-weight:400}');
		expect(css).toContain('.g-bs{box-shadow:var(--border-shadow-default)!important}');
		expect(css).toContain('.g-bs-t{box-shadow:var(--border-shadow-default-top)!important}');
		expect(css).toContain('.g-bs-bb{box-sizing:border-box}');
		expect(source).toContain('.g-br::before,.g-br::after');
		expect(css).toContain('.g-br-4{border-radius:4px}');
	});

	it('applies unit to numeric rules and scale only to fixed dimensions', async () => {
		const { css: source, matched } = await generate(
			[
				'x-f-2', 'x-f-[1_0_auto]', 'x-f-(--item-flex)',
				'x-fs-14', 'x-lh-1', 'x-lh-2', 'x-lh-3', 'x-lh-5', 'x-lh-6',
				'x-m-l-4', 'x-w-4', 'x-size-8', 'x-g-6',
				'x-t-4', 'x-b-6',
				'x-grid', 'x-gtc-13', 'x-gcs-13',
				'x-dot', 'x-divide', 'x-br-default', 'g-fs-14'
			].join(' '),
			{ prefix: 'x-', unit: 'rem', scale: 2 }
		);
		const css = compact(source);

		expect(matched).not.toContain('g-fs-14');
		expect(css).toContain('.x-f-2{flex:2}');
		expect(source).toContain('.x-f-\\[1_0_auto\\]{flex:1 0 auto;}');
		expect(css).toContain('.x-f-\\(--item-flex\\){flex:var(--item-flex)}');
		expect(css).toContain('.x-fs-14{font-size:14rem}');
		expect(css).toContain('.x-lh-1{line-height:1}');
		expect(css).toContain('.x-lh-2{line-height:2}');
		expect(css).toContain('.x-lh-3{line-height:3}');
		expect(css).toContain('.x-lh-5{line-height:5}');
		expect(css).toContain('.x-lh-6{line-height:6rem}');
		expect(css).toContain('.x-m-l-4{margin-left:4rem}');
		expect(css).toContain('.x-w-4{width:4rem}');
		expect(css).toContain('.x-size-8{width:8rem;height:8rem}');
		expect(css).toContain('.x-g-6{gap:6rem}');
		expect(css).toContain('.x-t-4{top:4rem}');
		expect(css).toContain('.x-b-6{bottom:6rem}');
		expect(css).toMatch(/\.x-grid\{[^}]*display:grid[^}]*box-sizing:border-box/);
		expect(css).toContain('.x-gtc-13{grid-template-columns:repeat(13,minmax(0,1fr))}');
		expect(css).toContain('.x-gcs-13{grid-column-start:13}');
		expect(css).toContain('.x-dot{display:block;width:10rem;height:10rem;border-radius:50%}');
		expect(css).toMatch(/\.x-divide\{[^}]*width:2rem[^}]*height:24rem/);
		expect(css).toContain('--border-radius-default:16rem;');
		expect(css).toContain('.x-br-default{border-radius:var(--border-radius-default)!important}');
	});

	it('reads defaults from process.env and lets explicit options override them', async () => {
		vi.stubEnv('UNOCSS_OPTIONS', JSON.stringify({
			prefix: 'env-',
			unit: 'rem',
			scale: 2,
			reset: false
		}));

		try {
			const { css: source, matched } = await generate('env-fs-14 env-dot g-fs-14');
			const css = compact(source);

			expect(matched).not.toContain('g-fs-14');
			expect(css).toContain('.env-fs-14{font-size:14rem}');
			expect(css).toContain('.env-dot{display:block;width:10rem;height:10rem;border-radius:50%}');
			expect(css).not.toContain('html{width:100%;height:100%}');

			const { css: overrideSource } = await generate('x-fs-14 x-dot', {
				prefix: 'x-',
				unit: 'px',
				scale: 1,
				reset: true
			});
			const overrideCSS = compact(overrideSource);
			expect(overrideCSS).toContain('.x-fs-14{font-size:14px}');
			expect(overrideCSS).toContain('.x-dot{display:block;width:5px;height:5px;border-radius:50%}');
			expect(overrideCSS).toContain('html{width:100%;height:100%}');
		} finally {
			vi.unstubAllEnvs();
		}
	});

	it('rejects an invalid scale from process.env', () => {
		vi.stubEnv('UNOCSS_OPTIONS', JSON.stringify({ scale: 'invalid' }));
		try {
			expect(() => presetStyle()).toThrow('UNOCSS_OPTIONS.scale must be a finite number');
		} finally {
			vi.unstubAllEnvs();
		}
	});

	it('uses prefix exactly as provided', async () => {
		const { css: source, matched } = await generate('xfs-14 xflex xt-4 x-fs-14', { prefix: 'x' });
		const css = compact(source);

		expect(matched).not.toContain('x-fs-14');
		expect(css).toContain('.xfs-14{font-size:14px}');
		expect(css).toMatch(/\.xflex\{[^}]*display:flex[^}]*box-sizing:border-box|\.xflex\{[^}]*box-sizing:border-box[^}]*display:flex/);
		expect(css).toContain('.xt-4{top:4px}');
	});

	it('supports an empty prefix', async () => {
		const { css: source, matched } = await generate('fs-14 m-l-4 flex g-fs-14', { prefix: '' });
		const css = compact(source);

		expect(matched).not.toContain('g-fs-14');
		expect(css).toContain('.fs-14{font-size:14px}');
		expect(css).toContain('.m-l-4{margin-left:4px}');
		expect(css).toMatch(/\.flex\{[^}]*display:flex[^}]*box-sizing:border-box|\.flex\{[^}]*box-sizing:border-box[^}]*display:flex/);
	});

	it('generates the theme variables and complex selectors', async () => {
		const { css: source } = await generate('g-c-info g-bg-white g-b g-scroller g-reset g-unset');
		const css = compact(source);

		expect(css).toContain('--color-info:#0177de;');
		expect(css).toContain('.g-c-info{color:var(--color-info)!important}');
		expect(css).toContain('.g-bg-white{background-color:#fff!important}');
		expect(source).not.toContain('.g-bg-white input');
		expect(source).toContain('.g-b::before,.g-b::after');
		expect(css).toContain('@media(resolution>=2dppx)');
		expect(source).toContain('.g-scroller::-webkit-scrollbar-thumb');
		expect(source).toContain('.g-reset ol,.g-reset ul,.g-reset li');
		expect(source).toContain('.g-unset h1,.g-unset h2');
	});

	it('implements every documented repository utility without relying on presetMini', async () => {
		const utilities = [...staticUtilities, ...numericUtilities];
		const { matched } = await generateStyleOnly(utilities.join(' '));

		expect([...matched].sort()).toEqual([...utilities].sort());
	});
});
