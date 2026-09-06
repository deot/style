import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, resolveKeywordValue } from './utils';

const textAlignValues = {
	l: 'left',
	r: 'right',
	c: 'center',
	j: 'justify',
	s: 'start',
	e: 'end',
	ja: 'justify-all',
	mp: 'match-parent'
} as const;

export const createTextRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const lineClamp = (lines: number) => ({
		'display': '-webkit-box',
		'overflow': 'hidden',
		'text-overflow': 'ellipsis',
		'-webkit-box-orient': 'vertical',
		'-webkit-line-clamp': `${lines}`,
		'word-break': 'break-all',
		'text-wrap': 'wrap',
		'overflow-wrap': 'break-word',
		'white-space': 'break-spaces'
	});
	const rules: Rule[] = [
		...Object.entries(textAlignValues).map(([name, value]) => (
			createStaticRule(options, `ta-${name}`, { 'text-align': `${value} !important` })
		)),
		[
			new RegExp(`^${createPatternPrefix(options)}ta-(\\[.+\\]|\\(--[\\w-]+\\))$`),
			([, value]) => {
				const result = resolveKeywordValue(value);
				if (result !== void 0) return { 'text-align': `${result} !important` };
			}
		],
		createStaticRule(options, 'line-nowrap', { 'white-space': 'nowrap !important' })
	];
	/*
	 * line-wrap 用于处理长单词和连续字符。
	 */
	const lineWrap = {
		'word-break': 'break-all',
		'overflow-wrap': 'break-word',
		'text-wrap': 'wrap'
	};
	rules.push(createStaticRule(options, 'line-wrap', lineWrap));
	/*
	 * 多行截断依赖 WebKit box 模型；break-spaces 保留调用方传入的空白和换行。
	 */
	rules.push([
		new RegExp(`^${createPatternPrefix(options)}line-([1-9]\\d*)$`),
		([, value]) => {
			const lines = Number(value);
			if (Number.isSafeInteger(lines)) return lineClamp(lines);
		}
	]);

	return rules;
};
