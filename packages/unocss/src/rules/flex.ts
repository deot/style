import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, percent } from './utils';

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
		 * g-col 等价于 g-col-1，数字后缀直接作为 flex-grow。
		 */
		[
			new RegExp(`^${patternPrefix}col(?:-(\\d+))?$`),
			([, value]) => ({ flex: `${Number(value ?? 1)}` })
		],
		/*
		 * 只接受有效分数，避免 0ofN、分子大于分母等无意义规则。
		 */
		[
			new RegExp(`^${patternPrefix}(\\d+)of(\\d+)$`),
			([, value, total]) => {
				const part = Number(value);
				const count = Number(total);
				if (part < 1 || count < 1 || part > count) return;
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
