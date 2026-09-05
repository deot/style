import type { CSSObject, Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, resolveKeywordValue } from './utils';

/*
 * 交互属性使用“属性缩写 + 值缩写”，保留 [] 任意值与 () CSS Variable 入口。
 */
const mappings = {
	vi: {
		property: 'visibility',
		values: { v: 'visible', h: 'hidden', c: 'collapse' }
	},
	cu: {
		property: 'cursor',
		values: {
			a: 'auto', d: 'default', n: 'none', p: 'pointer', prog: 'progress', w: 'wait',
			cell: 'cell', ch: 'crosshair', t: 'text', m: 'move', na: 'not-allowed',
			g: 'grab', gg: 'grabbing', zi: 'zoom-in', zo: 'zoom-out'
		}
	},
	pe: {
		property: 'pointer-events',
		values: { a: 'auto', n: 'none' }
	},
	re: {
		property: 'resize',
		values: { x: 'horizontal', y: 'vertical', b: 'both', n: 'none' }
	}
} as const;

const propertyRule = (
	options: ResolvedPresetStyleOptions,
	name: keyof typeof mappings
): Rule => [
	new RegExp(`^${createPatternPrefix(options)}${name}-(.+)$`),
	([, value]) => {
		const definition = mappings[name];
		const mapped = definition.values[value as keyof typeof definition.values];
		const result = mapped ?? resolveKeywordValue(value);
		if (result !== void 0) return { [definition.property]: result };
	}
];

/*
 * user-select 与 appearance 同时输出 WebKit 前缀，覆盖仍需兼容的浏览器实现。
 */
const userSelect = (value: string): CSSObject => ({
	'-webkit-user-select': value,
	'user-select': value
});

const appearance = (value: string): CSSObject => ({
	'-webkit-appearance': value,
	'appearance': value
});

export const createInteractionRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	...Object.keys(mappings).map(name => propertyRule(options, name as keyof typeof mappings)),
	...Object.entries({ a: 'auto', all: 'all', t: 'text', n: 'none' }).map(([name, value]) => (
		createStaticRule(options, `us-${name}`, userSelect(value))
	)),
	[
		new RegExp(`^${createPatternPrefix(options)}us-(\\[.+\\]|\\(--[\\w-]+\\))$`),
		([, value]) => {
			const result = resolveKeywordValue(value);
			if (result !== void 0) return userSelect(result);
		}
	],
	...Object.entries({ a: 'auto', n: 'none' }).map(([name, value]) => (
		createStaticRule(options, `ap-${name}`, appearance(value))
	)),
	[
		new RegExp(`^${createPatternPrefix(options)}ap-(\\[.+\\]|\\(--[\\w-]+\\))$`),
		([, value]) => {
			const result = resolveKeywordValue(value);
			if (result !== void 0) return appearance(result);
		}
	]
];
