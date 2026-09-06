import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, numericValue, unitValue } from './utils';

const imageRule = (options: ResolvedPresetStyleOptions): Rule => [
	new RegExp(
		`^${createPatternPrefix(options)}(image|image-circle|image-radius)-(\\d+)$`
	),
	([, mode, value]) => ({
		'width': numericValue(value, options),
		'height': numericValue(value, options),
		'max-width': numericValue(value, options),
		'min-width': numericValue(value, options),
		'line-height': numericValue(value, options),
		...(mode === 'image-circle' ? { 'border-radius': '50%' } : {}),
		...(mode === 'image-radius' ? { 'border-radius': unitValue(4, options) } : {})
	})
];

export const createImageRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	imageRule(options)
];
