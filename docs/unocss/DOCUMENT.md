# UnoCSS 工具类参考

本页完整记录 `@deot/style-unocss` 当前自有 [rules](../../packages/unocss/src/rules)，不包含 Mini-only utilities。Sass 预编译范围见 [Style 工具类参考](../style/DOCUMENT.md)；安装、variants 和配置见[概览与配置](../../packages/unocss/README.md)，Mini 同名覆盖见[组合专页](./mini.md)。

## 阅读约定

默认 `prefix: 'g-'`、`unit: 'px'`、`scale: 1`。表中列出关键 CSS 声明；仅标有 `!important` 的规则默认强制优先。复合规则还会设置表内说明的辅助声明、后代或伪元素。

> 直接映射 CSS 属性或属性值时，优先采用简短且可识别的缩写；同时设置多个属性或表达布局、状态、行为时，优先使用完整名称。部分短写有意保留，例如 Gap 的 `g-g-*`、安全区的 `s` 和便捷语义 `g-hide/g-show`。缩写依上下文辨义，不能从相似名字推导未列出的规则。

| 值记号 | 含义 | 示例 |
| --- | --- | --- |
| `{n}` | 非负整数形式；无单位计数通常还要求安全整数，特殊范围见各表 | `g-w-12` → `width: 12px` |
| `{value}` | 表内明确列出的枚举 | `g-ofx-h` → `overflow-x: hidden` |
| `{color}` | 本页色板中的键 | `g-c-white` → `color: #fff !important` |
| `[]` | 非空任意 CSS 值，实际写为 `[值]` | `g-m-[-8px]`、`g-w-[calc(100%_-_1rem)]` |
| `()` | CSS Variable 简写，实际写为 `(--变量名)` | `g-w-(--panel-width)` → `width: var(--panel-width)` |

只有表格标明支持 `[]/()` 的规则才接受这两种形式。裸负数、小数、未列出的关键字不自动匹配；可支持任意值的规则应将它们放入 `[]`。下划线转换为空格，转义下划线保留；变量简写接受 `--` 后的字母、数字、下划线和连字符。任意值不是 CSS 合法性验证器，应传入适合目标属性的值。

数字尺寸拼接 `unit`，不再应用 `scale`；`[]/()` 保持其显式值。比例、计数、无单位属性分别见对应章节。`scale` 只影响主题与组合规则的固定尺寸，详见 README。

当前工具类不包含旧 matcher，历史兼容见 [Deprecated 兼容与迁移](../style/deprecated.md)。

## 基础布局

来源：`rules/other.ts`、`rules/layout.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-d-n`、`g-none`、`g-hide` | `display: none !important` | 固定类 |
| `g-d-b`、`g-show`、`g-block` | `display: block !important` | 固定类 |
| `g-d-i`、`g-inline` | `display: inline !important` | 固定类 |
| `g-d-ib`、`g-inline-block` | `display: inline-block !important` | 固定类 |
| `g-bsz-bb` | `box-sizing: border-box` | 固定类 |
| `g-of-{value}` / `g-ofx-{value}` / `g-ofy-{value}` | `overflow` / `overflow-x` / `overflow-y` | `a/h/c/v/s` → auto/hidden/clip/visible/scroll；也支持 `[]/()` |
| `g-op-{n}` | `opacity: n / 100` | 整数 `0～100`；也支持 `[]/()`，任意值不除以 100 |

`g-of-h` 特别保留 `overflow: hidden !important`；其他 Overflow 声明不含 important。

## Flex、Grid 与对齐

### Flex 容器与子项

来源：`rules/flex.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-flex` | `display: flex; box-sizing: border-box` | 固定类 |
| `g-f-{n}` | `flex: n` | 非负安全整数；也支持 `[]/()`，不拼单位 |
| `g-f-{part}/{total}` | `flex: 0 0 百分比` | 安全整数，`1 ≤ part ≤ total` |
| `g-fb-{n}` | `flex-basis: npx` | 也支持 `auto/full`、`[]/()`；full = 100% |
| `g-fb-{part}/{total}` | `flex-basis: 百分比` | 安全整数，`1 ≤ part ≤ total` |
| `g-fg-{n}` / `g-fsh-{n}` | `flex-grow/shrink: n` | 非负安全整数或 `[]/()`；不拼单位 |
| `g-od-{n}` | `order: n` | 非负安全整数或 `[]/()`；负数写 `g-od-[-1]` |
| `g-od-first` / `g-od-last` / `g-od-default` | `order: -9999/9999/0` | 固定类 |
| `g-flex-holy` | Flex + border-box + `min-height: 100vh; flex-direction: column` | 纵向布局容器 |
| `g-flex-cc` / `g-flex-ac` | Flex + border-box + 双轴/交叉轴居中 | cc 设置 align-items 与 justify-content；ac 只设置 align-items |

