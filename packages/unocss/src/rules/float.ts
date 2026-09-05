import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, percent, withSelector } from './utils';

export const createFloatRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createStaticRule(options, 'fl-row', [
		{ padding: '0', margin: '0' },
		withSelector(value => `${value}::before,${value}::after`, { display: 'table', content: '" "' }),
		withSelector(value => `${value}::after`, { clear: 'both' })
	]),
	/*
	 * @deprecated 使用 g-fl-row；旧类只保留 @deot/style 兼容。
	 */
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
	[
		new RegExp(`^${createPatternPrefix(options)}fl-(\\d+)/12$`),
		([, value]) => {
			const column = Number(value);
			if (!Number.isSafeInteger(column) || column < 1 || column > 12) return;
			return { width: percent(column, 12), float: 'left' };
		}
	],
	/*
	 * @deprecated 使用 g-fl-{part}/12；旧类只保留 @deot/style 兼容。
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
