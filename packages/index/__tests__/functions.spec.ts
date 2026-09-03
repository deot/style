/* eslint-disable @stylistic/max-len */
import * as sass from './fixtures/sass';

describe('functions/', () => {
	it('themefix', () => {
		const source = sass.compileString(`@use './functions/theme' as ft;a{color: ft.themefix(color-default)}`);
		expect(source.css).toMatch('a{color:var(--color-default)}');
	});

	it('themefix allow-css-variables = false', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$allow-css-variables: false; @use './functions/theme.scss' as ft;a{color: ft.themefix(color-default)}`);
		expect(source.css).toMatch('a{color:#515a6e}');
	});

	it('unitfix 10rem', () => {
		const source = sass.compileString(`@use './functions/helper' as fh;a{font-size: fh.unitfix(10rem)}`);
		expect(source.css).toMatch('a{font-size:10rem}');
	});

	it('unitfix 10rem scale = 2', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$scale: 2; @use './functions/helper' as fh;a{font-size: fh.unitfix(10rem)}`);
		expect(source.css).toMatch('a{font-size:20rem}');
	});

	it('unitfix 10', () => {
		const source = sass.compileString(`@use './functions/helper' as fh;a{font-size: fh.unitfix(10)}`);
		expect(source.css).toMatch('a{font-size:10px}');
	});

	it('unitfix 10 scale = 2', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$scale: 2; @use './functions/helper' as fh;a{font-size: fh.unitfix(10)}`);
		expect(source.css).toMatch('a{font-size:20px}');
	});

	it('unitfix "10rpx"', () => {
		const source = sass.compileString(`@use './functions/helper' as fh;a{font-size: fh.unitfix("10rpx")}`);
		expect(source.css).toMatch('a{font-size:10rpx}');
	});

	it('unitfix "10rpx"', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$scale: 2; @use './functions/helper' as fh;a{font-size: fh.unitfix("10rpx")}`);
		expect(source.css).toMatch('a{font-size:10rpx}');
	});

	it('prefix suffix', () => {
		const source = sass.compileString(`@use './functions/helper' as fh;#{fh.prefix((name: 'test'))}#{fh.suffix(10)}{ color: red }`);
		expect(source.css).toMatch('.g-test-10{');
	});

	it('prefix suffix scale = 2', () => {
		const source = sass.compileString(`@use './variables/default' as vd; vd.$scale: 2; @use './functions/helper' as fh;#{fh.prefix((name: 'test'))}#{fh.suffix(10)}{ color: red }`);
		expect(source.css).toMatch('.g-test-20{');
	});
});
