export interface PresetStyleOptions {
	/**
	 * 工具类完整前缀，语义与 UnoCSS 的 prefix 一致；未传时读取 UNOCSS_OPTIONS.prefix。
	 * @default 'g-'
	 */
	prefix?: string;
	/**
	 * 数值工具类和固定尺寸使用的 CSS 单位；未传时读取 UNOCSS_OPTIONS.unit。
	 * @default 'px'
	 */
	unit?: string;
	/**
	 * 只缩放类名中没有直接表达数值的固定尺寸；未传时读取 UNOCSS_OPTIONS.scale。
	 * @default 1
	 */
	scale?: number;
	/**
	 * 是否输出与 Sass 默认入口一致的 html、body 和全局通配符 reset；未传时读取 UNOCSS_OPTIONS.reset。
	 * @default true
	 */
	reset?: boolean;
}

export type ResolvedPresetStyleOptions = Required<PresetStyleOptions>;
