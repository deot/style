import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, resolveDynamicValue } from './utils';

type PositionDirection = 't' | 'l' | 'b' | 'r';

const borderStyles = new Set([
	'none', 'hidden', 'dotted', 'dashed', 'solid',
	'double', 'groove', 'ridge', 'inset', 'outset'
]);

const positionProperties = {
	t: 'top',
	l: 'left',
	b: 'bottom',
	r: 'right'
} as const;

/*
 * g-b-[...] 包含独立的 border-style 关键字时表示普通 border 简写；
 * 其他 g-b-* 仍表示 bottom，裸 g-b 则由高清边框规则处理。
 */
const isBorderShorthand = (value: string) => (
	value.split(/\s+/).some(item => borderStyles.has(item.toLowerCase()))
);

export const createPositionRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);

	return [
		createStaticRule(options, 'fixed', { position: 'fixed !important' }),
		createStaticRule(options, 'relative', { position: 'relative !important' }),
		createStaticRule(options, 'absolute', { position: 'absolute !important' }),
		createStaticRule(options, 'fixed-full', { position: 'fixed !important', inset: '0' }),
		createStaticRule(options, 'absolute-full', { position: 'absolute !important', inset: '0' }),
		[
			new RegExp(`^${patternPrefix}(t|l|b|r)-(.+)$`),
			([, direction, value]) => {
				const result = resolveDynamicValue(value, options);
				if (result === void 0) return;
				if (direction === 'b' && value.startsWith('[') && isBorderShorthand(result)) {
					return { border: result };
				}
				return { [positionProperties[direction as PositionDirection]]: result };
			}
		]
	];
};
