import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule } from './utils';

export const createBoxShadowRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createStaticRule(options, 'bs', { 'box-shadow': 'var(--border-shadow-default) !important' }),
	createStaticRule(options, 'bs-t', { 'box-shadow': 'var(--border-shadow-default-top) !important' })
];
