import type { PresetMiniOptions } from '@unocss/preset-mini';
import { createGenerator, presetMini } from 'unocss';
import MagicString from 'magic-string';
import { presetStyle } from '../src';
import type { PresetStyleOptions } from '../src';

const generate = async (tokens: string, options: PresetStyleOptions = {}) => {
	const uno = await createGenerator({ presets: [presetStyle(options)] });
	return uno.generate(tokens);
};

const generateCombined = async (
	tokens: string,
	styleOptions: PresetStyleOptions = {},
	miniOptions: PresetMiniOptions = {}
) => {
	const uno = await createGenerator({
		presets: [
			presetMini({ prefix: styleOptions.prefix ?? 'g-', ...miniOptions }),
			presetStyle({ ...styleOptions, variants: false })
		]
	});
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
	'g-fwr-w', 'g-fwr-wr', 'g-fwr-n', 'g-fw-w', 'g-fw-wr', 'g-fw-n',
	'g-jc-fs', 'g-jc-fe', 'g-jc-c', 'g-jc-sb', 'g-jc-sa',
	'g-ai-fs', 'g-ai-fe', 'g-ai-c', 'g-ai-b', 'g-ai-s',
	'g-ac-fs', 'g-ac-fe', 'g-ac-c', 'g-ac-sb', 'g-ac-sa', 'g-ac-s',
	'g-as-a', 'g-as-fs', 'g-as-fe', 'g-as-c', 'g-as-b', 'g-as-s',
	...gridUtilities,
	'g-fl-row', 'g-row', 'g-clearfix', 'g-fl', 'g-fr',
	...Array.from({ length: 12 }, (_, index) => [
		`g-w-${index + 1}`,
		`g-fl-${index + 1}/12`,
		`g-fw-${index + 1}`
	]).flat(),
	'g-pd-s', 'g-pd-tb-s', 'g-pd-lr-s', 'g-pd-t-s', 'g-pd-r-s', 'g-pd-b-s', 'g-pd-l-s',
	'g-fw-bold', 'g-fw-400', 'g-fw-500', 'g-fw-600', 'g-fw-700',
	'g-lh-default', 'g-lh-one', 'g-lh-two', 'g-lh-1', 'g-lh-2',
	...['l', 'r', 'c', 'j', 's', 'e', 'ja', 'mp'].map(value => `g-ta-${value}`),
	'g-tdl-lt', 'g-tdl-ul', 'g-tdl-ol', 'g-tdl-n', 'g-td-lh', 'g-td-ul',
	'g-line-nowrap', 'g-nowrap', 'g-line-wrap', 'g-break',
	'g-line-1', 'g-line-2', 'g-line-one', 'g-line-two',
	...colorNames.flatMap(name => [`g-c-${name}`, `g-bg-${name}`]),
	'g-bg-lg-blue', 'g-bg-lg-yellow',
	'g-fixed', 'g-relative', 'g-absolute', 'g-fixed-full', 'g-absolute-full',
	'g-bd', 'g-bdt', 'g-bdr', 'g-bdb', 'g-bdl', 'g-br', 'g-br-circle', 'g-br-default',
	'g-bsh', 'g-bsh-t', 'g-bs', 'g-bs-t',
	'g-h-full', 'g-w-full', 'g-size-full',
	'g-none', 'g-dp-n', 'g-hide', 'g-show', 'g-dp-b', 'g-block',
	'g-dp-i', 'g-inline', 'g-dp-ib', 'g-inline-block', 'g-d-n', 'g-d-b', 'g-d-i', 'g-d-ib',
	'g-operable', 'g-pointer', 'g-disabled', 'g-unanimated', 'g-scroller',
	'g-divider', 'g-divide', 'g-dot', 'g-of-h', 'g-bsz-bb', 'g-bs-bb'
];

const numericUtilities = [
	'g-fs-37', 'g-lh-43', 'g-br-19',
	'g-image-41', 'g-image-circle-41', 'g-image-radius-41', 'g-img-41', 'g-imgc-41', 'g-imgr-41',
	'g-f-7', 'g-f-3/7', 'g-fw-350', 'g-t-7', 'g-l-7', 'g-b-7', 'g-r-7',
	...['m', 'pd'].flatMap(name => [
		`g-${name}-7`,
		...['tb', 'lr', 't', 'r', 'b', 'l'].map(direction => `g-${name}-${direction}-7`)
	])
];

