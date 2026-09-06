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

	it('loads compatibility once after current utilities in the full entry', () => {
		const { css } = compileString('@use \'./index\'');
		const duplicate = compileString('@use \'./index\'; @use \'./index.deprecated\' as compatibility').css;
		expect(duplicate).toBe(css);
		expect(css.indexOf('.g-lh-one{')).toBeGreaterThan(css.indexOf('.g-lh-2{'));
		expect(collectUtilityDeclarations(css, utilities))
			.toEqual(collectUtilityDeclarations(baseline, utilities));
		for (const entry of ['index.rem', 'index.rpx']) {
			const full = compileString(`@use './${entry}'`).css;
			const unit = entry.split('.')[1];
			const compatibility = compileString(`
				@use './variables/default' with ($unit: ${unit}, $scale: 2, $allow-css-variables: ${unit === 'rem'});
				@use './index.deprecated';
			`).css;
			const tokens = extractLegacyUtilities(compatibility);
			expect(tokens).toHaveLength(85);
			expect(collectUtilityDeclarations(full, tokens))
				.toEqual(collectUtilityDeclarations(compatibility, tokens));
		}
	});

	it('supports source prefix, unit, scale and concrete theme values', () => {
		const { css } = compileString(`
			@use 'sass:map';
			@use './variables/default' with ($prefix: 'app-', $unit: rem, $scale: 2, $allow-css-variables: false);
			@use './variables/theme' as theme;
			theme.$theme: map.merge(theme.$theme, (line-height-limit: 45rem, border-color-default: red));
			@use './index.deprecated';
		`);
		expect(css).not.toContain('.g-');
		expect(css).not.toContain('.app--');
		expect(css).not.toContain('var(--');
		expect(css).toContain('.app-lh-one{height:45rem;line-height:45rem}');
		expect(css).toContain('.app-lh-two{height:90rem;line-height:45rem}');
		expect(css).toContain('border:2rem solid red');
		expect(css).toContain('.app-img-80{width:80rem;');
		expect(css).toContain('border-radius:8rem');
		expect(css).toContain('margin:0 16rem');
	});

	it('shares image size extensions without emitting current images from compatibility', () => {
		const compatibility = compileString(`
			@use './outputs/gen-mixins/image' with ($image-size-list-join-data: (37,));
			@use './index.deprecated';
		`).css;
		expect(compatibility).toContain('.g-img-37{width:37px;');
		expect(compatibility).not.toContain('.g-image-');
		const full = compileString(`
			@use './outputs/image' with ($image-size-list-join-data: (37,));
			@use './index';
		`).css;
		expect(full).toContain('.g-img-37{width:37px;');
		expect(full).toContain('.g-image-37{width:37px;');
	});

	it('keeps rem-part scoped and supports an explicitly configured compatibility entry', () => {
		const partial = compileString('@use \'./index.rem-part\'').css;
		expect(partial).not.toContain('.rg-lh-one');
		expect(partial).not.toContain('.rg-lh-two');
		const compatibility = compileString(`
			@use './variables/default' with ($prefix: 'rg-', $unit: rem, $scale: 2);
			@use './index.deprecated';
		`).css;
		expect(compatibility).toContain('.rg-lh-one{');
		expect(compatibility).toContain('.rg-lh-two{');
		expect(compatibility).toContain('border:2rem solid var(--border-color-default)');
	});
});
