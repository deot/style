# Style 工具类参考

本页只记录 `@deot/style` 当前 Sass/CSS 工具类，以 [outputs 源码](../../packages/index/src/outputs)为准。动态生成能力请查 [UnoCSS 工具类参考](../unocss/DOCUMENT.md)，不要把两包的数值范围混用。

## 阅读约定

默认配置为 `g-`、px、scale 1；表中的类名直接用于 HTML，无需加 `.`。`{n}` 只代表表内列出的数值，不代表任意数字。每个表格按基础、单属性和组合规则排列；复合规则列出关键声明及副作用。

> 直接映射 CSS 属性或属性值时，优先使用简短且可识别的缩写；组合多个属性或表达布局、状态与行为时，优先使用完整名称。部分缩写和便捷语义有意保留，例如安全区后缀 `s`、`g-hide` 和 `g-show`。本文记录现有命名，不要求所有类机械遵循同一长度。

数字尺寸的类名后缀和属性值会随 Sass `$scale` 缩放；Grid 编号、Flex 比例、字重和无单位行高不按尺寸缩放。`$scale > 1` 时部分数值集合还会增加，见对应章节。参数见[概览与配置](../../packages/index/README.md)。

所有正常入口不包含旧类，历史兼容单独见 [Deprecated 兼容与迁移](./deprecated.md)。本页不列旧别名。

## 基础布局

来源：`outputs/other.scss`。

| 类名 | CSS 输出 | 范围与注意事项 |
| --- | --- | --- |
| `g-d-n`、`g-none`、`g-hide` | `display: none !important` | 固定类 |
| `g-d-b`、`g-show`、`g-block` | `display: block !important` | 固定类 |
| `g-d-i`、`g-inline` | `display: inline !important` | 固定类 |
| `g-d-ib`、`g-inline-block` | `display: inline-block !important` | 固定类 |
| `g-bsz-bb` | `box-sizing: border-box` | 固定类 |
| `g-of-h` | `overflow: hidden !important` | 不预生成其他 Overflow 值 |

## Flex、Grid 与对齐

### Flex 容器与子项

来源：`outputs/flex.scss`。

| 类名 | CSS 输出 | 实际范围 |
| --- | --- | --- |
| `g-flex` | `display: flex; box-sizing: border-box` | 固定类 |
| `g-f-{n}` | `flex: n` | `0, 1, 2` |
| `g-f-{part}/{total}` | `flex: 0 0 百分比` | `1/1`；total 为 `2～5`，part 为 `1～total−1` |
| `g-flex-holy` | Flex + border-box + `min-height: 100vh; flex-direction: column` | 纵向圣杯布局容器 |
| `g-flex-cc` | Flex + border-box + `align-items: center; justify-content: center` | 双轴居中 |
| `g-flex-ac` | Flex + border-box + `align-items: center` | 交叉轴居中 |

`flex: 1` 不等于 `flex: 1 0 auto`；固定占比也不等于按剩余空间弹性分配。Sass 不预生成任意 Flex 值或独立 grow、shrink、basis、order 类。

### 方向与对齐

| 模式 | 属性 | 后缀 → CSS 值 |
| --- | --- | --- |
| `g-fd-{value}` | `flex-direction` | `r/c/rr/cr` → row/column/row-reverse/column-reverse |
| `g-fwr-{value}` | `flex-wrap` | `w/wr/n` → wrap/wrap-reverse/nowrap |
| `g-jc-{value}` | `justify-content` | `fs/fe/c/sb/sa` → flex-start/flex-end/center/space-between/space-around |
| `g-ai-{value}` | `align-items` | `fs/fe/c/b/s` → flex-start/flex-end/center/baseline/stretch |
| `g-ac-{value}` | `align-content` | `fs/fe/c/sb/sa/s` → flex-start/flex-end/center/space-between/space-around/stretch |
| `g-as-{value}` | `align-self` | `a/fs/fe/c/b/s` → auto/flex-start/flex-end/center/baseline/stretch |

后缀通常取 CSS 值中各单词首字母。`jc/ai/ac/as` 也可用于 Grid，不在 Grid 表格重复列出。

### Grid