`g-f-[1_0_auto]` 直接输出 `flex: 1 0 auto`，不同于 `g-f-1`。`g-f-(--layout-flex)` 则输出 `flex: var(--layout-flex)`。带比例的 `g-f-1/2` 是固定占比，不是弹性权重。Mini 的 `g-flex-*` 与自有 `g-f-*` 的关系统一见[组合专页](./mini.md)。

### 方向与对齐

以下来自 `rules/flex.ts`，只接受列出的静态后缀，不支持 `[]/()`：

| 模式 | CSS 属性 | 后缀 → 值 |
| --- | --- | --- |
| `g-fd-{value}` | `flex-direction` | `r/c/rr/cr` → row/column/row-reverse/column-reverse |
| `g-fwr-{value}` | `flex-wrap` | `w/wr/n` → wrap/wrap-reverse/nowrap |
| `g-jc-{value}` | `justify-content` | `fs/fe/c/sb/sa` → flex-start/flex-end/center/space-between/space-around |
| `g-ai-{value}` | `align-items` | `fs/fe/c/b/s` → flex-start/flex-end/center/baseline/stretch |
| `g-ac-{value}` | `align-content` | `fs/fe/c/sb/sa/s` → flex-start/flex-end/center/space-between/space-around/stretch |
| `g-as-{value}` | `align-self` | `a/fs/fe/c/b/s` → auto/flex-start/flex-end/center/baseline/stretch |

`jc/ai/ac/as` 可用于 Grid。下面来自 `rules/grid.ts` 的对齐规则还支持 `[]/()`，不要混淆两组后缀：

| 模式 | CSS 属性 | 静态后缀 |
| --- | --- | --- |
| `g-ji-{value}` | `justify-items` | `s/e/c/st/b` |
| `g-js-{value}` | `justify-self` | `a/s/e/c/st/b` |
| `g-pc-{value}` | `place-content` | `s/e/c/st/b/sb/sa/se` |
| `g-pi-{value}` | `place-items` | `s/e/c/st/b` |
| `g-ps-{value}` | `place-self` | `a/s/e/c/st` |

`a/s/e/c/st/b` 分别为 auto/start/end/center/stretch/baseline，`sb/sa/se` 为 space-between/space-around/space-evenly。复杂对齐写为 `g-ji-[safe_center]`。

### Grid

来源：`rules/grid.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-grid` / `g-inline-grid` | `display: grid/inline-grid; box-sizing: border-box` | 固定类 |
| `g-gtc-{n}` / `g-gtr-{n}` | `grid-template-columns/rows: repeat(n,minmax(0,1fr))` | 正安全整数、`none/subgrid`、`[]/()` |
| `g-gc-{n}` / `g-gr-{n}` | `grid-column/row: n` | 正安全整数或 `[]/()`；无单位 |
| `g-gc-span-{n}` / `g-gr-span-{n}` | `grid-column/row: span n/span n` | 正安全整数；`full` 为 `1/-1`；无 `[]/()` span 后缀 |
| `g-gcs-{n}` / `g-gce-{n}` | `grid-column-start/end: n` | 正安全整数或 `[]/()` |
| `g-grs-{n}` / `g-gre-{n}` | `grid-row-start/end: n` | 正安全整数或 `[]/()` |
| `g-gaf-{value}` | `grid-auto-flow` | 仅 `r/c/d/rd/cd` → row/column/dense/row dense/column dense |
| `g-gac-{n}` / `g-gar-{n}` | `grid-auto-columns/rows: npx` | 数字、`min/max/fr`、`[]/()` |
| `g-ga-[]` / `g-ga-()` | `grid-area` | 仅任意值和变量 |
| `g-gta-[]` / `g-gta-()` | `grid-template-areas` | 仅任意值和变量 |

`min/max/fr` 分别为 min-content/max-content/minmax(0,1fr)。模板、定位与 span 数字不应用 unit/scale；自动轨道的尺寸数字使用 unit。

```text
g-gtc-[72px_minmax(0,_1fr)] → grid-template-columns: 72px minmax(0, 1fr)
g-gtr-(--tracks) → grid-template-rows: var(--tracks)
g-gc-[1/-1] → grid-column: 1/-1
g-gce-[-1] → grid-column-end: -1
```

