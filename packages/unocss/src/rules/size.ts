import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, percent, resolveDynamicValue } from './utils';

type SizeMode = 'w' | 'h' | 'size';

/*
 * full 与内容尺寸沿用 CSS 原生语义；screen 按宽高轴分别映射视口单位。
 */
const keywordValue = (value: string) => {
	const keyword = {
		full: '100%',
		min: 'min-content',
		max: 'max-content',
		fit: 'fit-content'
	}[value];
	if (keyword) return { width: keyword, height: keyword };
	if (value === 'screen') return { width: '100vw', height: '100vh' };
};

const sizeValue = (mode: SizeMode, value: string) => {
	if (mode === 'w') return { width: value };
	if (mode === 'h') return { height: value };
	return { width: value, height: value };
};

export const createSizeRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	return [
		/*
		 * 百分比宽度使用显式分数，避免与带单位的 g-w-{n} 再次产生歧义。
		 */
		[
			new RegExp(`^${patternPrefix}w-(\\d+)\\/(\\d+)$`),
			([, value, total]) => {
				const part = Number(value);
				const count = Number(total);
				if (!Number.isSafeInteger(part) || !Number.isSafeInteger(count)) return;
				if (part < 1 || count < 1 || part > count) return;
				return { width: percent(part, count) };
			}
		],
		[
			new RegExp(`^${patternPrefix}(w|h|size)-(.+)$`),
			([, mode, value]) => {
				const currentMode = mode as SizeMode;
				const keyword = keywordValue(value);
				if (keyword) {
					if (currentMode === 'w') return { width: keyword.width };
					if (currentMode === 'h') return { height: keyword.height };
					return keyword;
				}
				const result = resolveDynamicValue(value, options);
				if (result !== void 0) return sizeValue(currentMode, result);
			}
		]
	];
};