来源：`outputs/grid.scss`。编号和轨道数量均不拼接单位、不应用 scale。

| 类名或模式 | CSS 输出 | 实际范围 |
| --- | --- | --- |
| `g-grid` | `display: grid; box-sizing: border-box` | 固定类 |
| `g-gtc-{n}` / `g-gtr-{n}` | `grid-template-columns/rows: repeat(n, minmax(0, 1fr))` | `1～12` |
| `g-gtc-none` / `g-gtr-none` | `grid-template-columns/rows: none` | 固定类 |
| `g-gtc-subgrid` / `g-gtr-subgrid` | `grid-template-columns/rows: subgrid` | 固定类 |
| `g-gc-{n}` / `g-gr-{n}` | `grid-column/row: n` | `1～12` |
| `g-gc-span-{n}` / `g-gr-span-{n}` | `grid-column/row: span n / span n` | `1～12` |
| `g-gc-span-full` / `g-gr-span-full` | `grid-column/row: 1 / -1` | 跨越全部轨道 |
| `g-gcs-{n}` / `g-gce-{n}` | `grid-column-start/end: n` | `1～12` |
| `g-grs-{n}` / `g-gre-{n}` | `grid-row-start/end: n` | `1～12` |
| `g-gaf-{value}` | `grid-auto-flow` | `r/c/d/rd/cd` → row/column/dense/row dense/column dense |

本包不预生成 Inline Grid、任意模板、自动轨道尺寸或命名区域类。需要这些能力时写业务 CSS，或选择 UnoCSS 交付方式。

## 浮动与栅格

来源：`outputs/float.scss`。浮动十二列栅格不是 CSS Grid。

| 类名或模式 | CSS 输出 | 实际范围 |
| --- | --- | --- |
| `g-fl` / `g-fr` | `float: left/right` | 固定类 |
| `g-fl-{part}/12` | `width: 百分比; float: left` | part 为 `1～12` |
| `g-fl-row` | `padding: 0; margin: 0`，伪元素清除浮动 | 行容器 |
| `g-clearfix` | 通过 `::before/::after` 清除浮动 | 不设置栅格宽度 |

只有百分比宽度、不需要浮动时使用下一节的宽度分数。

## 尺寸

来源：`outputs/other.scss`、`outputs/float.scss`。

| 类名或模式 | CSS 输出 | 实际范围 |
| --- | --- | --- |
| `g-w-full` / `g-h-full` | `width/height: 100%` | 填满包含块的单轴 |
| `g-w-{part}/12` | `width: 百分比` | part 为 `1～12` |
| `g-size-full` | `width: 100%; height: 100%` | 同时设置宽高 |

> `full` 是包含块的 `100%`，不是视口尺寸。本包不预生成 `screen`、任意数值宽高或 min/max 尺寸；UnoCSS 提供这些扩展，见其独立参考。

## 间距

来源：`outputs/margin.scss`、`outputs/padding.scss`。

默认数值集合：`2, 4, 5, 6, 8, 10, 12, 13, 15, 16, 18, 20, 21, 24, 25, 30, 32, 48, 56, 60`。`$scale > 1` 时追加基础值 `3, 4, 5, 6, 7, 9`，再缩放后缀和属性值。

| 模式 | CSS 输出 | 实际范围 |
| --- | --- | --- |
| `g-m-{n}` / `g-pd-{n}` | `margin/padding: npx` | 上述集合 |
| `g-m-tb-{n}` / `g-pd-tb-{n}` | 上下两侧 margin/padding | 上述集合 |
| `g-m-lr-{n}` / `g-pd-lr-{n}` | 左右两侧 margin/padding | 上述集合 |
| `g-m-t-{n}` / `g-m-r-{n}` / `g-m-b-{n}` / `g-m-l-{n}` | 单侧 margin | 上述集合 |
| `g-pd-t-{n}` / `g-pd-r-{n}` / `g-pd-b-{n}` / `g-pd-l-{n}` | 单侧 padding | 上述集合 |

### 安全区

这里的固定后缀 `s` 表示 safe-area，不是尺寸值。

