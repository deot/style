import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, percent, resolveDynamicValue } from './utils';

const nonNegativeInteger = (value: string) => {
	if (!/^\d+$/.test(value)) return;
	const result = Number(value);
	if (Number.isSafeInteger(result) && result >= 0) return result;
};

export const createFlexRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	const rules: Rule[] = [
		createStaticRule(options, 'flex', { 'display': 'flex', 'box-sizing': 'border-box' }),
		createStaticRule(options, 'flex-holy', {
			'display': 'flex',
			'min-height': '100vh',
			'box-sizing': 'border-box',
			'flex-direction': 'column'
		}),
		createStaticRule(options, 'flex-cc', {
			'display': 'flex',
			'box-sizing': 'border-box',
			'align-items': 'center',
			'justify-content': 'center'
		}),
		createStaticRule(options, 'flex-ac', {
			'display': 'flex',
			'box-sizing': 'border-box',
			'align-items': 'center'
		}),
		/*
		 * @deprecated 使用 g-f-{n}；g-col 等价于 g-f-1。
		 */
		[
			new RegExp(`^${patternPrefix}col(?:-(\\d+))?$`),
			([, value]) => ({ flex: `${Number(value ?? 1)}` })
		],
		/*
		 * 分数表示固定 Flex 占比，与 Mini 的 g-flex-* 区分。
		 */
		[
			new RegExp(`^${patternPrefix}f-(\\d+)\\/(\\d+)$`),
			([, value, total]) => {
				const part = nonNegativeInteger(value);
				const count = nonNegativeInteger(total);
				if (part === void 0 || count === void 0 || part < 1 || count < 1 || part > count) return;
				return { flex: `0 0 ${percent(part, count)}` };
			}
		],
		/*
		 * 裸数字直接作为 flex 简写；[] 表示完整 CSS 值，() 表示 CSS Variable。
		 * 这些值不参与 unit、scale 计算。
		 */
		[
			new RegExp(`^${patternPrefix}f-(.+)$`),
			([, value]) => {
				const number = nonNegativeInteger(value);
				if (number !== void 0) return { flex: `${number}` };
				if (/^\d+$/.test(value)) return;
				const result = resolveDynamicValue(value, options);
				if (result !== void 0) return { flex: result };
			}
		],
		/*
		 * @deprecated 使用 g-f-{part}/{total}。
		 */
		[
			new RegExp(`^${patternPrefix}(\\d+)of(\\d+)$`),
			([, value, total]) => {
				const part = nonNegativeInteger(value);
				const count = nonNegativeInteger(total);
				if (part === void 0 || count === void 0 || part < 1 || count < 1 || part > count) return;
				return { flex: `0 0 ${percent(part, count)}` };
			}
		]
	];
	const flexRules = {
		'fd-r': ['flex-direction', 'row'],
		'fd-c': ['flex-direction', 'column'],
		'fd-rr': ['flex-direction', 'row-reverse'],
		'fd-cr': ['flex-direction', 'column-reverse'],
		'fw-w': ['flex-wrap', 'wrap'],
		'fw-wr': ['flex-wrap', 'wrap-reverse'],
		'fw-n': ['flex-wrap', 'nowrap'],
		'jc-fs': ['justify-content', 'flex-start'],
		'jc-fe': ['justify-content', 'flex-end'],
		'jc-c': ['justify-content', 'center'],
		'jc-sb': ['justify-content', 'space-between'],
		'jc-sa': ['justify-content', 'space-around'],
		'ai-fs': ['align-items', 'flex-start'],
		'ai-fe': ['align-items', 'flex-end'],
		'ai-c': ['align-items', 'center'],
		'ai-b': ['align-items', 'baseline'],
		'ai-s': ['align-items', 'stretch'],
		'ac-fs': ['align-content', 'flex-start'],
		'ac-fe': ['align-content', 'flex-end'],
		'ac-c': ['align-content', 'center'],
		'ac-sb': ['align-content', 'space-between'],
		'ac-sa': ['align-content', 'space-around'],
		'ac-s': ['align-content', 'stretch'],
		'as-a': ['align-self', 'auto'],
		'as-fs': ['align-self', 'flex-start'],
		'as-fe': ['align-self', 'flex-end'],
		'as-c': ['align-self', 'center'],
		'as-b': ['align-self', 'baseline'],
		'as-s': ['align-self', 'stretch']
	} as const;
	Object.entries(flexRules).forEach(([name, [property, value]]) => {
		rules.push(createStaticRule(options, name, { [property]: value }));
	});

	return rules;
};
