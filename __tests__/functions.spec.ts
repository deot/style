import * as sass from './fixtures/sass';

describe('functions/', () => {
	it('themefix', () => {
		const source = sass.compileString(`@import './functions/theme';a{color: themefix(color-default)}`);
		expect(source.css).toMatch('a{color:var(--color-default)}');
	});

	it('themefix allow-css-variables = false', () => {
		const source = sass.compileString(`$allow-css-variables: false; @import './functions/theme.scss';a{color: themefix(color-default)}`);
		expect(source.css).toMatch('a{color:#f5f6fa}');
	});

	it('unitfix 10rem', () => {
		const source = sass.compileString(`@import './functions/helper';a{font-size: unitfix(10rem)}`);
		expect(source.css).toMatch('a{font-size:10rem}');
	});

	it('unitfix 10rem scale = 2', () => {
		const source = sass.compileString(`$scale: 2; @import './functions/helper';a{font-size: unitfix(10rem)}`);
		expect(source.css).toMatch('a{font-size:20rem}');
	});

	it('unitfix 10', () => {
		const source = sass.compileString(`@import './functions/helper';a{font-size: unitfix(10)}`);
		expect(source.css).toMatch('a{font-size:10px}');
	});

	it('unitfix 10 scale = 2', () => {
		const source = sass.compileString(`$scale: 2; @import './functions/helper';a{font-size: unitfix(10)}`);
		expect(source.css).toMatch('a{font-size:20px}');
	});

	it('unitfix "10rpx"', () => {
		const source = sass.compileString(`@import './functions/helper';a{font-size: unitfix("10rpx")}`);
		expect(source.css).toMatch('a{font-size:10rpx}');
	});

	it('unitfix "10rpx"', () => {
		const source = sass.compileString(`$scale: 2; @import './functions/helper';a{font-size: unitfix("10rpx")}`);
		expect(source.css).toMatch('a{font-size:10rpx}');
	});

	it('prefix suffix', () => {
		const source = sass.compileString(`@import './functions/helper';#{prefix((name: 'test'))}#{suffix(10)}{ color: red }`);
		expect(source.css).toMatch('.g-test-10{');
	});

	it('prefix suffix scale = 2', () => {
		const source = sass.compileString(`$scale: 2; @import './functions/helper';#{prefix((name: 'test'))}#{suffix(10)}{ color: red }`);
		expect(source.css).toMatch('.g-test-20{');
	});
});
