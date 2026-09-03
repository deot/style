import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, numericValue, unitValue } from './utils';

/*
 * img 为方形尺寸，imgc 增加圆形裁切，imgr 使用受 scale 影响的固定圆角。
 */
export const createImageRules = (options: ResolvedPresetStyleOptions): Rule[] => [[
	new RegExp(`^${createPatternPrefix(options)}(img|imgc|imgr)-(\\d+)$`),
	([, mode, value]) => ({
		'width': numericValue(value, options),
		'height': numericValue(value, options),
		'max-width': numericValue(value, options),
		'min-width': numericValue(value, options),
		'line-height': numericValue(value, options),
		...(mode === 'imgc' ? { 'border-radius': '50%' } : {}),
		...(mode === 'imgr' ? { 'border-radius': unitValue(4, options) } : {})
	})
]];
