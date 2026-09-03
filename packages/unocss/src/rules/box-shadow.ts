import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule } from './utils';

export const createBoxShadowRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	/*
	 * bs 在这里表示 box-shadow；历史类 g-bs-bb 则表示 box-sizing。
	 */
	createStaticRule(options, 'bs', { 'box-shadow': 'var(--border-shadow-default) !important' }),
	createStaticRule(options, 'bs-t', { 'box-shadow': 'var(--border-shadow-default-top) !important' })
];