## 浮动与栅格

来源：`rules/float.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-fl` / `g-fr` | `float: left/right` | 固定类 |
| `g-fl-{part}/12` | `width: 百分比; float: left` | part 为 `1～12`，分母固定 12 |
| `g-fl-row` | 清除 padding/margin，伪元素清除浮动 | 不等于 CSS Grid |
| `g-clearfix` | 伪元素 display table、content 和 clear both | 不设置宽度 |

## 尺寸

来源：`rules/size.ts`、`rules/layout.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-w-{n}` / `g-h-{n}` | `width/height: npx` | 数字、尺寸关键字、`[]/()` |
| `g-min-w-{n}` / `g-max-w-{n}` | `min/max-width: npx` | 同上；不支持裸分数 |
| `g-min-h-{n}` / `g-max-h-{n}` | `min/max-height: npx` | 同上；不支持裸分数 |
| `g-w-{part}/{total}` | `width: 百分比` | 安全整数，`1 ≤ part ≤ total`；仅 width 提供此形式 |
| `g-ar-{value}` | `aspect-ratio` | `square/rectangle` → 1/1、16/9；正安全整数比例或 `[]/()`，比例可大于 1 |
| `g-size-{n}` | `width: npx; height: npx` | 数字、尺寸关键字、`[]/()` |

尺寸关键字：`full` → 100%，`screen` → 宽轴 100vw / 高轴 100vh，`min/max/fit` → min-content/max-content/fit-content。`auto` 需写入 `[]`。

> `full` 填满包含块，`screen` 填满视口，两种语义有意并存。`g-size-screen` 同时输出 width: 100vw 与 height: 100vh；它不等于两个轴都使用 100vw。

## 间距

来源：`rules/margin.ts`、`rules/padding.ts`、`rules/gap.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-m-{n}` / `g-pd-{n}` | `margin/padding: npx` | 数字或 `[]/()` |
| `g-m-tb-{n}` / `g-pd-tb-{n}` | 上下 margin/padding | 数字或 `[]/()` |
| `g-m-lr-{n}` / `g-pd-lr-{n}` | 左右 margin/padding | 数字或 `[]/()` |
| `g-m-t-{n}` / `g-m-r-{n}` / `g-m-b-{n}` / `g-m-l-{n}` | 单侧 margin | 数字或 `[]/()` |
| `g-pd-t-{n}` / `g-pd-r-{n}` / `g-pd-b-{n}` / `g-pd-l-{n}` | 单侧 padding | 数字或 `[]/()` |
| `g-g-{n}` / `g-cg-{n}` / `g-rg-{n}` | `gap/column-gap/row-gap: npx` | 数字或 `[]/()` |

没有 Sass 的预定义数值集合限制。负 margin 使用 `g-m-[-8px]`；padding 和 gap 的任意值仍需符合对应 CSS 属性约束。自有 Gap 使用 `g-g-*`，不生成也不拦截 Mini 的 `g-gap-*`。

### 安全区

| Token | CSS 输出 |
| --- | --- |
| `g-pd-s` | 四侧 `env(safe-area-inset-*)` |
| `g-pd-tb-s` / `g-pd-lr-s` | 上下 / 左右安全区 |
| `g-pd-t-s` / `g-pd-r-s` / `g-pd-b-s` / `g-pd-l-s` | 单侧安全区 |

`s` 是固定的 safe-area 标识；不拼单位、不应用 scale。

## 定位与层级

来源：`rules/position.ts`、`rules/layout.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-fixed` / `g-relative` / `g-absolute` | `position: fixed/relative/absolute !important` | 固定类 |
| `g-t-{n}` / `g-l-{n}` / `g-b-{n}` / `g-r-{n}` | `top/left/bottom/right: npx` | 数字或 `[]/()`；不应用 scale |
| `g-z-{n}` | `z-index: n` | 非负安全整数或 `[]/()`；无单位 |
| `g-fixed-full` / `g-absolute-full` | 对应 position（important）+ `inset: 0` | 铺满定位包含块 |

只有 `g-b-[...]` 根据值进行 Bottom/Border 分流：解析后包含独立的 none、hidden、dotted、dashed、solid、double、groove、ridge、inset、outset（不区分大小写）时输出普通 `border`；其他值仍输出 `bottom`。

