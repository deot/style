# @deot/style

`@deot/style` 是一套可配置的 Sass/CSS 基础样式与工具类，提供布局、间距、颜色、排版、边框、图片和辅助类，并产出 px、rem、rpx 与 normalize 等多种样式入口。

## 安装

```bash
pnpm add @deot/style
```

## 预编译 CSS

```ts
import '@deot/style/dist/index.css';
```

```html
<section class="g-flex g-ai-c g-jc-sb g-pd-16">
	<strong class="g-c-info">@deot/style</strong>
	<span class="g-bg-gray-mid g-br-8 g-pd-lr-8 g-pd-tb-4">ready</span>
</section>
```

需要包含 normalize.css 时改为引入 `@deot/style/dist/index.normalize.css`。全部入口如下；选择依据见[选择与安装](https://github.com/deot/style/blob/main/docs/start/installation.md)。

| 文件 | 内容 | 适用场景 |
| --- | --- | --- |
| `dist/index.css` | 完整 px 工具类 | 默认 Web 项目 |
| `dist/index.normalize.css` | 完整 px 工具类与 normalize.css | 需要浏览器样式归一化 |
| `dist/index.normalize-only.css` | 仅 normalize.css | 已自行组织其他样式入口 |
| `dist/index.rem.css` | 完整 rem 工具类，数值按 2 倍缩放 | 移动端 REM 方案 |
| `dist/index.rpx.css` | 完整 rpx 工具类，数值按 2 倍缩放 | 微信小程序等 rpx 环境 |
| `dist/index.rem-part.css` | 仅字号、行高、间距，`rg-` 前缀、rem、scale 2，无 theme/reset | 在 px 项目中局部混入 REM，主题由宿主提供 |
| `dist/index.deprecated.css` | 仅旧类，无 theme、reset 或当前类 | CSS / UnoCSS 旧项目临时兼容（g-、px、scale 1） |

所有正常入口只包含当前类。旧项目可临时加载默认 `g-`、px、scale 1 的 `@deot/style/dist/index.deprecated.css`；该入口不包含 theme、reset 或当前类，依赖的主题变量需由 UnoCSS preflight 或项目提供。完整映射及限制见 [Deprecated 迁移](https://github.com/deot/style/blob/main/docs/style/deprecated.md)。

选择 REM 入口后，需要按视口设置根字号时使用以下方法；默认 px 入口不需要调用。`750` 与预编译 REM 入口的 scale 2 搭配使用。默认同时注入 `font-size` 和 `--rem`；后者供 Sass `remfix()` 辅助手写尺寸。参数与 `remfix` 见[REM API](https://github.com/deot/style/blob/main/docs/style/reference-examples.md)。

```ts
import { Style } from '@deot/style/dist';

Style.useREM(750);
Style.useREM(750, { fontSize: false }); // 只注入 --rem，配合 remfix()
```

## Sass 配置

包内发布 `src/**`，支持通过 Sass 模块系统配置后再生成样式。以下示例假设构建工具能够从 `node_modules` 解析 `@use`。

若宿主项目尚未安装 Sass 编译器：

```bash
pnpm add -D sass
```

配置模块必须在 `src/index` 首次加载前完成：

```scss
@use '@deot/style/src/variables/default' with (
	$prefix: app,
	$unit: px,
	$scale: 1,
	$allow-css-variables: true,
	$allow-asterisk-wildcard: true
);

@use '@deot/style/src/variables/theme' with (
	$theme-merge-data: (
		color-highlight: #7c3aed,
		border-radius-default: 12px
	)
);

@use '@deot/style/src/index';
```

将上述内容保存到项目 Sass 文件，并在应用入口引入该文件，即可把默认 `.g-*` 类改为 `.app-*`，并覆盖两项主题值。多文件组织方式见[接入与迁移](https://github.com/deot/style/blob/main/docs/start/integration.md)。

## 默认配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$scale` | `1` | 数字尺寸及其类名后缀的缩放倍数；比例、编号、字重等不缩放 |
| `$rem-var` | `--rem` | `remfix` 默认 CSS 变量名，需与 `Style.useREM()` 注入的变量一致 |
| `$unit` | `px` | 无单位数字转换后的单位 |
| `$prefix` | `g` | 工具类前缀；末尾连字符可省略，空字符串会移除前缀 |
| `$allow-css-variables` | `true` | 使用 `var(--*)` 输出主题引用 |
| `$allow-asterisk-wildcard` | `true` | 输出全局 `*` reset 规则 |

## 主题

默认主题定义在 [`src/variables/theme.scss`](https://github.com/deot/style/blob/main/packages/index/src/variables/theme.scss)。主题支持两种配置方式：

- `$theme-merge-data`：覆盖同名键并保留其他默认值，适合只调整部分主题。
- `$theme`：替换完整主题 map，适合由项目统一维护全部主题键；缺少的键不会自动补回。

两个 map 都可以加入 `color-primary` 等业务语义键，并通过 `themefix()` 使用。完整加载顺序见[接入与迁移](https://github.com/deot/style/blob/main/docs/start/integration.md)。

主题键、函数、Common/BEM mixin 和 `Style.useREM()` 的完整说明见[参考与示例](https://github.com/deot/style/blob/main/docs/style/reference-examples.md)。

## 按需生成

不需要完整入口时可以只加载一个或多个输出模块：

```scss
@use '@deot/style/src/variables/default' with (
	$prefix: app
);

@use '@deot/style/src/outputs/flex';
@use '@deot/style/src/outputs/margin';
@use '@deot/style/src/outputs/padding';
```

[工具类参考](https://github.com/deot/style/blob/main/docs/style/DOCUMENT.md)按 CSS 属性分类，并标注对应输出模块；文档分类与源码模块不是一一对应关系。正常入口和分类模块只生成当前类，旧类集中在 `outputs/deprecated.scss`，仅由独立兼容入口加载。

## 相关文档

- [选择与安装](https://github.com/deot/style/blob/main/docs/start/installation.md)
- [接入与迁移](https://github.com/deot/style/blob/main/docs/start/integration.md)
- [工具类参考](https://github.com/deot/style/blob/main/docs/style/DOCUMENT.md)
- [参考与示例](https://github.com/deot/style/blob/main/docs/style/reference-examples.md)
- [Deprecated 兼容与迁移](https://github.com/deot/style/blob/main/docs/style/deprecated.md)
