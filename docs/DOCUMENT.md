# 工具类参考

本文档以当前 `packages/index/src/outputs` 源码为准，列出 `@deot/style` 默认 Sass/CSS 产物中的公共工具类。默认配置使用 `g-` 前缀、`px` 单位和 1 倍缩放；修改 Sass 配置后，类名前缀、数值后缀和属性值会相应变化。

`@deot/style-unocss` 覆盖这些公共语义，并对数值类提供动态 token。两种交付方式的 `scale` 和规则生成范围并不完全相同，迁移前请先阅读 [`@deot/style-unocss` README](../packages/unocss/README.md) 与[接入与迁移](./integration.md)。

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
| `.g-1of1` | 占满一行 |
| `.g-1of2` … `.g-4of5` | 生成 2 至 5 等分的所有有效分数 |

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
| `.g-w-1` … `.g-w-12` | 设置 1/12 至 12/12 宽度 |
| `.g-fw-1` … `.g-fw-12` | 设置宽度并左浮动 |
| `.g-fl` / `.g-fr` | 左浮动 / 右浮动 |

## 间距

默认数值：`2, 4, 5, 6, 8, 10, 12, 13, 15, 16, 18, 20, 21, 24, 25, 30, 32, 48, 56, 60`。

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
- 行高 `.g-lh-{n}`：`10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 60, 72, 80, 88, 120`。
- 字重 `.g-fw-{value}`：`bold, 400, 500, 600, 700`。

| 类 | 说明 |
| --- | --- |
| `.g-lh-default` | 使用主题的 `line-height-default`，默认 `1.5` |
| `.g-lh-one` / `.g-lh-two` | 使用主题限高生成一行 / 两行高度 |
| `.g-lh-1` / `.g-lh-2` | 无单位行高 1 / 2 |

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
| `.g-height-full` / `.g-width-full` / `.g-size-full` | 高度 / 宽度 / 两者为 100% |
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
