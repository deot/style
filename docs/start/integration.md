# 接入与迁移

本页说明 `@deot/style` 与 `@deot/style-unocss` 的构建接入、迁移边界，以及 Web、移动端 REM、小程序 RPX 和多入口配置。安装依赖请先阅读[选择与安装](./installation.md)，再选择下方与项目匹配的方案，无需依次加载所有示例。

## 先确定交付方式

- 现有项目直接消费完整 CSS，或需要 Sass 主题、函数和 mixin：使用 `@deot/style`。
- 已有 UnoCSS 构建链，并希望只生成源码中实际使用的 token：使用 `@deot/style-unocss`。
- 一个页面不要同时加载 `@deot/style` 完整工具类 CSS 与 UnoCSS preset 产物。
- 从 Sass 迁移到 UnoCSS 时可以保留主要 `g-*` 类名，但必须重新确认 `scale`、动态类名和 preflight。

UnoCSS 只覆盖当前类，已移除 deprecated matcher。默认 `g-`、px、scale 1 的项目可在迁移期单独加载 `@deot/style/dist/index.deprecated.css`；rem、rpx、`rg-`、自定义配置和旧 variants 应直接迁移，详见 [Deprecated 迁移](../style/deprecated.md)。

## Web：预编译 CSS

不需要定制主题时，直接选择一个完整入口：

```ts
import '@deot/style/dist/index.css';
// 或同时包含 normalize.css：
// import '@deot/style/dist/index.normalize.css';
```

不要同时引入两个完整入口。所有可选产物见 [Style 入口表](../../packages/index/README.md)。

## Web：Normalize 与 Sass 源码

需要定制主题时，由应用入口加载项目 Sass 文件；如果还需要浏览器归一化，再先加载 Normalize-only：

```ts
// 应用入口
import '@deot/style/dist/index.normalize-only.css';
import './styles/index.scss';
```

再由项目 Sass 入口按顺序加载主题和完整工具类：

```scss
// styles/index.scss
@use './theme';
@use './global';
// 在此追加业务 reset（如有）。
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

### Vue / Vite 共享 Sass mixin

若每个 Vue 文件都使用 BEM mixin，可在现有 Vite 配置中统一注入；这适用于各种 Sass 单位方案，不限于小程序：

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

只注入不直接生成工具类的 mixin 模块，不要把完整样式入口放进 `additionalData`，以免每个组件重复输出工具类。

## Web：UnoCSS 按需生成

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetStyle } from '@deot/style-unocss';

export default defineConfig({
	presets: [presetStyle()]
});
```

Vite 项目还需要注册构建插件：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	plugins: [UnoCSS()]
});
```

将 `UnoCSS()` 合并到现有 plugins 中，保留 Vue 等项目插件。然后在应用入口引入：

```ts
import 'virtual:uno.css';
```

其他构建链使用相应 UnoCSS 集成插件，不能只添加 preset 配置。

UnoCSS 只提取静态出现的完整 token。运行时拼接的 `g-fs-${size}`、`g-pd-${space}` 等类名必须改成静态映射，或加入项目 safelist。规则范围和参数见 [`@deot/style-unocss` README](../../packages/unocss/README.md)；需要 Mini rules 时参见[与 UnoCSS Mini 组合](../unocss/mini.md)。

### 从 Sass/CSS 迁入 UnoCSS

| 检查项 | Style | UnoCSS |
| --- | --- | --- |
| 工具类来源 | 一个完整 CSS 或 Sass 输出入口 | `virtual:uno.css`，移除完整 Style CSS |
| 数值范围 | 预定义数值集合 | 按规则匹配动态 Token |
| 数字尺寸 | Sass scale 同时缩放后缀与值 | Token 数字直接拼 unit，不再缩放 |
| 固定组合尺寸 | 随 unit/scale 变化 | 随 unit/scale 变化 |
| 主题 | 可配置 Sass map，支持关闭 CSS Variables | 默认主题变量，由业务 CSS 覆盖；不读取 Sass map |
| reset | 通配符开关不关闭 html/body | `reset: false` 关闭 html/body 与全局通配符，保留主题变量 |
| variants | 静态 CSS 无动态 variants | 默认复用官方 variants；Variant Group 负责分组展开 |

先选取项目真实使用的类名，按 [UnoCSS 工具类参考](../unocss/DOCUMENT.md)检查数值、动态值与组合声明。不要把名称相近理解为 CSS 完全等价。

### UnoCSS 项目如何接入 Deprecated

仅需要临时恢复默认 g-、px、scale 1 的已发布静态旧类时，额外安装兼容包：

```bash
pnpm add @deot/style
```

```ts
// 应用入口
import '@deot/style/dist/index.deprecated.css';
import 'virtual:uno.css';
```

保留 `presetStyle()`，不再加载完整 `@deot/style/dist/index.css`。默认主题 preflight 提供兼容类依赖的变量；关闭全局 preflights 或独立使用兼容 CSS 时，应由业务主题提供它们。

按 [Deprecated 完整迁移映射](../style/deprecated.md)逐项替换并验证布局，完成后删除兼容 CSS 引入；若不再消费 Style 的其他能力，再移除该依赖。静态兼容 CSS 不恢复旧 variants、动态旧 Token 或自定义单位/前缀，后者必须直接迁移。

如同时组合 Mini，旧名还可能触发 Mini 规则；导入顺序不能消除不同 CSS 属性的叠加。优先替换冲突旧名，配置控制见 [Mini 组合专页](../unocss/mini.md)。

## 移动端：REM

### Style：Sass 单位与主题

以下以 750 宽设计稿为例。沿用前文 `styles/index.scss` 先 theme、后 global 的组织方式，替换这两个文件的内容：

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

应用入口加载 `styles/index.scss`，并在挂载前初始化根字号：

```ts
import { Style } from '@deot/style/dist';
import './styles/index.scss';

