# 工具类参考

本文档以当前 `packages/index/src/outputs` 源码为准，列出 `@deot/style` 默认 Sass/CSS 产物中的公共工具类。默认配置使用 `g-` 前缀、`px` 单位和 1 倍缩放；修改 Sass 配置后，类名前缀、数值后缀和属性值会相应变化。

`@deot/style-unocss` 覆盖这些公共语义，并对数值类提供动态 token。两种交付方式的 `scale` 和规则生成范围并不完全相同，迁移前请先阅读 [`@deot/style-unocss` README](../packages/unocss/README.md) 与[接入与迁移](./integration.md)。

## 命名约定

> 本仓库的工具类以 CSS 原生语义为基础：直接映射单一 CSS 属性或属性值时，优先使用简短且可识别的缩写，例如 `w`、`h`、`fs`、`lh`、`ai`；同时设置多个属性或表达完整布局、状态和行为时，优先使用含义清晰的完整名称，例如 `size`、`reset`、`clearfix`。
>
> 部分缩写是有意保留的既有约定，例如 `g-g-*` 表示 `gap`。`fw`、`bs`、`br` 等历史缩写存在多种语义，应根据完整类名判断；本仓库会明确说明其匹配范围，但不会在本版改变已有输出。

### `full` 与 `screen`

> `full` 表示填满当前包含块，使用 `100%`；`screen` 表示填满浏览器视口，按轴使用 `100vw` 或 `100vh`。宽度、高度和宽高组合规则会同时提供这两类语义，它们是有意并存的能力，不是互相替代的别名。
>
> - `g-w-full` / `g-h-full`：单轴填满包含块。
> - `g-size-full`：宽高均填满包含块。
> - `g-w-screen` / `g-h-screen`：单轴填满视口。
> - `g-size-screen`：宽高分别使用 `100vw` 和 `100vh`。

`screen`、内容尺寸和任意值属于 UnoCSS 动态规则；预编译 Sass/CSS 提供 `full` 语义。

## 目录结构

```text
packages/index/src/
├── functions/       # 数值、选择器与主题函数
├── mixins/          # Common 与 BEM mixin
├── outputs/         # 工具类输出及生成器
├── scripts/         # Style.useREM
├── variables/       # 默认配置、颜色与主题
├── index.scss       # 完整样式入口
├── index.normalize.scss
├── index.normalize-only.scss
├── index.rem.scss
├── index.rem-part.scss
└── index.rpx.scss
```

主题、函数与 mixin 见 [`@deot/style` README](../packages/index/README.md)，构建产物见[选择与安装](./getting-started.md)。

## Reset

完整入口会设置 `html`、`body` 的基础尺寸、字体、行高、颜色和背景，并在 `$allow-asterisk-wildcard: true` 时输出全局 box-sizing 与间距 reset。

| 类 | 说明 |
| --- | --- |
| `.g-reset` | 重置列表、链接、图片、表单和常见行内元素 |
| `.g-unset` | 为富文本恢复标题、段落、列表等浏览器布局 |

## Flex

### 容器与分栏

| 类 | 说明 |
| --- | --- |
| `.g-flex` | `display: flex` 与 `box-sizing: border-box` |
| `.g-flex-holy` | 纵向、最小高度为视口的 Flex 容器 |
| `.g-flex-cc` | 水平垂直居中 |
| `.g-flex-ac` | 交叉轴居中 |
| `.g-col` / `.g-col-2` | `flex: 1` / `flex: 2` |
| `.g-f-{part}/{total}` | 固定 Flex 占比，例如 `g-f-1/2` 为 `flex: 0 0 50%` |

### 单属性类

| 前缀 | 属性 | 后缀 |
| --- | --- | --- |
| `g-fd-` | `flex-direction` | `r`、`c`、`rr`、`cr` |
| `g-fw-` | `flex-wrap` | `w`、`wr`、`n` |
| `g-jc-` | `justify-content` | `fs`、`fe`、`c`、`sb`、`sa` |
| `g-ai-` | `align-items` | `fs`、`fe`、`c`、`b`、`s` |
| `g-ac-` | `align-content` | `fs`、`fe`、`c`、`sb`、`sa`、`s` |
| `g-as-` | `align-self` | `a`、`fs`、`fe`、`c`、`b`、`s` |

后缀取属性值中每个单词的首字母，例如 `.g-jc-sb` 表示 `justify-content: space-between`。

