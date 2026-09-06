# 与 UnoCSS Mini 组合

`@deot/style-unocss` 默认只提供本仓库规则和 preflights，不再内置 `presetMini()` 的 rules、完整 theme 与 preflight。它仍通过 UnoCSS 官方公开入口复用 Mini variants、breakpoints 和任意 Variant 提取器，因此独立使用时可以继续写 `hover:`、`dark:`、`md:` 等响应式、group/peer、aria/data、任意 container、layer 与 `[&>*]:` 等 variants。

> 本 preset 只注入 Mini breakpoints，以保留 `sm:`、`md:` 等命名响应式能力；不注入 colors、spacing、containers 等其余 Mini theme 内容。`@[640px]:` 等任意值写法同样可用。

> 这是下一主版本的破坏性变更：此前依赖内置 Mini rules 的项目需要改用本仓库 token，或按本文显式组合 `presetMini()`。

本 preset 已移除 deprecated matcher，旧名可能落到 Mini 的其他规则；额外加载兼容 CSS 也不能消除全部属性冲突。旧类应按 [Deprecated 迁移](./deprecated.md)优先替换。

Variant Group transformer 也仍由本 preset 提供：

```html
<button class="hover:(g-c-white g-bg-black)">Button</button>
```

完整 variants 语法参考 [UnoCSS Mini](https://unocss.dev/presets/mini)，分组语法参考 [Variant Group](https://unocss.dev/transformers/variant-group)。

## 独立使用

```ts
import { defineConfig } from 'unocss';
import { presetStyle } from '@deot/style-unocss';

export default defineConfig({
	presets: [presetStyle()]
});
```

这种方式只生成本仓库定义的 `g-*` rules。`g-gap-*`、`g-flex-*`、`g-grid-cols-*`、`g-bottom-*`、transition 和 transform 等 Mini-only utilities 不会生成。本仓库已经直接提供 `g-inline-grid`、`g-min-h-screen` 以及下文列出的属性缩写。

## 显式组合 Mini

需要 Mini rules 时，将两个 preset 显式组合：

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

- 两个 preset 必须使用相同的 `prefix`，否则会形成两套工具类命名空间。
- `presetStyle({ variants: false })` 会同时关闭其 Mini variants、breakpoints 和任意 Variant 提取器，由外部 `presetMini()` 独占这些能力，避免同名 `dark:` 等 variants 受 preset 顺序影响。
- Mini preflight 应保持开启；transform、ring、shadow 等 Mini rules 依赖其中初始化的 `--un-*` 变量。
- `presetStyle` 保留 Variant Group transformer，不需要在项目中再次添加。
- `presetStyle` 使用 `enforce: 'post'`，因此无论两个 preset 的书写顺序如何，同名 token 最终都采用本仓库语义。仍建议按示例顺序书写，以便直接看出“Mini 提供通用规则，本仓库执行覆盖”。

## 规则来源与最终输出

以下采用默认 `prefix: 'g-'`、`unit: 'px'`、`scale: 1`：

| 分类与 Token | 仅本仓库 | 仅 Mini | 组合后的最终输出 |
| --- | --- | --- | --- |
| 覆盖：`g-m-4` | `margin: 4px` | `margin: 1rem` | `margin: 4px` |
| 覆盖：`g-w-4` | `width: 4px` | `width: 1rem` | `width: 4px` |
| 覆盖：`g-flex` | `display: flex; box-sizing: border-box` | `display: flex` | 本仓库输出 |
| 覆盖：`g-grid` | `display: grid; box-sizing: border-box` | `display: grid` | 本仓库输出 |
| 覆盖：`g-inline-grid` | `display: inline-grid; box-sizing: border-box` | `display: inline-grid` | 本仓库输出 |
| 覆盖：`g-min-h-screen` | `min-height: 100vh` | `min-height: 100vh` | 本仓库输出 |
| 覆盖：`g-op-50` | `opacity: 0.5` | `opacity: 0.5` | 本仓库输出 |
| 覆盖：`g-fill-black` | `fill: #000` | Mini 颜色变量输出 | 本仓库输出 |
| 覆盖：`g-bg-white` | `background-color: #fff !important` | Mini 颜色变量输出 | 本仓库输出 |
| 覆盖：`g-b-1` | `bottom: 1px` | `border-width: 1px` | `bottom: 1px` |
| 覆盖：`g-b-[1px_solid_red]` | `border: 1px solid red` | `border-color: 1px solid red` | 合法的 `border` 简写 |
| 本仓库有：`g-bd` | 高清伪元素全边框 | 不生成 | 本仓库高清边框 |
| 本仓库有：`g-bdw-2` | `border-width: 2px` | 不生成 | 本仓库输出 |
| 本仓库有：`g-ta-r` | `text-align: right !important` | 不生成 | 本仓库输出 |
| 本仓库有：`g-g-4` | `gap: 4px` | 不生成 | `gap: 4px` |
| 本仓库有：`g-cg-4` / `g-rg-4` | `column-gap/row-gap: 4px` | 不生成 | 本仓库输出 |
| 本仓库有：`g-f-1/2` | `flex: 0 0 50%` | 不生成 | `flex: 0 0 50%` |
| 本仓库有：`g-fwr-w` | `flex-wrap: wrap` | 不生成 | 本仓库输出 |
| 本仓库有：`g-gtc-3` | 三列等分轨道 | 不生成 | 本仓库输出 |
| 本仓库有：`g-t-8` | `top: 8px` | 不生成 | `top: 8px` |
| 本仓库有：`g-ofx-h` | `overflow-x: hidden` | 不生成 | 本仓库输出 |
| 本仓库有：`g-fsh-0` | `flex-shrink: 0` | 不生成 | 本仓库输出 |
| 本仓库有：`g-gac-4` | `grid-auto-columns: 4px` | 不生成 | 本仓库输出 |
| 本仓库有：`g-cu-p` | `cursor: pointer` | 不生成 | 本仓库输出 |
| 本仓库有：`g-olw-2` | `outline-width: 2px` | 不生成 | 本仓库输出 |
| 本仓库有：`g-bsh` / `g-bsz-bb` | 默认阴影 / `box-sizing: border-box` | 不生成 | 本仓库输出 |
| Mini 有：`g-gap-4` | 不生成 | `gap: 1rem` | `gap: 1rem` |
| Mini 有：`g-flex-1` | 不生成 | `flex: 1 1 0%` | Mini 输出 |
| Mini 有：`g-grid-cols-3` | 不生成 | 三列等分轨道 | Mini 输出 |
| Mini 有：`g-bottom-1` | 不生成 | `bottom: 0.25rem` | Mini 输出 |
| Mini 有：`g-transition` / `g-transform` | 不生成 | Mini transition / transform | Mini 输出 |

本仓库 rules 采用 `unit` 配置表达数值；Mini 的间距和尺寸采用其 theme 数值体系。组合后应根据 token 的所属来源判断数值含义，不能把 `g-g-4` 与 `g-gap-4` 当作同一套刻度。

## Mini-only Token 迁移

| 原 Mini Token | 本仓库选择 | 说明 |
| --- | --- | --- |
| `g-gap-*` | `g-g-*` | 名称和数值体系不同；需要保持 Mini 刻度时继续组合 Mini |
| `g-flex-*` | `g-f-*` | `g-f-{n}` 直接映射 `flex: n`，分数映射固定占比 |
| `g-grid-cols-*` | `g-gtc-*` | 本仓库采用 CSS 属性缩写 |
| `g-col-span-*` | `g-gc-span-*` | 本仓库 Grid 列定位缩写 |
| `g-grid-flow-*` | `g-gaf-*` | 本仓库只提供文档列出的缩写值 |
| `g-bottom-*` | `g-b-*` | 本仓库数字直接拼接 `unit`，不会使用 Mini spacing |
| `g-overflow-x/y-*` | `g-ofx/ofy-*` | 本仓库采用连续 CSS 属性缩写 |
| `g-basis/grow/shrink/order-*` | `g-fb/fg/fsh/od-*` | 本仓库区分 Flex 子项属性 |
| `g-auto-cols/rows-*` | `g-gac/gar-*` | 本仓库 Grid 属性缩写 |
| `g-cursor-*`、`g-select-*`、`g-resize-*` | `g-cu-*`、`g-us-*`、`g-re-*` | 使用本仓库交互属性缩写 |
| `g-outline-*` | `g-ol*` | width/style/color/offset 使用连续缩写 |
| `g-border-*` | `g-bd*` | 本仓库以方向和子属性连续缩写；数值使用配置单位 |
| `g-text-left/right/center` | `g-ta-l/r/c` | 本仓库 Text Align 使用值缩写并包含 `!important` |
| `g-inline-grid`、`g-min-h-screen` | 同名 | 已由本仓库直接提供 |
| transition、transform、ring、filter 等 | 无直接替代 | 继续组合 Mini，不纳入本仓库规则范围 |

## Variants 配置

独立使用时，`presetStyle` 接受与 Mini 一致的相关配置：

```ts
presetStyle({
	dark: 'media',
	attributifyPseudo: false,
	arbitraryVariants: true
});
```

- `dark` 默认是 `class`，也支持 `media` 或自定义 `light` / `dark` selectors。
- `attributifyPseudo` 默认是 `false`；启用后 group 等标记使用属性选择器。
- `arbitraryVariants` 默认是 `true`；关闭后不注册任意 Variant 专用提取器。
- `variants` 默认是 `true`；只有显式组合 Mini 等已有其他 variant 来源时才关闭。

这些参数也可以写入 `UNOCSS_OPTIONS`。显式传给 `presetStyle()` 的值仍然优先。