Style.useREM(750);
```

`$scale: 2` 会同时缩放数值后缀和属性值。例如基础字号 14 会输出为 `.g-fs-28 { font-size: 28rem; }`，对应 750 宽设计稿上的 28px 标注。

若桌面容器需要固定按 375px 展示移动页面，业务项目会把根字号固定为 `0.5px`；这是宿主环境策略，不属于 `Style.useREM()` 的通用行为。

### UnoCSS：配置单位与根字号

沿用前文的 UnoCSS 插件和 `virtual:uno.css` 接入，将 preset 参数改为：

```ts
presetStyle({ unit: 'rem', scale: 2 });
```

这里不加载上面的完整 Sass 入口。根字号仍需由项目按视口设置；若复用 `Style.useREM(750)`，安装并引入 `@deot/style` 的 JavaScript 入口即可，无需加载其完整 CSS。

UnoCSS 数字 Token 不再乘 scale：750 宽设计稿的 28px 字号应写 `g-fs-28`，得到 `28rem`。`scale: 2` 只影响主题和组合规则的固定尺寸。`baseWidth` 与 scale 的区别见 [REM API](../style/reference-examples.md)。

## 小程序：Style RPX

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

仍按 `styles/index.scss` 先 theme、后 global 的顺序组织，并在宿主的全局样式入口加载该文件。RPX 由小程序环境解释，不需要调用 `Style.useREM()`。

关闭 CSS Variables 后，可以在业务 mixin 中通过 `themefix()` 取得具体色值：

```scss
@use '@deot/style/src/functions/theme' as theme;

.tag {
	color: theme.themefix(color-primary);
}
```

## 多入口项目与开发命令

`presetStyle()` 在加载 `uno.config.ts` 时读取一次配置。可以由每个开发进程设置 `UNOCSS_OPTIONS`：

```bash
UNOCSS_OPTIONS='{"prefix":"g-","unit":"rem","scale":2,"reset":true}' npm run dev
```

显式传给 `presetStyle()` 的参数优先于 `UNOCSS_OPTIONS`，未设置时再使用默认值。

同一个 UnoCSS generator 不能让相同的 `g-fs-14` 在不同页面同时解释为 `14px` 和 `14rem`。如果仓库中的 mobile、manage 等入口需要不同的 `unit` / `scale`，开发时应为每个目标启动独立进程并传入对应 `UNOCSS_OPTIONS`；构建时也应按目标分别执行。不要根据页面运行时状态切换 preset 参数。

如果必须由同一个开发进程同时服务多个目标，应明确隔离生成配置，或使用显式带单位的不同 Token；仅给页面换前缀不会自动产生第二套配置。不要让同一个类名承担两套 CSS 语义。

这里的 `npm run dev` 指消费项目的开发命令。本仓库同名命令用于监听测试，文档预览使用 `npm run docs:dev`。

## 区分库工具类与业务扩展

业务项目会继续使用 `g-` 前缀补充 `.g-c-main`、`.g-btn-primary`、`.g-safe-area` 等项目专属规则，也会覆盖 `.g-bdb` 的边框颜色。这些类不属于 `@deot/style` 的公共输出，不应依赖它们跨项目存在。

- 公共类：分别以 [Style 工具类参考](../style/DOCUMENT.md)与 [UnoCSS 工具类参考](../unocss/DOCUMENT.md)为准。
- 业务类：由各项目自己的 `global.scss` 维护。
- 覆盖公共类时，应把业务样式放在 `@deot/style/src/index` 之后，确保样式顺序清晰。

## 继续阅读

- UnoCSS 参数、主题、动态 token 与 safelist：[`@deot/style-unocss` README](../../packages/unocss/README.md)。
- Mini rules、覆盖关系与迁移方式：[与 UnoCSS Mini 组合](../unocss/mini.md)。
- Sass 变量与主题配置：[`@deot/style` README](../../packages/index/README.md)；函数、mixin 与 REM API：[参考与示例](../style/reference-examples.md)。
- 当前类名：[Style 工具类参考](../style/DOCUMENT.md)、[UnoCSS 工具类参考](../unocss/DOCUMENT.md)。
