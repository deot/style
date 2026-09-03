/**
 * 相当于 750rem = 100vw
 * @param baseWidth - 基准跨度
 * @return
 */
export const useREM = (baseWidth: number = 750): void => {
	const refreshREM = () => {
		const html = document.documentElement;
		const screenWidth = html.getBoundingClientRect().width || window.innerWidth;
		html.style.setProperty('font-size', screenWidth / baseWidth + 'px', 'important');
	};

	// 微信使用rpx，这里使用rem（即750rem就是屏幕宽度）
	refreshREM();
	window.addEventListener('resize', refreshREM, false);
};
