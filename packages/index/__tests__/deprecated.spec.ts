import { readFileSync } from 'node:fs';
import { compileString } from './fixtures/sass';
import { collectUtilityDeclarations, extractLegacyUtilities } from './fixtures/utilities';

/*
 * 此基线在拆分前生成，固定旧声明、优先级、伪元素和媒体查询，防止迁移改变旧语义。
 */
const baseline = readFileSync(`${process.cwd()}/packages/index/__tests__/fixtures/deprecated.css`, 'utf8');
const utilities = extractLegacyUtilities(baseline);

describe('deprecated Sass entry', () => {
	it('only emits historical utilities with their original declarations', () => {
		const { css } = compileString('@use \'./index.deprecated\'');
		expect(extractLegacyUtilities(css)).toEqual(utilities);
		expect(collectUtilityDeclarations(css, utilities))
			.toEqual(collectUtilityDeclarations(baseline, utilities));
		expect(css).not.toContain(':root');
		expect(css).not.toContain('.g-reset');
		expect(css).not.toContain('.g-0of1');
		expect(css).not.toContain('.g-3of7');
		expect(css).not.toContain('.g-img-37');
		expect(css).toContain('.g-lh-one{height:var(--line-height-limit);line-height:var(--line-height-limit)}');
		expect(css).toContain('.g-lh-two{height:calc(var(--line-height-limit)*2);line-height:var(--line-height-limit)}');
	});

	it('keeps current category outputs free of deprecated classes', () => {
		for (const name of ['border', 'box-shadow', 'flex', 'float', 'image', 'line-height', 'other', 'text']) {
			const { css } = compileString(`@use './outputs/${name}'`);
			expect(extractLegacyUtilities(css).filter(token => utilities.includes(token))).toEqual([]);
		}
	});

	it('keeps every normal entry free of deprecated utilities', () => {
		for (const entry of [
			'index',
			'index.normalize',
			'index.normalize-only',
			'index.rem',
			'index.rem-part',
			'index.rpx'
		]) {
			const css = compileString(`@use './${entry}'`).css;
			const names = entry === 'index.rem-part'
				? utilities.map(token => token.replace(/^g-/, 'rg-'))
				: utilities;
			for (const name of names) {
				const selector = `.${name.replace('/', '\\/')}`;
				expect(css.includes(`${selector}{`) || css.includes(`${selector}::`)).toBe(false);
			}
		}
	});
});
