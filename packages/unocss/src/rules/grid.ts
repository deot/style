import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createPatternPrefix, createStaticRule, resolveDynamicValue } from './utils';

type GridAxis = 'c' | 'r';
type GridLineMode = 'gcs' | 'gce' | 'grs' | 'gre';

const axisProperty = (axis: GridAxis) => axis === 'c' ? 'grid-column' : 'grid-row';

const templateProperty = (axis: GridAxis) => (
	axis === 'c' ? 'grid-template-columns' : 'grid-template-rows'
);

const lineProperties = {
	gcs: 'grid-column-start',
	gce: 'grid-column-end',
	grs: 'grid-row-start',
	gre: 'grid-row-end'
} as const;

/*
 * Grid 数字是轨道数量或网格线编号，不拼接 unit，也不应用 scale。
 */
const positiveInteger = (value: string) => {
	if (!/^\d+$/.test(value)) return;
	const result = Number(value);
	if (Number.isSafeInteger(result) && result > 0) return result;
};

const gridValue = (value: string, options: ResolvedPresetStyleOptions) => {
	if (/^\d+$/.test(value)) {
		const result = positiveInteger(value);
		return result === void 0 ? void 0 : `${result}`;
	}
	return resolveDynamicValue(value, options);
};

export const createGridRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const patternPrefix = createPatternPrefix(options);
	const rules: Rule[] = [
		createStaticRule(options, 'grid', { 'display': 'grid', 'box-sizing': 'border-box' }),
		[
			new RegExp(`^${patternPrefix}gt(c|r)-(.+)$`),
			([, axis, value]) => {
				const property = templateProperty(axis as GridAxis);
				if (value === 'none' || value === 'subgrid') return { [property]: value };
				const count = positiveInteger(value);
				if (count !== void 0) return { [property]: `repeat(${count},minmax(0,1fr))` };
				const result = gridValue(value, options);
				if (result !== void 0) return { [property]: result };
			}
		],
		[
			new RegExp(`^${patternPrefix}g(c|r)-span-(full|\\d+)$`),
			([, axis, value]) => {
				const property = axisProperty(axis as GridAxis);
				if (value === 'full') return { [property]: '1/-1' };
				const count = positiveInteger(value);
				if (count !== void 0) return { [property]: `span ${count}/span ${count}` };
			}
		],
		[
			new RegExp(`^${patternPrefix}g(c|r)-(.+)$`),
			([, axis, value]) => {
				const result = gridValue(value, options);
				if (result !== void 0) return { [axisProperty(axis as GridAxis)]: result };
			}
		],
		[
			new RegExp(`^${patternPrefix}(gcs|gce|grs|gre)-(.+)$`),
			([, mode, value]) => {
				const result = gridValue(value, options);
				if (result !== void 0) return { [lineProperties[mode as GridLineMode]]: result };
			}
		]
	];
	for (const [name, value] of Object.entries({
		'gaf-r': 'row',
		'gaf-c': 'column',
		'gaf-d': 'dense',
		'gaf-rd': 'row dense',
		'gaf-cd': 'column dense'
	})) {
		rules.push(createStaticRule(options, name, { 'grid-auto-flow': value }));
	}

	return rules;
};
