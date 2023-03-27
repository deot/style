import * as sass from './fixtures/sass';

describe('index.scss', () => {
	it('build success', () => {
		const source1 = sass.compile();
		const source2 = sass.compileString(`@import './index.scss'`);

		expect(source1.css).toBe(source2.css);
	});
});
