# @deot/style-unocss

`@deot/style-unocss` 为 UnoCSS 项目提供 `@deot/style` 工具类。Preset 按源码中的 token 生成 CSS，不需要再引入 `@deot/style/dist/index.css`；默认不包含 Mini rules，但会通过官方公开入口复用 Mini variants、breakpoints 和任意 Variant 提取器。

> 下一主版本不再内置 `presetMini()` 的 rules 与 preflight。原先使用 Mini-only token 的项目请阅读[与 UnoCSS Mini 组合](https://github.com/deot/style/blob/main/docs/unocss/mini.md)。

> 下一主版本同时移除本 preset 中的全部 deprecated 规则。旧类临时兼容需显式安装 `@deot/style` 并加载 `@deot/style/dist/index.deprecated.css`；该 CSS 仅覆盖 Sass 已生成的普通旧类，不恢复旧 variants 或任意动态范围。映射与配置见 [Deprecated 迁移](https://github.com/deot/style/blob/main/docs/style/deprecated.md)。

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

Vite 项目仍需注册 UnoCSS 插件并引入 `virtual:uno.css`，完整步骤见[接入与迁移](https://github.com/deot/style/blob/main/docs/start/integration.md)。`presetStyle` 负责本仓库 rules、preflights、Mini variants 和 Variant Group transformer，不改变项目的构建入口。

## 能力与阅读路径

本 preset 提供当前自有工具类和动态属性扩展。完整 Token、有限枚举、任意值支持与输出声明集中在 [UnoCSS 工具类参考](https://github.com/deot/style/blob/main/docs/unocss/DOCUMENT.md)，README 只维护配置与运行方式。

## Variants 与 Variant Group

本 preset 通过 UnoCSS 官方公开入口复用 Mini variants、breakpoints 和任意 Variant 提取器，因此 `hover:`、`focus:`、`dark:`、`md:` 等响应式、group/peer、aria/data、任意 container、layer 与 `[&>*]:` 等写法可以直接作用于本仓库 rules。除 breakpoints 外，不注入 Mini 的 colors、spacing、containers 等 theme 内容。

Mini rules 与 Mini preflight 不再内置。`g-gap-*`、`g-flex-1`、`g-grid-cols-*`、transition 和 transform 等 Mini 工具类需要由项目显式组合 `presetMini()`。这不影响本仓库已有的 `g-flex-cc` 等组合类。完整配置、来源划分和冲突结果见[与 UnoCSS Mini 组合](https://github.com/deot/style/blob/main/docs/unocss/mini.md)。

本 preset 仍内置 Variant Group transformer：

```html
<button class="hover:(g-c-white g-bg-black)">Button</button>
```

只启用 `:` 分组，以免 CSS Variable 简写中的 `-(` 被转换；因此不支持 `g-(m-4 pd-8)`。

## 配置参数

`presetStyle(options?: PresetStyleOptions)` 返回 UnoCSS Preset，并导出 `PresetStyleOptions` 类型。

| 参数 | 类型 | 默认值 | 控制范围 |
| --- | --- | --- | --- |
| `prefix` | `string` | `'g-'` | 自有规则与 group/peer 标记类前缀，原样使用 |
| `unit` | `string` | `'px'` | 动态数字尺寸与固定尺寸的单位 |
| `scale` | `number` | `1` | 只缩放固定语义尺寸与主题尺寸；必须为有限数字 |
| `reset` | `boolean` | `true` | html/body/全局通配符 reset |
| `variants` | `boolean` | `true` | 官方 variants、breakpoints 与任意 Variant 提取器 |
| `dark` | `'class' \| 'media' \| { light?: string \| string[]; dark?: string \| string[] }` | `'class'` | 深浅色策略；自定义选择器也支持数组 |
| `attributifyPseudo` | `boolean` | `false` | 使用属性形式的 group 等标记；不等于启用整个 Attributify preset |
| `arbitraryVariants` | `boolean` | `true` | 任意 Variant 与其专用提取器 |

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

配置优先级按字段为：显式参数 > `UNOCSS_OPTIONS` > 默认值。环境变量必须是 JSON 对象字符串；JSON 解析失败会直接报错。配置在创建 preset 时读取，不跟随浏览器运行时状态变化。多入口开发流程见[接入与迁移](https://github.com/deot/style/blob/main/docs/start/integration.md)。

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

- [选择与安装](https://github.com/deot/style/blob/main/docs/start/installation.md)
- [接入与迁移](https://github.com/deot/style/blob/main/docs/start/integration.md)
- [与 UnoCSS Mini 组合](https://github.com/deot/style/blob/main/docs/unocss/mini.md)
- [工具类参考](https://github.com/deot/style/blob/main/docs/unocss/DOCUMENT.md)
