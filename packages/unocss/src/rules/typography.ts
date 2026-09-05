import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { resolveColorValue } from './color';
import { createPatternPrefix, createStaticRule, resolveDynamicValue, resolveKeywordValue } from './utils';

/*
 * 文本规则延续属性缩写设计；组合语义 truncate 保留全拼以突出其复合输出。
 */
const staticValues = {
	'tdl-lt': ['text-decoration-line', 'line-through'],
	'tdl-ul': ['text-decoration-line', 'underline'],
	'tdl-ol': ['text-decoration-line', 'overline'],
	'tdl-n': ['text-decoration-line', 'none'],
	'tds-s': ['text-decoration-style', 'solid'],
	'tds-db': ['text-decoration-style', 'double'],
	'tds-dot': ['text-decoration-style', 'dotted'],
	'tds-dash': ['text-decoration-style', 'dashed'],
	'tds-w': ['text-decoration-style', 'wavy'],
	'va-t': ['vertical-align', 'top'],
	'va-m': ['vertical-align', 'middle'],
	'va-b': ['vertical-align', 'bottom'],
	'va-base': ['vertical-align', 'baseline'],
	'va-tt': ['vertical-align', 'text-top'],
	'va-tb': ['vertical-align', 'text-bottom'],
	'va-sub': ['vertical-align', 'sub'],
	'va-sup': ['vertical-align', 'super'],
	'ws-n': ['white-space', 'normal'],
	'ws-nw': ['white-space', 'nowrap'],
	'ws-p': ['white-space', 'pre'],
	'ws-pl': ['white-space', 'pre-line'],
	'ws-pw': ['white-space', 'pre-wrap'],
	'ws-bs': ['white-space', 'break-spaces'],
	'to-e': ['text-overflow', 'ellipsis'],
	'to-c': ['text-overflow', 'clip'],
	'tt-u': ['text-transform', 'uppercase'],
	'tt-l': ['text-transform', 'lowercase'],
	'tt-c': ['text-transform', 'capitalize'],
	'tt-n': ['text-transform', 'none'],
	'italic': ['font-style', 'italic'],
	'oblique': ['font-style', 'oblique'],
	'not-italic': ['font-style', 'normal'],
	'not-oblique': ['font-style', 'normal']
} as const;

const decorationColorRule = (options: ResolvedPresetStyleOptions): Rule => [
	new RegExp(`^${createPatternPrefix(options)}tdc-(.+)$`),
	([, value]) => {
		const result = resolveColorValue(value, options);
		if (result !== void 0) {
			return {
				'-webkit-text-decoration-color': result,
				'text-decoration-color': result
			};
		}
	}
];

export const createTypographyRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	const rules: Rule[] = Object.entries(staticValues).map(([name, [property, value]]) => (
		createStaticRule(options, name, { [property]: value })
	));

	rules.push(
		createStaticRule(options, 'truncate', {
			'overflow': 'hidden',
			'text-overflow': 'ellipsis',
			'white-space': 'nowrap'
		}),
		decorationColorRule(options),
		...(['tdt', 'tuo', 'ls', 'wsp'] as const).map(name => [
			new RegExp(`^${patternPrefix}${name}-(.+)$`),
			([, value]: string[]) => {
				const result = resolveDynamicValue(value, options);
				if (result === void 0) return;
				const property = {
					tdt: 'text-decoration-thickness',
					tuo: 'text-underline-offset',
					ls: 'letter-spacing',
					wsp: 'word-spacing'
				}[name];
				return { [property]: result };
			}
		] as Rule),
		...(['tds', 'va', 'ws'] as const).map(name => [
			new RegExp(`^${patternPrefix}${name}-(\\[.+\\]|\\(--[\\w-]+\\))$`),
			([, value]: string[]) => {
				const result = resolveKeywordValue(value);
				if (result === void 0) return;
				const property = {
					tds: 'text-decoration-style',
					va: 'vertical-align',
					ws: 'white-space'
				}[name];
				return { [property]: result };
			}
		] as Rule)
	);

	return rules;
};
