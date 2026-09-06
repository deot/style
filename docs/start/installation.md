# 选择与安装

本仓库提供两种包、三种接入路径。新项目先选择一条主样式链路，再按[接入与迁移](./integration.md)配置构建入口。

| 项目需求 | 选择 | 接下来阅读 |
| --- | --- | --- |
| 无需生成工具，直接加载完整 CSS | `@deot/style` 预编译 CSS | [Style 概览与配置](../../packages/index/README.md) |
| 定制 Sass 主题、单位、前缀，或使用函数与 mixin | `@deot/style` Sass 源码 | [Style 概览与配置](../../packages/index/README.md) |
| 按源码 Token 生成 CSS，使用动态值与 variants | `@deot/style-unocss` | [UnoCSS 概览与配置](../../packages/unocss/README.md) |

> 两包共享当前核心工具类语义，但输出范围和 scale 不完全相同。不要在同一页面同时加载完整 Style 工具类 CSS 与 preset 产物；Normalize-only、独立兼容 CSS、Sass 函数和 mixin 不属于重复完整工具类。

## 预编译 CSS

```bash
pnpm add @deot/style
# 或 npm install @deot/style
```

```ts
import '@deot/style/dist/index.css';
```

默认入口使用 g-、px、scale 1。需要 Normalize、REM、RPX 或局部 REM 时，从 [Style 入口表](../../packages/index/README.md)选择对应文件，不叠加多个完整入口。

## Sass 源码

```bash
pnpm add @deot/style
pnpm add -D sass
```

```scss
@use '@deot/style/src/variables/default' with (
	$prefix: g-,
	$unit: px,
	$scale: 1
);
@use '@deot/style/src/index';
```

需要宿主构建工具解析 node_modules 中的 Sass 模块。配置必须先于输出模块加载，完整主题加载顺序见[接入与迁移](./integration.md)。

## UnoCSS

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

配置 preset 后，还需接入构建插件及生成 CSS 的虚拟入口，见[接入与迁移](./integration.md)。默认无需额外添加 Variant Group transformer；Mini rules 不是内置能力。

## 已有项目怎么选

- 继续使用 CSS/Sass：正常入口只含当前类，必要时额外加载唯一的 deprecated 兼容入口。
- 迁入 UnoCSS：先确认单位、数值集合、主题和动态类名，再按[接入与迁移](./integration.md)完成兼容接入。
- 完整旧类映射只在 [Deprecated 兼容与迁移](../style/deprecated.md)维护；兼容 CSS 仅适用于默认 g-、px、scale 1。
- 查类名时按包选择 [UnoCSS 工具类参考](../unocss/DOCUMENT.md)或 [Style 工具类参考](../style/DOCUMENT.md)。
