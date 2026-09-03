import type { Preset } from 'unocss';
import { presetMini } from 'unocss';
import { createRules } from './rules';
import { createThemePreflight } from './theme';
import type { PresetStyleOptions } from './types';

export type { PresetStyleOptions } from './types';

export const presetStyle = (options: PresetStyleOptions = {}): Preset => {
	const envOptions = process.env.UNOCSS_OPTIONS === undefined
		? {}
		: JSON.parse(process.env.UNOCSS_OPTIONS) as PresetStyleOptions;
	if (options.scale === undefined && envOptions.scale !== undefined && !Number.isFinite(envOptions.scale)) {
		throw new TypeError('UNOCSS_OPTIONS.scale must be a finite number');
	}
	const resolved = {
		prefix: options.prefix ?? envOptions.prefix ?? 'g-',
		unit: options.unit ?? envOptions.unit ?? 'px',
		scale: options.scale ?? envOptions.scale ?? 1
	};

	return {
		name: '@deot/style-unocss',
		/*
		 * d-style 与 Mini 存在同名类时，必须以后置 preset 的语义为准。
		 * https://unocss.dev/presets/mini
		 */
		enforce: 'post',
		presets: [presetMini({ prefix: resolved.prefix })],
		preflights: [createThemePreflight(resolved)],
		rules: createRules(resolved),
		options: resolved
	};
};
