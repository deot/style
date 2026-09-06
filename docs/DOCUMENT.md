# 工具类参考

本文档以当前 `packages/index/src/outputs` 源码为准，列出 `@deot/style` 默认 Sass/CSS 产物中的公共工具类。默认配置使用 `g-` 前缀、`px` 单位和 1 倍缩放；修改 Sass 配置后，类名前缀、数值后缀和属性值会相应变化。

`@deot/style-unocss` 覆盖这些公共语义，并对数值类提供动态 token。两种交付方式的 `scale` 和规则生成范围并不完全相同，迁移前请先阅读 [`@deot/style-unocss` README](../packages/unocss/README.md) 与[接入与迁移](./integration.md)。本 preset 默认不包含 Mini rules；需要 Mini 全名规则时参见[与 UnoCSS Mini 组合](./unocss-mini.md)。

## 命名约定

本文仅列当前工具类，所有正常 Sass/CSS 入口均不包含旧类。默认 `g-`、px、scale 1 的旧类由 `index.deprecated.scss` 独立入口提供；UnoCSS 已移除旧 matcher，兼容方式和映射见 [Deprecated 迁移](./deprecated.md)。

> 本仓库的工具类以 CSS 原生语义为基础：直接映射单一 CSS 属性或属性值时，优先使用简短且可识别的缩写，例如 `w`、`h`、`f`、`fs`、`lh`、`ai`、`gtc`；同时设置多个属性或表达完整布局、状态和行为时，优先使用含义清晰的完整名称，例如 `size`、`reset`、`clearfix`。
>
> 一个缩写在最新规则中只归属一个属性，例如 `fw` 只表示 `font-weight`、`fwr` 表示 `flex-wrap`、`bsh` 表示 `box-shadow`。部分无歧义短写会有意保留，例如 `g-g-*` 表示 Gap、Padding Safe Area 中的 `s` 表示 `safe-area`。

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
├── index.deprecated.scss # 仅旧类的兼容入口
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
| `.g-f-0` / `.g-f-1` / `.g-f-2` | `flex: 0` / `flex: 1` / `flex: 2` |
| `.g-f-{part}/{total}` | 固定 Flex 占比，例如 `g-f-1/2` 为 `flex: 0 0 50%` |

UnoCSS 还支持任意非负安全整数、任意值和 CSS Variable，例如 `g-f-7`、`g-f-[1_0_auto]`、`g-f-(--layout-flex)`。裸关键字不匹配本仓库规则，应写成 `g-f-[auto]`。`flex: 1` 通常按 `flex: 1 1 0%` 计算，并不等于 `flex: 1 0 auto`。

### 单属性类

| 前缀 | 属性 | 后缀 |
| --- | --- | --- |
| `g-fd-` | `flex-direction` | `r`、`c`、`rr`、`cr` |
| `g-fwr-` | `flex-wrap` | `w`、`wr`、`n` |
| `g-jc-` | `justify-content` | `fs`、`fe`、`c`、`sb`、`sa` |
| `g-ai-` | `align-items` | `fs`、`fe`、`c`、`b`、`s` |
| `g-ac-` | `align-content` | `fs`、`fe`、`c`、`sb`、`sa`、`s` |
| `g-as-` | `align-self` | `a`、`fs`、`fe`、`c`、`b`、`s` |

后缀取属性值中每个单词的首字母，例如 `.g-jc-sb` 表示 `justify-content: space-between`。

### Flex 子项

| 前缀 | 属性 | 说明 |
| --- | --- | --- |
| `g-fb-*` | `flex-basis` | 数字使用配置单位；支持 `auto/full`、比例和 `[]/()` |
| `g-fg-*` | `flex-grow` | 无单位数字或 `[]/()` |
| `g-fsh-*` | `flex-shrink` | 无单位数字或 `[]/()` |
| `g-od-*` | `order` | 数字或 `[]/()`；`first/last/default` 表示 `-9999/9999/0` |

`g-fsh-*` 有意避开已经表示 `font-size` 的 `g-fs-*`。

## Grid

### 容器与轨道

| 类 | 说明 |
| --- | --- |
| `.g-grid` | `display: grid` 与 `box-sizing: border-box` |
| `.g-inline-grid` | `display: inline-grid` 与 `box-sizing: border-box` |
| `.g-gtc-1` … `.g-gtc-12` | 生成 1 至 12 列 `repeat(n, minmax(0, 1fr))` 等分轨道 |
| `.g-gtr-1` … `.g-gtr-12` | 生成 1 至 12 行 `repeat(n, minmax(0, 1fr))` 等分轨道 |
| `.g-gtc-none` / `.g-gtc-subgrid` | 列模板使用 `none` / `subgrid` |
| `.g-gtr-none` / `.g-gtr-subgrid` | 行模板使用 `none` / `subgrid` |

