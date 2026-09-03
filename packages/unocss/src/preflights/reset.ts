import type { Preflight } from 'unocss';

/*
 * 与 Sass 默认入口的全局 reset 保持一致，通过 presetStyle.reset 控制是否输出。
 */
export const createResetPreflight = (): Preflight => ({
	getCSS: () => `html {
		width: 100%;
		height: 100%;
	}

	body {
		width: 100%;
		font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
		font-size: var(--font-size-default);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		line-height: var(--line-height-default);
		color: var(--color-default);
		background-color: var(--background-color-default);
	}

	*,
	*::before,
	*::after {
		padding: 0;
		margin: 0;
		border: none;
		box-sizing: border-box;
	}`
});
