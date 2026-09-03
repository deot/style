import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule } from './utils';

export const createFontWeightRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createStaticRule(options, 'fw-bold', { 'font-weight': 'bold' }),
	/*
	 * 1～12 已被浮动栅格占用；CSS 数字字重只接管 13～1000。
	 */
	[
		new RegExp(`^${createPatternPrefix(options)}fw-(\\d+)$`),
		([, value]) => {
			const weight = Number(value);
			if (weight <= 12 || weight > 1000) return;
			return { 'font-weight': `${weight}` };
		}
	]
];
