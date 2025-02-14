import * as path from 'node:path';
import * as sass from './fixtures/sass';

describe('mixins/', () => {
	it('index.scss', () => {
		const source1 = sass.compile(path.resolve(process.cwd(), `./src/mixins/index.scss`));
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

	it('common.scss/common-border-1px', () => {
		const source = sass.compileString(`@use './mixins/common.scss' as *; .b { @include common-border-1px('', inherit);}`);

		expect(source.css).toMatch(`border-radius:inherit`);
	});
});
