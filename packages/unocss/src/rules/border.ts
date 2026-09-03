import type { CSSObject, Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, numericValue, unitValue, withParent, withSelector } from './utils';

type BorderDirection = '' | 't' | 'r' | 'b' | 'l';

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

export const createBorderRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	[
		new RegExp(`^${createPatternPrefix(options)}br-(\\d+)$`),
		([, value]) => ({ 'border-radius': numericValue(value, options) })
	],
	createStaticRule(options, 'b', createBorderRule('', options)),
	createStaticRule(options, 'bt', createBorderRule('t', options)),
	createStaticRule(options, 'br', createBorderRule('r', options)),
	createStaticRule(options, 'bb', createBorderRule('b', options)),
	createStaticRule(options, 'bl', createBorderRule('l', options)),
	createStaticRule(options, 'br-circle', { 'border-radius': '100% !important' }),
	createStaticRule(options, 'br-default', { 'border-radius': 'var(--border-radius-default) !important' })
];