| 类名 | CSS 输出 |
| --- | --- |
| `g-pd-s` | 四侧对应的 `env(safe-area-inset-*)` |
| `g-pd-tb-s` / `g-pd-lr-s` | 上下 / 左右安全区 |
| `g-pd-t-s` / `g-pd-r-s` / `g-pd-b-s` / `g-pd-l-s` | 单侧安全区 |

Sass 不预生成 Gap 类；在本包项目中使用业务 CSS 的 `gap/column-gap/row-gap`。

## 定位与层级

来源：`outputs/position.scss`。

| 类名 | CSS 输出 | 注意事项 |
| --- | --- | --- |
| `g-fixed` / `g-relative` / `g-absolute` | `position: fixed/relative/absolute !important` | 固定类 |
| `g-fixed-full` / `g-absolute-full` | 对应 position（含 `!important`）并设置 `inset: 0` | 相对对应定位包含块铺满 |

本包不预生成边偏移或 z-index 数字类。

## 排版与文本

### 字号、行高与字重

来源：`outputs/font-size.scss`、`outputs/line-height.scss`、`outputs/font-weight.scss`。

| 模式 | CSS 输出 | 默认数值集合 |
| --- | --- | --- |
| `g-fs-{n}` | `font-size: npx` | `10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 48, 50, 60, 70, 80, 90, 100` |
| `g-lh-{n}` | `line-height: npx` | `10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 60, 72, 80, 88, 120` |
| `g-lh-1` / `g-lh-2` | `line-height: 1/2` | 仅这两个无单位值 |
| `g-lh-default` | `line-height: var(--line-height-default)` | 默认 `1.5` |
| `g-fw-{value}` | `font-weight: value` | `bold, 400, 500, 600, 700`；不缩放 |

`$scale > 1` 时字号、带单位行高追加基础值 `8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 39`，再按 scale 缩放。固定的无单位行高保持不变。

### 文本属性与组合

来源：`outputs/text.scss`。

| 模式 | CSS 输出 | 后缀或说明 |
| --- | --- | --- |
| `g-ta-{value}` | `text-align: value !important` | `l/r/c/j/s/e/ja/mp` → left/right/center/justify/start/end/justify-all/match-parent |
| `g-tdl-{value}` | `text-decoration-line` | `lt/ul/ol/n` → line-through/underline/overline/none；不含 `!important` |
| `g-ws-nw` | `white-space: nowrap` | 单属性规则 |
| `g-line-nowrap` | `white-space: nowrap !important` | 强制不换行 |
| `g-line-wrap` | `word-break: break-all; overflow-wrap: break-word; text-wrap: wrap` | 长文本换行 |
| `g-line-{n}` | WebKit box + hidden + ellipsis + line-clamp + 换行与 `white-space: break-spaces` | 仅 `1, 2`；组合输出 |

## 颜色与背景

来源：`outputs/color.scss`。每个颜色键同时提供 `g-c-{key}`（color）和 `g-bg-{key}`（background-color），均含 `!important`。

| 模式 | CSS 输出 | 实际范围 |
| --- | --- | --- |
| `g-c-{key}` | `color: 对应色值 !important` | 下表完整颜色键 |
| `g-bg-{key}` | `background-color: 对应色值 !important` | 下表完整颜色键 |

| 系列 | 完整颜色键 |
| --- | --- |
| 红粉 | `red-mid, pink-mid, pink-light` |
| 蓝 | `blue-dark, blue-mid, blue-light` |
| 黄 | `yellow-dark, yellow-mid, yellow-light` |
| 橙 | `orange-dark, orange-mid, orange-light` |
| 灰 | `gray-dark, gray-mid, gray-light` |
| 紫 | `purple-dark, purple-mid, purple-light` |
| 黑白 | `black, white, black-dark, black-mid, black-light` |
| 简写色值 | `444, 67, f2, f8, ef, cd, e8, d9, f4, f9, 000, 333, 51, 666, 999, aaa, bbb, bd` |
| 主题语义 | `info, success, error, warning`，引用对应 `--color-*` |

色值来源为 [variables/color.scss](../../packages/index/src/variables/color.scss)。关闭 CSS Variables 后，主题语义色输出具体值。业务扩展主题键不会自动变成颜色工具类。

