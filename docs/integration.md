# 接入与迁移

本页说明 `@deot/style` 与 `@deot/style-unocss` 的选择边界，以及 Web、移动端 REM、小程序 RPX 和多入口项目的配置方式。

## 先确定交付方式

- 现有项目直接消费完整 CSS，或需要 Sass 主题、函数和 mixin：使用 `@deot/style`。
- 已有 UnoCSS 构建链，并希望只生成源码中实际使用的 token：使用 `@deot/style-unocss`。
- 一个页面不要同时加载 `@deot/style` 完整工具类 CSS 与 UnoCSS preset 产物。
- 从 Sass 迁移到 UnoCSS 时可以保留主要 `g-*` 类名，但必须重新确认 `scale`、动态类名和 preflight。

## Web：预编译 CSS

不需要定制主题时，直接选择一个完整入口：

```ts
import '@deot/style/dist/index.css';
// 或同时包含 normalize.css：
// import '@deot/style/dist/index.normalize.css';
```

不要同时引入两个完整入口。所有可选产物见[选择与安装](./getting-started.md)。

## Web：Normalize 与 Sass 源码

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

## Web：UnoCSS 按需生成

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetStyle } from '@deot/style-unocss';

export default defineConfig({
	presets: [presetStyle()]
});
```

UnoCSS 只提取静态出现的完整 token。运行时拼接的 `g-fs-${size}`、`g-pd-${space}` 等类名必须改成静态映射，或加入项目 safelist。规则范围和参数见 [`@deot/style-unocss` README](../packages/unocss/README.md)。

本仓库的动态属性规则使用统一值语法：裸数字表示规则自身的数值语义，`[]` 表示任意 CSS 值，`()` 表示 CSS Variable。例如 `g-w-12`、`g-w-[50%]`、`g-w-(--panel-width)`；Flex 中的 `g-f-2` 表示 `flex: 2`，Grid 中的 `g-gtc-12` 表示 12 列，均不会拼接单位。

从 Sass/CSS 迁移时注意：

- 不再引入 `@deot/style/dist/index.css`，由 `virtual:uno.css` 承载生成结果。
- Sass `$scale` 会缩放数值类名后缀和属性值；UnoCSS `scale` 只缩放类名没有数值的固定尺寸。
- Sass 输出预定义数值集合；UnoCSS 数值规则按 token 动态生成。
- UnoCSS preset 默认同时输出 Mini preflight、主题变量，以及与 Sass 完整入口一致的 `html`、`body` 和全局 `*` reset；可通过 `reset: false` 关闭最后一组。
- `g-w-{n}` 在 UnoCSS 中表示带配置单位的宽度；十二列比例统一使用 `g-w-{part}/{total}`。
- Flex 简写值使用 `g-f-{n}`，固定占比使用 `g-f-{part}/{total}`；Grid 列定位使用 `g-gc-{n}`，Mini 的 `g-col-span-*`、`g-col-start-*` 等明确 Grid 类仍可使用。
- Grid 缩写与 Mini 全名可以并存，例如 `g-gtc-3` 与 `g-grid-cols-3`、`g-gaf-rd` 与 `g-grid-flow-row-dense`。
- 本仓库把 `g-b-{n}` 定义为 Bottom，覆盖 Mini 的 border-width；`g-b-[...]` 含独立 Border Style 关键字时输出普通 `border`。需要 Mini 定位全名时可继续使用 `g-bottom-*`。
- Preset 已内置 `hover:(...)` 等 Variant Group 写法，不需要在项目中重复添加 transformer。

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

## 多入口项目与开发命令

`presetStyle()` 在加载 `uno.config.ts` 时读取一次配置。可以由每个开发进程设置 `UNOCSS_OPTIONS`：

```bash
UNOCSS_OPTIONS='{"prefix":"g-","unit":"rem","scale":2,"reset":true}' npm run dev
```

显式传给 `presetStyle()` 的参数优先于 `UNOCSS_OPTIONS`，未设置时再使用默认值。

同一个 UnoCSS generator 不能让相同的 `g-fs-14` 在不同页面同时解释为 `14px` 和 `14rem`。如果仓库中的 mobile、manage 等入口需要不同的 `unit` / `scale`，开发时应为每个目标启动独立进程并传入对应 `UNOCSS_OPTIONS`；构建时也应按目标分别执行。不要根据页面运行时状态切换 preset 参数。

如果必须由同一个开发进程同时服务多个目标，应使用不同前缀或显式不同 token，避免同一个类名承担两套 CSS 语义。

## 区分库工具类与业务扩展

业务项目会继续使用 `g-` 前缀补充 `.g-c-main`、`.g-btn-primary`、`.g-safe-area` 等项目专属规则，也会覆盖 `.g-bb` 的边框颜色。这些类不属于 `@deot/style` 的公共输出，不应依赖它们跨项目存在。

- 公共类：以[工具类参考](./DOCUMENT.md)和当前 `packages/index/src/outputs` 为准。
- 业务类：由各项目自己的 `global.scss` 维护。
- 覆盖公共类时，应把业务样式放在 `@deot/style/src/index` 之后，确保样式顺序清晰。

## 继续阅读

- UnoCSS 参数、主题、动态 token 与 safelist：[`@deot/style-unocss` README](../packages/unocss/README.md)。
- Sass 变量、主题、函数与 mixin：[`@deot/style` README](../packages/index/README.md)。
- 完整公共类名：[工具类参考](./DOCUMENT.md)。
