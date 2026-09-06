import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, percent, withSelector } from './utils';

export const createFloatRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createStaticRule(options, 'fl-row', [
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
	]
];
