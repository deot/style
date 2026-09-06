# 选择与安装

本仓库提供两种交付方式。先按项目现有构建链选择，再进入对应配置页：

| 需求 | 选择 | 后续文档 |
| --- | --- | --- |
| 直接引入完整 CSS | `@deot/style` 编译产物 | 本页“预编译 CSS” |
| 自定义主题、单位、缩放或 Sass mixin | `@deot/style` Sass 源码 | [`@deot/style` README](../packages/index/README.md) |
| 项目已使用 UnoCSS，希望按需生成 | `@deot/style-unocss` | [`@deot/style-unocss` README](../packages/unocss/README.md) |

不要同时引入 `@deot/style` 完整 CSS 和 `@deot/style-unocss`，否则同名工具类会被生成两次。Normalize-only、独立 deprecated 兼容 CSS、Sass 函数和 mixin 不属于这项限制。

## 预编译 CSS

### 安装

```bash
pnpm add @deot/style
```

也可以使用 npm：

```bash
npm install @deot/style
```

### 选择样式入口

包内提供以下已编译文件：

| 文件 | 内容 | 适用场景 |
| --- | --- | --- |
| `dist/index.css` | 完整 px 工具类 | 默认 Web 项目 |
| `dist/index.normalize.css` | 完整 px 工具类与 normalize.css | 需要浏览器样式归一化 |
| `dist/index.normalize-only.css` | 仅 normalize.css | 已自行组织其他样式入口 |
| `dist/index.rem.css` | 完整 rem 工具类，数值按 2 倍缩放 | 移动端 REM 方案 |
| `dist/index.rpx.css` | 完整 rpx 工具类，数值按 2 倍缩放 | 微信小程序等 rpx 环境 |
| `dist/index.rem-part.css` | 仅字号、行高、间距，使用 `rg-` 前缀 | 在 px 项目中局部混入 REM |
| `dist/index.deprecated.css` | 仅旧类，无 theme、reset 或当前类 | UnoCSS 项目的临时兼容 |

所有正常入口和分类 Sass 输出都只包含当前类。默认 `g-`、px、scale 1 的旧类兼容方式及映射见 [Deprecated 迁移](./deprecated.md)。

每个页面只应选择一个完整入口，避免相同选择器互相覆盖。

```ts
// 默认 Web 项目
import '@deot/style/dist/index.css';

// 或：带 normalize.css
import '@deot/style/dist/index.normalize.css';
```

### 组合工具类

默认前缀是 `g-`。工具类只负责单一或相近能力，可以按需组合：

```html
<article class="g-flex g-ai-c g-jc-sb g-pd-16 g-br-8 g-bsh">
	<div>
		<h2 class="g-fs-20 g-lh-default">标题</h2>
		<p class="g-c-666 g-m-t-8">说明文字</p>
	</div>
	<span class="g-bg-blue-mid g-c-white g-br-8 g-pd-tb-4 g-pd-lr-8">Active</span>
</article>
```

完整类名见[工具类参考](./DOCUMENT.md)，可运行示例见[Sass/CSS 示例](./playground.md)。

### REM 适配

`Style.useREM(baseWidth)` 会将根元素字号设置为：

```text
document width / baseWidth px
```

默认 `baseWidth` 是 `750`，因此视口宽度始终等于 `750rem`。函数会立即刷新一次，并在窗口 resize 时重新计算。

```ts
import '@deot/style/dist/index.rem.css';
import { Style } from '@deot/style/dist';

Style.useREM();
```

若设计稿以 375 为基准：

```ts
Style.useREM(375);
```

应用生命周期内应只调用一次；当前 API 不返回移除 resize 监听器的方法。

## 使用 Sass 源码

需要自定义前缀、单位或主题时，应由项目的 Sass 构建链直接加载 `src/` 下的模块，而不是再覆盖编译后的 CSS。配置方式见 [`@deot/style` README](../packages/index/README.md)，完整的 Web、REM 与 RPX 加载顺序见[接入与迁移](./integration.md)。

```bash
pnpm add @deot/style
```

```scss
@use '@deot/style/src/variables/default' with (
	$prefix: g-,
	$unit: px,
	$scale: 1
);
@use '@deot/style/src/index';
```

`$prefix` 可以写成 `g` 或 `g-`，两者都会生成 `.g-*`，不会出现重复连字符。

## 使用 UnoCSS Preset

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

再按 UnoCSS 官方方式接入构建插件并在应用入口引入 `virtual:uno.css`。Preset 的参数、环境变量和动态类名处理见 [`@deot/style-unocss` README](../packages/unocss/README.md)。

## 下一步

- 需要按 Web、REM、RPX 或多入口项目组织配置：阅读[接入与迁移](./integration.md)。
- 需要查找具体 `g-*`：阅读[工具类参考](./DOCUMENT.md)。
