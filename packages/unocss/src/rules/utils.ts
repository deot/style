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

/*
 * 方括号语法与 UnoCSS 的任意值保持一致：未转义的下划线表示空格，
 * 反斜杠转义的下划线保留为普通字符。
 */
export const arbitraryValue = (value: string) => {
	if (!value.startsWith('[') || !value.endsWith(']')) return;
	const body = value.slice(1, -1);
	if (!body) return;

	let brackets = 0;
	for (const character of body) {
		if (character === '[') brackets++;
		if (character === ']' && --brackets < 0) return;
	}
	if (brackets) return;

	const normalized = body
		.replace(/(url\(.*?\))/g, item => item.replace(/_/g, '\\_'))
		.replace(/(^|[^\\])_/g, '$1 ')
		.replace(/\\_/g, '_');
	/*
	 * calc、clamp、min、max 的加减运算符需要保留空格，
	 * 同时暂存 var() 名称，避免变量名中的连字符被误处理。
	 */
	return normalized.replace(/(?:calc|clamp|max|min)\((.*)/g, (matched) => {
		const variables: string[] = [];
		return matched
			.replace(/var\((--.+?)[,)]/g, (item, variable: string) => {
				variables.push(variable);
				return item.replace(variable, '--un-calc');
			})
			.replace(/(-?\d*\.?\d(?!-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, '$1 $2 ')
			.replace(/--un-calc/g, () => variables.shift() ?? '');
	});
};

/*
 * 无单位属性只接受非负安全整数、任意值和 CSS Variable。
 * 负数、小数与全局关键字应显式放入 []，避免与尺寸规则混淆。
 */
export const resolveUnitlessValue = (value: string) => {
	if (/^\d+$/.test(value)) {
		const result = Number(value);
		if (Number.isSafeInteger(result)) return `${result}`;
		return;
	}
	const variable = value.match(/^\((--[\w-]+)\)$/)?.[1];
	if (variable) return `var(${variable})`;
	return arbitraryValue(value);
};

/*
 * 枚举属性不接受裸数字，只允许 [] 任意值与 () CSS Variable。
 */
export const resolveKeywordValue = (value: string) => {
	const variable = value.match(/^\((--[\w-]+)\)$/)?.[1];
	if (variable) return `var(${variable})`;
	return arbitraryValue(value);
};

/*
 * 裸数字使用配置单位；[] 表示任意 CSS 值；() 只接受 CSS Variable。
 * 动态值已经完整表达最终尺寸，因此不再应用 scale。
 */
export const resolveDynamicValue = (value: string, options: ResolvedPresetStyleOptions) => {
	if (/^\d+$/.test(value)) return numericValue(value, options);
	const variable = value.match(/^\((--[\w-]+)\)$/)?.[1];
	if (variable) return `var(${variable})`;
	return arbitraryValue(value);
};

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
	new RegExp(`^${createPatternPrefix(options)}${name}(?:-(tb|lr|t|r|b|l))?-(.+)$`),
	([, direction, value]) => {
		const result = resolveDynamicValue(value, options);
		if (result === void 0) return;
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
