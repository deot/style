# @deot/style-unocss

`@deot/style-unocss` 为 UnoCSS 项目提供 `@deot/style` 工具类。Preset 按源码中的 token 生成 CSS，不需要再引入 `@deot/style/dist/index.css`；默认不包含 Mini rules，但会通过官方公开入口复用 Mini variants、breakpoints 和任意 Variant 提取器。

> 下一主版本不再内置 `presetMini()` 的 rules 与 preflight。原先使用 Mini-only token 的项目请阅读[与 UnoCSS Mini 组合](../../docs/unocss-mini.md)。

## 安装与配置

```bash
pnpm add -D unocss @deot/style-unocss
```

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetStyle } from '@deot/style-unocss';

export default defineConfig({
	presets: [presetStyle()]
});
```

Vite 项目仍需按 UnoCSS 官方方式安装插件并引入 `virtual:uno.css`。`presetStyle` 负责本仓库 rules、preflights、Mini variants 和 Variant Group transformer，不改变项目的构建入口。

## 命名约定

> 本仓库的工具类以 CSS 原生语义为基础：直接映射单一 CSS 属性或属性值时，优先使用简短且可识别的缩写，例如 `w`、`h`、`f`、`fs`、`lh`、`ai`、`gtc`；同时设置多个属性或表达完整布局、状态和行为时，优先使用含义清晰的完整名称，例如 `size`、`reset`、`clearfix`。
>
> 一个缩写在最新规则中只归属一个属性，例如 `fw` 只表示 `font-weight`、`fwr` 表示 `flex-wrap`、`bsh` 表示 `box-shadow`。部分无歧义短写会有意保留，例如 `g-g-*` 表示 Gap、Padding Safe Area 中的 `s` 表示 `safe-area`。

## 规则组成

### 本仓库特有

本仓库规则负责现有 `@deot/style` 语义和新增的属性缩写：

- `g-g-*`、`g-cg-*`、`g-rg-*`：Gap、Column Gap、Row Gap。
- `g-f-{n}`、`g-f-{part}/{total}`：Flex 简写值与固定占比。
- `g-fwr-*`、`g-fl-{part}/12`、`g-fl-row`：Flex Wrap 与浮动十二列栅格。
- `g-grid`、`g-gtc-*`、`g-gtr-*`、`g-gc-*`：Grid 容器、轨道与定位。
- `g-t-*`、`g-l-*`、`g-b-*`、`g-r-*`：定位边偏移。
- `g-pd-*`、`g-fs-*`、`g-lh-*`、`g-line-{n}`：Padding、字号、行高和多行截断。
- `g-ai-*`、`g-jc-*`：Flex 对齐。
- `g-op-*`、`g-z-*`、`g-of*`、`g-ar-*`：透明度、层级、溢出与宽高比。
- `g-vi-*`、`g-cu-*`、`g-pe-*`、`g-us-*`、`g-re-*`、`g-ap-*`：显示和交互属性。
- `g-ol*`、`g-tdl*`、`g-tds*`、`g-tdc*`、`g-tdt*`、`g-tuo*`：Outline 与文本装饰属性。
- `g-fill-*`、`g-stroke-*`：SVG 填充和描边。
- `g-bd`、`g-bdt`、`g-bdr`、`g-bdb`、`g-bdl`：高清全边框和方向边框。
- `g-bd*`：标准 Border 简写、宽度、样式与颜色。
- `g-ta-*`：Text Align。
- `g-d-*`、`g-bsh*`、`g-bsz-*`：Display、Box Shadow 与 Box Sizing。
- `g-reset`、`g-scroller`、`g-divider` 等组合工具。
- `g-image-*`、`g-image-circle-*`、`g-image-radius-*`：图片复合尺寸。
- `g-c-*`、`g-bg-*`、`g-w-*`、`g-h-*`、`g-size-*` 等规则由本仓库定义最终语义。

`g-b-{n}` 与 `g-b-[]/()` 表示 Bottom；其中 `[]` 含 Border Style 时表示普通 Border。高清边框使用 `g-bd/g-bdt/g-bdr/g-bdb/g-bdl`，`g-br-*` 表示 Border Radius。

### Mini Variants 与 Rules 边界

本 preset 通过 UnoCSS 官方公开入口复用 Mini variants、breakpoints 和任意 Variant 提取器，因此 `hover:`、`focus:`、`dark:`、`md:` 等响应式、group/peer、aria/data、任意 container、layer 与 `[&>*]:` 等写法可以直接作用于本仓库 rules。除 breakpoints 外，不注入 Mini 的 colors、spacing、containers 等 theme 内容。

Mini rules 与 Mini preflight 不再内置。`g-gap-*`、`g-flex-*`、Grid 全名、transition 和 transform 等能力需要由项目显式组合 `presetMini()`。完整配置、来源划分和冲突结果见[与 UnoCSS Mini 组合](../../docs/unocss-mini.md)。

本 preset 仍内置 Variant Group transformer：

```html
<button class="hover:(g-c-white g-bg-black)">Button</button>
```

只启用 `:` 分组，以免 CSS Variable 简写中的 `-(` 被转换；因此不支持 `g-(m-4 pd-8)`。

### 显式组合 Mini

组合 Mini 时使用相同前缀，并关闭本 preset 重复的 variants：

```ts
import { defineConfig, presetMini } from 'unocss';
import { presetStyle } from '@deot/style-unocss';

export default defineConfig({
	presets: [
		presetMini({ prefix: 'g-', dark: 'class' }),
		presetStyle({ prefix: 'g-', variants: false })
	]
});
```

本 preset 使用 `enforce: 'post'`，同一个 token 被两边识别时以本仓库语义为准。完整覆盖表见[与 UnoCSS Mini 组合](../../docs/unocss-mini.md)。

## 动态值

本仓库的属性规则支持三种值形式：

| 形式 | 含义 | 示例 |
| --- | --- | --- |
| `{n}` | 非负整数；具体语义由规则决定 | `g-w-12` → `width: 12px` |
| `[...]` | 任意 CSS 值 | `g-w-[50%]` → `width: 50%` |
| `(--*)` | CSS Variable 简写 | `g-w-(--panel-width)` → `width: var(--panel-width)` |

负数、小数和复杂表达式使用 `[]`：

```html
<div class="g-m-[-8px] g-w-[calc(100%_-_1rem)]" />
```

`[]` 使用 UnoCSS 的下划线空格约定；`()` 只接受以 `--` 开头的 CSS Variable 名。尺寸和间距裸数字会拼接 `unit`；Flex 与 Grid 数字分别表示 `flex` 值和轨道、网格线或跨度，不拼接单位。三种形式均不会被 `scale` 二次缩放。

### Position

```text
g-t-8                         -> top: 8px
g-l-[auto]                    -> left: auto
g-b-[-10px]                   -> bottom: -10px
g-r-(--offset)                -> right: var(--offset)
g-b-[calc(100%_-_10px)]       -> bottom: calc(100% - 10px)
g-b-[1px_solid_red]           -> border: 1px solid red
g-b-[1px_dashed_var(--color)] -> border: 1px dashed var(--color)
```

裸数字拼接 `unit`，不应用 `scale`；负数、小数、关键字和复杂表达式使用 `[]`。只有 `g-b-[...]` 会检查解析后的值：包含独立的 `none`、`hidden`、`dotted`、`dashed`、`solid`、`double`、`groove`、`ridge`、`inset` 或 `outset` 时输出普通 CSS `border`，否则输出 `bottom`。因此变量名中的 `solid` 不会误判；`g-b-[var(--solid-color)]` 仍表示 `bottom`。

> `g-bd` 是本仓库的高清伪元素全边框，与 `g-b-*` 的动态规则不同。显式组合 Mini 后，Mini 的 `g-bottom-*` 保持原语义；Mini 的 `g-b-{n}` 和 `g-b-[...]` 会被本仓库上述规则覆盖。

### 颜色

```text
g-c-[#123456]       -> color: #123456 !important
g-c-(--brand)       -> color: var(--brand) !important
g-bg-[rgb(0_0_0)]   -> background-color: rgb(0 0 0) !important
g-bg-(--surface)    -> background-color: var(--surface) !important
```

固定色板中的 `g-c-white`、`g-bg-blue-mid`、`g-c-info` 等类保持原语义。

### 尺寸

```text
g-w-* / g-w-[] / g-w-()             -> width
g-h-* / g-h-[] / g-h-()             -> height
g-size-* / g-size-[] / g-size-()    -> width + height
```

> `full` 表示填满当前包含块，使用 `100%`；`screen` 表示填满浏览器视口，按轴使用 `100vw` 或 `100vh`。宽度、高度和宽高组合规则会同时提供这两类语义，它们是有意并存的能力，不是互相替代的别名。
>
> - `g-w-full` / `g-h-full`：单轴填满包含块。
> - `g-size-full`：宽高均填满包含块。
> - `g-w-screen` / `g-h-screen`：单轴填满视口。
> - `g-size-screen`：宽高分别使用 `100vw` 和 `100vh`。

内容尺寸还支持 `min`、`max`、`fit`，分别映射到 `min-content`、`max-content`、`fit-content`。

最小和最大尺寸沿用 CSS 属性顺序：

```text
g-min-w-4 / g-max-w-4       -> min-width / max-width: 4px
g-min-h-full                -> min-height: 100%
g-max-h-screen              -> max-height: 100vh
g-min-w-[] / g-min-w-()     -> 任意值 / CSS Variable
```

### 基础布局

| 本仓库缩写 | CSS 属性 | 值 |
| --- | --- | --- |
| `g-op-*` | `opacity` | `0～100` 映射到 `0～1`，或 `[]/()` |
| `g-z-*` | `z-index` | 非负整数，或 `[]/()` |
| `g-of-*` | `overflow` | `a/h/c/v/s`，或 `[]/()` |
| `g-ofx-*` / `g-ofy-*` | `overflow-x/y` | `a/h/c/v/s`，或 `[]/()` |
| `g-ar-*` | `aspect-ratio` | `square/rectangle`、正数比例、`[]/()` |

`a/h/c/v/s` 分别表示 `auto/hidden/clip/visible/scroll`；`g-ar-square`、`g-ar-rectangle` 分别表示 `1/1`、`16/9`。现有 `g-of-h` 继续输出 `overflow: hidden !important`。

宽度分数使用：

```text
g-w-1/12  -> width: 8.3333333333%
g-w-7/12  -> width: 58.3333333333%
g-w-12/12 -> width: 100%
```

`part` 和 `total` 必须大于等于 `1`，且 `part` 不能大于 `total`。`g-w-{n}` 只表示带配置单位的尺寸，不再表示十二列比例。

### 间距、字号与行高

Margin 和 Padding 的所有方向都支持数值、`[]` 和 `()`：

```text
g-m-4              -> margin: 4px
g-m-l-(--offset)   -> margin-left: var(--offset)
g-pd-tb-[1rem]     -> padding-top/bottom: 1rem
```

字号使用 `g-fs-*`；行高使用 `g-lh-*`。`g-lh-0` 至 `g-lh-5` 为无单位行高，大于 `5` 的整数使用配置单位。

Padding Safe Area 继续使用 `s` 作为固定短值，例如 `g-pd-s`、`g-pd-t-s` 和 `g-pd-tb-s`；这里的 `s` 表示 `safe-area`。

### Gap

```text
g-g-* / g-g-[] / g-g-()       -> gap
g-cg-* / g-cg-[] / g-cg-()    -> column-gap
g-rg-* / g-rg-[] / g-rg-()    -> row-gap
```

### Grid

`@deot/style` 与本 preset 使用同一套 Grid 缩写；Sass 预生成 `1` 至 `12`，UnoCSS 的正整数不限制到 `12`：

| 模式 | CSS 属性或输出 |
| --- | --- |
| `g-grid` | `display: grid; box-sizing: border-box` |
| `g-inline-grid` | `display: inline-grid; box-sizing: border-box` |
| `g-gtc-*` / `g-gtr-*` | `grid-template-columns/rows: repeat(*, minmax(0, 1fr))` |
| `g-gtc-[]/()` / `g-gtr-[]/()` | 任意行列模板 / CSS Variable |
| `g-gc-*` / `g-gr-*` | `grid-column` / `grid-row` |
| `g-gc-span-*` / `g-gr-span-*` | 跨越指定列数 / 行数；`full` 为 `1 / -1` |
| `g-gcs-*` / `g-gce-*` | `grid-column-start` / `grid-column-end` |
| `g-grs-*` / `g-gre-*` | `grid-row-start` / `grid-row-end` |
| `g-gaf-r/c/d/rd/cd` | `row` / `column` / `dense` / `row dense` / `column dense` |
| `g-gac-*` / `g-gar-*` | `grid-auto-columns` / `grid-auto-rows` |
| `g-ji-*` / `g-js-*` | `justify-items` / `justify-self` |
| `g-pc-*` / `g-pi-*` / `g-ps-*` | `place-content/items/self` |
| `g-ga-[]/()` / `g-gta-[]/()` | `grid-area` / `grid-template-areas` |

模板同时支持 `none` 与 `subgrid`。除 span 外，定位规则支持 `[]` 和 `()`，例如：

```text
g-gtc-[72px_minmax(0,_1fr)] -> grid-template-columns: 72px minmax(0, 1fr)
g-gtc-(--tracks)            -> grid-template-columns: var(--tracks)
g-gc-[1/-1]                 -> grid-column: 1 / -1
g-gce-[-1]                  -> grid-column-end: -1
```

Grid 高级属性的值缩写使用 `s/e/c/st/b` 表示 `start/end/center/stretch/baseline`，内容分布增加 `sb/sa/se`。safe 等复杂值使用 `[]`。`g-gac-*`、`g-gar-*` 还支持 `min/max/fr`、尺寸数字和动态值。

现有 `g-jc-*`、`g-ai-*`、`g-ac-*`、`g-as-*` 对 Grid 同样有效；本仓库间距使用 `g-g-*`，Grid 列定位使用 `g-gc-{n}`。`g-gap-*`、`g-col-span-*` 等 Mini 全名只有在项目显式组合 Mini 后才可使用。

### Flex 值与固定占比

`g-f-*` 统一映射 CSS `flex` 属性。裸值只接受非负安全整数；关键字或多段简写使用 `[]`，CSS Variable 使用 `()`：

```text
g-f-1                -> flex: 1
g-f-1/2              -> flex: 0 0 50%
g-f-[1_0_auto]       -> flex: 1 0 auto
g-f-(--layout-flex)  -> flex: var(--layout-flex)
```

Sass 预生成 `g-f-0`、`g-f-1`、`g-f-2`，UnoCSS 支持任意非负安全整数。`g-f-{part}/{total}` 要求 `total > 0` 且 `0 < part <= total`。`flex: 1` 通常按 `flex: 1 1 0%` 计算，并不等于 `flex: 1 0 auto`；需要后者时应使用 `g-f-[1_0_auto]`。

Flex 子项使用：

| 本仓库缩写 | CSS 属性 | 说明 |
| --- | --- | --- |
| `g-fb-*` | `flex-basis` | 数字使用 `unit`；支持 `auto/full`、比例和 `[]/()` |
| `g-fg-*` | `flex-grow` | 无单位数字或 `[]/()` |
| `g-fsh-*` | `flex-shrink` | 无单位数字或 `[]/()`；避免与 `g-fs-*` 字号冲突 |
| `g-od-*` | `order` | 数字或 `[]/()`；`first/last/default` 为 `-9999/9999/0` |

### 交互属性

| 缩写 | 属性 | 静态后缀 |
| --- | --- | --- |
| `g-vi-*` | `visibility` | `v/h/c` |
| `g-cu-*` | `cursor` | `a/d/n/p/prog/w/cell/ch/t/m/na/g/gg/zi/zo` |
| `g-pe-*` | `pointer-events` | `a/n` |
| `g-us-*` | `user-select` | `a/all/t/n` |
| `g-re-*` | `resize` | `x/y/b/n` |
| `g-ap-*` | `appearance` | `a/n` |

这些规则均支持 `[]`；适合变量的属性同时支持 `()`。`g-pointer` 和 `g-disabled` 作为既有组合语义继续保留。

### Outline、文本与 SVG

| 缩写 | 属性或语义 |
| --- | --- |
| `g-ol-[]/()` | `outline` 简写 |
| `g-olw-*` / `g-ols-*` / `g-olc-*` / `g-olo-*` | Outline width/style/color/offset |
| `g-ta-l/r/c/j/s/e/ja/mp` | Text Align 的标准静态值 |
| `g-ta-[]/()` | Text Align 任意值 / CSS Variable |
| `g-tdl-*` / `g-tds-*` / `g-tdc-*` / `g-tdt-*` / `g-tuo-*` | 文本装饰各子属性 |
| `g-va-*` / `g-ls-*` / `g-wsp-*` / `g-ws-*` | vertical-align、letter/word-spacing、white-space |
| `g-to-e/c` / `g-truncate` / `g-tt-*` | 文本溢出、单行截断与大小写转换 |
| `g-fill-*` / `g-stroke-*` | SVG 填充与描边 |

`g-tdl-lt/ul/ol/n` 分别表示 line-through、underline、overline、none；`g-line-{n}` 使用正整数生成多行截断。Outline Style 后缀 `n/h/dot/dash/s/db/g/r/i/o` 对应标准样式；SVG 还提供 `g-stroke-w-*`、`g-stroke-dasharray-[]/()`、`g-stroke-dashoffset-*`、`g-stroke-cap-*`、`g-stroke-join-*`。Outline、文本装饰和 SVG 颜色复用本仓库色板但不添加 `!important`。

### Border

高清边框使用 `g-bd/g-bdt/g-bdr/g-bdb/g-bdl`。标准 CSS Border 只由 UnoCSS 动态生成，按“`bd` + 方向 + 子属性”连续缩写：

| 模式 | CSS 属性 |
| --- | --- |
| `g-bd-[]/()` | `border` |
| `g-bdt-[]/()` / `g-bdr-[]/()` / `g-bdb-[]/()` / `g-bdl-[]/()` | 四个方向的 Border 简写 |
| `g-bdw-*` / `g-bdtw-*` / `g-bdrw-*` / `g-bdbw-*` / `g-bdlw-*` | 整体或方向 `border-width` |
| `g-bds-*` / `g-bdts-*` / `g-bdrs-*` / `g-bdbs-*` / `g-bdls-*` | 整体或方向 `border-style` |
| `g-bdc-*` / `g-bdtc-*` / `g-bdrc-*` / `g-bdbc-*` / `g-bdlc-*` | 整体或方向 `border-color` |

Width 数字使用 `unit` 且不应用 `scale`，`tn/md/tk` 分别表示 `thin/medium/thick`。Style 使用 `n/h/dot/dash/s/db/g/r/i/o`；Color 复用本仓库色板。所有子属性均支持适用的 `[]/()`，且不添加 `!important`。裸 `g-bdr` 表示高清右边框，带动态后缀时表示普通 CSS Border Right。

## 配置参数

### `prefix`

默认值为 `'g-'`，语义与 UnoCSS `prefix` 一致，传入值原样作用于本仓库规则和 Mini tagged variants 的标记类：

```ts
presetStyle({ prefix: 'x-' });
// x-flex、x-fs-14、x-g-4
```

传入空字符串可生成无前缀类。

### `unit`

默认值为 `'px'`。数值 token 直接拼接配置单位：

```ts
presetStyle({ unit: 'rem' });
// g-fs-14 -> font-size: 14rem
// g-pd-8  -> padding: 8rem
// g-w-4   -> width: 4rem
```

### `scale`

默认值为 `1`。动态 token 已经表达最终值，因此不应用 `scale`：

```ts
presetStyle({ unit: 'rem', scale: 2 });
// g-fs-14 -> font-size: 14rem
// g-w-4   -> width: 4rem
```

`scale` 只应用于 `g-dot`、`g-divider`、滚动条、默认圆角、阴影、高清边框和主题变量等固定语义尺寸。这与 Sass `$scale` 会同时缩放类名后缀和属性值的行为不同。

### `reset`

默认值为 `true`，输出与 Sass 默认入口一致的 `html`、`body` 和全局 `*` reset：

```ts
presetStyle({ reset: false });
```

关闭后仍保留本仓库主题变量和按需生成的 reset 工具。独立使用时不会输出 Mini preflight；显式组合 Mini 后，其 preflight 由 `presetMini()` 自身控制。

### `variants`

默认值为 `true`，启用 Mini 官方 variants、breakpoints 与任意 Variant 提取器。显式组合 `presetMini()` 时设置为 `false`，由外部 Mini 统一提供这些能力：

```ts
presetStyle({ variants: false });
```

`dark` 默认使用 `class`，也支持 `media` 和自定义 selectors；`attributifyPseudo` 默认是 `false`，`arbitraryVariants` 默认是 `true`。这些选项与 `prefix`、`unit`、`scale`、`reset` 一样，也可以通过 `UNOCSS_OPTIONS` 提供。

## `UNOCSS_OPTIONS`

参数也可以由运行 UnoCSS 的 Node 进程通过 JSON 环境变量提供：

```bash
UNOCSS_OPTIONS='{"prefix":"g-","unit":"rem","scale":2,"reset":true}' npm run dev
```

显式传给 `presetStyle()` 的参数优先。Preset 在加载 `uno.config.ts` 时读取 `process.env`；不使用主要面向应用源码的 `import.meta.env`。

同一个 UnoCSS generator 不能让同名 token 同时使用两套单位或缩放。多入口项目应为 mobile、manage 等目标启动独立进程，并分别设置 `UNOCSS_OPTIONS`。

## 动态类名与 safelist

UnoCSS 只能提取源码中静态出现的完整 token。以下运行时拼接不会自动生成：

```vue
<div :class="`g-fs-${size}`" />
```

应改为静态映射，或加入 safelist：

```ts
export default defineConfig({
	presets: [presetStyle()],
	safelist: [12, 14, 16].map(size => `g-fs-${size}`)
});
```

## 与 Sass/CSS 的边界

- 按使用情况生成工具类时使用 `@deot/style-unocss`，不要同时引入完整的 `@deot/style` CSS。
- 需要 Sass 函数、mixin、主题 map 或 rem/rpx 静态产物时继续使用 `@deot/style`。
- 业务项目私有的 `g-*` 类不属于本 preset 的公共规则。

## 相关文档

- [选择与安装](../../docs/getting-started.md)
- [接入与迁移](../../docs/integration.md)
- [与 UnoCSS Mini 组合](../../docs/unocss-mini.md)
- [工具类参考](../../docs/DOCUMENT.md)
