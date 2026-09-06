# Deprecated 兼容与迁移

本页集中记录已随 `@deot/style` 发布、目前废弃的工具类。最新工具类参考只展示当前命名；开发期间改名但未发布的 UnoCSS token 不属于 deprecated。

下一主版本中，`@deot/style-unocss` 删除旧类的 matcher，只生成最新规则。`@deot/style` 将旧类集中到 `src/outputs/deprecated.scss`，提供独立兼容入口，帮助项目逐步替换旧类。

## 入口与加载范围

| 入口 | 输出 |
| --- | --- |
| `@deot/style/dist/index.css` | 当前完整工具类、theme 和 reset，不含 deprecated |
| `@deot/style/dist/index.normalize.css` | 当前完整样式与 Normalize，不含 deprecated |
| `@deot/style/dist/index.rem.css` / `index.rpx.css` | 相应配置下的当前样式，不含 deprecated |
| `@deot/style/dist/index.deprecated.css` | 默认 `g-`、`px`、`scale: 1` 配置下的旧类，无 theme、reset 和最新类 |
| `@deot/style/src/index.deprecated.scss` | 仅 `@use "./outputs/deprecated"`，对应上述默认兼容入口 |
| `@deot/style/dist/index.rem-part.css` | 仅当前字号、行高和间距，使用 `rg-`；不包含 deprecated |

所有正常 Sass/CSS 入口和分类 `outputs/*.scss` 都只生成当前类。仍需要旧类时，显式加载唯一的独立兼容入口。

## UnoCSS 项目临时兼容

使用包含上述入口的新版本 `@deot/style`：

```bash
pnpm add @deot/style
```

应用入口：

```ts
import '@deot/style/dist/index.deprecated.css';
import 'virtual:uno.css';
```

UnoCSS 配置继续使用 `presetStyle()`。其变量 preflight 默认提供兼容类依赖的 `--border-color-default`、`--border-shadow-default`、`--border-shadow-default-top` 和 `--line-height-limit`。单独使用兼容 CSS、或项目自行关闭 preflights 时，应先由项目主题提供这些变量，也可以单独加载 Sass 的 `outputs/theme`。兼容 CSS 本身不定义主题变量。

逐步替换旧类，完成迁移后移除独立兼容 CSS。普通 CSS 项目若还需要当前工具类，应先加载兼容入口，再加载 `@deot/style/dist/index.css`，让当前声明保持更高的层叠优先级。

兼容产物固定为默认 `g-`、px、scale 1，不读取 `UNOCSS_OPTIONS`，也不提供 rem、rpx、`rg-` 或其他自定义配置的预编译入口。这些项目应直接迁移旧类。

## 完整迁移映射

下表使用兼容入口固定的 `g-` 前缀。

