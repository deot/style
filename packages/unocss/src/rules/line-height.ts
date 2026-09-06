import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, resolveDynamicValue } from './utils';

/*
 * 小值通常表达行高倍率；超过阈值后才按尺寸处理并附加配置单位。
 */
const UNITLESS_LINE_HEIGHT_MAX = 5;

export const createLineHeightRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	[
		new RegExp(`^${createPatternPrefix(options)}lh-(.+)$`),
		([, value]) => {
			if (/^\d+$/.test(value) && Number(value) <= UNITLESS_LINE_HEIGHT_MAX) {
				return { 'line-height': value };
			}
			const result = resolveDynamicValue(value, options);
			if (result !== void 0) return { 'line-height': result };
		}
	],
	createStaticRule(options, 'lh-default', { 'line-height': 'var(--line-height-default)' })
];
