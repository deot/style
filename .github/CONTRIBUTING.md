# 贡献指南

这篇指南会指导你如何为 `@deot/style` 贡献一份自己的力量，请在你要提 `issue` 或者 `pull request` 之前花几分钟来阅读一遍这篇指南。

## 行为准则

我们有一份 [行为准则](./CODE_OF_CONDUCT.md)，希望所有的贡献者都能遵守，请花时间阅读一遍全文以确保你能明白哪些是可以做的，哪些是不可以做的。

## 透明的开发

我们所有的工作都会放在 [`GitHub`](https://github.com/deot) 上。不管是核心团队的成员还是外部贡献者的 `pull request` 都需要经过同样流程的 `review`。

## 分支管理

当前默认分支为 `main`。修复和功能开发均从 `main` 创建工作分支，并向 `main` 提交 `pull request`；如果维护者为具体任务指定了其他目标分支，以该任务约定为准。

## Bugs

我们使用 [`GitHub Issues`](https://github.com/deot/style/issues) 来做 `bug` 追踪。

在报告 `bug` 之前，请先搜索已有 `issue`，并按[仓库概览](../README.md)确认所用包的配置、工具类范围和迁移说明。

## 新增功能

如果你有改进我们的 `API` 或者新增功能的想法，新建一个添加新功能的 `issue`。

## 第一次贡献

如果你还不清楚怎么在 `GitHub` 上提 `Pull Request` ，可以阅读下面这篇文章来学习：

[如何优雅地在 `GitHub` 上贡献代码](https://segmentfault.com/a/1190000000736629)

为了能帮助你开始你的第一次尝试，我们用 `good first issues` 标记了一些比较比较容易修复的 `bug` 和小功能。这些 `issue` 可以很好地做为你的首次尝试。

如果你打算开始处理一个 `issue`，请先检查一下 `issue` 下面的留言以确保没有别人正在处理这个 `issue`。如果当前没有人在处理的话你可以留言告知其他人你将会处理这个 `issue`，以免别人重复劳动。

如果之前有人留言说会处理这个 `issue` 但是一两个星期都没有动静，那么你也可以接手处理这个 `issue`，当然还是需要留言告知其他人。

## Pull Request

维护者会审查 `pull request`，并根据测试、兼容性和文档情况决定是否合并，或说明需要调整的内容。

**在你发送 `Pull Request` 之前**，请确认你是按照下面的步骤来做的：

1. 按本文“分支管理”选择目标分支。
2. 在项目根目录下运行了 `pnpm install`。
3. 如果你修复了一个 `bug` 或者新增了一个功能，请确保写了相应的测试，这很重要。
4. 运行 `npm run test -- --package-name '*' --no-coverage` 验证两个包；可用 `--package-name index` 或 `--package-name unocss` 单独验证。
5. 运行 `npm run lint:es`；涉及 Sass 时检查相关 Stylelint 结果。完整 `npm run lint` 包含自动修复，应确认其 diff；提交钩子只检查暂存文件，不替代全量验证。


## 开发流程

在你 `clone` 了 `@deot/style` 的代码并使用 `pnpm install` 安装依赖后，可运行以下命令：

1. `npm run dev` 监听两个包的测试；`npm run docs:dev` 构建 Style 并启动文档站。
2. `npm run lint:es` 检查 JS/TS 和 Markdown 代码块。注意现有 `npm run lint` 中的 Stylelint 带自动修复，不是只读检查。
3. `npm run build` 构建各子包到对应 `dist` 目录；`npm run typecheck` 检查类型。
4. 文档按 [仓库概览](../README.md)的三个分组组织。工具类变更同步对应包的参考，旧类仅在 [Deprecated 专页](../docs/style/deprecated.md)维护；两份子包 README 保持独立可读。
