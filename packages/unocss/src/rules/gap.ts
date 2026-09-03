import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, resolveDynamicValue } from './utils';

export const createGapRules = (options: ResolvedPresetStyleOptions): Rule[] => [[
	new RegExp(`^${createPatternPrefix(options)}g(?:-(x|y|col|row))?-(.+)$`),
	([, direction, value]) => {
		const result = resolveDynamicValue(value, options);
		if (result === void 0) return;
		if (direction === 'x' || direction === 'col') return { 'column-gap': result };
		if (direction === 'y' || direction === 'row') return { 'row-gap': result };
		return { gap: result };
	}
]];
