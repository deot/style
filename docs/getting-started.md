# 快速开始

## 安装

```bash
pnpm add @deot/style
```

也可以使用 npm：

```bash
npm install @deot/style
```

## 选择样式入口

包内提供以下已编译文件：

| 文件 | 内容 | 适用场景 |
| --- | --- | --- |
| `dist/index.css` | 完整 px 工具类 | 默认 Web 项目 |
| `dist/index.normalize.css` | 完整 px 工具类与 normalize.css | 需要浏览器样式归一化 |
| `dist/index.normalize-only.css` | 仅 normalize.css | 已自行组织其他样式入口 |
| `dist/index.rem.css` | 完整 rem 工具类，数值按 2 倍缩放 | 移动端 REM 方案 |
| `dist/index.rpx.css` | 完整 rpx 工具类，数值按 2 倍缩放 | 微信小程序等 rpx 环境 |
| `dist/index.rem-part.css` | 仅字号、行高、间距，使用 `rg-` 前缀 | 在 px 项目中局部混入 REM |

每个页面只应选择一个完整入口，避免相同选择器互相覆盖。

```ts
// 默认 Web 项目
import '@deot/style/dist/index.css';

// 或：带 normalize.css
import '@deot/style/dist/index.normalize.css';
```

## 组合工具类

默认前缀是 `g-`。工具类只负责单一或相近能力，可以按需组合：

```html
<article class="g-flex g-ai-c g-jc-sb g-pd-16 g-br-8 g-bs">
	<div>
		<h2 class="g-fs-20 g-lh-default">标题</h2>
		<p class="g-c-666 g-m-t-8">说明文字</p>
	</div>
	<span class="g-bg-blue-mid g-c-white g-br-8 g-pd-tb-4 g-pd-lr-8">Active</span>
</article>
```

完整类名见[工具类参考](./DOCUMENT.md)，可运行示例见[在线示例](./playground.md)。

## REM 适配

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

需要自定义前缀、单位或主题时，应由项目的 Sass 构建链直接加载 `src/` 下的模块，而不是再覆盖编译后的 CSS。配置方式见 [Sass API](./sass.md)，完整的 Web、REM 与 RPX 加载顺序见[项目接入实践](./integration.md)。
