import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createSpacingRule, createStaticRule } from './utils';

export const createPaddingRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const rules: Rule[] = [
		createSpacingRule('pd', 'padding', options),
		/*
		 * s 后缀表示系统安全区，分别映射到 env(safe-area-inset-*)。
		 */
		createStaticRule(options, 'pd-s', {
			padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
		}),
		createStaticRule(options, 'pd-tb-s', {
			'padding-top': 'env(safe-area-inset-top)',
			'padding-bottom': 'env(safe-area-inset-bottom)'
		}),
		createStaticRule(options, 'pd-lr-s', {
			'padding-right': 'env(safe-area-inset-right)',
			'padding-left': 'env(safe-area-inset-left)'
		})
	];

	for (const [short, direction] of Object.entries({ t: 'top', r: 'right', b: 'bottom', l: 'left' })) {
		rules.push(createStaticRule(options, `pd-${short}-s`, {
			[`padding-${direction}`]: `env(safe-area-inset-${direction})`
		}));
	}

	return rules;
};
