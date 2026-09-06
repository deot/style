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

需要包含 normalize.css 时改为引入 `@deot/style/dist/index.normalize.css`。全部入口及适用场景见[选择与安装](../../docs/getting-started.md)。

完整入口继续包含后置的 deprecated 兼容类。只需要兼容旧类时可加载 `@deot/style/dist/index.deprecated.css`；自定义 Sass 配置后加载 `@deot/style/src/index.deprecated.scss`。独立入口不包含 theme、reset 或当前类，依赖的主题变量需由 UnoCSS preflight 或项目提供，完整映射及限制见 [Deprecated 迁移](../../docs/deprecated.md)。

需要按视口设置 REM 时使用：

```ts
import { Style } from '@deot/style/dist';

Style.useREM(750);
```

## Sass 配置

包内发布 `src/**`，支持通过 Sass 模块系统配置后再生成样式。以下示例假设构建工具能够从 `node_modules` 解析 `@use`。

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

上述配置会把默认 `.g-*` 类改为 `.app-*`，并覆盖两项主题值。

## 布局与尺寸

- `g-w-full`、`g-h-full`、`g-size-full` 分别填满包含块的宽度、高度或宽高。
- 十二列百分比宽度使用 `g-w-1/12` 至 `g-w-12/12`。
- `g-fl-1/12` 至 `g-fl-12/12` 提供十二列宽度并增加 `float: left`，容器使用 `g-fl-row`。
- Flex 简写值使用 `g-f-0`、`g-f-1`、`g-f-2`。
- Flex 固定占比使用 `g-f-1/2`、`g-f-1/3` 等分数写法。
- Flex Wrap 使用 `g-fwr-w/wr/n`，`g-fw-*` 只表示 Font Weight。

Grid 使用属性首字母缩写：

- `g-grid` 创建 Grid 容器并设置 `box-sizing: border-box`。
- `g-gtc-1` 至 `g-gtc-12`、`g-gtr-1` 至 `g-gtr-12` 生成等分列和行。
- `g-gc-*`、`g-gr-*` 负责网格定位与 span；`g-gcs/gce/grs/gre-*` 设置起止网格线。
- `g-gaf-r/c/d/rd/cd` 设置自动布局方向和 dense 模式。

UnoCSS 还提供 `g-w-{n}` 数值尺寸、`screen`、内容尺寸、任意值和 CSS Variable 等按需规则，详见 [`@deot/style-unocss` README](../unocss/README.md)。

## 文本与边框

- Text Align 使用 `g-ta-l/r/c/j/s/e/ja/mp`，并保持 `!important` 输出。
- Text Decoration Line 使用 `g-tdl-lt/ul/ol/n`；多行截断使用 `g-line-1/2`。
- 高清边框使用 `g-bd/g-bdt/g-bdr/g-bdb/g-bdl`。
- `g-br-{n}`、`g-br-circle/default` 继续表示 Border Radius。
- 默认阴影使用 `g-bsh/g-bsh-t`，Box Sizing 使用 `g-bsz-bb`。
- 标准 Border 的动态 width/style/color 与 `[]/()` 语法仅由 UnoCSS 提供。

## 默认配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$scale` | `1` | 数字值和数字类名后缀的缩放倍数 |
| `$unit` | `px` | 无单位数字转换后的单位 |
| `$prefix` | `g` | 工具类前缀；末尾连字符可省略，空字符串会移除前缀 |
| `$allow-css-variables` | `true` | 使用 `var(--*)` 输出主题引用 |
| `$allow-asterisk-wildcard` | `true` | 输出全局 `*` reset 规则 |

## 主题

默认主题定义在 [`src/variables/theme.scss`](./src/variables/theme.scss)。主题支持两种配置方式：

- `$theme-merge-data`：覆盖同名键并保留其他默认值，适合只调整部分主题。
- `$theme`：替换完整主题 map，适合由项目统一维护全部主题键；缺少的键不会自动补回。

