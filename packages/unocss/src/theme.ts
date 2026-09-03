import type { Preflight } from 'unocss';
import type { ResolvedPresetStyleOptions } from './types';
import { unitValue } from './rules/utils';

/*
 * 与 Sass 默认色板保持一致，语义色通过 CSS Variables 允许业务侧覆盖。
 */
export const colors = {
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

/*
 * Preset 按需生成工具类，但主题变量需要预先注入，供语义规则和业务样式共同使用。
 */
export const createThemePreflight = (options: ResolvedPresetStyleOptions): Preflight => ({
	getCSS: () => `:root {
	--color-default: #515a6e;
	--color-highlight: #5495f6;
	--color-info: #0177de;
	--color-success: #00a854;
	--color-error: #f04134;
	--color-warning: #ffbf00;
	--background-color-default: #f5f6fa;
	--background-color-highlight: #5495f6;
	--border-radius-default: ${unitValue(8, options)};
	--border-shadow-default: 0 0 ${unitValue(8, options)} 0 rgba(0, 0, 0, 0.1);
	--border-shadow-default-top: 0 ${unitValue(-2, options)} ${unitValue(10, options)} 0 rgba(0, 0, 0, 0.08);
	--line-height-default: 1.5;
	--line-height-limit: ${unitValue(32, options)};
	--border-color-default: #c9c9c9;
	--font-size-default: ${unitValue(14, options)};
	--font-size-large: ${unitValue(16, options)};
	--scrollbar-track-bg-color: rgba(0, 0, 0, 0);
	--scrollbar-thumb-bg-color: rgba(0, 0, 0, 0.2);
	--scrollbar-track-box-shadow: inset 0 0 ${unitValue(10, options)} rgba(0, 0, 0, 0);
}`
});
