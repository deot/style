import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createBorderRules } from './border';
import { createBoxShadowRules } from './box-shadow';
import { createColorRules } from './color';
import { createFlexRules } from './flex';
import { createFloatRules } from './float';
import { createFontSizeRules } from './font-size';
import { createFontWeightRules } from './font-weight';
import { createImageRules } from './image';
import { createLineHeightRules } from './line-height';
import { createMarginRules } from './margin';
import { createOtherRules } from './other';
import { createPaddingRules } from './padding';
import { createPositionRules } from './position';
import { createResetRules } from './reset';
import { createTextRules } from './text';

export const createRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	...createFontSizeRules(options),
	...createLineHeightRules(options),
	...createMarginRules(options),
	...createPaddingRules(options),
	...createImageRules(options),
	...createFlexRules(options),
	/*
	 * g-fw-1～12 保留浮动栅格语义，其他有效数字再由字重规则处理。
	 */
	...createFloatRules(options),
	...createFontWeightRules(options),
	...createTextRules(options),
	...createColorRules(options),
	...createPositionRules(options),
	...createBorderRules(options),
	...createBoxShadowRules(options),
	...createResetRules(options),
	...createOtherRules(options)
];