| 旧类 | 最新类 | 行为差异或说明 |
| --- | --- | --- |
| `g-col`、`g-col-2` | `g-f-1`、`g-f-2` | 分别为 `flex: 1` 和 `flex: 2` |
| `g-{part}of{total}` | `g-f-{part}/{total}` | `flex: 0 0 百分比`；旧 Sass 范围为 `g-1of1`，以及 total 为 2～5、part 为 1～total−1 的分数 |
| `g-fw-w`、`g-fw-wr`、`g-fw-n` | `g-fwr-w`、`g-fwr-wr`、`g-fwr-n` | Flex Wrap，分别为 wrap、wrap-reverse、nowrap |
| `g-fw-{part}`（part 为 1～12） | `g-fl-{part}/12` | 浮动十二列栅格；UnoCSS 暂不复用 1～12 为字重，当前数字字重范围仍为 13～1000 |
| `g-row` | `g-fl-row` | 浮动行容器与清除浮动 |
| `g-img-{n}` | `g-image-{n}` | 图片宽高、最大/最小宽度及行高 |
| `g-imgc-{n}` | `g-image-circle-{n}` | 图片尺寸加圆形圆角 |
| `g-imgr-{n}` | `g-image-radius-{n}` | 图片尺寸加默认 `4px` 圆角 |
| `g-b`、`g-bt`、`g-br`、`g-bb`、`g-bl` | `g-bd`、`g-bdt`、`g-bdr`、`g-bdb`、`g-bdl` | 高清伪元素边框；不要把裸 `g-br` 与仍有效的 `g-br-{n}` 圆角混淆 |
| `g-bs`、`g-bs-t` | `g-bsh`、`g-bsh-t` | 主题阴影 |
| `g-tc`、`g-tl`、`g-tr` | `g-ta-c`、`g-ta-l`、`g-ta-r` | 都保留文本对齐的 `!important` |
| `g-td-lh`、`g-td-ul` | `g-tdl-lt`、`g-tdl-ul` | 旧规则是带 `!important` 的 `text-decoration` 简写；新规则只设置普通 `text-decoration-line`，不重置装饰线的其他属性 |
| `g-nowrap` | `g-ws-nw` | 新规则不带 `!important`；需要原强制不换行语义时使用 `g-line-nowrap` |
| `g-break` | `g-line-wrap` | 复合换行规则 |
| `g-line-one`、`g-line-two` | `g-line-1`、`g-line-2` | 一行、两行文本截断 |
| `g-height-full`、`g-width-full` | `g-h-full`、`g-w-full` | 百分比尺寸 |
| `g-dp-n`、`g-dp-b`、`g-dp-i`、`g-dp-ib` | `g-d-n`、`g-d-b`、`g-d-i`、`g-d-ib` | Display，保留 `!important` |
| `g-divide` | `g-divider` | 分隔线 |
| `g-bs-bb` | `g-bsz-bb` | `box-sizing: border-box` |
| `g-lh-one`、`g-lh-two` | 无直接替代 | deprecated 仍保留高度和行高；迁移时按业务需要组合高度与行高，不应换成文本截断类 |

`g-lh-one/two` 在默认 CSS Variables 配置下保持：

```css
.g-lh-one {
	height: var(--line-height-limit);
	line-height: var(--line-height-limit);
}

.g-lh-two {
	height: calc(var(--line-height-limit) * 2);
	line-height: var(--line-height-limit);
}
```

## 兼容边界与破坏性变更

- **静态范围**：默认旧图片尺寸为 `256, 150, 128, 100, 96, 64, 56, 40, 32, 24`；旧 Flex 分数仅为上表范围。旧 UnoCSS 动态 token 如 `g-img-37`、`g-3of7` 不由默认兼容 CSS 生成，应迁移为 `g-image-37`、`g-f-3/7`。历史循环意外生成的 `g-0of1` 不属于受支持语义，不保留。
- **Variants**：静态 CSS 不恢复旧 UnoCSS variants。`hover:g-col` 应改为 `hover:g-f-1`，`md:g-img-37` 应改为 `md:g-image-37`；分组语法中的旧类也必须替换。
- **层叠顺序**：同时加载当前 CSS 时，应先加载 deprecated，再加载当前入口。迁移时直接替换旧类，避免在同一元素叠加新旧定义；HTML class 的书写顺序不决定 CSS 优先级。
- **单位与前缀**：rem、rpx、`rg-` 和其他自定义配置没有兼容产物，应直接迁移。`index.rem-part.css` 不再包含此前的 `rg-lh-one/two`。
- **Mini 组合**：本 preset 移除旧 matcher 后，旧名可能落到 Mini 的其他规则，例如 `g-b` 会由 Mini 生成 `border-width: 1px`，不再由本 preset 生成高清伪元素边框。静态兼容 CSS 与 Mini 生成的声明可能叠加，调整导入顺序不能消除不同属性之间的冲突；请优先迁移这些旧名。组合配置见[与 UnoCSS Mini 组合](./unocss-mini.md)。

## 相关文档

- [当前工具类参考](./DOCUMENT.md)
- [UnoCSS 配置](../packages/unocss/README.md)
- [Sass 配置与主题](../packages/index/README.md)
- [接入与迁移](./integration.md)
