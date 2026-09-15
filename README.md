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

- 两个包默认使用 `g-` 前缀；UnoCSS 覆盖 Style 当前核心工具类，并提供额外动态规则。两包输出范围和 scale 行为不同，旧类由 Sass 独立兼容入口提供。
- `@deot/style` 支持配置单位、缩放、前缀、CSS Variables、主题与全局 reset。
- `@deot/style` 提供完整 CSS、normalize、rem、rpx 和局部 rem 构建产物。
- `@deot/style-unocss` 提供本仓库按需规则，并复用 Mini 官方 variants，支持布局、Flex/Grid 子项、交互、排版、标准 Border、Outline、SVG、动态值、CSS Variables 与 Variant Group；Mini rules 由项目按需显式组合。
- 两包均提供 Flex、Grid、浮动栅格和主题变量；BEM mixin 与 Sass 函数由 `@deot/style` 提供。
- JavaScript 入口提供 `Style.useREM()`，用于按视口宽度设置根字号和 `--rem`；Sass `remfix()` 可按同一坐标系写尺寸。

## 阅读导航

按“开始使用 → 对应包配置 → 对应包工具类”阅读：

### 开始使用

- [选择与安装](./docs/start/installation.md)：比较 CSS、Sass 与 UnoCSS，安装所需依赖。
- [接入与迁移](./docs/start/integration.md)：构建插件、Web/REM/RPX、多入口开发，以及 UnoCSS 接入兼容 CSS 的步骤。

### UnoCSS · @deot/style-unocss

- [概览与配置](./packages/unocss/README.md)：preset 参数、variants、环境变量和 safelist。
- [工具类参考](./docs/unocss/DOCUMENT.md)：自有规则、完整取值范围、动态值与输出。
- [presetMini 组合、覆盖与配置](./docs/unocss/mini.md)：本仓库有、Mini 有、同名覆盖及配置归属。

### Style · @deot/style

- [概览与配置](./packages/index/README.md)：预编译入口、Sass 配置、主题和按需加载。
- [工具类参考](./docs/style/DOCUMENT.md)：实际 Sass/CSS 输出及有限数值集合。
- [Deprecated 兼容与迁移](./docs/style/deprecated.md)：唯一兼容入口、旧类映射和边界。
- [参考与示例](./docs/style/reference-examples.md)：主题键、函数、mixin、REM API 与交互示例。

两份工具类参考只展示当前规则，历史类名仅在 Deprecated 专页维护。不要同时加载完整 Style CSS 和 UnoCSS 工具类产物。

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

# 代码检查（包含 Stylelint 自动修复）
npm run lint
```

## 贡献

- [贡献指南](./.github/CONTRIBUTING.md)
- License: MIT
