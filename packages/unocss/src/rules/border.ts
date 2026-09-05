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
	const isVertical = direction === 'r' || direction === 'l';
	/*
	 * 上、左边框使用 ::before，其余方向使用 ::after，与原 Sass 产物保持一致。
	 */
	const pseudo = direction === 't' || direction === 'l' ? '::before' : '::after';
	const edge = {
		'': {
			'top': '0',
			'left': '0',
			'width': '100%',
			'height': '100%',
			'border': `${unitValue(1, options)} solid var(--border-color-default)`,
			'transform-origin': '0 0'
		},
		't': {
			'top': '0',
			'left': '0',
			'width': '100%',
			'border-top': `${unitValue(1, options)} solid var(--border-color-default)`,
			'transform-origin': '0 top'
		},
		'r': {
			'top': '0',
			'right': '0',
			'height': '100%',
			'border-right': `${unitValue(1, options)} solid var(--border-color-default)`,
			'transform-origin': 'right 0'
		},
		'b': {
			'bottom': '0',
			'left': '0',
			'width': '100%',
			'border-bottom': `${unitValue(1, options)} solid var(--border-color-default)`,
			'transform-origin': '0 bottom'
		},
		'l': {
			'top': '0',
			'left': '0',
			'height': '100%',
			'border-left': `${unitValue(1, options)} solid var(--border-color-default)`,
			'transform-origin': 'left 0'
		}
	}[direction] as CSSObject;
	/*
	 * 高分屏下先放大伪元素，再按像素密度缩小，得到物理像素级细边框。
	 */
	const scaled = (ratio: number): CSSObject => ({
		...(isVertical || !direction ? { height: `${ratio * 100}%` } : {}),
		...(!isVertical || !direction ? { width: `${ratio * 100}%` } : {}),
		transform: `scale(${1 / ratio})`
	});

	return [
		/*
		 * translateZ(0) 保留原实现的合成层行为，避免缩放边框渲染不稳定。
		 */
		{ position: 'relative', transform: 'translateZ(0)' },
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
		withParent('@media (resolution >= 2dppx)', value => `${value}${pseudo}`, scaled(2)),
		withParent('@media (resolution >= 3dppx)', value => `${value}${pseudo}`, scaled(3))
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
		createStaticRule(options, 'br-default', { 'border-radius': 'var(--border-radius-default) !important' }),
		/*
		 * @deprecated 使用 g-bd、g-bdt、g-bdr、g-bdb、g-bdl；旧类只保留 @deot/style 兼容。
		 */
		createStaticRule(options, 'b', createBorderRule('', options)),
		createStaticRule(options, 'bt', createBorderRule('t', options)),
		createStaticRule(options, 'br', createBorderRule('r', options)),
		createStaticRule(options, 'bb', createBorderRule('b', options)),
		createStaticRule(options, 'bl', createBorderRule('l', options))
	];

	return rules;
};