| 类名 | CSS 输出 |
| --- | --- |
| `g-bg-lg-blue` | 从 blue-mid 到 blue-light 的右向线性渐变，background 为终点色回退 |
| `g-bg-lg-yellow` | 从 yellow-mid 到 yellow-light 的右向线性渐变，background 为终点色回退 |

## 边框、圆角与阴影

来源：`outputs/border.scss`、`outputs/box-shadow.scss`。

| 类名或模式 | CSS 输出 | 范围与注意事项 |
| --- | --- | --- |
| `g-br-{n}` | `border-radius: npx` | `2, 4, 6, 8, 10, 12, 14, 16, 18, 20` |
| `g-br-circle` | `border-radius: 100% !important` | 固定类 |
| `g-br-default` | `border-radius: var(--border-radius-default) !important` | 默认 8px |
| `g-bsh` / `g-bsh-t` | `box-shadow` 引用 `--border-shadow-default` / `--border-shadow-default-top` | 普通声明 |
| `g-bd` / `g-bdt` / `g-bdr` / `g-bdb` / `g-bdl` | 全边 / 上 / 右 / 下 / 左高清细边框 | 设置 relative、translateZ(0)，使用伪元素与 2x/3x 媒体查询 |

数字圆角在 `$scale > 1` 时追加基础值 `1, 3, 5, 7, 9`，再缩放。高清边框颜色引用 `--border-color-default`，上/左使用 `::before`，全边/右/下使用 `::after`；与业务伪元素组合时注意占用。

本包不预生成标准 Border width/style/color 或 Outline 工具类。

## 图片

来源：`outputs/image.scss`。默认尺寸集合：`256, 150, 128, 100, 96, 64, 56, 40, 32, 24`；按 `$unit/$scale` 生成。

| 模式 | CSS 输出 | 范围与注意事项 |
| --- | --- | --- |
| `g-image-{n}` | width、height、min/max-width、line-height 均为对应尺寸 | 上述集合 |
| `g-image-circle-{n}` | 图片复合尺寸 + `border-radius: 50%` | 上述集合 |
| `g-image-radius-{n}` | 图片复合尺寸 + 默认 4px 圆角 | 圆角也随配置缩放 |

本包不预生成 SVG fill/stroke 类。

## 交互、状态与辅助类

来源：`outputs/other.scss`。显示类见“基础布局”，这里不重复。

| 类名 | CSS 输出或行为 | 注意事项 |
| --- | --- | --- |
| `g-pointer` | `cursor: pointer !important` | 固定类 |
| `g-disabled` | `pointer-events: none` | 不替代 HTML disabled 属性 |
| `g-unanimated` | `animation: 0 !important` | 不关闭 transition |
| `g-operable` | 14px 字号、主题高亮色（important）、pointer 光标 | 字号随配置缩放 |
| `g-scroller` | WebKit 滚动条：宽 4px、横向高 2px、轨道/滑块圆角 5px及主题颜色 | 固定尺寸随配置缩放 |
| `g-divider` | 1px × 12px，左右 margin 8px，#ccc 背景、relative、inline-block、middle、border-box | 固定尺寸随配置缩放 |
| `g-dot` | block、5px × 5px、50% 圆角 | 尺寸随配置缩放；颜色自行组合 |

## Reset 与全局输出

来源：`outputs/reset.scss`、`outputs/theme.scss`。

| 类型 | 输出与边界 |
| --- | --- |
| theme | CSS Variables 开启时输出 `:root` 主题变量；仅加载工具模块不一定包含 theme |
| 全局 reset | html 宽高、body 宽度/字体/颜色/背景；允许通配符时清除全局 padding/margin/border 并设置 border-box |
| `g-reset` | 处理后代列表、链接、图片、`.inline`、i/b/span、输入框和按钮的默认表现 |
| `g-unset` | 为富文本恢复标题、段落、列表布局；列表使用 40px 左内边距和 1em 上下外边距 |

`$allow-asterisk-wildcard: false` 只关闭通配符部分（包括 `g-unset` 的通配符），不会删除 html/body 或全部 reset 工具。Normalize-only 入口不含本页工具类；REM-part 只提供字号、行高和间距。完整入口列表见[概览与配置](../../packages/index/README.md)。
