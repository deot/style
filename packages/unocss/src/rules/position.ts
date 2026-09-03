import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule } from './utils';

export const createPositionRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	createStaticRule(options, 'fixed', { position: 'fixed !important' }),
	createStaticRule(options, 'relative', { position: 'relative !important' }),
	createStaticRule(options, 'absolute', { position: 'absolute !important' }),
	createStaticRule(options, 'fixed-full', { position: 'fixed !important', inset: '0' }),
	createStaticRule(options, 'absolute-full', { position: 'absolute !important', inset: '0' })
];
