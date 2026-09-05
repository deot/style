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
import { createGridRules } from './grid';
import { createImageRules } from './image';
import { createInteractionRules } from './interaction';
import { createLayoutRules } from './layout';
import { createLineHeightRules } from './line-height';
import { createMarginRules } from './margin';
import { createOtherRules } from './other';
import { createOutlineRules } from './outline';
import { createPaddingRules } from './padding';
import { createPositionRules } from './position';
import { createResetRules } from './reset';
import { createSizeRules } from './size';
import { createSvgRules } from './svg';
import { createTextRules } from './text';
import { createTypographyRules } from './typography';

export const createRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	...createFontSizeRules(options),
	...createLineHeightRules(options),
	...createMarginRules(options),
	...createPaddingRules(options),
	...createSizeRules(options),
	...createLayoutRules(options),
	...createGapRules(options),
	...createGridRules(options),
	...createImageRules(options),
	...createFlexRules(options),
	/*
	 * fw 是历史共用缩写：w/wr/n 表示 flex-wrap，1～12 表示浮动宽度，
	 * 其他有效数字再由 font-weight 规则处理。
	 */
	...createFloatRules(options),
	...createFontWeightRules(options),
	...createTextRules(options),
	...createTypographyRules(options),
	...createColorRules(options),
	...createInteractionRules(options),
	...createPositionRules(options),
	...createOutlineRules(options),
	...createBorderRules(options),
	...createSvgRules(options),
	/*
	 * 历史 bs 同时表示 box-shadow 和 box-sizing，新规则分别使用 bsh 与 bsz。
	 * bdr 表示右侧高清边框；br-* 表示 border-radius。
	 */
	...createBoxShadowRules(options),
	...createResetRules(options),
	...createOtherRules(options)
];