## 浮动栅格

项目未提供 CSS Grid 工具类；现有栅格使用 12 列浮动布局。

| 类 | 说明 |
| --- | --- |
| `.g-row` | 行容器并清除浮动 |
| `.g-clearfix` | 清除浮动 |
| `.g-w-1/12` … `.g-w-12/12` | 设置 1/12 至 12/12 宽度 |
| `.g-fw-1` … `.g-fw-12` | 设置宽度并左浮动 |
| `.g-fl` / `.g-fr` | 左浮动 / 右浮动 |

## 尺寸

UnoCSS 属性规则支持裸数字、`[]` 任意值和 `()` CSS Variable：

| 模式 | 说明 |
| --- | --- |
| `g-w-*` / `g-w-[]` / `g-w-()` | 设置宽度 |
| `g-h-*` / `g-h-[]` / `g-h-()` | 设置高度 |
| `g-size-*` / `g-size-[]` / `g-size-()` | 同时设置宽高 |

`full`、`screen` 的区别见前文；`min`、`max`、`fit` 分别表示 `min-content`、`max-content`、`fit-content`。宽度比例使用 `g-w-{part}/{total}`，裸数字只表示配置单位尺寸。

## 间距

默认数值：`2, 4, 5, 6, 8, 10, 12, 13, 15, 16, 18, 20, 21, 24, 25, 30, 32, 48, 56, 60`。

UnoCSS 不限于以上预生成数值，并为所有方向支持 `[]` 和 `()`。

| 模式 | 说明 |
| --- | --- |
| `.g-pd-{n}` / `.g-m-{n}` | 四边 padding / margin |
| `.g-pd-tb-{n}` / `.g-m-tb-{n}` | 上下间距 |
| `.g-pd-lr-{n}` / `.g-m-lr-{n}` | 左右间距 |
| `.g-pd-t-{n}`、`l`、`r`、`b` | 单方向 padding |
| `.g-m-t-{n}`、`l`、`r`、`b` | 单方向 margin |

### 安全区

| 类 | 说明 |
| --- | --- |
| `.g-pd-s` | 四个方向使用对应 `safe-area-inset-*` |
| `.g-pd-tb-s` / `.g-pd-lr-s` | 上下 / 左右安全区 |
| `.g-pd-t-s`、`b`、`l`、`r` | 单方向安全区 |

## 排版

### 字号、行高和字重

- 字号 `.g-fs-{n}`：`10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 48, 50, 60, 70, 80, 90, 100`。
- 行高 `.g-lh-{n}`：`0` 至 `5` 为无单位值，大于 `5` 时使用配置单位；Sass 预编译数值还包括 `10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 60, 72, 80, 88, 120`。
- 字重 `.g-fw-{value}`：`bold, 400, 500, 600, 700`。

| 类 | 说明 |
| --- | --- |
| `.g-lh-default` | 使用主题的 `line-height-default`，默认 `1.5` |
| `.g-lh-one` / `.g-lh-two` | 使用主题限高生成一行 / 两行高度 |
| `.g-lh-0` … `.g-lh-5` | UnoCSS 无单位行高 |

### 文本

| 类 | 说明 |
| --- | --- |
| `.g-tl` / `.g-tc` / `.g-tr` | 左 / 中 / 右对齐 |
| `.g-td-lh` / `.g-td-ul` | 删除线 / 下划线 |
| `.g-line-nowrap` / `.g-nowrap` | 不换行 |
| `.g-line-wrap` / `.g-break` | 使用 `word-break`、`overflow-wrap` 与 `text-wrap` 处理长文本和连续字符 |
| `.g-line-one` / `.g-line-two` | 一行 / 两行截断，并通过 `white-space: break-spaces` 保留空白换行 |

## 颜色与渐变

每个颜色键同时生成 `.g-c-{key}` 与 `.g-bg-{key}`。

UnoCSS 还支持 `g-c-[<color>]`、`g-bg-[<color>]` 任意颜色，以及 `g-c-(--variable)`、`g-bg-(--variable)` CSS Variable 简写。

