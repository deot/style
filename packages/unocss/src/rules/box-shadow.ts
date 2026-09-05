import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule } from './utils';

export const createBoxShadowRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	/*
	 * Box Shadow 使用独立的 bsh 前缀，避免与 Box Sizing 共用缩写。
	 */
	createStaticRule(options, 'bsh', { 'box-shadow': 'var(--border-shadow-default) !important' }),
	createStaticRule(options, 'bsh-t', { 'box-shadow': 'var(--border-shadow-default-top) !important' }),
	/*
	 * @deprecated 使用 g-bsh、g-bsh-t；旧类只保留 @deot/style 兼容。
	 */
	createStaticRule(options, 'bs', { 'box-shadow': 'var(--border-shadow-default) !important' }),
	createStaticRule(options, 'bs-t', { 'box-shadow': 'var(--border-shadow-default-top) !important' })
];
