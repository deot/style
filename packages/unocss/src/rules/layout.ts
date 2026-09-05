import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import {
	createPatternPrefix,
	createStaticRule,
	resolveDynamicValue,
	resolveKeywordValue,
	resolveUnitlessValue
} from './utils';

const sizeKeyword = (mode: 'w' | 'h', value: string) => {
	if (value === 'full') return '100%';
	if (value === 'screen') return mode === 'w' ? '100vw' : '100vh';
	if (['min', 'max', 'fit'].includes(value)) return `${value}-content`;
};

export const createLayoutRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	const rules: Rule[] = [
		[
			new RegExp(`^${patternPrefix}op-(.+)$`),
			([, value]) => {
				if (/^\d+$/.test(value)) {
					const result = Number(value);
					if (Number.isSafeInteger(result) && result <= 100) return { opacity: `${result / 100}` };
					return;
				}
				const result = resolveKeywordValue(value);
				if (result !== void 0) return { opacity: result };
			}
		],
		[
			new RegExp(`^${patternPrefix}z-(.+)$`),
			([, value]) => {
				const result = resolveUnitlessValue(value);
				if (result !== void 0) return { 'z-index': result };
			}
		],
		/*
		 * g-of-h 是既有工具类，保留原来的 !important 输出。
		 */
		createStaticRule(options, 'of-h', { overflow: 'hidden !important' }),
		[
			new RegExp(`^${patternPrefix}(of|ofx|ofy)-(.+)$`),
			([, mode, value]) => {
				const mapped = {
					a: 'auto',
					h: 'hidden',
					c: 'clip',
					v: 'visible',
					s: 'scroll'
				}[value];
				const result = mapped ?? resolveKeywordValue(value);
				if (result === void 0) return;
				const property = mode === 'of' ? 'overflow' : `overflow-${mode.slice(-1)}`;
				return { [property]: result };
			}
		],
		[
			new RegExp(`^${patternPrefix}(min|max)-(w|h)-(.+)$`),
			([, boundary, mode, value]) => {
				const result = sizeKeyword(mode as 'w' | 'h', value) ?? resolveDynamicValue(value, options);
				if (result !== void 0) {
					return { [`${boundary}-${mode === 'w' ? 'width' : 'height'}`]: result };
				}
			}
		],
		[
			new RegExp(`^${patternPrefix}ar-(.+)$`),
			([, value]) => {
				if (value === 'square') return { 'aspect-ratio': '1/1' };
				if (value === 'rectangle') return { 'aspect-ratio': '16/9' };
				const fraction = value.match(/^(\d+)\/(\d+)$/);
				if (fraction) {
					const part = Number(fraction[1]);
					const total = Number(fraction[2]);
					if (Number.isSafeInteger(part) && Number.isSafeInteger(total) && part > 0 && total > 0) {
						return { 'aspect-ratio': `${part}/${total}` };
					}
					return;
				}
				const result = resolveKeywordValue(value);
				if (result !== void 0) return { 'aspect-ratio': result };
			}
		]
	];

	return rules;
};