const supplementalUtilities = [
	'g-op-50', 'g-z-10',
	...['a', 'c', 'v', 's'].map(value => `g-of-${value}`),
	...['a', 'h', 'c', 'v', 's'].flatMap(value => [`g-ofx-${value}`, `g-ofy-${value}`]),
	'g-min-w-4', 'g-max-w-full', 'g-min-h-screen', 'g-max-h-fit',
	'g-ar-square', 'g-ar-rectangle', 'g-ar-4/3',
	'g-fb-4', 'g-fb-auto', 'g-fb-full', 'g-fb-1/2',
	'g-fg-1', 'g-fsh-0', 'g-od-1', 'g-od-first', 'g-od-last', 'g-od-default',
	'g-inline-grid', 'g-gac-4', 'g-gar-fr',
	...['s', 'e', 'c', 'st', 'b'].map(value => `g-ji-${value}`),
	...['a', 's', 'e', 'c', 'st', 'b'].map(value => `g-js-${value}`),
	...['s', 'e', 'c', 'st', 'b', 'sb', 'sa', 'se'].map(value => `g-pc-${value}`),
	...['s', 'e', 'c', 'st', 'b'].map(value => `g-pi-${value}`),
	...['a', 's', 'e', 'c', 'st'].map(value => `g-ps-${value}`),
	...['v', 'h', 'c'].map(value => `g-vi-${value}`),
	...['a', 'd', 'n', 'p', 'prog', 'w', 'cell', 'ch', 't', 'm', 'na', 'g', 'gg', 'zi', 'zo']
		.map(value => `g-cu-${value}`),
	'g-pe-a', 'g-pe-n', 'g-us-a', 'g-us-all', 'g-us-t', 'g-us-n',
	'g-re-x', 'g-re-y', 'g-re-b', 'g-re-n', 'g-ap-a', 'g-ap-n',
	...['n', 'h', 'dot', 'dash', 's', 'db', 'g', 'r', 'i', 'o'].map(value => `g-ols-${value}`),
	'g-olw-2', 'g-olo-2',
	...['s', 'db', 'dot', 'dash', 'w'].map(value => `g-tds-${value}`),
	...['t', 'm', 'b', 'base', 'tt', 'tb', 'sub', 'sup'].map(value => `g-va-${value}`),
	'g-tdt-2', 'g-tuo-2', 'g-ls-2', 'g-wsp-2',
	...['n', 'nw', 'p', 'pl', 'pw', 'bs'].map(value => `g-ws-${value}`),
	'g-to-e', 'g-to-c', 'g-truncate',
	...['u', 'l', 'c', 'n'].map(value => `g-tt-${value}`),
	'g-italic', 'g-oblique', 'g-not-italic', 'g-not-oblique',
	...colorNames.flatMap(name => [`g-olc-${name}`, `g-tdc-${name}`, `g-fill-${name}`, `g-stroke-${name}`]),
	'g-fill-n', 'g-stroke-n', 'g-stroke-w-2', 'g-stroke-dashoffset-2',
	'g-stroke-cap-s', 'g-stroke-cap-r', 'g-stroke-cap-b',
	...['a', 'b', 'c', 'r', 'm'].map(value => `g-stroke-join-${value}`),
	'g-bd-[1px_solid_red]', 'g-bdt-(--border-top)', 'g-bdr-[2px_dashed_blue]',
	'g-bdb-[double]', 'g-bdl-(--border-left)',
	...['bdw', 'bdtw', 'bdrw', 'bdbw', 'bdlw'].flatMap(name => [
		`g-${name}-2`, `g-${name}-tn`, `g-${name}-md`, `g-${name}-tk`
	]),
	...['bds', 'bdts', 'bdrs', 'bdbs', 'bdls'].flatMap(name => (
		['n', 'h', 'dot', 'dash', 's', 'db', 'g', 'r', 'i', 'o'].map(value => `g-${name}-${value}`)
	)),
	...colorNames.flatMap(name => ['bdc', 'bdtc', 'bdrc', 'bdbc', 'bdlc'].map(mode => `g-${mode}-${name}`))
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

	it('only generates repository rules while retaining Mini variants', async () => {
		const { css: source, matched } = await generate('flex g-flex g-min-h-screen g-m-4 hover:g-m-l-8');
		const css = compact(source);

		expect(matched).not.toContain('flex');
		expect(matched).toEqual(new Set(['g-flex', 'g-min-h-screen', 'g-m-4', 'hover:g-m-l-8']));
		expect(css).toMatch(/\.g-flex\{[^}]*display:flex[^}]*box-sizing:border-box|\.g-flex\{[^}]*box-sizing:border-box[^}]*display:flex/);
		expect(css).toContain('.g-min-h-screen{min-height:100vh}');
		expect(css).toContain('.g-m-4{margin:4px}');
		expect(css).not.toContain('.g-m-4{margin:1rem}');
		expect(css).toContain('.hover\\:g-m-l-8:hover{margin-left:8px}');
		expect(css).not.toContain('--un-');
		expect(presetStyle().presets).toBeUndefined();
	});

	it('does not include Mini-only utilities', async () => {
		const utilities = [
			'g-gap-4', 'g-flex-1', 'g-flex-1/2',
			'g-grid-cols-3', 'g-col-span-2', 'g-grid-flow-row-dense',
			'g-bottom-1', 'g-transition', 'g-transform'
		];
		const { css, matched } = await generate(utilities.join(' '));

		expect(matched).toEqual(new Set());
		expect(css).not.toContain('--un-');
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

	it('reuses Mini variants and breakpoints without including Mini rules or preflight', async () => {
		const utilities = [
			'hover:g-c-white', 'before:g-block', 'not-hover:g-c-white',
			'dark:g-bg-black', 'md:g-m-4',
			'group-hover:g-c-white', 'peer-focus:g-bg-black',
			'aria-[expanded=true]:g-block', 'data-[state=open]:g-show',
			'important:g-w-4', 'print:g-hide', 'supports-[display:grid]:g-grid',
			'rtl:g-m-l-4', 'layer-components:g-pd-4', '@[640px]:g-w-full',
			'starting:g-bg-white', '-g-m-4', 'all:g-hide', '[&>*]:g-pd-4'
		];
		const { css: source, matched } = await generate(utilities.join(' '));
		const css = compact(source);

		expect([...matched].sort()).toEqual([...utilities].sort());
		expect(css).toContain('.hover\\:g-c-white:hover{color:#fff!important}');
		expect(css).toContain('.before\\:g-block::before{display:block!important}');
		expect(css).toContain('.not-hover\\:g-c-white:not(:hover)');
		expect(css).toContain('.dark.dark\\:g-bg-black');
		expect(css).toContain('@media(min-width:768px){.md\\:g-m-4{margin:4px}}');
		expect(css).toContain('.g-group:hover.group-hover\\:g-c-white{color:#fff!important}');
		expect(css).toContain('.g-peer:focus~.peer-focus\\:g-bg-black{background-color:#000!important}');
		expect(css).toContain('[aria-expanded=true]');
		expect(css).toContain('[data-state=open]');
		expect(css).toContain('.important\\:g-w-4{width:4px!important}');
		expect(css).toContain('@mediaprint{.print\\:g-hide{display:none!important}}');
		expect(css).toContain('@supports(display:grid)');
		expect(css).toContain('[dir="rtl"].rtl\\:g-m-l-4{margin-left:4px}');
		expect(css).toContain('@layercomponents');
		expect(css).toContain('@container(min-width:640px)');
		expect(css).toContain('@starting-style');
		expect(css).toContain('.-g-m-4{margin:-4px}');
		expect(css).toContain('.all\\:g-hide*{display:none!important}');
		expect(css).toContain('\\[\\&\\>\\*\\]\\:g-pd-4>*{padding:4px}');
		expect(css).not.toContain('--un-');
	});

	it('supports Mini dark and tagged-pseudo options', async () => {
		const { css: mediaSource } = await generate(
			'dark:g-bg-black light:g-c-black',
			{ dark: 'media' }
		);
		expect(compact(mediaSource)).toContain('@media(prefers-color-scheme:dark)');
		expect(compact(mediaSource)).toContain('@media(prefers-color-scheme:light)');

		const { css: customSource } = await generate(
			'dark:g-bg-black light:g-c-black',
			{ dark: { dark: '.theme-dark', light: '.theme-light' } }
		);
		const customCSS = compact(customSource);
		expect(customCSS).toContain('.theme-dark.dark\\:g-bg-black');
		expect(customCSS).toContain('.theme-light.light\\:g-c-black');

		const { css: taggedSource } = await generate(
			'group-hover:g-c-white',
			{ attributifyPseudo: true }
		);
		expect(compact(taggedSource)).toContain('[g-group=""]:hover.group-hover\\:g-c-white');

		const { css: prefixSource } = await generate(
			'group-hover:x-c-white peer-focus:x-bg-black',
			{ prefix: 'x-' }
		);
		const prefixCSS = compact(prefixSource);
		expect(prefixCSS).toContain('.x-group:hover.group-hover\\:x-c-white');
		expect(prefixCSS).toContain('.x-peer:focus~.peer-focus\\:x-bg-black');
	});

	it('can disable Mini variants and arbitrary extractor while retaining the transformer', async () => {
		const preset = presetStyle({ variants: false });
		const uno = await createGenerator({ presets: [preset] });
		const { matched } = await uno.generate('g-m-4 hover:g-m-4 md:g-m-4 [&>*]:g-pd-4');

		expect(matched).toEqual(new Set(['g-m-4']));
		expect(preset.variants).toBeUndefined();
		expect(preset.theme).toBeUndefined();
		expect(preset.extractorDefault).toBeUndefined();
		expect(preset.transformers).toHaveLength(1);
		expect(presetStyle().variants?.length).toBeGreaterThan(0);
		expect(presetStyle().theme).toEqual({
			breakpoints: expect.objectContaining({ md: '768px' })
		});
		expect(presetStyle().extractorDefault).toBeDefined();
		expect(presetStyle({ arbitraryVariants: false }).extractorDefault).toBeUndefined();
	});

	it('supports arbitrary non-negative integer dimensions', async () => {
		const { css: source } = await generate([
			'g-fs-37', 'g-lh-1', 'g-lh-2', 'g-lh-3', 'g-lh-4', 'g-lh-5', 'g-lh-6', 'g-lh-43',
			'g-m-t-7', 'g-pd-lr-13', 'g-br-19', 'g-image-circle-41', 'g-image-radius-27'
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
		expect(css).toMatch(/\.g-image-circle-41\{[^}]*width:41px[^}]*border-radius:50%/);
		expect(css).toMatch(/\.g-image-radius-27\{[^}]*width:27px[^}]*border-radius:4px/);
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

	it('generates positive integer line clamps', async () => {
		const { css: source } = await generate('g-line-1 g-line-2 g-line-3 hover:g-line-4');
		const css = compact(source);

		expect(css).toContain('-webkit-line-clamp:1');
		expect(css).toContain('-webkit-line-clamp:2');
		expect(css).toContain('.g-line-3{display:-webkit-box');
		expect(css).toContain('-webkit-line-clamp:3');
		expect(css).toContain('.hover\\:g-line-4:hover{display:-webkit-box');
		expect(css).toContain('-webkit-line-clamp:4');

		const { matched } = await generateStyleOnly([
			'g-line-0', 'g-line--1', 'g-line-1.5', 'g-line-', 'g-line-auto',
			'g-line-9007199254740992'
		].join(' '));
		expect(matched).toEqual(new Set());
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

	it('uses repository Gap abbreviations without Mini aliases', async () => {
		const { css: source, matched } = await generate([
			'g-g-4', 'g-gap-4', 'g-g-[1.5rem]', 'g-g-(--gap)',
			'g-cg-8', 'g-cg-(--column-gap)', 'g-rg-[2vh]', 'g-rg-12'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-g-4{gap:4px}');
		expect(matched).not.toContain('g-gap-4');
		expect(css).toContain('.g-g-\\[1\\.5rem\\]{gap:1.5rem}');
		expect(css).toContain('.g-g-\\(--gap\\){gap:var(--gap)}');
		expect(css).toContain('.g-cg-8{column-gap:8px}');
		expect(css).toContain('column-gap:var(--column-gap)');
		expect(css).toContain('row-gap:2vh');
		expect(css).toContain('.g-rg-12{row-gap:12px}');
	});

	it('generates repository Grid abbreviations without Mini Grid aliases', async () => {
		const { css: source, matched } = await generate([
			'g-grid', 'g-inline-grid',
			'g-gtc-3', 'g-grid-cols-3',
			'g-gc-span-2', 'g-col-span-2',
			'g-gaf-rd', 'g-grid-flow-row-dense',
			'g-col-2'
		].join(' '));
		const css = compact(source);

		expect(matched).toEqual(new Set([
			'g-grid', 'g-inline-grid', 'g-gtc-3', 'g-gc-span-2', 'g-gaf-rd',
			'g-col-2'
		]));
		expect(css).toMatch(/\.g-grid\{[^}]*display:grid[^}]*box-sizing:border-box/);
		expect(css).toContain('.g-gtc-3{grid-template-columns:repeat(3,minmax(0,1fr))}');
		expect(css).toContain('.g-gc-span-2{grid-column:span2/span2}');
		expect(css).toContain('.g-gaf-rd{grid-auto-flow:rowdense}');
		expect(css).toMatch(/\.g-inline-grid\{[^}]*display:inline-grid[^}]*box-sizing:border-box/);
		expect(matched).not.toContain('g-grid-cols-3');
		expect(matched).not.toContain('g-col-span-2');
		expect(matched).not.toContain('g-grid-flow-row-dense');
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
		const { css: source, matched: generated } = await generate([
			'g-f-0', 'g-f-1', 'g-f-7',
			'g-f-3/7', 'g-f-7/7', 'g-f-[1_0_auto]', 'g-f-[auto]', 'g-f-(--item-flex)',
			'hover:g-f-2', 'g-flex-1', 'g-flex-1/2',
			'g-fl-4/12', 'g-fw-350', 'g-fw-950'
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
		expect(generated).not.toContain('g-flex-1');
		expect(generated).not.toContain('g-flex-1/2');
		expect(source).toContain('.g-fl-4\\/12{width:33.3333333333%;float:left;}');
		expect(css).toContain('.g-fw-350{font-weight:350}');
		expect(css).toContain('.g-fw-950{font-weight:950}');

		const { matched } = await generateStyleOnly([
			'g-f--1', 'g-f-9007199254740992', 'g-f-auto',
			'g-f-0/7', 'g-f-8/7', 'g-f-9007199254740992/9007199254740992',
			'g-0of7', 'g-8of7',
			'g-w-0/7', 'g-w-8/7', 'g-w-1/0', 'g-w-9007199254740992/9007199254740992',
			'g-f-()', 'g-f-[]', 'g-f-(invalid)',
			'g-w-()', 'g-w-[]', 'g-w-(invalid)', 'g-s-4', 'g-fw-0', 'g-fw-1001', 'g-col-3'
		].join(' '));
		expect(matched).toEqual(new Set());
	});

	it('keeps source-only deprecated utilities compatible', async () => {
		const { css: source } = await generateStyleOnly([
			'g-col', 'g-col-2', 'g-3of7', 'g-height-full', 'g-width-full',
			'g-tl', 'g-tc', 'g-tr', 'g-b', 'g-bt', 'g-bb', 'g-bl',
			'g-fw-w', 'g-fw-4', 'g-row', 'g-bs', 'g-bs-t', 'g-bs-bb',
			'g-dp-n', 'g-dp-b', 'g-dp-i', 'g-dp-ib',
			'g-img-41', 'g-imgc-41', 'g-imgr-41', 'g-td-lh', 'g-td-ul',
			'g-nowrap', 'g-break', 'g-line-one', 'g-line-two', 'g-lh-one', 'g-lh-two',
			'g-divide'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-col{flex:1}');
		expect(css).toContain('.g-col-2{flex:2}');
		expect(source).toContain('.g-3of7{flex:0 0 42.8571428571%;}');
		expect(css).toContain('.g-height-full{height:100%}');
		expect(css).toContain('.g-width-full{width:100%}');
		expect(css).toContain('.g-tl{text-align:left!important}');
		expect(css).toContain('.g-tc{text-align:center!important}');
		expect(css).toContain('.g-tr{text-align:right!important}');
		expect(source).toContain('.g-b::before,.g-b::after');
		expect(source).toContain('.g-bt::before,.g-bt::after');
		expect(source).toContain('.g-bb::before,.g-bb::after');
		expect(source).toContain('.g-bl::before,.g-bl::after');
		expect(css).toContain('.g-fw-w{flex-wrap:wrap}');
		expect(css).toContain('.g-fw-4{width:33.3333333333%;float:left}');
		expect(css).toContain('.g-row{padding:0;margin:0}');
		expect(css).toContain('.g-bs{box-shadow:var(--border-shadow-default)!important}');
		expect(css).toContain('.g-bs-bb{box-sizing:border-box}');
		expect(css).toContain('.g-dp-n{display:none!important}');
		expect(css).toContain('.g-img-41{width:41px;height:41px;max-width:41px;min-width:41px;line-height:41px}');
		expect(css).toContain('.g-td-lh{text-decoration:line-through!important}');
		expect(css).toContain('.g-nowrap{white-space:nowrap!important}');
		expect(css).toContain('.g-line-one{display:-webkit-box');
		expect(css).toContain('.g-lh-one{height:var(--line-height-limit);line-height:var(--line-height-limit)}');
		expect(css).toContain('.g-divide{position:relative;display:inline-block');
	});

	it('does not retain renamed UnoCSS draft utilities', async () => {
		const { matched } = await generateStyleOnly([
			'g-g-x-4', 'g-g-col-4', 'g-g-y-4', 'g-g-row-4',
			'g-td-ol', 'g-td-n', 'g-tdo-2', 'g-ar-sq', 'g-ar-v',
			'g-od-f', 'g-od-l', 'g-od-n',
			'g-stroke-dash-[4_2]', 'g-stroke-offset-2',
			'g-pd-safe', 'g-pd-t-safe', 'g-m-safe'
		].join(' '));

		expect(matched).toEqual(new Set());
	});

	it('generates position edges without Mini position aliases', async () => {
		const { css: source, matched } = await generate([
			'g-bd', 'g-t-8', 'g-l-[auto]', 'g-b-12', 'g-b-[-10px]', 'g-r-(--offset)',
			'g-b-1', 'g-b-[2px]', 'g-b-[calc(100%_-_10px)]', 'g-b-[var(--solid-color)]',
			'g-b-[1px_solid_red]', 'hover:g-l-4', 'g-bottom-1'
		].join(' '));
		const css = compact(source);

		expect(source).toContain('.g-bd::before,.g-bd::after');
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
		expect(matched).not.toContain('g-bottom-1');
		expect(css).not.toContain('.g-b-1{border-width:1px}');
		expect(source).not.toContain('border-width:2px;');
	});

	it('generates standard Border and Text Align families', async () => {
		const { css: source, matched } = await generate([
			'g-bd', 'g-bdt', 'g-bdr', 'g-bdb', 'g-bdl',
			'g-bd-[1px_solid_red]', 'g-bdt-(--border-top)', 'g-bdr-[2px_dashed_blue]',
			'g-bdb-[double]', 'g-bdl-(--border-left)',
			'g-bdw-2', 'g-bdtw-tn', 'g-bdrw-md', 'g-bdbw-tk', 'g-bdlw-(--border-width)',
			'g-bds-s', 'g-bdts-dash', 'g-bdrs-db', 'g-bdbs-dot', 'g-bdls-(--border-style)',
			'g-bdc-blue-mid', 'g-bdtc-[#123456]', 'g-bdrc-(--border-color)',
			'g-bdbc-red-mid', 'g-bdlc-white',
			'g-ta-l', 'g-ta-r', 'g-ta-c', 'g-ta-j', 'g-ta-s', 'g-ta-e', 'g-ta-ja', 'g-ta-mp',
			'g-ta-[inherit]', 'g-ta-(--text-align)'
		].join(' '));
		const css = compact(source);

		expect(source).toContain('.g-bd::before,.g-bd::after');
		expect(source).toContain('.g-bdt::before,.g-bdt::after');
		expect(source).toContain('.g-bdr::before,.g-bdr::after');
		expect(source).toContain('.g-bdb::before,.g-bdb::after');
		expect(source).toContain('.g-bdl::before,.g-bdl::after');
		expect(source).toContain('border:1px solid red;');
		expect(css).toContain('border-top:var(--border-top)');
		expect(source).toContain('border-right:2px dashed blue;');
		expect(css).toContain('border-bottom:double');
		expect(css).toContain('border-left:var(--border-left)');
		expect(css).toContain('.g-bdw-2{border-width:2px}');
		expect(css).toContain('.g-bdtw-tn{border-top-width:thin}');
		expect(css).toContain('.g-bdrw-md{border-right-width:medium}');
		expect(css).toContain('.g-bdbw-tk{border-bottom-width:thick}');
		expect(css).toContain('border-left-width:var(--border-width)');
		expect(css).toContain('.g-bds-s{border-style:solid}');
		expect(css).toContain('.g-bdts-dash{border-top-style:dashed}');
		expect(css).toContain('.g-bdrs-db{border-right-style:double}');
		expect(css).toContain('.g-bdbs-dot{border-bottom-style:dotted}');
		expect(css).toContain('border-left-style:var(--border-style)');
		expect(css).toContain('.g-bdc-blue-mid{border-color:#16a3ff}');
		expect(css).toContain('border-top-color:#123456');
		expect(css).toContain('border-right-color:var(--border-color)');
		expect(css).toContain('.g-bdbc-red-mid{border-bottom-color:#ca1622}');
		expect(css).toContain('.g-bdlc-white{border-left-color:#fff}');
		expect(css).toContain('.g-ta-l{text-align:left!important}');
		expect(css).toContain('.g-ta-r{text-align:right!important}');
		expect(css).toContain('.g-ta-c{text-align:center!important}');
		expect(css).toContain('.g-ta-j{text-align:justify!important}');
		expect(css).toContain('.g-ta-s{text-align:start!important}');
		expect(css).toContain('.g-ta-e{text-align:end!important}');
		expect(css).toContain('.g-ta-ja{text-align:justify-all!important}');
		expect(css).toContain('.g-ta-mp{text-align:match-parent!important}');
		expect(css).toContain('text-align:inherit!important');
		expect(css).toContain('text-align:var(--text-align)!important');
		expect(matched).toContain('g-bdr');
	});

	it('rejects invalid standard Border and Text Align values', async () => {
		const { matched } = await generateStyleOnly([
			'g-bd-red', 'g-bdw--1', 'g-bdw-auto', 'g-bds-solid',
			'g-bdc-unknown', 'g-bd-[]', 'g-bdt-()', 'g-ta-left', 'g-ta-[]', 'g-ta-(invalid)'
		].join(' '));

		expect(matched).toEqual(new Set());
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

	it('keeps @deot/style semantics when explicitly combined with presetMini', async () => {
		const { css: source } = await generateCombined([
			'g-ai-c', 'g-col', 'g-w-12', 'g-fl-4/12', 'g-fw-400', 'g-br-4',
			'g-bg-blue-mid', 'g-bg-white', 'g-block', 'g-m-4', 'g-flex', 'g-grid',
			'g-bd', 'g-b-1', 'g-b-[1px_solid_red]', 'g-gap-4', 'g-flex-1',
			'g-inline-grid', 'g-grid-cols-3', 'g-bottom-1', 'g-transition', 'g-transform'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-ai-c{align-items:center}');
		expect(css).toContain('.g-col{flex:1}');
		expect(css).toContain('.g-w-12{width:12px}');
		expect(source).toContain('.g-fl-4\\/12{width:33.3333333333%;float:left;}');
		expect(css).toContain('.g-fw-400{font-weight:400}');
		expect(css).toContain('.g-br-4{border-radius:4px}');
		expect(css).toContain('.g-bg-blue-mid{background-color:#16a3ff!important}');
		expect(css).toContain('.g-bg-white{background-color:#fff!important}');
		expect(css).toContain('.g-block{display:block!important}');
		expect(css).toContain('.g-m-4{margin:4px}');
		expect(css).toMatch(/\.g-flex\{[^}]*display:flex[^}]*box-sizing:border-box|\.g-flex\{[^}]*box-sizing:border-box[^}]*display:flex/);
		expect(css).toMatch(/\.g-grid\{[^}]*display:grid[^}]*box-sizing:border-box|\.g-grid\{[^}]*box-sizing:border-box[^}]*display:grid/);
		expect(css).toContain('.g-b-1{bottom:1px}');
		expect(source).toContain('.g-bd::before,.g-bd::after');
		expect(source).toContain('border:1px solid red;');
		expect(css).toContain('.g-gap-4{gap:1rem}');
		expect(source).toContain('.g-flex-1{flex:1 1 0%;}');
		expect(css).toMatch(/\.g-inline-grid\{[^}]*display:inline-grid[^}]*box-sizing:border-box/);
		expect(css).toContain('.g-grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}');
		expect(css).toContain('.g-bottom-1{bottom:0.25rem}');
		expect(css).toContain('.g-transition{transition-property:');
		expect(css).toContain('.g-transform{transform:');
	});

	it('keeps combined rule priority and dark strategy independent of preset order', async () => {
		const createPresets = () => [
			presetMini({ prefix: 'g-', dark: 'media' }),
			presetStyle({ variants: false })
		];

		for (const presets of [createPresets(), createPresets().reverse()]) {
			const uno = await createGenerator({ presets });
			const { css: source } = await uno.generate('g-m-4 g-w-4 g-b-1 g-gap-4 dark:g-bg-black');
			const css = compact(source);

			expect(css).toContain('.g-m-4{margin:4px}');
			expect(css).toContain('.g-w-4{width:4px}');
			expect(css).toContain('.g-b-1{bottom:1px}');
			expect(css).toContain('.g-gap-4{gap:1rem}');
			expect(css).toContain('@media(prefers-color-scheme:dark)');
			expect(css).toContain('--un-rotate:0;');
			expect(css).toContain('--font-size-default:14px;');
		}
	});

	it('generates layout primitives with repository abbreviations', async () => {
		const { css: source } = await generate([
			'g-op-50', 'g-op-[.35]', 'g-op-(--opacity)', 'hover:g-op-25',
			'g-z-10', 'g-z-[-1]', 'g-z-(--layer)',
			'g-of-h', 'g-of-a', 'g-ofx-h', 'g-ofy-a', 'g-of-[overlay]',
			'g-min-w-4', 'g-max-h-screen', 'g-min-h-[calc(100%_-_8px)]', 'g-max-w-(--max-width)',
			'g-ar-square', 'g-ar-rectangle', 'g-ar-4/3', 'g-ar-[1.5]', 'g-ar-(--ratio)'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-op-50{opacity:0.5}');
		expect(css).toContain('opacity:.35');
		expect(css).toContain('opacity:var(--opacity)');
		expect(css).toContain('.hover\\:g-op-25:hover{opacity:0.25}');
		expect(css).toContain('.g-z-10{z-index:10}');
		expect(css).toContain('z-index:-1');
		expect(css).toContain('z-index:var(--layer)');
		expect(css).toContain('.g-of-h{overflow:hidden!important}');
		expect(css).toContain('.g-of-a{overflow:auto}');
		expect(css).toContain('.g-ofx-h{overflow-x:hidden}');
		expect(css).toContain('.g-ofy-a{overflow-y:auto}');
		expect(css).toContain('overflow:overlay');
		expect(css).toContain('.g-min-w-4{min-width:4px}');
		expect(css).toContain('.g-max-h-screen{max-height:100vh}');
		expect(source).toContain('min-height:calc(100% - 8px);');
		expect(css).toContain('max-width:var(--max-width)');
		expect(css).toContain('.g-ar-square{aspect-ratio:1/1}');
		expect(css).toContain('.g-ar-rectangle{aspect-ratio:16/9}');
		expect(css).toContain('.g-ar-4\\/3{aspect-ratio:4/3}');
		expect(css).toContain('aspect-ratio:1.5');
		expect(css).toContain('aspect-ratio:var(--ratio)');
	});

	it('generates Flex item and advanced Grid rules', async () => {
		const { css: source } = await generate([
			'g-fb-8', 'g-fb-auto', 'g-fb-full', 'g-fb-1/3', 'g-fb-[content]', 'g-fb-(--basis)',
			'g-fg-2', 'g-fg-(--grow)', 'g-fsh-0', 'g-fsh-[.5]',
			'g-od-first', 'g-od-last', 'g-od-default', 'g-od-3', 'g-od-[-1]',
			'g-inline-grid', 'g-gac-4', 'g-gar-fr', 'g-gac-[minmax(10px,_1fr)]',
			'g-ji-c', 'g-js-b', 'g-pc-sb', 'g-pi-st', 'g-ps-a', 'g-pi-[safe_center]',
			'g-ga-[header]', 'g-gta-["header_header"_"main_side"]'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-fb-8{flex-basis:8px}');
		expect(css).toContain('.g-fb-auto{flex-basis:auto}');
		expect(css).toContain('.g-fb-full{flex-basis:100%}');
		expect(css).toContain('.g-fb-1\\/3{flex-basis:33.3333333333%}');
		expect(css).toContain('flex-basis:content');
		expect(css).toContain('flex-basis:var(--basis)');
		expect(css).toContain('.g-fg-2{flex-grow:2}');
		expect(css).toContain('flex-grow:var(--grow)');
		expect(css).toContain('.g-fsh-0{flex-shrink:0}');
		expect(css).toContain('flex-shrink:.5');
		expect(css).toContain('.g-od-first{order:-9999}');
		expect(css).toContain('.g-od-last{order:9999}');
		expect(css).toContain('.g-od-default{order:0}');
		expect(css).toContain('.g-od-3{order:3}');
		expect(css).toContain('order:-1');
		expect(css).toMatch(/\.g-inline-grid\{[^}]*display:inline-grid[^}]*box-sizing:border-box/);
		expect(css).toContain('.g-gac-4{grid-auto-columns:4px}');
		expect(css).toContain('.g-gar-fr{grid-auto-rows:minmax(0,1fr)}');
		expect(css).toContain('grid-auto-columns:minmax(10px,1fr)');
		expect(css).toContain('.g-ji-c{justify-items:center}');
		expect(css).toContain('.g-js-b{justify-self:baseline}');
		expect(css).toContain('.g-pc-sb{place-content:space-between}');
		expect(css).toContain('.g-pi-st{place-items:stretch}');
		expect(css).toContain('.g-ps-a{place-self:auto}');
		expect(css).toContain('place-items:safecenter');
		expect(css).toContain('grid-area:header');
		expect(source).toContain('grid-template-areas:"header header" "main side";');
	});

	it('generates interaction abbreviations and arbitrary values', async () => {
		const { css: source } = await generate([
			'g-vi-v', 'g-vi-h', 'g-vi-c', 'g-vi-(--visibility)',
			'g-cu-p', 'g-cu-na', 'g-cu-gg', 'g-cu-[url(cursor.png),_pointer]',
			'g-pe-n', 'g-pe-(--pointer-events)',
			'g-us-n', 'g-us-all', 'g-us-[contain]',
			'g-re-x', 'g-re-y', 'g-re-b', 'g-re-n', 'g-re-[block]',
			'g-ap-n', 'g-ap-(--appearance)'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-vi-v{visibility:visible}');
		expect(css).toContain('.g-vi-h{visibility:hidden}');
		expect(css).toContain('.g-vi-c{visibility:collapse}');
		expect(css).toContain('visibility:var(--visibility)');
		expect(css).toContain('.g-cu-p{cursor:pointer}');
		expect(css).toContain('.g-cu-na{cursor:not-allowed}');
		expect(css).toContain('.g-cu-gg{cursor:grabbing}');
		expect(css).toContain('cursor:url(cursor.png),pointer');
		expect(css).toContain('.g-pe-n{pointer-events:none}');
		expect(css).toContain('pointer-events:var(--pointer-events)');
		expect(css).toContain('-webkit-user-select:none;user-select:none');
		expect(css).toContain('-webkit-user-select:all;user-select:all');
		expect(css).toContain('-webkit-user-select:contain;user-select:contain');
		expect(css).toContain('.g-re-x{resize:horizontal}');
		expect(css).toContain('.g-re-y{resize:vertical}');
		expect(css).toContain('.g-re-b{resize:both}');
		expect(css).toContain('.g-re-n{resize:none}');
		expect(css).toContain('resize:block');
		expect(css).toContain('-webkit-appearance:none;appearance:none');
		expect(css).toContain('-webkit-appearance:var(--appearance);appearance:var(--appearance)');
	});

	it('generates Outline, typography, and SVG rules', async () => {
		const { css: source } = await generate([
			'g-ol-[2px_solid_red]', 'g-ol-(--outline)', 'g-olw-2', 'g-olw-(--outline-width)',
			'g-ols-dash', 'g-ols-[revert-layer]', 'g-olc-blue-mid', 'g-olc-[#123456]', 'g-olo-4',
			'g-tdl-lt', 'g-tdl-ul', 'g-tdl-ol', 'g-tdl-n',
			'g-tds-w', 'g-tdc-red-mid', 'g-tdt-2', 'g-tuo-(--offset)',
			'g-va-m', 'g-va-[10%]', 'g-ls-2', 'g-wsp-[.2em]', 'g-ws-pw', 'g-ws-(--white-space)',
			'g-to-e', 'g-to-c', 'g-truncate', 'g-tt-u', 'g-italic', 'g-not-oblique',
			'g-fill-black', 'g-fill-n', 'g-fill-(--fill)', 'g-stroke-red-mid', 'g-stroke-n',
			'g-stroke-w-2', 'g-stroke-dasharray-[4_2]', 'g-stroke-dashoffset-(--offset)',
			'g-stroke-cap-r', 'g-stroke-join-b'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('outline:2pxsolidred');
		expect(css).toContain('outline:var(--outline)');
		expect(css).toContain('.g-olw-2{outline-width:2px}');
		expect(css).toContain('outline-width:var(--outline-width)');
		expect(css).toContain('.g-ols-dash{outline-style:dashed}');
		expect(css).toContain('outline-style:revert-layer');
		expect(css).toContain('.g-olc-blue-mid{outline-color:#16a3ff}');
		expect(css).toContain('outline-color:#123456');
		expect(css).toContain('.g-olo-4{outline-offset:4px}');
		expect(css).toContain('.g-tdl-lt{text-decoration-line:line-through}');
		expect(css).toContain('.g-tdl-ul{text-decoration-line:underline}');
		expect(css).toContain('.g-tdl-ol{text-decoration-line:overline}');
		expect(css).toContain('.g-tdl-n{text-decoration-line:none}');
		expect(css).toContain('.g-tds-w{text-decoration-style:wavy}');
		expect(css).toContain('text-decoration-color:#ca1622');
		expect(css).toContain('text-decoration-thickness:2px');
		expect(css).toContain('text-underline-offset:var(--offset)');
		expect(css).toContain('.g-va-m{vertical-align:middle}');
		expect(css).toContain('vertical-align:10%');
		expect(css).toContain('.g-ls-2{letter-spacing:2px}');
		expect(css).toContain('word-spacing:.2em');
		expect(css).toContain('.g-ws-pw{white-space:pre-wrap}');
		expect(css).toContain('white-space:var(--white-space)');
		expect(css).toContain('.g-to-e{text-overflow:ellipsis}');
		expect(css).toContain('.g-to-c{text-overflow:clip}');
		expect(css).toContain('.g-truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}');
		expect(css).toContain('.g-tt-u{text-transform:uppercase}');
		expect(css).toContain('.g-italic{font-style:italic}');
		expect(css).toContain('.g-not-oblique{font-style:normal}');
		expect(css).toContain('.g-fill-black{fill:#000}');
		expect(css).toContain('.g-fill-n{fill:none}');
		expect(css).toContain('fill:var(--fill)');
		expect(css).toContain('.g-stroke-red-mid{stroke:#ca1622}');
		expect(css).toContain('.g-stroke-n{stroke:none}');
		expect(css).toContain('.g-stroke-w-2{stroke-width:2px}');
		expect(css).toContain('stroke-dasharray:42');
		expect(css).toContain('stroke-dashoffset:var(--offset)');
		expect(css).toContain('.g-stroke-cap-r{stroke-linecap:round}');
		expect(css).toContain('.g-stroke-join-b{stroke-linejoin:bevel}');
	});

	it('rejects invalid supplemental rules', async () => {
		const { matched } = await generateStyleOnly([
			'g-op-101', 'g-op--1', 'g-z--1', 'g-of-invalid', 'g-ofx-1',
			'g-ar-0/1', 'g-ar-1/0', 'g-ar-1', 'g-fg--1', 'g-fsh-1.5', 'g-js-sb', 'g-ps-b',
			'g-vi-visible', 'g-cu-pointer', 'g-re-horizontal', 'g-olc-unknown',
			'g-ga-header', 'g-stroke-dasharray-4'
		].join(' '));

		expect(matched).toEqual(new Set());
	});

	it('applies custom prefix and unit to supplemental rules', async () => {
		const { css: source } = await generate([
			'x-min-w-2', 'x-fb-3', 'x-gac-4', 'x-olw-5', 'x-ls-6', 'x-stroke-w-7',
			'x-bd', 'x-bdw-5', 'hover:x-bdc-black', 'hover:x-cu-p', 'g-min-w-2', 'g-bd'
		].join(' '), { prefix: 'x-', unit: 'rem', scale: 3 });
		const css = compact(source);

		expect(css).toContain('.x-min-w-2{min-width:2rem}');
		expect(css).toContain('.x-fb-3{flex-basis:3rem}');
		expect(css).toContain('.x-gac-4{grid-auto-columns:4rem}');
		expect(css).toContain('.x-olw-5{outline-width:5rem}');
		expect(css).toContain('.x-ls-6{letter-spacing:6rem}');
		expect(css).toContain('.x-stroke-w-7{stroke-width:7rem}');
		expect(source).toContain('.x-bd::before,.x-bd::after');
		expect(source).toContain('border:3rem solid var(--border-color-default);');
		expect(css).toContain('.x-bdw-5{border-width:5rem}');
		expect(css).toContain('.hover\\:x-bdc-black:hover{border-color:#000}');
		expect(css).toContain('.hover\\:x-cu-p:hover{cursor:pointer}');
		expect(css).not.toContain('.g-min-w-2');
		expect(css).not.toContain('.g-bd');
	});

	it('keeps supplemental rule semantics when explicitly combined with Mini', async () => {
		const { css: source } = await generateCombined([
			'g-min-w-4', 'g-inline-grid', 'g-op-50', 'g-fill-black',
			'g-bd', 'g-bdw-2', 'g-bdc-black', 'g-ta-r',
			'g-overflow-x-hidden', 'g-cursor-pointer'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-min-w-4{min-width:4px}');
		expect(css).not.toContain('.g-min-w-4{min-width:1rem}');
		expect(css).toMatch(/\.g-inline-grid\{[^}]*display:inline-grid[^}]*box-sizing:border-box/);
		expect(css).toContain('.g-op-50{opacity:0.5}');
		expect(css).toContain('.g-fill-black{fill:#000}');
		expect(source).toContain('.g-bd::before,.g-bd::after');
		expect(css).toContain('.g-bdw-2{border-width:2px}');
		expect(css).toContain('.g-bdc-black{border-color:#000}');
		expect(css).toContain('.g-ta-r{text-align:right!important}');
		expect(css).toContain('.g-overflow-x-hidden{overflow-x:hidden}');
		expect(css).toContain('.g-cursor-pointer{cursor:pointer}');
	});

	it('uses distinct canonical abbreviations for formerly shared properties', async () => {
		const { css: source } = await generate([
			'g-fwr-w', 'g-fl-4/12', 'g-fw-400',
			'g-bsh', 'g-bsh-t', 'g-bsz-bb', 'g-bdr', 'g-br-4'
		].join(' '));
		const css = compact(source);

		expect(css).toContain('.g-fwr-w{flex-wrap:wrap}');
		expect(source).toContain('.g-fl-4\\/12{width:33.3333333333%;float:left;}');
		expect(css).toContain('.g-fw-400{font-weight:400}');
		expect(css).toContain('.g-bsh{box-shadow:var(--border-shadow-default)!important}');
		expect(css).toContain('.g-bsh-t{box-shadow:var(--border-shadow-default-top)!important}');
		expect(css).toContain('.g-bsz-bb{box-sizing:border-box}');
		expect(source).toContain('.g-bdr::before,.g-bdr::after');
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
				'x-dot', 'x-divider', 'x-br-default', 'g-fs-14'
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
		expect(css).toMatch(/\.x-divider\{[^}]*width:2rem[^}]*height:24rem/);
		expect(css).toContain('--border-radius-default:16rem;');
		expect(css).toContain('.x-br-default{border-radius:var(--border-radius-default)!important}');
	});

	it('reads defaults from process.env and lets explicit options override them', async () => {
		vi.stubEnv('UNOCSS_OPTIONS', JSON.stringify({
			prefix: 'env-',
			unit: 'rem',
			scale: 2,
			reset: false,
			variants: false,
			dark: 'media'
		}));

		try {
			const { css: source, matched } = await generate('env-fs-14 env-dot hover:env-fs-14 g-fs-14');
			const css = compact(source);

			expect(matched).not.toContain('g-fs-14');
			expect(matched).not.toContain('hover:env-fs-14');
			expect(css).toContain('.env-fs-14{font-size:14rem}');
			expect(css).toContain('.env-dot{display:block;width:10rem;height:10rem;border-radius:50%}');
			expect(css).not.toContain('html{width:100%;height:100%}');

			const { css: overrideSource } = await generate('x-fs-14 x-dot dark:x-fs-14', {
				prefix: 'x-',
				unit: 'px',
				scale: 1,
				reset: true,
				variants: true
			});
			const overrideCSS = compact(overrideSource);
			expect(overrideCSS).toContain('.x-fs-14{font-size:14px}');
			expect(overrideCSS).toContain('.x-dot{display:block;width:5px;height:5px;border-radius:50%}');
			expect(overrideCSS).toContain('html{width:100%;height:100%}');
			expect(overrideCSS).toContain('@media(prefers-color-scheme:dark)');
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

	it('rejects an invalid scale from explicit options', () => {
		for (const scale of [Number.NaN, Number.POSITIVE_INFINITY]) {
			expect(() => presetStyle({ scale })).toThrow('presetStyle.scale must be a finite number');
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
		const { css: source } = await generate('g-c-info g-bg-white g-bd g-scroller g-reset g-unset');
		const css = compact(source);

		expect(css).toContain('--color-info:#0177de;');
		expect(css).toContain('.g-c-info{color:var(--color-info)!important}');
		expect(css).toContain('.g-bg-white{background-color:#fff!important}');
		expect(source).not.toContain('.g-bg-white input');
		expect(source).toContain('.g-bd::before,.g-bd::after');
		expect(css).toContain('@media(resolution>=2dppx)');
		expect(source).toContain('.g-scroller::-webkit-scrollbar-thumb');
		expect(source).toContain('.g-reset ol,.g-reset ul,.g-reset li');
		expect(source).toContain('.g-unset h1,.g-unset h2');
	});

	it('implements every documented repository utility without relying on presetMini', async () => {
		const utilities = [...staticUtilities, ...numericUtilities, ...supplementalUtilities];
		const { matched } = await generateStyleOnly(utilities.join(' '));

		expect([...matched].sort()).toEqual([...utilities].sort());
	});
});
