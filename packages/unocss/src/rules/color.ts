import type { Rule } from 'unocss';
import { colors } from '../theme';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule } from './utils';

export const createColorRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const rules: Rule[] = [];
	Object.entries(colors).forEach(([name, color]) => {
		rules.push(createStaticRule(options, `c-${name}`, { color: `${color} !important` }));
		rules.push(createStaticRule(options, `bg-${name}`, { 'background-color': `${color} !important` }));
	});
	for (const [name, start, end] of [
		['blue', colors['blue-mid'], colors['blue-light']],
		['yellow', colors['yellow-mid'], colors['yellow-light']]
	] as const) {
		rules.push(createStaticRule(options, `bg-lg-${name}`, {
			'background': end,
			'background-image': `linear-gradient(to right, ${start}, ${end})`
		}));
	}

	return rules;
};
