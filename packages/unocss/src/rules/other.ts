import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule, unitValue, withSelector } from './utils';

export const createOtherRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const rules: Rule[] = [];
	/*
	 * 保留历史类名及语义别名，避免迁移到 UnoCSS 后出现行为差异。
	 */
	for (const name of ['none', 'dp-n', 'hide']) {
		rules.push(createStaticRule(options, name, { display: 'none !important' }));
	}
	for (const name of ['show', 'dp-b', 'block']) {
		rules.push(createStaticRule(options, name, { display: 'block !important' }));
	}
	for (const name of ['dp-i', 'inline']) {
		rules.push(createStaticRule(options, name, { display: 'inline !important' }));
	}
	for (const name of ['dp-ib', 'inline-block']) {
		rules.push(createStaticRule(options, name, { display: 'inline-block !important' }));
	}
	rules.push(
		createStaticRule(options, 'operable', {
			'font-size': unitValue(14, options),
			'color': 'var(--color-highlight) !important',
			'cursor': 'pointer'
		}),
		createStaticRule(options, 'disabled', { 'pointer-events': 'none' }),
		createStaticRule(options, 'unanimated', { animation: '0 !important' }),
		createStaticRule(options, 'pointer', { cursor: 'pointer !important' }),
		/*
		 * scrollbar 不是标准单属性工具类，需要为 WebKit 的多个伪元素分别生成规则。
		 */
		createStaticRule(options, 'scroller', [
			withSelector(value => `${value}::-webkit-scrollbar`, { width: unitValue(4, options) }),
			withSelector(value => `${value}::-webkit-scrollbar:horizontal`, { height: unitValue(2, options) }),
			withSelector(value => `${value}::-webkit-scrollbar-track`, {
				'background': 'var(--scrollbar-track-bg-color)',
				'border-radius': unitValue(5, options),
				'box-shadow': 'var(--scrollbar-track-box-shadow)'
			}),
			withSelector(value => `${value}::-webkit-scrollbar-thumb`, {
				'background': 'var(--scrollbar-thumb-bg-color)',
				'border-radius': unitValue(5, options)
			})
		]),
		createStaticRule(options, 'divide', {
			'position': 'relative',
			'display': 'inline-block',
			'width': unitValue(1, options),
			'height': unitValue(12, options),
			'margin': `0 ${unitValue(8, options)}`,
			'vertical-align': 'middle',
			'background': '#ccc',
			'box-sizing': 'border-box'
		}),
		createStaticRule(options, 'dot', {
			'display': 'block',
			'width': unitValue(5, options),
			'height': unitValue(5, options),
			'border-radius': '50%'
		}),
		createStaticRule(options, 'of-h', { overflow: 'hidden !important' }),
		/*
		 * g-bs-bb 是历史 box-sizing 缩写，与 box-shadow 的 g-bs-* 共用前缀。
		 */
		createStaticRule(options, 'bs-bb', { 'box-sizing': 'border-box' })
	);

	return rules;
};
