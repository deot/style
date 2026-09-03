# @deot/style-unocss

`@deot/style-unocss` 为使用 UnoCSS 的项目提供 `@deot/style` 公共工具类，并同时启用带相同前缀的 `presetMini`。Preset 按需生成实际使用的规则，不需要再引入 `@deot/style/dist/index.css`。

如果还没有确定使用预编译 CSS、Sass 或 UnoCSS，请先阅读[选择与安装](../../docs/getting-started.md)；从 Sass/CSS 迁移时同时参考[接入与迁移](../../docs/integration.md)。

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

Vite 项目仍按 UnoCSS 官方接入方式安装插件并在入口引入 `virtual:uno.css`；`presetStyle` 只负责规则和 preflight，不改变构建模式。

## 组合内容

- `presetMini({ prefix: 'g-' })` 提供 Mini 的布局、尺寸、颜色、variants 等能力。
- `@deot/style` 兼容规则覆盖同名工具类，保持 `g-m-4 { margin: 4px }`、`g-flex`、`g-fw-*` 等既有语义。
- [工具类参考](../../docs/DOCUMENT.md)中的全部公共 `g-*` 均可按需生成，包括高清边框、滚动条、`g-reset` 与 `g-unset`。
- Preset 注入当前主题的 `:root` CSS Variables，因此 `g-c-info`、`g-bs` 等语义类仍可由项目覆盖变量。
- Mini 的 variants 同样作用于兼容规则，例如 `hover:g-m-l-8`。

## 配置参数

```ts
presetStyle({
	prefix: 'g-',
	unit: 'px',
	scale: 1,
	reset: true
});
```

以上参数也可以由运行 UnoCSS 的 Node 进程通过 `UNOCSS_OPTIONS` 提供。它是包含 `prefix`、`unit`、`scale`、`reset` 的 JSON 字符串。显式参数的优先级高于环境变量，环境变量未设置时使用各参数的默认值。例如：

```bash
UNOCSS_OPTIONS='{"prefix":"x-","unit":"rem","scale":2}' npm run dev
```

Preset 在 `uno.config.ts` 执行时读取 `process.env`。这里不使用 `import.meta.env`，因为后者由 Vite 转换并主要提供给应用源码，不能作为 UnoCSS 配置加载阶段的通用输入。`UNOCSS_OPTIONS.scale` 必须是有限数值。

### `prefix`

默认值为 `'g-'`，语义与 UnoCSS 的 `prefix` 一致，传入值会原样同时作用于 Mini 和兼容规则：

```ts
presetStyle({ prefix: 'x-' });
// x-flex、x-fs-14、x-m-l-4
```

传入空字符串可生成无前缀类。

### `unit`

默认值为 `'px'`。数值型规则直接把类名中的非负整数与单位组合：

```ts
presetStyle({ unit: 'rem' });
// g-fs-14  -> font-size: 14rem
// g-pd-8   -> padding: 8rem
// g-img-40 -> width/height: 40rem
```

数值规则不限于 Sass 当前的预生成列表，但不接受负数或小数。

Flex 与字重同样按需生成：

- `g-col` 等价于 `flex: 1`，`g-col-{n}` 支持任意非负整数。
- `g-{part}of{total}` 接受 `part >= 1`、`total >= 1` 且 `part <= total` 的有效分数。
- `g-fw-1` 至 `g-fw-12` 保留既有 12 列浮动栅格语义；`g-fw-13` 至 `g-fw-1000` 生成对应数字字重，`g-fw-bold` 生成粗体。
- `g-lh-0` 至 `g-lh-5` 生成无单位行高；大于 `5` 的 `g-lh-{n}` 使用配置的 `unit`。

### `scale`

默认值为 `1`。UnoCSS 中类名数字已经表达最终尺寸，所以 `scale` 不改变数值类：

```ts
presetStyle({ unit: 'rem', scale: 2 });
// g-fs-14 -> font-size: 14rem
```

`scale` 只应用于类名没有携带尺寸的固定语义类及主题变量，例如 `g-dot`、`g-divide`、`g-operable`、滚动条、默认圆角、阴影和高清边框。以上配置下，`g-dot` 的 5rem 内部尺寸会缩放为 10rem。

这与 Sass `$scale` 会同时缩放数值后缀和属性值的行为不同；从 Sass CSS 迁移时不要假设两者的 `scale` 语义相同。

### `reset`

默认值为 `true`，输出与 Sass 默认入口一致的 `html`、`body` 和全局 `*` reset。只关闭这组全局样式时传入：

```ts
presetStyle({ reset: false });
```

关闭后仍会保留主题变量、Mini preflight 和按需生成的 `g-reset`、`g-unset` 工具类。

## 主题变量

Preset 默认输出与 Sass 当前默认主题一致的 CSS Variables，例如：

```css
:root {
	--color-highlight: #5495f6;
	--color-info: #0177de;
	--border-radius-default: 8px;
}
```

业务项目可在后加载的全局样式中覆盖这些变量。具体色值类如 `g-c-white` 仍直接输出确定色值。

## 动态类名

UnoCSS 只能提取源码中静态出现的完整 token。以下动态拼接不会自动生成：

```vue
<div :class="`g-fs-${size}`" />
```

应改为静态映射，或在项目的 UnoCSS 配置中加入 safelist：

```ts
export default defineConfig({
	presets: [presetStyle()],
	safelist: [12, 14, 16].map(size => `g-fs-${size}`)
});
```

## 与 Sass/CSS 入口的边界

- 需要按使用情况生成工具类时，使用 `@deot/style-unocss`，不要再引入完整 `dist/index.css`。
- 需要 Sass 函数、mixin、主题 map 或既有 rem/rpx 静态产物时，继续使用 `@deot/style`。
- Preset 默认输出 Sass 完整入口中的 `html`、`body` 与全局 `*` reset；不需要全局样式时设置 `reset: false`。

## 相关文档

- [选择与安装](../../docs/getting-started.md)
- [接入与迁移](../../docs/integration.md)
- [工具类参考](../../docs/DOCUMENT.md)
