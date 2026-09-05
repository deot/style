import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { resolveColorValue } from './color';
import { createPatternPrefix, createStaticRule, resolveDynamicValue, resolveKeywordValue } from './utils';

export const createSvgRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	const rules: Rule[] = [
		createStaticRule(options, 'fill-n', { fill: 'none' }),
		createStaticRule(options, 'stroke-n', { stroke: 'none' })
	];

	/*
	 * stroke-linecap 与 stroke-linejoin 使用短值，同时保留 []/() 处理动态长尾值。
	 */
	for (const [name, value] of Object.entries({ s: 'square', r: 'round', b: 'butt' })) {
		rules.push(createStaticRule(options, `stroke-cap-${name}`, { 'stroke-linecap': value }));
	}
	for (const [name, value] of Object.entries({ a: 'arcs', b: 'bevel', c: 'miter-clip', r: 'round', m: 'miter' })) {
		rules.push(createStaticRule(options, `stroke-join-${name}`, { 'stroke-linejoin': value }));
	}

	rules.push(
		...(['stroke-w', 'stroke-dashoffset'] as const).map(name => [
			new RegExp(`^${patternPrefix}${name}-(.+)$`),
			([, value]: string[]) => {
				const result = resolveDynamicValue(value, options);
				if (result !== void 0) {
					return { [name === 'stroke-w' ? 'stroke-width' : 'stroke-dashoffset']: result };
				}
			}
		] as Rule),
		[
			new RegExp(`^${patternPrefix}stroke-dasharray-(\\[.+\\]|\\(--[\\w-]+\\))$`),
			([, value]) => {
				const result = resolveKeywordValue(value);
				if (result !== void 0) return { 'stroke-dasharray': result };
			}
		],
		[
			new RegExp(`^${patternPrefix}(fill|stroke)-(.+)$`),
			([, property, value]) => {
				const result = resolveColorValue(value, options);
				if (result !== void 0) return { [property]: result };
			}
		]
	);

	return rules;
};
