import type { CSSObject, Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { resolveColorValue } from './color';
import {
	createPatternPrefix,
	createStaticRule,
	numericValue,
	resolveDynamicValue,
	resolveKeywordValue,
	unitValue,
	withParent,
	withSelector
} from './utils';

type BorderDirection = '' | 't' | 'r' | 'b' | 'l';

const borderProperties = {
	'': 'border',
	't': 'border-top',
	'r': 'border-right',
	'b': 'border-bottom',
	'l': 'border-left'
} as const;

const borderStyles = {
	n: 'none',
	h: 'hidden',
	dot: 'dotted',
	dash: 'dashed',
	s: 'solid',
	db: 'double',
	g: 'groove',
	r: 'ridge',
	i: 'inset',
	o: 'outset'
} as const;

const borderWidths = {
	tn: 'thin',
	md: 'medium',
	tk: 'thick'
} as const;

const createBorderRule = (
	direction: BorderDirection,
	options: ResolvedPresetStyleOptions
): CSSObject[] => {
	/*
	 * 上、左边框使用 ::before，其余方向使用 ::after，与原 Sass 产物保持一致。
	 */
	const pseudo = direction === 't' || direction === 'l' ? '::before' : '::after';
	const edge = {
		'': {
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			border: `${unitValue(1, options)} solid var(--border-color-default)`
		},
		't': {
			'top': '0',
			'left': '0',
			'width': '100%',
			'border-top': `${unitValue(1, options)} solid var(--border-color-default)`
		},
		'r': {
			'top': '0',
			'right': '0',
			'height': '100%',
			'border-right': `${unitValue(1, options)} solid var(--border-color-default)`
		},
		'b': {
			'bottom': '0',
			'left': '0',
			'width': '100%',
			'border-bottom': `${unitValue(1, options)} solid var(--border-color-default)`
		},
		'l': {
			'top': '0',
			'left': '0',
			'height': '100%',
			'border-left': `${unitValue(1, options)} solid var(--border-color-default)`
		}
	}[direction] as CSSObject;
	/*
	 * 高分屏下把边框宽度减半：浏览器会把 border-width 向下对齐到整数设备像素，且不足 1 个设备像素时取 1，
	 * 任意缩放比例下都是实色的整像素线；不用 transform 缩放，缩放后的右、下边缘对不齐设备像素，会发虚或缺失。
	 * @supports 只起版本闸门的作用：会把 0.5px 画成 0 的老浏览器不认识 @supports，整块被跳过，保留完整宽度的边框。
	 */
	const hairline = '@media (resolution >= 2dppx) $$ @supports (border-width: 0.5px)';

	return [
		/*
		 * isolation 让伪元素的层级只在自身内部生效。
		 */
		{ position: 'relative', isolation: 'isolate' },
		withSelector(value => `${value}::before,${value}::after`, {
			'position': 'absolute',
			'z-index': '1',
			'display': 'block',
			'clear': 'both',
			'pointer-events': 'none',
			'border-radius': 'inherit',
			'content': '" "',
			'box-sizing': 'border-box'
		}),
		withSelector(value => `${value}${pseudo}`, edge),
		withParent(hairline, value => `${value}${pseudo}`, { 'border-width': unitValue(0.5, options) })
	];
};

export const createBorderRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	const rules: Rule[] = [
		/*
		 * br-N 表示 border-radius；右侧高清边框使用 g-bdr。
		 */
		[
			new RegExp(`^${patternPrefix}br-(\\d+)$`),
			([, value]) => ({ 'border-radius': numericValue(value, options) })
		],
		/*
		 * bd 后可直接拼接方向和子属性，例如 bdtc 表示 border-top-color。
		 * 带连字符的 bd-[]、bdr-[] 则表示整体或单边 Border 简写。
		 */
		[
			new RegExp(`^${patternPrefix}bd([trbl])?-(\\[.+\\]|\\(--[\\w-]+\\))$`),
			([, direction = '', value]) => {
				const result = resolveKeywordValue(value);
				if (result !== void 0) return { [borderProperties[direction as BorderDirection]]: result };
			}
		],
		[
			new RegExp(`^${patternPrefix}bd([trbl])?w-(.+)$`),
			([, direction = '', value]) => {
				const result = borderWidths[value as keyof typeof borderWidths]
					?? resolveDynamicValue(value, options);
				if (result !== void 0) {
					return { [`${borderProperties[direction as BorderDirection]}-width`]: result };
				}
			}
		],
		[
			new RegExp(`^${patternPrefix}bd([trbl])?s-(.+)$`),
			([, direction = '', value]) => {
				const result = borderStyles[value as keyof typeof borderStyles] ?? resolveKeywordValue(value);
				if (result !== void 0) {
					return { [`${borderProperties[direction as BorderDirection]}-style`]: result };
				}
			}
		],
		[
			new RegExp(`^${patternPrefix}bd([trbl])?c-(.+)$`),
			([, direction = '', value]) => {
				const result = resolveColorValue(value, options);
				if (result !== void 0) {
					return { [`${borderProperties[direction as BorderDirection]}-color`]: result };
				}
			}
		],
		createStaticRule(options, 'bd', createBorderRule('', options)),
		createStaticRule(options, 'bdt', createBorderRule('t', options)),
		createStaticRule(options, 'bdr', createBorderRule('r', options)),
		createStaticRule(options, 'bdb', createBorderRule('b', options)),
		createStaticRule(options, 'bdl', createBorderRule('l', options)),
		createStaticRule(options, 'br-circle', { 'border-radius': '100% !important' }),
		createStaticRule(options, 'br-default', { 'border-radius': 'var(--border-radius-default) !important' })
	];

	return rules;
};
