import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, percent, withSelector } from './utils';

export const createFloatRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createStaticRule(options, 'row', [
		{ padding: '0', margin: '0' },
		withSelector(value => `${value}::before,${value}::after`, { display: 'table', content: '" "' }),
		withSelector(value => `${value}::after`, { clear: 'both' })
	]),
	createStaticRule(options, 'clearfix', [
		withSelector(value => `${value}::before,${value}::after`, { display: 'table', content: '" "' }),
		withSelector(value => `${value}::after`, { clear: 'both' })
	]),
	createStaticRule(options, 'fl', { float: 'left' }),
	createStaticRule(options, 'fr', { float: 'right' }),
	/*
	 * g-fw-1～12 是历史浮动栅格；g-w-* 已由尺寸规则接管。
	 */
	[
		new RegExp(`^${createPatternPrefix(options)}fw-(\\d+)$`),
		([, value]) => {
			const column = Number(value);
			if (column < 1 || column > 12) return;
			return { width: percent(column, 12), float: 'left' };
		}
	]
];
