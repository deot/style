// @vitest-environment jsdom
import { Style } from '../src/index.ts';

const html = () => document.documentElement;
const expected = () => `${window.innerWidth / 750}px`;

describe('js/', () => {
	beforeEach(() => {
		html().style.cssText = '';
	});

	it('themefix', () => {
		expect.hasAssertions();
		// 默认宽度1024
		Style.useREM();
		expect(parseFloat(html().style.fontSize)).toBe(1024 / 750);
		expect(html().style.getPropertyValue('--rem')).toBe(expected());
	});

	it('injects font-size only', () => {
		Style.useREM(750, { rem: false });
		expect(html().style.fontSize).toBe(expected());
		expect(html().style.getPropertyValue('--rem')).toBe('');
	});

	it('injects css var only', () => {
		Style.useREM(750, { fontSize: false });
		expect(html().style.fontSize).toBe('');
		expect(html().style.getPropertyValue('--rem')).toBe(expected());
	});

	it('customizes css var name', () => {
		Style.useREM(750, { rem: '--unit' });
		expect(html().style.getPropertyValue('--unit')).toBe(expected());
		expect(html().style.getPropertyValue('--rem')).toBe('');
	});

	it('prefixes css var name without dashes', () => {
		Style.useREM(750, { fontSize: false, rem: 'unit' });
		expect(html().style.getPropertyValue('--unit')).toBe(expected());
	});
});
