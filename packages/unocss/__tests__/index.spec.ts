import { createGenerator } from 'unocss';
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

const staticUtilities = [
	'g-reset', 'g-unset',
	'g-flex', 'g-flex-holy', 'g-flex-cc', 'g-flex-ac', 'g-col', 'g-col-2', 'g-1of1',
	...Array.from({ length: 4 }, (_, index) => index + 2).flatMap(total => (
		Array.from({ length: total - 1 }, (_, index) => `g-${index + 1}of${total}`)
	)),
	'g-fd-r', 'g-fd-c', 'g-fd-rr', 'g-fd-cr',
	'g-fw-w', 'g-fw-wr', 'g-fw-n',
	'g-jc-fs', 'g-jc-fe', 'g-jc-c', 'g-jc-sb', 'g-jc-sa',
	'g-ai-fs', 'g-ai-fe', 'g-ai-c', 'g-ai-b', 'g-ai-s',
	'g-ac-fs', 'g-ac-fe', 'g-ac-c', 'g-ac-sb', 'g-ac-sa', 'g-ac-s',
	'g-as-a', 'g-as-fs', 'g-as-fe', 'g-as-c', 'g-as-b', 'g-as-s',
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
	'g-height-full', 'g-width-full', 'g-size-full',
	'g-none', 'g-dp-n', 'g-hide', 'g-show', 'g-dp-b', 'g-block',
	'g-dp-i', 'g-inline', 'g-dp-ib', 'g-inline-block',
	'g-operable', 'g-pointer', 'g-disabled', 'g-unanimated', 'g-scroller',
	'g-divide', 'g-dot', 'g-of-h', 'g-bs-bb'
];

const numericUtilities = [
	'g-fs-37', 'g-lh-43', 'g-br-19', 'g-img-41', 'g-imgc-41', 'g-imgr-41',
	'g-col-7', 'g-3of7', 'g-fw-350',
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

	it('combines presetMini with d-style overrides', async () => {
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

	it('generates flex columns, fractions, and numeric font weights dynamically', async () => {
		const { css: source } = await generate('g-col g-col-0 g-col-7 g-3of7 g-7of7 g-fw-4 g-fw-350 g-fw-950');
		const css = compact(source);

		expect(css).toContain('.g-col{flex:1}');
		expect(css).toContain('.g-col-0{flex:0}');
		expect(css).toContain('.g-col-7{flex:7}');
		expect(source).toContain('.g-3of7{flex:0 0 42.8571428571%;}');
		expect(source).toContain('.g-7of7{flex:0 0 100%;}');
		expect(css).toContain('.g-fw-4{width:33.3333333333%;float:left}');
		expect(css).toContain('.g-fw-350{font-weight:350}');
		expect(css).toContain('.g-fw-950{font-weight:950}');

		const { matched } = await generateStyleOnly('g-0of7 g-8of7 g-fw-0 g-fw-1001');
		expect(matched).toEqual(new Set());
	});

	it('keeps d-style semantics for utilities that collide with presetMini', async () => {
		const { css: source } = await generate('g-ai-c g-col g-w-12 g-fw-4 g-fw-400 g-br-4 g-bg-blue-mid g-block');
		const css = compact(source);

		expect(css).toContain('.g-ai-c{align-items:center}');
		expect(css).toContain('.g-col{flex:1}');
		expect(css).toContain('.g-w-12{width:100%}');
		expect(css).toContain('.g-fw-4{width:33.3333333333%;float:left}');
		expect(css).toContain('.g-fw-400{font-weight:400}');
		expect(css).toContain('.g-br-4{border-radius:4px}');
		expect(css).toContain('.g-bg-blue-mid{background-color:#16a3ff!important}');
		expect(css).toContain('.g-block{display:block!important}');
	});

	it('applies unit to numeric rules and scale only to fixed dimensions', async () => {
		const { css: source, matched } = await generate(
			'x-fs-14 x-lh-1 x-lh-2 x-lh-3 x-lh-5 x-lh-6 x-m-l-4 x-dot x-divide x-br-default g-fs-14',
			{ prefix: 'x-', unit: 'rem', scale: 2 }
		);
		const css = compact(source);

		expect(matched).not.toContain('g-fs-14');
		expect(css).toContain('.x-fs-14{font-size:14rem}');
		expect(css).toContain('.x-lh-1{line-height:1}');
		expect(css).toContain('.x-lh-2{line-height:2}');
		expect(css).toContain('.x-lh-3{line-height:3}');
		expect(css).toContain('.x-lh-5{line-height:5}');
		expect(css).toContain('.x-lh-6{line-height:6rem}');
		expect(css).toContain('.x-m-l-4{margin-left:4rem}');
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
		const { css: source, matched } = await generate('xfs-14 xflex x-fs-14', { prefix: 'x' });
		const css = compact(source);

		expect(matched).not.toContain('x-fs-14');
		expect(css).toContain('.xfs-14{font-size:14px}');
		expect(css).toMatch(/\.xflex\{[^}]*display:flex[^}]*box-sizing:border-box|\.xflex\{[^}]*box-sizing:border-box[^}]*display:flex/);
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

	it('implements every documented utility without relying on presetMini', async () => {
		const utilities = [...staticUtilities, ...numericUtilities];
		const { matched } = await generateStyleOnly(utilities.join(' '));

		expect([...matched].sort()).toEqual([...utilities].sort());
	});
});