```text
g-t-8 → top: 8px
g-l-[auto] → left: auto
g-b-[-10px] → bottom: -10px
g-r-(--offset) → right: var(--offset)
g-b-[calc(100%_-_10px)] → bottom: calc(100% - 10px)
g-b-[var(--solid-color)] → bottom: var(--solid-color)
g-b-[1px_solid_red] → border: 1px solid red
g-b-[1px_dashed_var(--color)] → border: 1px dashed var(--color)
```

`g-b-(--border)` 始终表示 Bottom 变量，不检查变量的运行时内容；其他三个方向的 `[]` 也不进行 Border 分流。普通 Border 不等于下面的高清伪元素边框。

## 排版与文本

来源：`rules/font-size.ts`、`rules/line-height.ts`、`rules/font-weight.ts`、`rules/text.ts`、`rules/typography.ts`。

### 字号、行高与字重

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-fs-{n}` | `font-size: npx` | 数字或 `[]/()` |
| `g-lh-{n}` | `line-height` | `0～5` 无单位；大于 5 拼 unit；也支持 `[]/()` |
| `g-lh-default` | `line-height: var(--line-height-default)` | 默认 1.5 |
| `g-fw-{n}` / `g-fw-bold` | `font-weight` | 整数 `13～1000` 或 bold；无 `[]/()` |
| `g-italic` / `g-oblique` | `font-style: italic/oblique` | 固定类 |
| `g-not-italic` / `g-not-oblique` | `font-style: normal` | 固定类 |

例如 `g-lh-5` 是无单位 5，`g-lh-6` 是 6px，`g-lh-[1.5]` 是无单位 1.5。字重有效数字范围固定为 13～1000，不从相似属性推导额外范围。

### 单属性文本

| Token 模式 | CSS 属性 | 静态后缀及动态值支持 |
| --- | --- | --- |
| `g-ta-{value}` | `text-align`（important） | `l/r/c/j/s/e/ja/mp` → left/right/center/justify/start/end/justify-all/match-parent；`[]/()` |
| `g-tdl-{value}` | `text-decoration-line` | 仅 `lt/ul/ol/n` → line-through/underline/overline/none |
| `g-tds-{value}` | `text-decoration-style` | `s/db/dot/dash/w` → solid/double/dotted/dashed/wavy；`[]/()` |
| `g-tdc-{color}` | `text-decoration-color` | 色板或 `[]/()`；同时输出 WebKit 前缀 |
| `g-tdt-{n}` / `g-tuo-{n}` | `text-decoration-thickness/text-underline-offset` | 数字拼 unit 或 `[]/()` |
| `g-va-{value}` | `vertical-align` | `t/m/b/base/tt/tb/sub/sup` → top/middle/bottom/baseline/text-top/text-bottom/sub/super；`[]/()` |
| `g-ls-{n}` / `g-wsp-{n}` | `letter-spacing/word-spacing` | 数字拼 unit 或 `[]/()` |
| `g-ws-{value}` | `white-space` | `n/nw/p/pl/pw/bs` → normal/nowrap/pre/pre-line/pre-wrap/break-spaces；`[]/()` |
| `g-to-e` / `g-to-c` | `text-overflow: ellipsis/clip` | 仅固定类 |
| `g-tt-{value}` | `text-transform` | 仅 `u/l/c/n` → uppercase/lowercase/capitalize/none |

文本装饰颜色不含 `!important`；Text Align 含 `!important`，两者不要混淆。

### 文本组合

| Token | CSS 输出或行为 |
| --- | --- |
| `g-truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| `g-line-nowrap` | `white-space: nowrap !important` |
| `g-line-wrap` | `word-break: break-all; overflow-wrap: break-word; text-wrap: wrap` |
| `g-line-{n}` | WebKit box + hidden + ellipsis + line-clamp + 换行与 break-spaces；n 为无前导零的正安全整数 |

`g-line-1` 仍使用 WebKit 多行截断模型，不是 `g-truncate` 的别名。

## 颜色与背景

来源：`rules/color.ts`。

| Token 模式 | CSS 输出 | 支持的值 |
| --- | --- | --- |
| `g-c-{color}` | `color: 值 !important` | 下方色板或 `[]/()` |
| `g-bg-{color}` | `background-color: 值 !important` | 下方色板或 `[]/()` |
| `g-bg-lg-blue` / `g-bg-lg-yellow` | 右向渐变，background 为终点色回退 | 固定 blue/yellow 的 mid → light |

完整色板（也供 Border、Outline、文本装饰和 SVG 使用）：

