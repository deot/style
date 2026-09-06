# presetMini 组合、覆盖与配置

`@deot/style-unocss` 默认只提供本仓库规则和 preflights，不再内置 `presetMini()` 的 rules、完整 theme 与 preflight。它仍通过 UnoCSS 官方公开入口复用 Mini variants、breakpoints 和任意 Variant 提取器，因此独立使用时可以继续写 `hover:`、`dark:`、`md:` 等响应式、group/peer、aria/data、任意 container、layer 与 `[&>*]:` 等 variants。

> 本 preset 只注入 Mini breakpoints，以保留 `sm:`、`md:` 等命名响应式能力；不注入 colors、spacing、containers 等其余 Mini theme 内容。`@[640px]:` 等任意值写法同样可用。

> 这是下一主版本的破坏性变更：此前依赖内置 Mini rules 的项目需要改用本仓库 token，或按本文显式组合 `presetMini()`。

本 preset 已移除 deprecated matcher，旧名可能落到 Mini 的其他规则；额外加载兼容 CSS 也不能消除全部属性冲突。旧类应按 [Deprecated 迁移](../style/deprecated.md)优先替换。

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

这种方式只生成本仓库定义的 `g-*` rules。`g-gap-*`、`g-flex-1`、`g-grid-cols-*`、`g-bottom-*`、transition 和 transform 等 Mini-only utilities 不会生成；本仓库的 `g-flex-cc` 等组合类不受影响。本仓库也直接提供 `g-inline-grid`、`g-min-h-screen` 以及下文列出的属性缩写。

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

- 本文方案让两个 preset 使用相同的 `prefix`，在同一命名空间内组合和覆盖。不同前缀会形成两套命名空间，不适用下文的同名覆盖表。
- `presetStyle({ variants: false })` 会同时关闭其 Mini variants、breakpoints 和任意 Variant 提取器，由外部 `presetMini()` 独占这些能力，避免同名 `dark:` 等 variants 受 preset 顺序影响。
- Mini preflight 应保持开启；transform、ring、shadow 等 Mini rules 依赖其中初始化的 `--un-*` 变量。
- `presetStyle` 保留 Variant Group transformer，不需要在项目中再次添加。
- `presetStyle` 使用 `enforce: 'post'`，因此无论两个 preset 的书写顺序如何，两边都能匹配的同名 token 最终采用本仓库语义。本仓库未匹配的值仍可能由 Mini 生成，不能据此推导本仓库的独立支持范围。建议按示例顺序书写，以便看出“Mini 提供通用规则，本仓库执行覆盖”。

## 规则来源与最终输出

三类来源分别为本仓库有、Mini 有、组合后覆盖；覆盖不一定表示语义改变。下面将覆盖项标为“同义”或“差异”，优先检查差异项。对照基于本仓库当前锁定的 Mini 版本，升级后需重新核对。

以下采用默认 `prefix: 'g-'`、`unit: 'px'`、`scale: 1`：

| 分类与 Token | 仅本仓库 | 仅 Mini | 组合后的最终输出 |
| --- | --- | --- | --- |
| **覆盖·差异**：`g-m-4` | `margin: 4px` | `margin: 1rem` | `margin: 4px` |
| **覆盖·差异**：`g-w-4` | `width: 4px` | `width: 1rem` | `width: 4px` |
| **覆盖·差异**：`g-flex` | `display: flex; box-sizing: border-box` | `display: flex` | 本仓库输出 |
| **覆盖·差异**：`g-grid` | `display: grid; box-sizing: border-box` | `display: grid` | 本仓库输出 |
| **覆盖·差异**：`g-inline-grid` | `display: inline-grid; box-sizing: border-box` | `display: inline-grid` | 本仓库输出 |
| 覆盖·同义：`g-min-h-screen` | `min-height: 100vh` | `min-height: 100vh` | 本仓库输出 |
| 覆盖·同义：`g-op-50` | `opacity: 0.5` | `opacity: 0.5` | 本仓库输出 |
| **覆盖·差异**：`g-fill-black` | `fill: #000` | Mini 颜色变量输出 | 本仓库输出 |
| **覆盖·差异**：`g-bg-white` | `background-color: #fff !important` | Mini 颜色变量输出 | 本仓库输出 |
| **覆盖·差异**：`g-b-1` | `bottom: 1px` | `border-width: 1px` | `bottom: 1px` |
| **覆盖·差异**：`g-b-[1px_solid_red]` | `border: 1px solid red` | `border-color: 1px solid red` | 合法的 `border` 简写 |
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

## Mini Token 对照与迁移

下表包含需要更名、已经同名支持及无替代项三种情况。迁移时同时核对后缀枚举、数值单位和组合声明，不要只批量替换前缀；本仓库完整范围见[工具类参考](./DOCUMENT.md)。

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

## 组合后的配置归属

独立使用的完整参数和默认值只在 [UnoCSS 概览与配置](../../packages/unocss/README.md)维护。组合时按下面的归属配置，避免只改其中一个 preset 却误以为影响全部 Token。

| 配置 | 本仓库控制 | Mini 控制 | 组合时怎么设置 |
| --- | --- | --- | --- |
| prefix | 自有类名前缀 | Mini 类名与标记前缀 | 推荐两边都设为相同的 `g-` 或自定义值 |
| unit / scale | 自有数值尺寸、固定尺寸 | 不读取本仓库的 unit/scale | 不能用本仓库参数改变 `g-gap-4` 的刻度 |
| variants | `false` 时关闭自带 variants、breakpoints、任意提取器 | 提供 variants | 本仓库 false，由 Mini 统一负责 |
| dark / attributifyPseudo / arbitraryVariants | variants 关闭后不生效 | 决定实际 variants 策略 | 传给 `presetMini()`，不要只写在 `UNOCSS_OPTIONS` |
| theme | 自有色板及预设主题 CSS Variables | Mini colors、spacing、breakpoints 等 | UnoCSS 顶层 theme 可定制 Mini 规则；不自动改变自有色板 |
| reset | `reset: false` 关闭本仓库全局 reset | Mini preflight 不受此参数影响 | 本仓库主题变量和按需 reset 工具仍保留 |
| preflight | 自有主题变量与可选 reset | transform/ring/shadow 等初始化变量 | 不要全局禁用后误以为 Mini 规则仍完整可用 |
| Variant Group | 本仓库始终提供，只展开冒号分组 | 不靠 Mini rules 展开分组 | 不重复添加 transformer |

例如，组合模式切换为 media dark：

```ts
export default defineConfig({
	presets: [
		presetMini({ prefix: 'g-', dark: 'media' }),
		presetStyle({ prefix: 'g-', variants: false, reset: false })
	]
});
```

本仓库的 `UNOCSS_OPTIONS` 只供 `presetStyle()` 读取，不会自动传给外部 `presetMini()`。Mini-only Token 的数字刻度、规则详情以 [Mini 官方文档](https://unocss.dev/presets/mini)为准。

## 继续阅读

- [UnoCSS 概览与配置](../../packages/unocss/README.md)
- [自有工具类参考](./DOCUMENT.md)
- [接入与迁移](../start/integration.md)
- [Deprecated 兼容与迁移](../style/deprecated.md)
