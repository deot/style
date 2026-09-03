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
	 * g-w-N 只设置十二列宽度；g-fw-N 在相同宽度基础上增加左浮动。
	 */
	[
		new RegExp(`^${createPatternPrefix(options)}(f?w)-(\\d+)$`),
		([, mode, value]) => {
			const column = Number(value);
			if (column < 1 || column > 12) return;
			return { width: percent(column, 12), ...(mode === 'fw' ? { float: 'left' } : {}) };
		}
	]
];
