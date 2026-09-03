import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createSpacingRule } from './utils';

export const createMarginRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createSpacingRule('m', 'margin', options)
];
