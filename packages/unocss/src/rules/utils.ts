import type { CSSObject, Rule } from 'unocss';
import { symbols } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';

export type CSSRuleValue = CSSObject | CSSObject[];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/*
 * 避免 scale 计算产生 -0，防止输出无意义的 -0px。
 */
const normalizeNumber = (value: number) => Object.is(value, -0) ? 0 : value;

/*
 * 固定语义尺寸需要应用 scale，例如默认圆角、滚动条和高清边框。
 */
export const unitValue = (value: number, options: ResolvedPresetStyleOptions) => (
	`${normalizeNumber(value * options.scale)}${options.unit}`
);

/*
 * 数值后缀已经是最终值，不再应用 scale，例如 g-fs-14 始终表示 14 个配置单位。
 */
export const numericValue = (value: string, options: ResolvedPresetStyleOptions) => `${value}${options.unit}`;

export const createStaticRule = (
	options: ResolvedPresetStyleOptions,
	name: string,
	value: CSSRuleValue
): Rule => [`${options.prefix}${name}`, value];

export const createPatternPrefix = (options: ResolvedPresetStyleOptions) => (
	escapeRegExp(options.prefix)
);

/*
 * margin 与 padding 共用方向缩写：tb/lr 表示双边，t/r/b/l 表示单边。
 */
export const createSpacingRule = (
	name: 'm' | 'pd',
	property: 'margin' | 'padding',
	options: ResolvedPresetStyleOptions
): Rule => [
	new RegExp(`^${createPatternPrefix(options)}${name}(?:-(tb|lr|t|r|b|l))?-(\\d+)$`),
	([, direction, value]) => {
		const result = numericValue(value, options);
		if (!direction) return { [property]: result };
		const directions = direction === 'tb'
			? ['top', 'bottom']
			: direction === 'lr'
				? ['left', 'right']
				: [{ t: 'top', r: 'right', b: 'bottom', l: 'left' }[direction]];
		return Object.fromEntries(directions.map(item => [`${property}-${item}`, result]));
	}
];

/*
 * UnoCSS 通过 symbols.selector 改写当前 token 的最终选择器，用于伪元素和后代元素。
 */
export const withSelector = (selector: (value: string) => string, body: CSSObject): CSSObject => ({
	[symbols.selector]: selector,
	...body
});

/*
 * parent 与 selector 组合可把同一规则放入媒体查询，同时保持伪元素选择器不变。
 */
export const withParent = (parent: string, selector: (value: string) => string, body: CSSObject): CSSObject => ({
	[symbols.parent]: parent,
	[symbols.selector]: selector,
	...body
});

/*
 * 限制小数位并去掉末尾无效零，避免分栏百分比出现浮点噪声。
 */
export const percent = (value: number, total: number) => `${Number(((value / total) * 100).toFixed(10))}%`;
