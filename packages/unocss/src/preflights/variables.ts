import type { Preflight } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { unitValue } from '../rules/utils';

/*
 * Preset 按需生成工具类，但主题变量需要预先注入，供语义规则和业务样式共同使用。
 */
export const createVariablesPreflight = (options: ResolvedPresetStyleOptions): Preflight => ({
	getCSS: () => `:root {
	--color-default: #1d2129;
	--color-primary: #456cf6;
	--color-success: #00b42a;
	--color-error: #f53f3f;
	--color-warning: #fadc19;
	--color-disabled: #8f939c;
	--background-color-default: #f8f8f8;
	--background-color-primary: #2d7fff;
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
