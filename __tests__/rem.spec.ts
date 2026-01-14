// @vitest-environment jsdom
import { Style } from '../src/index.ts';

describe('js/', () => {
	it('themefix', () => {
		expect.hasAssertions();
		// 默认宽度1024
		Style.useREM();
		expect(parseFloat(document.documentElement.style.fontSize)).toBe(1024 / 750);
	});
});
