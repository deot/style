import type { Rule } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createStaticRule, unitValue, withSelector } from './utils';

export const createOtherRules = (options: ResolvedPresetStyleOptions): Rule[] => {
	const rules: Rule[] = [];
	for (const name of ['none', 'hide']) {
		rules.push(createStaticRule(options, name, { display: 'none !important' }));
	}
	for (const name of ['show', 'block']) {
		rules.push(createStaticRule(options, name, { display: 'block !important' }));
	}
	for (const name of ['inline']) {
		rules.push(createStaticRule(options, name, { display: 'inline !important' }));
	}
	for (const name of ['inline-block']) {
		rules.push(createStaticRule(options, name, { display: 'inline-block !important' }));
	}
	for (const [name, value] of Object.entries({ n: 'none', b: 'block', i: 'inline', ib: 'inline-block' })) {
		rules.push(createStaticRule(options, `d-${name}`, { display: `${value} !important` }));
	}
	/*
	 * @deprecated g-dp-n/b/i/ib 分别改用 g-d-n/b/i/ib；旧类只保留 @deot/style 兼容。
	 */
	for (const [name, value] of Object.entries({ n: 'none', b: 'block', i: 'inline', ib: 'inline-block' })) {
		rules.push(createStaticRule(options, `dp-${name}`, { display: `${value} !important` }));
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
		createStaticRule(options, 'divider', {
			'position': 'relative',
			'display': 'inline-block',
			'width': unitValue(1, options),
			'height': unitValue(12, options),
			'margin': `0 ${unitValue(8, options)}`,
			'vertical-align': 'middle',
			'background': '#ccc',
			'box-sizing': 'border-box'
		}),
		/*
		 * @deprecated 使用 g-divider；旧类只保留 @deot/style 兼容。
		 */
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
		createStaticRule(options, 'bsz-bb', { 'box-sizing': 'border-box' }),
		/*
		 * @deprecated 使用 g-bsz-bb；旧类只保留 @deot/style 兼容。
		 */
		createStaticRule(options, 'bs-bb', { 'box-sizing': 'border-box' })
	);

	return rules;
};
