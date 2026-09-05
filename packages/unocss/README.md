# @deot/style-unocss

`@deot/style-unocss` 为 UnoCSS 项目提供 `@deot/style` 工具类，并组合带相同前缀的 `presetMini`。Preset 按源码中的 token 生成 CSS，不需要再引入 `@deot/style/dist/index.css`。

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

Vite 项目仍需按 UnoCSS 官方方式安装插件并引入 `virtual:uno.css`。`presetStyle` 负责 rules、preflights 和 Variant Group transformer，不改变项目的构建入口。

## 命名约定

> 本仓库的工具类以 CSS 原生语义为基础：直接映射单一 CSS 属性或属性值时，优先使用简短且可识别的缩写，例如 `w`、`h`、`f`、`fs`、`lh`、`ai`、`gtc`；同时设置多个属性或表达完整布局、状态和行为时，优先使用含义清晰的完整名称，例如 `size`、`reset`、`clearfix`。
>
> 部分缩写是有意保留的既有约定，例如 `g-g-*` 表示 `gap`。`fw`、`bs`、`br` 等历史缩写存在多种语义，应根据完整类名判断；本仓库会明确说明其匹配范围，但不会在本版改变已有输出。

## 规则组成

### 本仓库特有

本仓库规则负责现有 `@deot/style` 语义和新增的属性缩写：

- `g-g-*`：Gap。
- `g-f-{n}`、`g-f-{part}/{total}`：Flex 简写值与固定占比。
- `g-grid`、`g-gtc-*`、`g-gtr-*`、`g-gc-*`：Grid 容器、轨道与定位。
- `g-t-*`、`g-l-*`、`g-b-*`、`g-r-*`：定位边偏移。
- `g-pd-*`、`g-fs-*`、`g-lh-*`：Padding、字号和行高。
- `g-ai-*`、`g-jc-*`：Flex 对齐。
- `g-b`、`g-reset`、`g-scroller` 等高清边框和组合工具。
- `g-c-*`、`g-bg-*`、`g-w-*`、`g-h-*`、`g-size-*` 等规则由本仓库定义最终语义。

历史共用缩写需要结合完整 token 判断：

| 缩写 | 语义 |
| --- | --- |
| `g-fw-w/wr/n` | `flex-wrap` |
| `g-fw-1` 至 `g-fw-12` | 十二列宽度并左浮动 |
| `g-fw-13` 至 `g-fw-1000`、`g-fw-bold` | `font-weight` |
| `g-bs`、`g-bs-t` | `box-shadow` |
| `g-bs-bb` | `box-sizing: border-box` |
| `g-b` | 高清全边框 |
| `g-b-{n}`、`g-b-[]/()` | Bottom；`[]` 含 Border Style 时表示普通 Border |
| `g-br` | 右侧高清边框 |
| `g-br-{n}`、`g-br-circle/default` | `border-radius` |

### Mini 特有

`presetMini` 提供本仓库不重复实现的通用能力，例如：

- `g-gap-*`。
- `g-flex-1`、`g-flex-auto`、`g-flex-1/2`。
- `g-inline-grid`、`g-grid-cols-*`、`g-col-span-*`、`g-grid-flow-*` 等 Grid 全名规则。
- transition、transform 等通用规则。
- `hover:`、`focus:`、`dark:` 和响应式 variants。

