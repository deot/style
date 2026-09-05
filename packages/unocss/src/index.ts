import type { Preset } from 'unocss';
import { extractorArbitraryVariants } from '@unocss/extractor-arbitrary-variants';
import { breakpoints as miniBreakpoints } from '@unocss/preset-mini/theme';
import { variants as createMiniVariants } from '@unocss/preset-mini/variants';
import { transformerVariantGroup } from 'unocss';
import { createPreflights } from './preflights';
import { createRules } from './rules';
import type { PresetStyleOptions } from './types';

export type { PresetStyleOptions } from './types';

export const presetStyle = (options: PresetStyleOptions = {}): Preset => {
	const envOptions = process.env.UNOCSS_OPTIONS === void 0
		? {}
		: JSON.parse(process.env.UNOCSS_OPTIONS) as PresetStyleOptions;
	const scale = options.scale ?? envOptions.scale ?? 1;
	if (!Number.isFinite(scale)) {
		const source = options.scale === void 0 ? 'UNOCSS_OPTIONS.scale' : 'presetStyle.scale';
		throw new TypeError(`${source} must be a finite number`);
	}
	const resolved = {
		prefix: options.prefix ?? envOptions.prefix ?? 'g-',
		unit: options.unit ?? envOptions.unit ?? 'px',
		scale,
		reset: options.reset ?? envOptions.reset ?? true,
		variants: options.variants ?? envOptions.variants ?? true,
		dark: options.dark ?? envOptions.dark ?? 'class',
		attributifyPseudo: options.attributifyPseudo ?? envOptions.attributifyPseudo ?? false,
		arbitraryVariants: options.arbitraryVariants ?? envOptions.arbitraryVariants ?? true
	};
	const variantConfig = resolved.variants
		? {
				theme: { breakpoints: miniBreakpoints },
				variants: createMiniVariants({
					prefix: resolved.prefix,
					dark: resolved.dark,
					attributifyPseudo: resolved.attributifyPseudo,
					arbitraryVariants: resolved.arbitraryVariants
				}),
				...(resolved.arbitraryVariants
					? { extractorDefault: extractorArbitraryVariants() }
					: {})
			}
		: {};

	return {
		name: '@deot/style-unocss',
		/*
		 * @deot/style 与 Mini 存在同名类时，必须以后置 preset 的语义为准。
		 * https://unocss.dev/presets/mini
		 */
		enforce: 'post',
		...variantConfig,
		preflights: createPreflights(resolved),
		rules: createRules(resolved),
		/*
		 * 只启用 : 分组，避免 g-w-(--variable) 被 - 分组语法错误展开。
		 */
		transformers: [transformerVariantGroup({ separators: [':'] })],
		options: resolved
	};
};
