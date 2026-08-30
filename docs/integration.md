# 项目接入实践

本页介绍 `@deot/style` 在 Web、移动端 REM 与小程序 RPX 场景中的常见接入方式，以及公共工具类与业务扩展的边界。

## Web：Normalize 与 Sass 源码组合

需要定制主题的 Web 项目会只预加载 normalize：

```ts
import '@deot/style/dist/index.normalize-only.css';
```

再由项目 Sass 入口按顺序加载主题和完整工具类：

```scss
// styles/index.scss
@use './theme';
@use './global';
@use './reset';
```

```scss
// styles/theme.scss
@use '@deot/style/src/functions/helper' as helper;
@use '@deot/style/src/variables/theme' with (
	$theme-merge-data: (
		color-highlight: #456cf6,
		border-radius-default: helper.unitfix(8),
		font-size-default: helper.unitfix(13)
	)
);
```

```scss
// styles/global.scss
@use '@deot/style/src/index';
```

`theme` 必须先于 `src/index` 加载，否则 Sass 模块已初始化，后续不能再通过 `with` 配置。这里的 `index.normalize-only.css` 只负责浏览器样式归一化，工具类由 `src/index` 生成，因此不要再同时引入 `dist/index.css`。

需要完整维护主题表时可以直接配置 `$theme`；只改少量键时优先使用 `$theme-merge-data`，可保留其余默认值。两种变量都由当前源码支持。

## 移动端：REM

750 宽设计稿的项目先配置单位和缩放，再加载主题与完整入口：

```scss
// styles/theme.scss
@use '@deot/style/src/variables/default' with (
	$allow-css-variables: true,
	$unit: rem,
	$scale: 2
);
@use '@deot/style/src/variables/theme' with (
	$theme-merge-data: (
		color-highlight: #456cf6
	)
);
```

```scss
// styles/global.scss
@use '@deot/style/src/index';
```

应用挂载前初始化根字号：

```ts
import { Style } from '@deot/style/dist';

Style.useREM(750);
```

`$scale: 2` 会同时缩放数值后缀和属性值。例如基础字号 14 会输出为 `.g-fs-28 { font-size: 28rem; }`，对应 750 宽设计稿上的 28px 标注。

若桌面容器需要固定按 375px 展示移动页面，业务项目会把根字号固定为 `0.5px`；这是宿主环境策略，不属于 `Style.useREM()` 的通用行为。

## 小程序：RPX

小程序项目使用无 CSS Variables、无全局 `*` reset 的 RPX 配置：

```scss
// styles/theme.scss
@use '@deot/style/src/variables/default' with (
	$allow-css-variables: false,
	$allow-asterisk-wildcard: false,
	$unit: rpx,
	$scale: 2
);
@use '@deot/style/src/variables/theme' with (
	$theme-merge-data: (
		color-primary: #e99d42
	)
);
```

```scss
// styles/global.scss
@use '@deot/style/src/index.rpx';
```

关闭 CSS Variables 后，可以在业务 mixin 中通过 `themefix()` 取得具体色值：

```scss
@use '@deot/style/src/functions/theme' as theme;

.tag {
	color: theme.themefix(color-primary);
}
```

如果每个 Vue 文件都使用 BEM mixin，可由 Vite 统一注入：

```js
export default {
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "@deot/style/src/mixins/bem.scss" as *;'
			}
		}
	}
};
```

## 区分库工具类与业务扩展

业务项目会继续使用 `g-` 前缀补充 `.g-c-main`、`.g-btn-primary`、`.g-safe-area` 等项目专属规则，也会覆盖 `.g-bb` 的边框颜色。这些类不属于 `@deot/style` 的公共输出，不应依赖它们跨项目存在。

- 公共类：以[工具类参考](./DOCUMENT.md)和当前 `src/outputs` 为准。
- 业务类：由各项目自己的 `global.scss` 维护。
- 覆盖公共类时，应把业务样式放在 `@deot/style/src/index` 之后，确保样式顺序清晰。
