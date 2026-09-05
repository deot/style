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
		/*
		 * @deprecated 使用 g-ta-c、g-ta-l、g-ta-r；旧类只保留源码兼容。
		 */
		createStaticRule(options, 'tc', { 'text-align': 'center !important' }),
		createStaticRule(options, 'tl', { 'text-align': 'left !important' }),
		createStaticRule(options, 'tr', { 'text-align': 'right !important' }),
		/*
		 * @deprecated 使用 g-tdl-lt、g-tdl-ul；旧类只保留 @deot/style 兼容。
		 */
		createStaticRule(options, 'td-lh', { 'text-decoration': 'line-through !important' }),
		createStaticRule(options, 'td-ul', { 'text-decoration': 'underline !important' }),
		createStaticRule(options, 'line-nowrap', { 'white-space': 'nowrap !important' }),
		/*
		 * @deprecated 使用 g-ws-nw；旧类只保留 @deot/style 兼容。
		 */
		createStaticRule(options, 'nowrap', { 'white-space': 'nowrap !important' })
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
	 * @deprecated 使用 g-line-wrap；旧类只保留 @deot/style 兼容。
	 */
	rules.push(createStaticRule(options, 'break', lineWrap));
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
	/*
	 * @deprecated 使用 g-line-1、g-line-2；旧类只保留 @deot/style 兼容。
	 */
	for (const [name, lines] of [['line-one', 1], ['line-two', 2]] as const) {
		rules.push(createStaticRule(options, name, lineClamp(lines)));
	}

	return rules;
};
