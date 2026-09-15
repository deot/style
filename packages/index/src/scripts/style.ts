export type UseREMOptions = {
	/**
	 * 注入根元素 `font-size`
	 * @default true
	 */
	fontSize?: boolean;
	/**
	 * 注入 CSS 变量。`true` 使用 `--rem`，`false` 不注入，字符串则作为变量名
	 * @default true
	 */
	rem?: boolean | string;
};

const resolveRemName = (rem: boolean | string = true): string => {
	if (rem === false) return '';
	if (rem === true) return '--rem';

	const name = rem.trim();
	if (!name) return '';
	return name.startsWith('--') ? name : `--${name}`;
};

/**
 * 始终保证的是 750rem = 100vw。
 * 默认同时注入 html font-size 与 --rem（供 remfix 使用）。
 * @param baseWidth - 基准宽度
 * @param options - 注入配置
 */
export const useREM = (baseWidth: number = 750, options: UseREMOptions = {}): void => {
	const { fontSize = true, rem = true } = options;
	const remName = resolveRemName(rem);

	const refreshREM = () => {
		const html = document.documentElement;
		const screenWidth = html.getBoundingClientRect().width || window.innerWidth;
		const value = screenWidth / baseWidth + 'px';

		fontSize && html.style.setProperty('font-size', value, 'important');

		// 与 remfix(24) 同一坐标系：24rem = calc(var(--rem, calc(100vw / 750)) * 24)，不乘 $scale
		remName && html.style.setProperty(remName, value);
	};

	// 微信使用rpx，这里使用rem（即750rem就是屏幕宽度）
	refreshREM();
	window.addEventListener('resize', refreshREM, false);
};
