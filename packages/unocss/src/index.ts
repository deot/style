import type { Preset } from 'unocss';
import { presetMini, transformerVariantGroup } from 'unocss';
import { createPreflights } from './preflights';
import { createRules } from './rules';
import type { PresetStyleOptions } from './types';

export type { PresetStyleOptions } from './types';

export const presetStyle = (options: PresetStyleOptions = {}): Preset => {
	const envOptions = process.env.UNOCSS_OPTIONS === void 0
		? {}
		: JSON.parse(process.env.UNOCSS_OPTIONS) as PresetStyleOptions;
	if (options.scale === void 0 && envOptions.scale !== void 0 && !Number.isFinite(envOptions.scale)) {
		throw new TypeError('UNOCSS_OPTIONS.scale must be a finite number');
	}
	const resolved = {
		prefix: options.prefix ?? envOptions.prefix ?? 'g-',
		unit: options.unit ?? envOptions.unit ?? 'px',
		scale: options.scale ?? envOptions.scale ?? 1,
		reset: options.reset ?? envOptions.reset ?? true
	};

	return {
		name: '@deot/style-unocss',
		/*
		 * @deot/style 与 Mini 存在同名类时，必须以后置 preset 的语义为准。
		 * https://unocss.dev/presets/mini
		 */
		enforce: 'post',
		presets: [presetMini({ prefix: resolved.prefix })],
		preflights: createPreflights(resolved),
		rules: createRules(resolved),
		/*
		 * 只启用 : 分组，避免 g-w-(--variable) 被 - 分组语法错误展开。
		 */
		transformers: [transformerVariantGroup({ separators: [':'] })],
		options: resolved
	};
};
