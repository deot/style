import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { resolveColorValue } from './color';
import { createPatternPrefix, createStaticRule, resolveDynamicValue, resolveKeywordValue } from './utils';

export const createOutlineRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	const rules: Rule[] = [];

	/*
	 * Outline 子属性采用连续缩写：olw、ols、olc、olo，避免与复合值 g-ol-* 混淆。
	 */
	for (const [name, value] of Object.entries({
		n: 'none', h: 'hidden', dot: 'dotted', dash: 'dashed', s: 'solid',
		db: 'double', g: 'groove', r: 'ridge', i: 'inset', o: 'outset'
	})) {
		rules.push(createStaticRule(options, `ols-${name}`, { 'outline-style': value }));
	}

	rules.push(
		[
			new RegExp(`^${patternPrefix}ol-(\\[.+\\]|\\(--[\\w-]+\\))$`),
			([, value]) => {
				const result = resolveKeywordValue(value);
				if (result !== void 0) return { outline: result };
			}
		],
		...(['olw', 'olo'] as const).map(name => [
			new RegExp(`^${patternPrefix}${name}-(.+)$`),
			([, value]: string[]) => {
				const result = resolveDynamicValue(value, options);
				if (result !== void 0) {
					return { [name === 'olw' ? 'outline-width' : 'outline-offset']: result };
				}
			}
		] as Rule),
		[
			new RegExp(`^${patternPrefix}ols-(\\[.+\\]|\\(--[\\w-]+\\))$`),
			([, value]) => {
				const result = resolveKeywordValue(value);
				if (result !== void 0) return { 'outline-style': result };
			}
		],
		[
			new RegExp(`^${patternPrefix}olc-(.+)$`),
			([, value]) => {
				const result = resolveColorValue(value, options);
				if (result !== void 0) return { 'outline-color': result };
			}
		]
	);

	return rules;
};