| 系列 | 键 → 值 |
| --- | --- |
| 红粉 | `red-mid` → #ca1622；`pink-mid` → #fa5a6e；`pink-light` → #fff2ea |
| 蓝 | `blue-dark/blue-mid/blue-light` → #0b76fe/#16a3ff/#6ab4ff |
| 黄 | `yellow-dark/yellow-mid/yellow-light` → #f2c300/#ffd00d/#ffd31c |
| 橙 | `orange-dark/orange-mid/orange-light` → #ef3528/#fa6f60/#fc9780 |
| 灰 | `gray-dark/gray-mid/gray-light` → #edeef0/#f5f6f7/#f7f8fa |
| 紫 | `purple-dark/purple-mid/purple-light` → #8b61f3/#a48efc/#cca3ff |
| 黑白 | `black/white` → #000/#fff；`black-dark/black-mid/black-light` → #2e3136/#636770/#9c9fa6 |
| 三位简写 | `444, 000, 333, 666, 999, aaa, bbb` → 相应三位十六进制色 |
| 两位简写 | `67, f2, f8, ef, cd, e8, d9, f4, f9, 51, bd` → 三次重复，例如 bd 为 #bdbdbd |
| 主题语义 | `info/success/error/warning` → 对应 `var(--color-*)` |

`g-c-[#123456]`、`g-bg-[rgb(0_0_0)]`、`g-c-(--brand)` 可用于动态颜色。未列出的裸颜色名不能依赖本 preset 自动匹配，应写为任意值，例如 `g-c-[red]`。主题变量可以由业务 CSS 覆盖，但不会自动注册业务颜色键。

## 边框、圆角与阴影

来源：`rules/border.ts`、`rules/box-shadow.ts`、`rules/outline.ts`。

### 标准 Border

| Token 模式 | CSS 属性 | 支持的值与限制 |
| --- | --- | --- |
| `g-bd-[]` / `g-bd-()` | `border` | 完整简写或变量 |
| `g-bdt-[]` / `g-bdr-[]` / `g-bdb-[]` / `g-bdl-[]` | `border-top/right/bottom/left` | 同时支持对应 `()` |
| `g-bdw-{n}` / `g-bdtw-{n}` / `g-bdrw-{n}` / `g-bdbw-{n}` / `g-bdlw-{n}` | 整体/方向 `border-width` | 数字拼 unit、`tn/md/tk` → thin/medium/thick、`[]/()` |
| `g-bds-{value}` / `g-bdts-{value}` / `g-bdrs-{value}` / `g-bdbs-{value}` / `g-bdls-{value}` | 整体/方向 `border-style` | 下方样式后缀或 `[]/()` |
| `g-bdc-{color}` / `g-bdtc-{color}` / `g-bdrc-{color}` / `g-bdbc-{color}` / `g-bdlc-{color}` | 整体/方向 `border-color` | 色板或 `[]/()` |

样式后缀：`n/h/dot/dash/s/db/g/r/i/o` → none/hidden/dotted/dashed/solid/double/groove/ridge/inset/outset。标准 Border 均不加 important，也不缩放动态值。