两个 map 都可以加入 `color-primary` 等业务语义键，并通过 `themefix()` 使用。完整加载顺序见[接入与迁移](../../docs/integration.md)。

| 键 | 默认值 |
| --- | --- |
| `color-default` | `#515a6e` |
| `color-highlight` | `#5495f6` |
| `color-info` | `#0177de` |
| `color-success` | `#00a854` |
| `color-error` | `#f04134` |
| `color-warning` | `#ffbf00` |
| `background-color-default` | `#f5f6fa` |
| `background-color-highlight` | `#5495f6` |
| `border-radius-default` | `8px` |
| `border-shadow-default` | `0 0 8px 0 rgb(0 0 0 / 10%)` |
| `border-shadow-default-top` | `0 -2px 10px 0 rgb(0 0 0 / 8%)` |
| `line-height-default` | `1.5` |
| `line-height-limit` | `32px` |
| `border-color-default` | `#c9c9c9` |
| `font-size-default` | `14px` |
| `font-size-large` | `16px` |

滚动条主题还包括 `scrollbar-track-bg-color`、`scrollbar-thumb-bg-color` 与 `scrollbar-track-box-shadow`。启用 CSS Variables 时，`src/outputs/theme.scss` 会把完整主题输出到 `:root`；关闭后，`themefix()` 会直接返回 map 中的具体值。

## 函数

### Helper

从 `src/functions/helper` 加载：

| 函数 | 说明 |
| --- | --- |
| `merge($rest...)` | 合并传入的 map 或嵌套 list 中的 map |
| `prefix($rest...)` | 根据 `prefix` 与 `name` 生成类选择器前缀 |
| `unitfix($value, $rest...)` | 缩放数字并补单位；字符串保持原值 |
| `suffix($value, $rest...)` | 缩放数字类名后缀；字符串保持原值 |
| `percentw($col, $total)` | 将分栏比例转换为百分比 |

```scss
@use '@deot/style/src/functions/helper' as helper;

.card {
	padding: helper.unitfix(16);
	width: helper.percentw(1, 3);
}
```

### Theme

从 `src/functions/theme` 加载：

```scss
@use '@deot/style/src/functions/theme' as theme;

.card {
	color: theme.themefix(color-default);
	box-shadow: theme.themefix(border-shadow-default);
}
```

## Common mixin

从 `src/mixins/common` 加载：

| Mixin | 说明 |
| --- | --- |
| `common-bg-linear` | 输出线性渐变及纯色回退 |
| `common-flex` | Flex 容器与 border-box |
| `common-flex-cc` | Flex 水平垂直居中 |
| `common-break` | 长文本与连续字符换行 |
| `common-ellipsis` | 单行省略 |
| `common-text-line($line)` | 指定行数截断 |
| `common-clear-fix` | 清除浮动 |
| `common-scroll($size)` | WebKit 滚动条样式 |
| `common-border-1px(...)` | 适配 2x/3x 屏的 1px 边框 |

## BEM mixin

从 `src/mixins/bem` 加载。默认使用 `__` 连接元素、`--` 连接修饰符，并提供 `is-` 与 `has-` 状态前缀。

```scss
@use '@deot/style/src/mixins/bem' as *;

@include block(card) {
	@include element(title) {
		font-weight: 600;
	}

	@include modifier(active) {
		@include when(selected) {
			color: #0177de;
		}
	}
}
```

常用 mixin 包括 `block`、`element`、`modifier`、`when`、`pseudo`、`share-rule`、`extend-rule`、`spec-selector` 与 `meb`。

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

可选输出模块与[工具类参考](../../docs/DOCUMENT.md)中的分类一一对应。分类模块只生成当前类，旧类集中在 `outputs/deprecated.scss`，由完整入口或独立兼容入口加载。

## 相关文档

- [选择与安装](../../docs/getting-started.md)
- [接入与迁移](../../docs/integration.md)
- [工具类参考](../../docs/DOCUMENT.md)
- [Sass/CSS 示例](../../docs/playground.md)