UnoCSS 的模板数字不限于 `12`，并支持任意值和 CSS Variable：

```text
g-gtc-[72px_minmax(0,_1fr)] -> grid-template-columns: 72px minmax(0, 1fr)
g-gtr-(--rows)               -> grid-template-rows: var(--rows)
```

### 网格定位

| 类 | 说明 |
| --- | --- |
| `.g-gc-1` … `.g-gc-12` | `grid-column` 网格线 |
| `.g-gr-1` … `.g-gr-12` | `grid-row` 网格线 |
| `.g-gc-span-1` … `.g-gc-span-12` | 跨越指定列数 |
| `.g-gr-span-1` … `.g-gr-span-12` | 跨越指定行数 |
| `.g-gc-span-full` / `.g-gr-span-full` | 从首条网格线跨越到末条网格线，即 `1 / -1` |
| `.g-gcs-*` / `.g-gce-*` | `grid-column-start` / `grid-column-end` |
| `.g-grs-*` / `.g-gre-*` | `grid-row-start` / `grid-row-end` |

Sass 为定位数字预生成 `1` 至 `12`。UnoCSS 支持任意正整数；除 span 外还支持 `[]` 与 `()`，例如 `g-gc-[1/-1]`、`g-gce-[-1]`、`g-gr-(--row)`。

### 自动流与协作规则

| 类 | `grid-auto-flow` |
| --- | --- |
| `.g-gaf-r` / `.g-gaf-c` | `row` / `column` |
| `.g-gaf-d` | `dense` |
| `.g-gaf-rd` / `.g-gaf-cd` | `row dense` / `column dense` |
| `.g-gac-*` / `.g-gar-*` | `grid-auto-columns` / `grid-auto-rows` |
| `.g-ji-*` / `.g-js-*` | `justify-items` / `justify-self` |
| `.g-pc-*` / `.g-pi-*` / `.g-ps-*` | `place-content` / `place-items` / `place-self` |
| `.g-ga-[]/()` / `.g-gta-[]/()` | `grid-area` / `grid-template-areas` |

Flex 章节中的 `g-jc-*`、`g-ai-*`、`g-ac-*`、`g-as-*` 对 Grid 同样有效；Grid 间距使用本仓库 `g-g-*`。Flex 简写值使用 `g-f-{n}`，Grid 列定位使用 `g-gc-{n}`。

显式组合 Mini 后，可以同时使用 `g-grid-cols-*`、`g-col-span-*`、`g-grid-flow-*` 等全名规则。主要对应关系为：

| 本仓库缩写 | Mini | 关系 |
| --- | --- | --- |
| `g-gtc-3` | `g-grid-cols-3` | 均生成 3 列等分轨道 |
| `g-gc-span-2` | `g-col-span-2` | 均跨越 2 列 |
| `g-gaf-rd` | `g-grid-flow-row-dense` | 均使用 `row dense` |

本仓库的 `g-grid`、`g-inline-grid` 都会设置 `box-sizing: border-box`。高级属性后缀使用 `s/e/c/st/b` 表示 start/end/center/stretch/baseline，内容分布增加 `sb/sa/se`；safe 等复杂值写入 `[]`。Mini 全名仍可通过显式组合使用。

## 浮动栅格

浮动栅格与上面的 CSS Grid 工具类相互独立，继续保留 12 列历史布局。

| 类 | 说明 |
| --- | --- |
| `.g-fl-row` | 行容器并清除浮动 |
| `.g-clearfix` | 清除浮动 |
| `.g-w-1/12` … `.g-w-12/12` | 设置 1/12 至 12/12 宽度 |
| `.g-fl-1/12` … `.g-fl-12/12` | 设置宽度并左浮动 |
| `.g-fl` / `.g-fr` | 左浮动 / 右浮动 |

## 尺寸

UnoCSS 属性规则支持裸数字、`[]` 任意值和 `()` CSS Variable：

| 模式 | 说明 |
| --- | --- |
| `g-w-*` / `g-w-[]` / `g-w-()` | 设置宽度 |
| `g-h-*` / `g-h-[]` / `g-h-()` | 设置高度 |
| `g-size-*` / `g-size-[]` / `g-size-()` | 同时设置宽高 |

`full`、`screen` 的区别见前文；`min`、`max`、`fit` 分别表示 `min-content`、`max-content`、`fit-content`。宽度比例使用 `g-w-{part}/{total}`，裸数字只表示配置单位尺寸。

最小和最大尺寸使用 `g-min-w-*`、`g-max-w-*`、`g-min-h-*`、`g-max-h-*`，支持同样的数字、内容关键字、`full/screen`、`[]` 和 `()`。

## 基础布局属性

