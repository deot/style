import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, resolveDynamicValue } from './utils';

export const createGapRules = (options: ResolvedPresetStyleOptions): Rule[] => [[
	new RegExp(`^${createPatternPrefix(options)}(g|cg|rg)-(.+)$`),
	([, mode, value]) => {
		const result = resolveDynamicValue(value, options);
		if (result === void 0) return;
		if (mode === 'cg') return { 'column-gap': result };
		if (mode === 'rg') return { 'row-gap': result };
		return { gap: result };
	}
]];
