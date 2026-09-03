import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, numericValue } from './utils';

export const createFontSizeRules = (options: ResolvedPresetStyleOptions): Rule[] => [[
	new RegExp(`^${createPatternPrefix(options)}fs-(\\d+)$`),
	([, value]) => ({ 'font-size': numericValue(value, options) })
]];
