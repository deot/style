[ci-image]: https://github.com/deot/style/actions/workflows/ci.yml/badge.svg?branch=main
[ci-url]: https://github.com/deot/style/actions/workflows/ci.yml

[![build status][ci-image]][ci-url]

# @deot/style

`@deot/style` 是一套可配置的 Sass/CSS 基础样式与工具类。它提供布局、间距、颜色、排版、边框、图片和辅助类，并产出 px、rem、rpx 与 normalize 等多种样式入口。

## 特性

- 默认使用 `g-` 前缀，工具类可直接组合。
- Sass 源码支持配置单位、缩放、类名前缀、CSS Variables 与全局 reset。
- 内置 Flex、浮动栅格、主题变量、BEM mixin 与常用样式函数。
- 同时提供完整 CSS、normalize、rem、rpx 和局部 rem 构建产物。
- JavaScript 入口提供 `Style.useREM()`，用于按视口宽度设置根字号。

## 安装

```bash
pnpm add @deot/style
```

## 基础用法

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

## 文档

- [快速开始](./docs/getting-started.md)：安装、构建产物与 REM 适配。
- [项目接入实践](./docs/integration.md)：Web、REM、RPX 与业务扩展的常见接法。
- [Sass API](./docs/sass.md)：配置、主题、函数和 mixin。
- [在线示例](./docs/playground.md)：交互式体验布局、工具类和 REM。
- [工具类参考](./docs/DOCUMENT.md)：完整的 `g-*` 类说明。

## 本地开发

```bash
pnpm install

# 监听测试
npm run dev

# 启动文档站
npm run docs:dev

# 测试、类型检查与构建
npm run test
npm run typecheck
npm run build

# 代码检查
npm run lint
```

## 贡献

- [贡献指南](./.github/CONTRIBUTING.md)
- License: MIT