完整规则见 [UnoCSS Mini 官方文档](https://unocss.dev/presets/mini)。

本 preset 还内置 Variant Group transformer：

```html
<button class="hover:(g-c-white g-bg-black)">Button</button>
```

只启用 `:` 分组，以免 CSS Variable 简写中的 `-(` 被转换；因此不支持 `g-(m-4 pd-8)`。

### 本仓库覆盖 Mini

同一个 token 同时被 Mini 和本仓库识别时，以本仓库语义为准：

| Token | Mini 原语义 | 本仓库最终语义 |
| --- | --- | --- |
| `g-m-4` | `margin: 1rem` | `margin: 4px` |
| `g-w-4` | `width: 1rem` | `width: 4px` |
| `g-flex` | `display: flex` | 增加 `box-sizing: border-box` |
| `g-grid` | `display: grid` | 增加 `box-sizing: border-box` |
| `g-bg-white` | Mini 颜色变量机制 | `background-color: #fff !important` |
| `g-b-1` | `border-width: 1px` | `bottom: 1px` |
| `g-b-[1px_solid_red]` | `border-color: 1px solid red` | `border: 1px solid red` |

以下是并存规则，不属于覆盖关系：

| 本仓库 | Mini | 区别 |
| --- | --- | --- |
| `g-g-4` → `gap: 4px` | `g-gap-4` → `gap: 1rem` | 不同命名、不同数值体系 |
| `g-f-1` → `flex: 1` | `g-flex-1` → `flex: 1 1 0%` | 声明形式不同，通常具有相同计算结果 |
| `g-f-[auto]` → `flex: auto` | `g-flex-auto` → `flex: 1 1 auto` | 简写与展开值 |
| `g-f-1/2` → `flex: 0 0 50%` | `g-flex-1/2` → `flex: 50%` | 固定占比与 Mini Flex 简写 |
| `g-gtc-3` | `g-grid-cols-3` | 均生成 3 列等分轨道 |
| `g-gc-span-2` | `g-col-span-2` | 均跨越 2 列 |
| `g-gaf-rd` | `g-grid-flow-row-dense` | 均使用 `row dense` 自动布局 |

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

> 裸 `g-b` 始终是本仓库的高清伪元素边框，与 `g-b-*` 的动态规则不同。Mini 的 `g-bottom-*` 保持原语义；Mini 原有的 `g-b-{n}` 和 `g-b-[...]` 会被本仓库上述规则覆盖。

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

### Gap

```text
g-g-* / g-g-[] / g-g-()             -> gap
g-g-x-* / g-g-col-*                 -> column-gap
g-g-y-* / g-g-row-*                 -> row-gap
```

### Grid

`@deot/style` 与本 preset 使用同一套 Grid 缩写；Sass 预生成 `1` 至 `12`，UnoCSS 的正整数不限制到 `12`：

| 模式 | CSS 属性或输出 |
| --- | --- |
| `g-grid` | `display: grid; box-sizing: border-box` |
| `g-gtc-*` / `g-gtr-*` | `grid-template-columns/rows: repeat(*, minmax(0, 1fr))` |
| `g-gtc-[]/()` / `g-gtr-[]/()` | 任意行列模板 / CSS Variable |
| `g-gc-*` / `g-gr-*` | `grid-column` / `grid-row` |
| `g-gc-span-*` / `g-gr-span-*` | 跨越指定列数 / 行数；`full` 为 `1 / -1` |
| `g-gcs-*` / `g-gce-*` | `grid-column-start` / `grid-column-end` |
| `g-grs-*` / `g-gre-*` | `grid-row-start` / `grid-row-end` |
| `g-gaf-r/c/d/rd/cd` | `row` / `column` / `dense` / `row dense` / `column dense` |

模板同时支持 `none` 与 `subgrid`。除 span 外，定位规则支持 `[]` 和 `()`，例如：

```text
g-gtc-[72px_minmax(0,_1fr)] -> grid-template-columns: 72px minmax(0, 1fr)
g-gtc-(--tracks)            -> grid-template-columns: var(--tracks)
g-gc-[1/-1]                 -> grid-column: 1 / -1
g-gce-[-1]                  -> grid-column-end: -1
```

现有 `g-jc-*`、`g-ai-*`、`g-ac-*`、`g-as-*` 对 Grid 同样有效；间距继续使用本仓库 `g-g-*` 或 Mini `g-gap-*`。Grid 列定位使用 `g-gc-{n}`；Mini 的 `g-col-span-*`、`g-col-start-*` 等明确 Grid 类仍可使用。`g-inline-grid`、auto tracks、areas、place 和 justify-items/self 等高级能力继续使用 Mini 全名。

### Flex 值与固定占比

`g-f-*` 统一映射 CSS `flex` 属性。裸值只接受非负安全整数；关键字或多段简写使用 `[]`，CSS Variable 使用 `()`：

```text
g-f-1                -> flex: 1
g-f-1/2              -> flex: 0 0 50%
g-f-[1_0_auto]       -> flex: 1 0 auto
g-f-(--layout-flex)  -> flex: var(--layout-flex)
```

Sass 预生成 `g-f-0`、`g-f-1`、`g-f-2`，UnoCSS 支持任意非负安全整数。`g-f-{part}/{total}` 要求 `total > 0` 且 `0 < part <= total`。`flex: 1` 通常按 `flex: 1 1 0%` 计算，并不等于 `flex: 1 0 auto`；需要后者时应使用 `g-f-[1_0_auto]`。

## 配置参数

### `prefix`

默认值为 `'g-'`，语义与 UnoCSS `prefix` 一致，传入值原样作用于 Mini 和本仓库规则：

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

`scale` 只应用于 `g-dot`、`g-divide`、滚动条、默认圆角、阴影、高清边框和主题变量等固定语义尺寸。这与 Sass `$scale` 会同时缩放类名后缀和属性值的行为不同。

### `reset`

默认值为 `true`，输出与 Sass 默认入口一致的 `html`、`body` 和全局 `*` reset：

```ts
presetStyle({ reset: false });
```

关闭后仍保留主题变量、Mini preflight 以及按需生成的 reset 工具。

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
- [工具类参考](../../docs/DOCUMENT.md)
