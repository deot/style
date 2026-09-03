import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, resolveDynamicValue } from './utils';

export const createFontSizeRules = (options: ResolvedPresetStyleOptions): Rule[] => [[
	new RegExp(`^${createPatternPrefix(options)}fs-(.+)$`),
	([, value]) => {
		const result = resolveDynamicValue(value, options);
		if (result !== void 0) return { 'font-size': result };
	}
]];
