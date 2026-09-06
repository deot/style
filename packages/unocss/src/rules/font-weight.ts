import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule } from './utils';

export const createFontWeightRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createStaticRule(options, 'fw-bold', { 'font-weight': 'bold' }),
	/*
	 * 迁移期保留旧浮动栅格的 1～12，避免旧 token 被重新解释为字重。
	 * 当前数字字重范围为 13～1000。
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
