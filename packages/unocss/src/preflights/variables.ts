import type { Preflight } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { unitValue } from '../rules/utils';

/*
 * Preset 按需生成工具类，但主题变量需要预先注入，供语义规则和业务样式共同使用。
 */
export const createVariablesPreflight = (options: ResolvedPresetStyleOptions): Preflight => ({
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
