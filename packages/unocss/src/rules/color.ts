import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule } from './utils';

/*
 * 与 Sass 默认色板保持一致，语义色通过 CSS Variables 允许业务侧覆盖。
 */
const colors = {
	'red-mid': '#ca1622',
	'pink-mid': '#fa5a6e',
	'pink-light': '#fff2ea',
	'blue-dark': '#0b76fe',
	'blue-mid': '#16a3ff',
	'blue-light': '#6ab4ff',
	'yellow-dark': '#f2c300',
	'yellow-mid': '#ffd00d',
	'yellow-light': '#ffd31c',
	'orange-dark': '#ef3528',
	'orange-mid': '#fa6f60',
	'orange-light': '#fc9780',
	'gray-dark': '#edeef0',
	'gray-mid': '#f5f6f7',
	'gray-light': '#f7f8fa',
	'black-dark': '#2e3136',
	'black-mid': '#636770',
	'black-light': '#9c9fa6',
	'purple-dark': '#8b61f3',
	'purple-mid': '#a48efc',
	'purple-light': '#cca3ff',
	'black': '#000',
	'white': '#fff',
	'444': '#444',
	'67': '#676767',
	'f2': '#f2f2f2',
	'f8': '#f8f8f8',
	'ef': '#efefef',
	'cd': '#cdcdcd',
	'e8': '#e8e8e8',
	'd9': '#d9d9d9',
	'f4': '#f4f4f4',
	'f9': '#f9f9f9',
	'000': '#000',
	'333': '#333',
	'51': '#515151',
	'666': '#666',
	'999': '#999',
	'aaa': '#aaa',
	'bbb': '#bbb',
	'bd': '#bdbdbd',
	'info': 'var(--color-info)',
	'success': 'var(--color-success)',
	'error': 'var(--color-error)',
	'warning': 'var(--color-warning)'
} as const;

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
