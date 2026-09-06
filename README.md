[ci-image]: https://github.com/deot/style/actions/workflows/ci.yml/badge.svg?branch=main
[ci-url]: https://github.com/deot/style/actions/workflows/ci.yml

[![build status][ci-image]][ci-url]

# @deot/style

本仓库维护一套共享 `g-*` 语义的样式工具，并按两种方式发布：`@deot/style` 提供预编译 CSS 与可配置 Sass，`@deot/style-unocss` 提供按需生成的 UnoCSS preset。

| 包 | 交付方式 | 适用场景 |
| --- | --- | --- |
| `@deot/style` | CSS / Sass | 直接选择 px、rem、rpx、normalize 产物，或从 Sass 源码配置主题 |
| `@deot/style-unocss` | UnoCSS preset | 已使用 UnoCSS，希望按源码 token 生成工具类 |

## 特性

- 两个包默认使用 `g-` 前缀，并覆盖相同的当前公共工具类语义；旧类由 Sass 独立兼容入口提供。
- `@deot/style` 支持配置单位、缩放、前缀、CSS Variables、主题与全局 reset。
- `@deot/style` 提供完整 CSS、normalize、rem、rpx 和局部 rem 构建产物。
- `@deot/style-unocss` 提供本仓库按需规则，并复用 Mini 官方 variants，支持布局、Flex/Grid 子项、交互、排版、标准 Border、Outline、SVG、动态值、CSS Variables 与 Variant Group；Mini rules 由项目按需显式组合。
- 内置 Flex、Grid、浮动栅格、主题变量、BEM mixin 与常用 Sass 函数。
- JavaScript 入口提供 `Style.useREM()`，用于按视口宽度设置根字号。

## 选择并安装

直接使用 CSS 或 Sass：

```bash
pnpm add @deot/style
```

已经使用 UnoCSS：

```bash
pnpm add -D unocss @deot/style-unocss
```

完整选择依据见[选择与安装](./docs/getting-started.md)。

## CSS / Sass 基础用法

```ts
import '@deot/style/dist/index.css';
```

```html
<section class="g-flex g-ai-c g-jc-sb g-pd-16">
	<strong class="g-c-info">@deot/style</strong>
	<span class="g-bg-gray-mid g-br-8 g-pd-lr-8 g-pd-tb-4">ready</span>
</section>
```

需要包含 normalize.css 时改为：

```ts
import '@deot/style/dist/index.normalize.css';
```

## UnoCSS 基础用法

```ts
import { defineConfig } from 'unocss';
import { presetStyle } from '@deot/style-unocss';

export default defineConfig({
	presets: [presetStyle()]
});
```

## 文档

- [选择与安装](./docs/getting-started.md)：先确定 CSS、Sass 或 UnoCSS 接入方式。
- [接入与迁移](./docs/integration.md)：Web、REM、RPX、UnoCSS 和多入口开发场景。
- [Deprecated 迁移](./docs/deprecated.md)：旧类映射、独立兼容 CSS 和迁移边界。
- [`@deot/style-unocss`](./packages/unocss/README.md)：按需规则、配置语义与动态类名。
- [与 UnoCSS Mini 组合](./docs/unocss-mini.md)：规则来源、覆盖结果和 Mini-only token 迁移。
- [`@deot/style` Sass](./packages/index/README.md)：配置、主题、函数和 mixin。
- [工具类参考](./docs/DOCUMENT.md)：完整的 `g-*` 类说明。
- [Sass/CSS 示例](./docs/playground.md)：交互式体验布局、工具类和 REM。

## 本地开发

```bash
pnpm install

# 监听测试
npm run dev

# 启动文档站
npm run docs:dev

# 全量测试、类型检查与构建
npm run test -- --package-name '*'
npm run typecheck
npm run build

# 单独验证包
npm run test -- --package-name index --no-coverage
npm run test -- --package-name unocss --no-coverage

# 代码检查
npm run lint
```

## 贡献

- [贡献指南](./.github/CONTRIBUTING.md)
- License: MIT
