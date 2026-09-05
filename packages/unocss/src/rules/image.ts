import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, numericValue, unitValue } from './utils';

const imageRule = (options: ResolvedPresetStyleOptions, legacy = false): Rule => [
	new RegExp(
		`^${createPatternPrefix(options)}${legacy ? '(img|imgc|imgr)' : '(image|image-circle|image-radius)'}-(\\d+)$`
	),
	([, mode, value]) => ({
		'width': numericValue(value, options),
		'height': numericValue(value, options),
		'max-width': numericValue(value, options),
		'min-width': numericValue(value, options),
		'line-height': numericValue(value, options),
		...(['imgc', 'image-circle'].includes(mode) ? { 'border-radius': '50%' } : {}),
		...(['imgr', 'image-radius'].includes(mode) ? { 'border-radius': unitValue(4, options) } : {})
	})
];

export const createImageRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	imageRule(options),
	/*
	 * @deprecated 使用 g-image-*、g-image-circle-*、g-image-radius-*；
	 * 旧类只保留 @deot/style 兼容。
	 */
	imageRule(options, true)
];