### 圆角、阴影与高清边框

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-br-{n}` | `border-radius: npx` | 仅非负整数形式，不支持 `[]/()` |
| `g-br-circle` / `g-br-default` | `border-radius: 100% / var(--border-radius-default) !important` | default 默认 8px |
| `g-bsh` / `g-bsh-t` | box-shadow 引用默认/顶部主题阴影变量 | 仅固定类 |
| `g-bd` / `g-bdt` / `g-bdr` / `g-bdb` / `g-bdl` | 全边/上/右/下/左高清伪元素边框 | relative + translateZ(0)，2x/3x 媒体查询缩放 |

高清边框上/左使用 `::before`，其余使用 `::after`，颜色取 `--border-color-default`。固定细边框尺寸和主题尺寸应用 scale；它们不是标准 Border 简写。裸 `g-bdr` 是高清右边框，`g-bdr-[1px_solid_red]` 是标准右边框，`g-br-8` 是圆角。

### Outline

| Token 模式 | CSS 属性 | 支持的值与限制 |
| --- | --- | --- |
| `g-ol-[]` / `g-ol-()` | `outline` | 仅简写任意值或变量 |
| `g-olw-{n}` / `g-olo-{n}` | `outline-width/outline-offset` | 数字拼 unit 或 `[]/()`；负 offset 写 `[]` |
| `g-ols-{value}` | `outline-style` | 与 Border 相同的样式后缀或 `[]/()` |
| `g-olc-{color}` | `outline-color` | 色板或 `[]/()`；无 important |

Outline Width 不提供 Border Width 的裸关键字缩写；需要关键字时放入 `[]`。

## 图片与 SVG

来源：`rules/image.ts`、`rules/svg.ts`。

| Token 模式 | CSS 输出 | 支持的值与限制 |
| --- | --- | --- |
| `g-image-{n}` | width、height、min/max-width、line-height 均为 npx | 仅非负整数形式，不支持 `[]/()` |
| `g-image-circle-{n}` | 图片复合尺寸 + 50% 圆角 | 同上 |
| `g-image-radius-{n}` | 图片复合尺寸 + 默认 4px 圆角 | 图片数字不缩放，固定圆角应用 scale |
| `g-fill-{color}` / `g-stroke-{color}` | `fill/stroke` | 色板或 `[]/()`；无 important |
| `g-fill-n` / `g-stroke-n` | `fill/stroke: none` | 固定类 |
| `g-stroke-w-{n}` / `g-stroke-dashoffset-{n}` | `stroke-width/stroke-dashoffset: npx` | 数字或 `[]/()`；负值放入 `[]` |
| `g-stroke-dasharray-[]` / `g-stroke-dasharray-()` | `stroke-dasharray` | 仅任意值或变量 |
| `g-stroke-cap-{value}` | `stroke-linecap` | 仅 `s/r/b` → square/round/butt |
| `g-stroke-join-{value}` | `stroke-linejoin` | 仅 `a/b/c/r/m` → arcs/bevel/miter-clip/round/miter |

## 交互、状态与辅助类

来源：`rules/interaction.ts`、`rules/other.ts`。

| Token 模式 | CSS 属性 | 静态后缀 → 值 |
| --- | --- | --- |
| `g-vi-{value}` | `visibility` | `v/h/c` → visible/hidden/collapse |
| `g-cu-{value}` | `cursor` | `a/d/n/p/prog/w/cell/ch/t/m/na/g/gg/zi/zo` → auto/default/none/pointer/progress/wait/cell/crosshair/text/move/not-allowed/grab/grabbing/zoom-in/zoom-out |
| `g-pe-{value}` | `pointer-events` | `a/n` → auto/none |
| `g-us-{value}` | `user-select` | `a/all/t/n` → auto/all/text/none；含 WebKit 前缀 |
| `g-re-{value}` | `resize` | `x/y/b/n` → horizontal/vertical/both/none |
| `g-ap-{value}` | `appearance` | `a/n` → auto/none；含 WebKit 前缀 |

上述六组均支持 `[]/()`，不接受其他裸值。

| Token | CSS 输出或行为 |
| --- | --- |
| `g-pointer` | `cursor: pointer !important`，不同于普通 `g-cu-p` |
| `g-disabled` | `pointer-events: none`；不替代 HTML disabled |
| `g-unanimated` | `animation: 0 !important`，不关闭 transition |
| `g-operable` | 14px 字号、主题高亮色（important）和 pointer 光标 |
| `g-scroller` | WebKit 滚动条：宽 4px、横向高 2px、轨道/滑块圆角 5px及主题颜色 |
| `g-divider` | 1px × 12px、左右 margin 8px、#ccc 背景、relative、inline-block、middle、border-box |
| `g-dot` | block、5px × 5px、50% 圆角；颜色自行组合 |

这里的固定尺寸随 unit/scale 变化；Display 便捷类见“基础布局”。

## Reset 与全局输出

来源：`rules/reset.ts` 与 `preflights/`。preflight 不依赖 token 出现；工具类按需生成。

| 类型 | 输出与边界 |
| --- | --- |
| 主题 preflight | `:root` 默认主题变量，保留供颜色、圆角、边框、阴影与组合类使用 |
| reset preflight | html/body 基础样式和全局通配符 reset，默认开启；`reset: false` 关闭这一整组 |
| `g-reset` | 处理后代列表、链接、图片、`.inline`、i/b/span、输入框和按钮默认表现 |
| `g-unset` | 恢复富文本标题、段落、列表；列表固定为 40px 左内边距、1em 上下外边距，不应用 unit/scale |

`reset: false` 不关闭主题变量，也不移除 `g-reset/g-unset` matcher。独立使用没有 Mini `--un-*` 初始化 preflight；显式组合时的控制方式见[Mini 专页](./mini.md)。