| 系列 | 键 |
| --- | --- |
| 红粉 | `red-mid`、`pink-mid`、`pink-light` |
| 蓝 | `blue-dark`、`blue-mid`、`blue-light` |
| 黄 | `yellow-dark`、`yellow-mid`、`yellow-light` |
| 橙 | `orange-dark`、`orange-mid`、`orange-light` |
| 灰 | `gray-dark`、`gray-mid`、`gray-light` |
| 紫 | `purple-dark`、`purple-mid`、`purple-light` |
| 黑白 | `black`、`white`、`black-dark`、`black-mid`、`black-light` |
| 简写色值 | `444`、`67`、`f2`、`f8`、`ef`、`cd`、`e8`、`d9`、`f4`、`f9`、`000`、`333`、`51`、`666`、`999`、`aaa`、`bbb`、`bd` |
| 主题语义 | `info`、`success`、`error`、`warning` |

渐变类：

- `.g-bg-lg-blue`：`blue-mid → blue-light`。
- `.g-bg-lg-yellow`：`yellow-mid → yellow-light`。

## 图片

默认尺寸：`256, 150, 128, 100, 96, 64, 56, 40, 32, 24`。

| 类 | 说明 |
| --- | --- |
| `.g-img-{n}` | 固定 width、height、min/max-width 与 line-height |
| `.g-imgc-{n}` | 固定尺寸并使用 50% 圆角 |
| `.g-imgr-{n}` | 固定尺寸并使用 4px 圆角 |

## 定位

| 类 | 说明 |
| --- | --- |
| `.g-fixed` | `position: fixed` |
| `.g-relative` | `position: relative` |
| `.g-absolute` | `position: absolute` |
| `.g-fixed-full` | fixed 并设置 `inset: 0` |
| `.g-absolute-full` | absolute 并设置 `inset: 0` |

## 边框、圆角与阴影

| 类 | 说明 |
| --- | --- |
| `.g-b`、`.g-bt`、`.g-br`、`.g-bb`、`.g-bl` | 适配高分屏的全边或单边 1px 边框 |
| `.g-br-circle` | 100% 圆角 |
| `.g-br-default` | 使用主题默认圆角 |
| `.g-br-{n}` | `n` 为 `2, 4, 6, 8, 10, 12, 14, 16, 18, 20` |
| `.g-bs` / `.g-bs-t` | 默认阴影 / 顶部阴影 |

## 显示与辅助类

| 类 | 说明 |
| --- | --- |
| `.g-h-full` / `.g-w-full` / `.g-size-full` | 高度 / 宽度 / 两者为 100% |
| `.g-none` / `.g-dp-n` / `.g-hide` | `display: none` |
| `.g-show` / `.g-dp-b` / `.g-block` | `display: block` |
| `.g-dp-i` / `.g-inline` | `display: inline` |
| `.g-dp-ib` / `.g-inline-block` | `display: inline-block` |
| `.g-operable` | 高亮色、14px 字号和 pointer 光标 |
| `.g-pointer` | pointer 光标 |
| `.g-disabled` | 禁用 pointer events |
| `.g-unanimated` | 禁用动画 |
| `.g-scroller` | WebKit 滚动条样式 |
| `.g-divide` | 1px × 12px 的行内分隔线 |
| `.g-dot` | 5px 圆点 |
| `.g-of-h` | `overflow: hidden` |
| `.g-bs-bb` | `box-sizing: border-box` |

## Gap

本仓库 UnoCSS 规则使用 `g-g-*`：

| 模式 | 属性 |
| --- | --- |
| `g-g-*` / `g-g-[]` / `g-g-()` | `gap` |
| `g-g-x-*` / `g-g-col-*` | `column-gap` |
| `g-g-y-*` / `g-g-row-*` | `row-gap` |

Mini 的 `g-gap-*` 同时可用，但采用 Mini 自身的数值刻度。例如默认配置下，`g-g-4` 为 `4px`，`g-gap-4` 为 `1rem`。

## 历史共用缩写

以下缩写存在多种现行语义，不属于废弃规则：

| 缩写 | 语义 |
| --- | --- |
| `g-fw-w/wr/n` | `flex-wrap` |
| `g-fw-1` 至 `g-fw-12` | 十二列宽度并左浮动 |
| `g-fw-13` 至 `g-fw-1000`、`g-fw-bold` | `font-weight` |
| `g-bs`、`g-bs-t` | `box-shadow` |
| `g-bs-bb` | `box-sizing: border-box` |
| `g-br` | 右侧高清边框 |
| `g-br-{n}`、`g-br-circle/default` | `border-radius` |