| 缩写 | CSS 属性 | 静态值 |
| --- | --- | --- |
| `g-op-*` | `opacity` | `0～100` 映射到 `0～1` |
| `g-z-*` | `z-index` | 非负整数 |
| `g-of-*` | `overflow` | `a/h/c/v/s` |
| `g-ofx-*` / `g-ofy-*` | `overflow-x` / `overflow-y` | `a/h/c/v/s` |
| `g-ar-*` | `aspect-ratio` | `square/rectangle` 或正数比例 |

上述规则支持各自适用的 `[]` 和 `()`。`g-ar-square`、`g-ar-rectangle` 分别输出 `1/1`、`16/9`；现有 `g-of-h` 继续包含 `!important`。

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

这里的 `s` 固定表示 `safe-area`，方向后的最后一个 `s` 不是尺寸值。

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
| `.g-lh-0` … `.g-lh-5` | UnoCSS 无单位行高 |

### 文本

| 类 | 说明 |
| --- | --- |
| `.g-ta-l/r/c` | 左 / 右 / 中对齐 |
| `.g-ta-j/s/e` | justify / start / end |
| `.g-ta-ja/mp` | justify-all / match-parent |
| `.g-tdl-lt/ul/ol/n` | 删除线 / 下划线 / 上划线 / 无文本装饰线 |
| `.g-ws-nw` | Sass 与 UnoCSS 均提供的普通不换行规则 |
| `.g-line-nowrap` | 带 `!important` 的不换行语义 |
| `.g-line-wrap` | 使用 `word-break`、`overflow-wrap` 与 `text-wrap` 处理长文本和连续字符 |
| `.g-line-{n}` | 多行截断；Sass 预生成 `1/2`，UnoCSS 支持任意正整数 |
| `.g-tds-*` / `.g-tdc-*` | `text-decoration-style/color` |
| `.g-tdt-*` / `.g-tuo-*` | `text-decoration-thickness` / `text-underline-offset` |
| `.g-va-*` | `vertical-align` |
| `.g-ls-*` / `.g-wsp-*` | `letter-spacing` / `word-spacing` |
| `.g-ws-*` | `white-space` |
| `.g-to-e` / `.g-to-c` | `text-overflow: ellipsis/clip` |
| `.g-truncate` | 单行截断组合 |
| `.g-tt-u/l/c/n` | 大写 / 小写 / 首字母大写 / 不转换 |
| `.g-italic` / `.g-oblique` | 字体 italic / oblique |

UnoCSS 的 Text Align 还支持 `g-ta-[]/()`；所有 Text Align 输出包含 `!important`。`g-ws-nw` 是原子 White Space 规则，`g-line-nowrap` 保留既有强制不换行语义，`g-line-wrap` 和 `g-line-{n}` 是复合文本规则。

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
| `.g-image-{n}` | 固定 width、height、min/max-width 与 line-height |
| `.g-image-circle-{n}` | 固定尺寸并使用 50% 圆角 |
| `.g-image-radius-{n}` | 固定尺寸并使用 4px 圆角 |

### SVG

| 类 | 说明 |
| --- | --- |
| `.g-fill-*` | fill 使用本仓库色板、`none`、任意值或 CSS Variable |
| `.g-stroke-*` | stroke 使用本仓库色板、`none`、任意值或 CSS Variable |
| `.g-stroke-w-*` | `stroke-width` |
| `.g-stroke-dasharray-[]/()` | `stroke-dasharray` |
| `.g-stroke-dashoffset-*` | `stroke-dashoffset` |
| `.g-stroke-cap-s/r/b` | square / round / butt |
| `.g-stroke-join-a/b/c/r/m` | arcs / bevel / miter-clip / round / miter |

## 定位

| 类 | 说明 |
| --- | --- |
| `.g-fixed` | `position: fixed` |
| `.g-relative` | `position: relative` |
| `.g-absolute` | `position: absolute` |
| `.g-fixed-full` | fixed 并设置 `inset: 0` |
| `.g-absolute-full` | absolute 并设置 `inset: 0` |

UnoCSS 额外提供动态边偏移：`g-t-*`、`g-l-*`、`g-b-*`、`g-r-*` 分别对应 `top`、`left`、`bottom`、`right`，支持数字、`[]` 任意值和 `()` CSS Variable。例如 `g-t-8` 为 `top: 8px`，`g-r-(--offset)` 为 `right: var(--offset)`。

`g-b-[...]` 是一个有意保留的特殊分流：值中包含独立 Border Style 关键字时输出普通 `border`，例如 `g-b-[1px_solid_red]` 为 `border: 1px solid red`；否则仍输出 `bottom`。变量名中的 `solid` 不参与匹配。

## 边框、圆角与阴影

