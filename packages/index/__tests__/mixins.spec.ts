import * as path from 'node:path';
import * as sass from './fixtures/sass';

describe('mixins/', () => {
	it('index.scss', () => {
		const source1 = sass.compile(path.resolve(process.cwd(), `./packages/index/src/mixins/index.scss`));
		const source2 = sass.compileString(`@use './mixins/index.scss'`);

		// mixins转css后不存在了
		expect(source1.css).toBe(source2.css);
		expect(source1.css).toBe('');
		expect(source2.css).toBe('');
	});

	it('bem.scss', () => {
		const source = sass.compileString(`
			@use './mixins/bem.scss' as *;
			$block: b;

			@include share-rule(border) {
				margin: 30px;
			}

			@include block(b) {
				margin: 0;
				@include element(e) {
					margin: 10px;
				}

				@include modifier(m) {
					margin: 20px;
				}

				@include element(e1) {
					margin: 10px;
					@include modifier(m1) {
						margin: 20px;
					}
				}

				@include element(e2) {
					margin: 10px;
					@include when(d) {
						margin: 20px;
					}
				}

				@include element(e3) {
					margin: 10px;
					@include when(d, true) {
						margin: 20px;
					}
				}

				@include element(e4) {
					@include extend-rule(border);
				}

				@include element(e5) {
					@include extend-rule(border);
				}

				@include pseudo(hover) {
					margin: 40px;
				}

				@include element(e6) {
					@include element(e7) {
						@include element(e8) {
							margin: 50px;
						}
					}
				}

				@include element(e9, false) {
					@include element(e10, false) {
						@include element(e11, false) {
							margin: 50px;
						}
					}
				}
			}
		`);

		expect(source.css).toMatch(`.b{margin:0}`);
		expect(source.css).toMatch(`.b__e{margin:10px}`);
		expect(source.css).toMatch(`.b--m{margin:20px}`);
		expect(source.css).toMatch(`.b__e1{margin:10px}`);
		expect(source.css).toMatch(`.b__e1--m1{margin:20px}`);
		expect(source.css).toMatch(`.b__e2{margin:10px}`);
		expect(source.css).toMatch(`.b__e2.is-d{margin:20px}`);
		expect(source.css).toMatch(`.b__e3{margin:10px}`);
		expect(source.css).toMatch(`.b__e3.has-d{margin:20px}`);
		expect(source.css).toMatch(`.b__e5,.b__e4{margin:30px}`);
		expect(source.css).toMatch(`.b:hover{margin:40px}`);
		expect(source.css).toMatch(`.b__e8{margin:50px}`);
		expect(source.css).toMatch(`.b__e9 .b__e10 .b__e11{margin:50px}`);
	});

	it('bem.scss, block list shares one rule and pairs elements with their own block', () => {
		const source = sass.compileString(`
			@use './mixins/bem.scss' as *;

			@include block((b, bm)) {
				margin: 0;

				@include when(d) {
					margin: 10px;

					@include element(e) {
						margin: 20px;
					}
				}

				@include element(e1) {
					margin: 30px;

					@include when(d) {
						margin: 40px;
					}
				}

				@include element((e2, e3)) {
					margin: 50px;

					@include pseudo(hover) {
						margin: 60px;
					}
				}

				@include element(e4, false) {
					margin: 70px;
				}

				@include modifier(m) {
					margin: 80px;
				}

				@include pseudo(hover) {
					margin: 90px;

					@include element(e5) {
						margin: 100px;
					}
				}
			}
		`);

		expect(source.css).toMatch(`.b,.bm{margin:0}`);
		expect(source.css).toMatch(`.b.is-d,.bm.is-d{margin:10px}`);
		// 嵌套时 element 只接在自己 block 的父选择器后面，不交叉组合
		expect(source.css).toMatch(`.b.is-d .b__e,.bm.is-d .bm__e{margin:20px}`);
		expect(source.css).toMatch(`.b__e1,.bm__e1{margin:30px}`);
		expect(source.css).toMatch(`.b__e1.is-d,.bm__e1.is-d{margin:40px}`);
		expect(source.css).toMatch(`.b__e2,.b__e3,.bm__e2,.bm__e3{margin:50px}`);
		// 父选择器为列表时，每一项都加上伪类
		expect(source.css).toMatch(`.b__e2:hover,.b__e3:hover,.bm__e2:hover,.bm__e3:hover{margin:60px}`);
		expect(source.css).toMatch(`.b .b__e4,.bm .bm__e4{margin:70px}`);
		expect(source.css).toMatch(`.b--m,.bm--m{margin:80px}`);
		expect(source.css).toMatch(`.b:hover,.bm:hover{margin:90px}`);
		expect(source.css).toMatch(`.b:hover .b__e5,.bm:hover .bm__e5{margin:100px}`);
		expect(source.css).not.toMatch(`.b.is-d .bm__e`);
	});

	it('bem.scss, block list only pairs exact block names', () => {
		const source = sass.compileString(`
			@use './mixins/bem.scss' as *;

			@include block((vc-select, vc-select-option)) {
				@include when(d) {
					@include element(e) {
						margin: 0;
					}
				}
			}
		`);

		// .vc-select-option 不应被当作 .vc-select 的选择器
		expect(source.css).toMatch(`.vc-select.is-d .vc-select__e,.vc-select-option.is-d .vc-select-option__e{margin:0}`);
	});

	it('bem.scss, element list followed by pseudo (single block)', () => {
		const source = sass.compileString(`
			@use './mixins/bem.scss' as *;

			@include block(b) {
				@include element((e1, e2)) {
					@include pseudo(hover) {
						margin: 0;
					}
				}
			}
		`);

		expect(source.css).toMatch(`.b__e1:hover,.b__e2:hover{margin:0}`);
	});

	it('bem.scss, block list pairs configurable-m, spec-selector and meb', () => {
		const source = sass.compileString(`
			@use './mixins/bem.scss' as *;

			@include block((b, bm)) {
				@include element(e) {
					@include configurable-m(m, e) {
						margin: 0;
					}

					@include spec-selector(' > ', f) {
						margin: 10px;
					}

					@include spec-selector('', e, m1) {
						margin: 20px;
					}

					@include meb(m2, g) {
						margin: 30px;
					}
				}
			}
		`);

		expect(source.css).toMatch(`.b__e .b__e--m,.bm__e .bm__e--m{margin:0}`);
		expect(source.css).toMatch(`.b__e>.b__f,.bm__e>.bm__f{margin:10px}`);
		expect(source.css).toMatch(`.b__e.b__e--m1,.bm__e.bm__e--m1{margin:20px}`);
		expect(source.css).toMatch(`.b__e .b__g--m2,.bm__e .bm__g--m2{margin:30px}`);
	});

	it('common.scss/common-border-1px, radius', () => {
		const source = sass.compileString(`
			@use './mixins/common.scss' as *;
			.a { @include common-border-1px('', red, 4); }
			.b { @include common-border-1px('', red, calc(var(--rem) * 8)); }
			.c { @include common-border-1px('', red); }
		`);

		expect(source.css).toMatch(`.a::before,.a::after{`);
		expect(source.css).toMatch(`border-radius:4px`);
		// 字符串圆角原样输出（原先一律变为 inherit）
		expect(source.css).toMatch(`border-radius:calc(var(--rem)*8)`);
		expect(source.css).toMatch(`border-radius:inherit`);
	});

	it('common.scss/common-text-line, break', () => {
		const withBreak = sass.compileString(`@use './mixins/common.scss' as *; .a { @include common-text-line(2); }`);
		const withoutBreak = sass.compileString(`@use './mixins/common.scss' as *; .a { @include common-text-line(2, false); }`);

		expect(withBreak.css).toMatch(`word-break:break-all`);
		expect(withoutBreak.css).toMatch(`-webkit-line-clamp:2`);
		expect(withoutBreak.css).not.toMatch(`word-break`);
	});

	it('common.scss/common-border-1px', () => {
		const source = sass.compileString(`@use './mixins/common.scss' as *; .b { @include common-border-1px('', inherit);}`);

		expect(source.css).toMatch(`border-radius:inherit`);
	});
});
