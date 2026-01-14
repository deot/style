import * as sass from './fixtures/sass';

describe('index.scss', () => {
	it('build success', () => {
		const source1 = sass.compile();
		const source2 = sass.compileString(`@use './index.scss'`);
		const source3 = sass.compileString(`@use './index.rpx.scss'`);

		expect(source1.css).toBe(source2.css);
		expect(source3.css !== source2.css).toBe(true);
	});

	it('rem-part', () => {
		const source = sass.compileString(`@use './index.rem-part.scss'`);
		expect(source.css).toMatch('.rg-pd-tb-24{padding-bottom:24rem;padding-top:24rem}');
	});

	it('theme', () => {
		const source = sass.compileString(`@use './outputs/theme.scss'`);

		expect(source.css).toMatch(`:root{--`);
	});

	it('padding', () => {
		const source = sass.compileString(`@use './outputs/padding.scss'`);

		expect(source.css).toMatch(`.g-pd-56{padding:56px}`);
		expect(source.css).toMatch(`.g-pd-tb-56{padding-bottom:56px;padding-top:56px}`);
		expect(source.css).toMatch(`.g-pd-t-56{padding-top:56px}`);
	});

	it('margin', () => {
		const source = sass.compileString(`@use './outputs/margin.scss'`);

		expect(source.css).toMatch(`.g-m-56{margin:56px}`);
		expect(source.css).toMatch(`.g-m-tb-56{margin-bottom:56px;margin-top:56px}`);
		expect(source.css).toMatch(`.g-m-t-56{margin-top:56px}`);
	});

	it('color', () => {
		const source = sass.compileString(`@use './outputs/color.scss'`);
		expect(source.css).toMatch(`.g-c-white{color:#fff !important}`);
		expect(source.css).toMatch(`.g-bg-white{background-color:#fff !important}`);
		expect(source.css).toMatch(`.g-bg-lg-blue{background:#6ab4ff;background-image:linear-gradient(to right, #16a3ff, #6ab4ff)}`);
	});

	it('line-height', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$allow-css-variables: false; @use './outputs/line-height.scss'`);
		expect(source.css).toMatch(`.g-lh-16{line-height:16px}`);
		expect(source.css).toMatch(`.g-lh-1{line-height:1}`);
		expect(source.css).toMatch(`.g-lh-default{line-height:1.5}`);
		expect(source.css).toMatch(`.g-lh-one{height:32px;line-height:32px}`);
		expect(source.css).toMatch(`.g-lh-two{height:calc(32px*2);line-height:32px}`);
	});

	it('font-size', () => {
		const source = sass.compileString(`@use './outputs/font-size.scss'`);
		expect(source.css).toMatch(`.g-fs-16{font-size:16px}`);
	});

	it('float', () => {
		const source = sass.compileString(`@use './outputs/float.scss'`);
		expect(source.css).toMatch(`.g-w-12,.g-fw-12{width:100%}`);
	});

	it('flex', () => {
		const source = sass.compileString(`@use './outputs/flex.scss'`);
		expect(source.css).toMatch(`.g-ai-c{align-items:center}`);
		expect(source.css).toMatch(`.g-1of5{flex:0 0 20%}`);
	});

	it('image', () => {
		const source = sass.compileString(`@use './outputs/image.scss'`);
		expect(source.css).toMatch(`.g-img-40{width:40px;height:40px;max-width:40px;min-width:40px;line-height:40px}`);
		expect(source.css).toMatch(`.g-imgr-40{width:40px;height:40px;max-width:40px;min-width:40px;line-height:40px;border-radius:4px}`);
		expect(source.css).toMatch(`.g-imgc-40{width:40px;height:40px;max-width:40px;min-width:40px;line-height:40px;border-radius:50%}`);
	});

	it('position', () => {
		const source = sass.compileString(`@use './outputs/position.scss'`);
		expect(source.css).toMatch(`.g-absolute-full{position:absolute !important;inset:0}`);
	});

	it('text', () => {
		const source = sass.compileString(`@use './outputs/text.scss'`);
		expect(source.css)
			// eslint-disable-next-line @stylistic/max-len
			.toMatch(`.g-line-two{display:-webkit-box;overflow:hidden;text-overflow:ellipsis;-webkit-box-orient:vertical;-webkit-line-clamp:2;word-break:break-all;text-wrap:wrap;overflow-wrap:break-word}`);
	});

	it('border', () => {
		const source = sass.compileString(`@use './outputs/border.scss'`);
		expect(source.css)
			.toMatch(`.g-b{position:relative;transform:translateZ(0)}.g-b::before,.g-b::after`);
		expect(source.css).toMatch(`.g-br-4{border-radius:4px}`);
	});

	it('box-shadow', () => {
		const source = sass.compileString(`@use './outputs/box-shadow.scss'`);
		expect(source.css)
			.toMatch(`.g-bs{box-shadow:var(--border-shadow-default) !important}`);
	});

	it('reset', () => {
		const source = sass.compileString(`@use './outputs/reset.scss'`);
		expect(source.css).toMatch(`.g-unset`);
		expect(source.css).toMatch(`.g-reset`);
	});

	it('font-weight', () => {
		const source = sass.compileString(`@use './outputs/font-weight.scss'`);
		expect(source.css).toMatch(`.g-fw-bold`);
		expect(source.css).toMatch(`.g-fw-700`);
		expect(source.css).toMatch(`.g-fw-400{font-weight:400}`);
	});

	it('other', () => {
		const source = sass.compileString(`@use './outputs/other.scss'`);
		expect(source.css).toMatch(`.g-pointer`);
		expect(source.css).toMatch(`.g-bs-bb`);
		expect(source.css).toMatch(`.g-disabled{pointer-events:none}`);
		expect(source.css).toMatch(`.g-operable{font-size:14px;color:var(--color-highlight) !important;cursor:pointer}`);
	});

	it('prefix = ""', () => {
		const source = sass.compileString(`@use './variables/default' with ($prefix: ''); @use './outputs/other.scss'`);
		expect(source.css).toMatch(`.disabled{pointer-events:none}`);
	});

	it('unit = rem', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$unit: rem; @use './outputs/other.scss'`);
		expect(source.css).toMatch(`.g-operable{font-size:14rem;color:var(--color-highlight) !important;cursor:pointer}`);
	});

	it('scale = 2 & unit = rpx', () => {
		// eslint-disable-next-line @stylistic/max-len
		const source = sass.compileString(`@use './variables/default' as vd; vd.$scale: 2; vd.$unit: rpx; @use './outputs/other.scss'; @use './outputs/font-size.scss'`);
		expect(source.css).toMatch(`.g-operable{font-size:28rpx;color:var(--color-highlight) !important;cursor:pointer}`);
		expect(source.css).toMatch(`.g-fs-16{font-size:16rpx}`);
	});

	it('allow-css-variables = false', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$allow-css-variables: false; @use './outputs/other.scss';`);
		expect(source.css).toMatch(`.g-operable{font-size:14px;color:#5495f6 !important;cursor:pointer}`);
	});

	it('allow-asterisk-wildcard', () => {
		const source1 = sass.compileString(`@use './variables/default' as vd; vd.$allow-asterisk-wildcard: false; @use './outputs/reset.scss';`);
		expect(source1.css).not.toMatch(`*::before`);

		const source2 = sass.compileString(`@use './variables/default' as vd; vd.$allow-asterisk-wildcard: true; @use './outputs/reset.scss';`);
		expect(source2.css).toMatch(`*::before`);
	});
});