| 类 | 说明 |
| --- | --- |
| `.g-bd`、`.g-bdt`、`.g-bdr`、`.g-bdb`、`.g-bdl` | 适配高分屏的全边或单边 1px 边框 |
| `.g-br-circle` | 100% 圆角 |
| `.g-br-default` | 使用主题默认圆角 |
| `.g-br-{n}` | `n` 为 `2, 4, 6, 8, 10, 12, 14, 16, 18, 20` |
| `.g-bsh` / `.g-bsh-t` | 默认阴影 / 顶部阴影 |

> `.g-bd` 使用伪元素实现高清全边框；带后缀的 `g-b-*` 是 UnoCSS 动态规则，表示 Bottom 或上面说明的普通 Border，二者不是同一类边框能力。

### 标准 Border

标准 CSS Border 由 UnoCSS 按需生成，Sass/CSS 预编译包不批量输出以下宽度、样式和颜色规则：

| 模式 | CSS 属性 |
| --- | --- |
| `g-bd-[]/()` | `border` |
| `g-bdt-[]/()` / `g-bdr-[]/()` / `g-bdb-[]/()` / `g-bdl-[]/()` | `border-top/right/bottom/left` |
| `g-bdw/bdtw/bdrw/bdbw/bdlw-*` | 整体或方向 Border Width |
| `g-bds/bdts/bdrs/bdbs/bdls-*` | 整体或方向 Border Style |
| `g-bdc/bdtc/bdrc/bdbc/bdlc-*` | 整体或方向 Border Color |

Width 数字拼接 `unit`，`tn/md/tk` 表示 `thin/medium/thick`；Style 使用 `n/h/dot/dash/s/db/g/r/i/o`；Color 复用本仓库色板。相关规则支持 `[]/()` 且不添加 `!important`。裸 `g-bdr` 表示高清右边框，带动态后缀时表示普通 CSS Border Right。

### Outline

| 缩写 | 属性 |
| --- | --- |
| `g-ol-[]/()` | `outline` 简写 |
| `g-olw-*` | `outline-width` |
| `g-ols-*` | `outline-style` |
| `g-olc-*` | `outline-color` |
| `g-olo-*` | `outline-offset` |

Outline Style 使用 `n/h/dot/dash/s/db/g/r/i/o` 表示 none/hidden/dotted/dashed/solid/double/groove/ridge/inset/outset。颜色复用本仓库色板但不添加 `!important`。

## 显示与辅助类

| 类 | 说明 |
| --- | --- |
| `.g-h-full` / `.g-w-full` / `.g-size-full` | 高度 / 宽度 / 两者为 100% |
| `.g-d-n` / `.g-none` / `.g-hide` | `display: none` |
| `.g-d-b` / `.g-show` / `.g-block` | `display: block` |
| `.g-d-i` / `.g-inline` | `display: inline` |
| `.g-d-ib` / `.g-inline-block` | `display: inline-block` |
| `.g-operable` | 高亮色、14px 字号和 pointer 光标 |
| `.g-pointer` | pointer 光标 |
| `.g-disabled` | 禁用 pointer events |
| `.g-unanimated` | 禁用动画 |
| `.g-scroller` | WebKit 滚动条样式 |
| `.g-divider` | 1px × 12px 的行内分隔线 |
| `.g-dot` | 5px 圆点 |
| `.g-of-h` | `overflow: hidden` |
| `.g-bsz-bb` | `box-sizing: border-box` |

交互属性缩写：

| 缩写 | 属性 | 静态后缀 |
| --- | --- | --- |
| `g-vi-*` | `visibility` | `v/h/c` |
| `g-cu-*` | `cursor` | `a/d/n/p/prog/w/cell/ch/t/m/na/g/gg/zi/zo` |
| `g-pe-*` | `pointer-events` | `a/n` |
| `g-us-*` | `user-select` | `a/all/t/n` |
| `g-re-*` | `resize` | `x/y/b/n` |
| `g-ap-*` | `appearance` | `a/n` |

这些属性均支持 `[]`；适合 CSS Variable 的属性同时支持 `()`。`.g-pointer`、`.g-disabled` 继续作为便捷语义类使用。

## Gap

本仓库 UnoCSS 规则使用 `g-g-*`：

| 模式 | 属性 |
| --- | --- |
| `g-g-*` / `g-g-[]` / `g-g-()` | `gap` |
| `g-cg-*` / `g-cg-[]` / `g-cg-()` | `column-gap` |
| `g-rg-*` / `g-rg-[]` / `g-rg-()` | `row-gap` |

显式组合 Mini 后也可以使用 `g-gap-*`，但它采用 Mini 自身的数值刻度。例如默认配置下，`g-g-4` 为 `4px`，`g-gap-4` 为 `1rem`。
