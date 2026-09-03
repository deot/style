import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule } from './utils';

export const createTextRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const rules: Rule[] = [
		createStaticRule(options, 'tc', { 'text-align': 'center !important' }),
		createStaticRule(options, 'tl', { 'text-align': 'left !important' }),
		createStaticRule(options, 'tr', { 'text-align': 'right !important' }),
		createStaticRule(options, 'td-lh', { 'text-decoration': 'line-through !important' }),
		createStaticRule(options, 'td-ul', { 'text-decoration': 'underline !important' }),
		createStaticRule(options, 'line-nowrap', { 'white-space': 'nowrap !important' }),
		createStaticRule(options, 'nowrap', { 'white-space': 'nowrap !important' })
	];
	/*
	 * wrap 与 break 是兼容性别名，组合声明用于处理长单词和连续字符。
	 */
	for (const name of ['line-wrap', 'break']) {
		rules.push(createStaticRule(options, name, {
			'word-break': 'break-all',
			'overflow-wrap': 'break-word',
			'text-wrap': 'wrap'
		}));
	}
	/*
	 * 多行截断依赖 WebKit box 模型；break-spaces 保留调用方传入的空白和换行。
	 */
	for (const [name, lines] of [['line-one', 1], ['line-two', 2]] as const) {
		rules.push(createStaticRule(options, name, {
			'display': '-webkit-box',
			'overflow': 'hidden',
			'text-overflow': 'ellipsis',
			'-webkit-box-orient': 'vertical',
			'-webkit-line-clamp': `${lines}`,
			'word-break': 'break-all',
			'text-wrap': 'wrap',
			'overflow-wrap': 'break-word',
			'white-space': 'break-spaces'
		}));
	}

	return rules;
};
