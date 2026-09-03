import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule, withSelector } from './utils';

export const createResetRules = (options: ResolvedPresetStyleOptions): Rule[] => [
	/*
	 * g-reset 清除业务容器中常见元素的浏览器默认表现。
	 */
	createStaticRule(options, 'reset', [
		withSelector(value => `${value} ol,${value} ul,${value} li`, { 'list-style': 'none' }),
		withSelector(value => `${value} a`, { 'text-decoration': 'none' }),
		withSelector(value => `${value} a,${value} a:visited,${value} a:hover`, { color: 'inherit' }),
		withSelector(value => `${value} img`, { 'vertical-align': 'middle' }),
		withSelector(value => `${value} .inline`, { display: 'inline' }),
		withSelector(value => `${value} i,${value} b,${value} span`, {
			'font-style': 'normal',
			'font-weight': 'normal'
		}),
		withSelector(value => `${value} input,${value} textarea`, { outline: 'none' }),
		withSelector(value => `${value} button`, { 'outline-style': 'none' })
	]),
	/*
	 * g-unset 用于富文本场景，恢复被全局 reset 清除的标题、段落和列表布局。
	 */
	createStaticRule(options, 'unset', [
		withSelector(value => `${value} *,${value} *::before,${value} *::after`, {
			padding: 'unset',
			margin: 'unset'
		}),
		withSelector(value => `${value} h1,${value} h2,${value} h3,${value} h4,${value} h5,${value} h6`, {
			'margin-top': 'unset',
			'margin-bottom': 'unset',
			'font-weight': 'unset',
			'color': 'unset'
		}),
		withSelector(value => `${value} p`, { 'margin-top': 'unset', 'margin-bottom': 'unset' }),
		withSelector(value => `${value} li`, { display: 'list-item' }),
		withSelector(value => `${value} ol`, {
			'display': 'block',
			'padding-left': '40px',
			'margin': '1em 0',
			'list-style-type': 'decimal'
		}),
		withSelector(value => `${value} ul`, {
			'display': 'block',
			'padding-left': '40px',
			'margin': '1em 0',
			'list-style-type': 'disc'
		})
	])
];
