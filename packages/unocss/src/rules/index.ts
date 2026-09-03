import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createBorderRules } from './border';
import { createBoxShadowRules } from './box-shadow';
import { createColorRules } from './color';
import { createFlexRules } from './flex';
import { createFloatRules } from './float';
import { createFontSizeRules } from './font-size';
import { createFontWeightRules } from './font-weight';
import { createGapRules } from './gap';
import { createImageRules } from './image';
import { createLineHeightRules } from './line-height';
import { createMarginRules } from './margin';
import { createOtherRules } from './other';
import { createPaddingRules } from './padding';
import { createPositionRules } from './position';
import { createResetRules } from './reset';
import { createSizeRules } from './size';
import { createTextRules } from './text';

export const createRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	...createFontSizeRules(options),
	...createLineHeightRules(options),
	...createMarginRules(options),
	...createPaddingRules(options),
	...createSizeRules(options),
	...createGapRules(options),
	...createImageRules(options),
	...createFlexRules(options),
	/*
	 * fw 是历史共用缩写：w/wr/n 表示 flex-wrap，1～12 表示浮动宽度，
	 * 其他有效数字再由 font-weight 规则处理。
	 */
	...createFloatRules(options),
	...createFontWeightRules(options),
	...createTextRules(options),
	...createColorRules(options),
	...createPositionRules(options),
	...createBorderRules(options),
	/*
	 * bs 表示 box-shadow；历史类 g-bs-bb 则表示 box-sizing。
	 * br 表示右侧高清边框；带后缀的 br-* 表示 border-radius。
	 */
	...createBoxShadowRules(options),
	...createResetRules(options),
	...createOtherRules(options)
];
