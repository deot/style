# 参考与示例

本页介绍 `@deot/style` 的主题键、Sass 函数与 mixin、JavaScript REM API，以及使用当前 CSS 的交互示例。配置入口见[概览与配置](../../packages/index/README.md)，查类名请用 [Style 工具类参考](./DOCUMENT.md)。

## 主题键参考

| 键 | 默认值 |
| --- | --- |
| `color-default` | `#515a6e` |
| `color-highlight` | `#5495f6` |
| `color-info` | `#0177de` |
| `color-success` | `#00a854` |
| `color-error` | `#f04134` |
| `color-warning` | `#ffbf00` |
| `background-color-default` | `#f5f6fa` |
| `background-color-highlight` | `#5495f6` |
| `border-radius-default` | `8px` |
| `border-shadow-default` | `0 0 8px 0 rgb(0 0 0 / 10%)` |
| `border-shadow-default-top` | `0 -2px 10px 0 rgb(0 0 0 / 8%)` |
| `line-height-default` | `1.5` |
| `line-height-limit` | `32px` |
| `border-color-default` | `#c9c9c9` |
| `font-size-default` | `14px` |
| `font-size-large` | `16px` |
| `scrollbar-track-bg-color` | `rgb(0 0 0 / 0%)` |
| `scrollbar-thumb-bg-color` | `rgb(0 0 0 / 20%)` |
| `scrollbar-track-box-shadow` | `inset 0 0 10px rgb(0 0 0 / 0%)` |

以上为 g-、px、scale 1 下的默认值；固定尺寸随 unit/scale 变化。启用 CSS Variables 时，`src/outputs/theme.scss` 会把完整主题输出到 `:root`；关闭后，`themefix()` 会直接返回 map 中的具体值。

## 函数

### Helper

从 `src/functions/helper` 加载：

| 函数 | 说明 |
| --- | --- |
| `merge($rest...)` | 合并传入的 map 或嵌套 list 中的 map |
| `prefix($rest...)` | 根据 `prefix` 与 `name` 生成类选择器前缀 |
| `unitfix($value, $rest...)` | 缩放数字并补单位；字符串保持原值 |
| `suffix($value, $rest...)` | 缩放数字类名后缀；字符串保持原值 |
| `percentw($col, $total)` | 将分栏比例转换为百分比 |
| `remfix($value, $rest...)` | 输出 `calc(var(--rem, calc(100vw / 750)) * n)`，配合 `Style.useREM()`；n 按 750 画布取值，不乘 `$scale` |

```scss
@use '@deot/style/src/functions/helper' as helper;

.card {
	padding: helper.unitfix(16);
	width: helper.percentw(1, 3);
	height: helper.remfix(24);
}
```

`remfix(24)` 与手写 `24rem` 同一坐标系。默认读取 `$rem-var`（`--rem`），可用 `(rem: --unit)`、`(base-width: 375)` 覆盖；`$scale` 不会改变输出。与 `Style.useREM()` 的配合见下文。

### Theme

从 `src/functions/theme` 加载：

```scss
@use '@deot/style/src/functions/theme' as theme;

.card {
	color: theme.themefix(color-default);
	box-shadow: theme.themefix(border-shadow-default);
}
```

## Common mixin

从 `src/mixins/common` 加载：

| Mixin | 说明 |
| --- | --- |
| `common-bg-linear($angle: to bottom, $start: #fff, $end: #000)` | 输出线性渐变及终点纯色回退 |
| `common-flex` | Flex 容器与 border-box |
| `common-flex-cc` | Flex 水平垂直居中 |
| `common-break` | 长文本与连续字符换行 |
| `common-ellipsis` | 单行省略 |
| `common-text-line($line)` | 指定行数截断 |
| `common-clear-fix($content: false)` | 清除浮动；true 时在伪元素内接收内容块 |
| `common-scroll($size: 4)` | WebKit 滚动条样式，尺寸通过 unitfix 处理 |
| `common-border-1px($direction: '', $color, $border-radius: inherit)` | 空方向为全边，或 top/right/bottom/left；颜色必传，适配 2x/3x 屏 |

## BEM mixin

从 `src/mixins/bem` 加载。默认使用 `__` 连接元素、`--` 连接修饰符，并提供 `is-` 与 `has-` 状态前缀。

```scss
@use '@deot/style/src/mixins/bem' as *;

@include block(card) {
	@include element(title) {
		font-weight: 600;
	}

	@include modifier(active) {
		@include when(selected) {
			color: #0177de;
		}
	}
}
```

| Mixin | 参数与行为 |
| --- | --- |
| `block($block)` | 定义块并建立后续元素的命名上下文 |
| `element($element, $root: true)` | 支持元素列表；默认将普通元素选择器置顶 |
| `modifier($modifier, $root: true)` | 支持修饰符列表；默认置顶普通修饰符选择器 |
| `when($state, $useHas: false)` | 当前选择器追加 is- 状态；true 时使用 has- |
| `pseudo($pseudo)` | 在当前选择器追加单冒号伪类，例如 hover |
| `configurable-m($modifier, $E-flag: false)` | 当前选择器下生成块或指定元素的修饰符 |
| `spec-selector($specSelector: '', $element: $E, $modifier: false, $block: $B)` | 与指定元素选择器组合，可传入连接符 |
| `meb($modifier: false, $element: $E, $block: $B)` | 当前选择器下生成指定块的元素/修饰符 |
| `share-rule($name)` / `extend-rule($name)` | 定义/扩展 `%shared-` 占位规则 |

`$B/$E` 是最近一次 block/element 的上下文，不是调用方必须提供的参数。模块还提供选择器辅助函数 `selector-to-string`、`contains-modifier`、`contain-when-flag`、`contain-pseudo-class` 和 `hit-all-special-nest-rule`，分别用于字符串化或判断修饰符、状态、伪类及其组合；一般业务使用上述 mixin 即可。


## JavaScript：Style.useREM

`Style.useREM(baseWidth, options)` 按视口宽度计算：

```text
document width / baseWidth px
```

默认 `baseWidth` 是 `750`。函数会立即刷新一次，并在窗口 resize 时重新计算。默认同时注入根元素 `font-size`（`!important`）和 CSS 变量 `--rem`：

- `font-size`：使 `750rem` 等于视口宽度，配合预编译 rem 工具类
- `--rem`：供 Sass `remfix()` 使用，不依赖根字号；未注入时 `remfix` 回退为 `calc(100vw / 750)`

```ts
import '@deot/style/dist/index.rem.css';
import { Style } from '@deot/style/dist';

Style.useREM();
```

第二个参数控制注入哪些属性，可只注入其中一项，也可同时注入：

| 选项 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `fontSize` | `boolean` | `true` | 注入根元素 `font-size` |
| `rem` | `boolean \| string` | `true` | `true` 注入 `--rem`；`false` 不注入；字符串作为变量名（无 `--` 时自动补上） |

```ts
Style.useREM(750, { rem: false });
Style.useREM(750, { fontSize: false });
Style.useREM(750, { rem: '--unit' });
```

只注入 `--rem` 时，页面上的 `rem` 单位不会随视口变化。业务手写尺寸用 `remfix()` 辅助处理：

```scss
@use '@deot/style/src/functions/helper' as helper;

.card {
	width: helper.remfix(24);
}
```

自定义变量名时，Sass `$rem-var` 或 `remfix(..., (rem: --unit))` 需与 `useREM` 的 `rem` 选项一致。

`index.rem.css` 固定使用 scale 2，示例与 750 宽设计稿搭配。若改用 375 宽设计稿，应从 Sass 源码配置 `$unit: rem`、`$scale: 1` 并加载生成的样式，再调用：

```ts
Style.useREM(375);
```

`baseWidth` 只控制注入值的计算，不改变 CSS 产物的单位、类名或 scale；仅把 `750` 改为 `375`，不会把预编译 scale 2 的 CSS 转为 scale 1。`remfix` 也不乘 `$scale`。Sass 加载顺序见[接入与迁移](../start/integration.md)。

应用生命周期内应只调用一次；当前 API 不返回移除 resize 监听器的方法。


## CSS 交互示例

以下示例由文档站加载 `@deot/style/dist/index.css` 后直接运行，可以切换到 Files 查看和修改源码。它们用于体验预编译 Sass/CSS 产物，不会在浏览器中启动 UnoCSS generator；UnoCSS 的按需规则与配置见 [`@deot/style-unocss` README](../../packages/unocss/README.md)。

### Flex 布局实验

选择主轴方向与对齐方式，观察 `g-flex` 相关类的组合效果。

:::playground
<!--
<config lang="json5">
{
	views: ['runtime', 'files'],
	viewport: 'auto',
	viewportOptions: ['auto', 375, [768, 560]]
}
</config>
-->
```vue
<script setup>
import { ref } from 'vue';

const direction = ref('g-fd-r');
const justify = ref('g-jc-sb');
const align = ref('g-ai-c');
</script>

<template>
	<main class="demo g-pd-16">
		<div class="controls">
			<label>方向
				<select v-model="direction">
					<option value="g-fd-r">row</option>
					<option value="g-fd-c">column</option>
					<option value="g-fd-rr">row-reverse</option>
				</select>
			</label>
			<label>主轴
				<select v-model="justify">
					<option value="g-jc-fs">flex-start</option>
					<option value="g-jc-c">center</option>
					<option value="g-jc-sb">space-between</option>
				</select>
			</label>
			<label>交叉轴
				<select v-model="align">
					<option value="g-ai-fs">flex-start</option>
					<option value="g-ai-c">center</option>
					<option value="g-ai-fe">flex-end</option>
				</select>
			</label>
		</div>

		<code>{{ ['g-flex', direction, justify, align].join(' ') }}</code>
		<section :class="['g-flex', direction, justify, align]" class="stage g-br-8 g-bd g-pd-16">
			<div class="item g-flex-cc g-c-white g-br-8 g-bg-blue-mid">A</div>
			<div class="item g-flex-cc g-c-white g-br-8 g-bg-purple-mid">B</div>
			<div class="item g-flex-cc g-c-white g-br-8 g-bg-orange-mid">C</div>
		</section>
	</main>
</template>

<style scoped>
.demo { display: grid; gap: 16px; width: min(100%, 720px); box-sizing: border-box; }
.controls { display: flex; flex-wrap: wrap; gap: 12px; }
label { display: grid; gap: 4px; font: 13px/1.5 system-ui; }
select { min-width: 140px; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: white; }
code { overflow-wrap: anywhere; color: #475569; }
.stage { min-height: 220px; gap: 12px; background: #f8fafc; }
.item { width: 72px; height: 72px; flex: 0 0 72px; font: 700 22px/1 system-ui; }
</style>
```
:::

### 工具卡片组合

切换预设，查看间距、颜色、圆角、阴影与文本工具类如何共同组成卡片。

:::playground
<!--
<config lang="json5">
{
	views: ['runtime', 'files'],
	viewport: 375,
	viewportOptions: ['auto', 375, 768]
}
</config>
-->
```vue
<script setup>
import { ref } from 'vue';

const presets = [
	{ name: 'Info', classes: ['g-bg-blue-mid', 'g-c-white', 'g-br-8', 'g-pd-24'] },
	{ name: 'Soft', classes: ['g-bg-gray-mid', 'g-c-333', 'g-br-16', 'g-pd-16', 'g-bsh'] },
	{ name: 'Warning', classes: ['g-bg-warning', 'g-c-333', 'g-br-4', 'g-pd-12'] }
];
const selected = ref(presets[0]);
</script>

<template>
	<main class="demo g-pd-16">
		<div class="g-flex g-fwr-w controls">
			<button
				v-for="preset in presets"
				:key="preset.name"
				:class="{ active: selected === preset }"
				@click="selected = preset"
			>{{ preset.name }}</button>
		</div>

		<article :class="selected.classes">
			<strong class="g-fs-20">组合优于覆盖</strong>
			<p class="g-line-2 g-lh-default g-m-t-8">
				每个工具类只负责一项清晰能力，页面可以根据状态切换整组类名。
			</p>
		</article>
		<code>{{ selected.classes.join(' ') }}</code>
	</main>
</template>

<style scoped>
.demo { display: grid; gap: 16px; width: min(100%, 560px); box-sizing: border-box; font-family: system-ui; }
.controls { gap: 8px; }
button { padding: 7px 12px; cursor: pointer; border: 1px solid #cbd5e1; border-radius: 6px; background: white; }
button.active { color: white; border-color: #2563eb; background: #2563eb; }
article { min-height: 130px; box-sizing: border-box; transition: all 180ms ease; }
p { max-width: 32em; }
code { overflow-wrap: anywhere; color: #475569; }
</style>
```
:::

### REM 适配

示例使用 `Style.useREM(375)` 和手写的 `160rem` 尺寸，不加载 scale 2 的 `index.rem.css`。切换预览宽度时，根字号与使用 rem 的方块会同步变化。

:::playground
<!--
<config lang="json5">
{
	views: ['runtime', 'files'],
	viewport: 375,
	viewportOptions: [375, 768, 'auto']
}
</config>
-->
```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Style } from '@deot/style/dist';

const rootSize = ref('');
const viewportWidth = ref(0);
const update = () => {
	rootSize.value = getComputedStyle(document.documentElement).fontSize;
	viewportWidth.value = document.documentElement.getBoundingClientRect().width;
};

onMounted(() => {
	Style.useREM(375);
	update();
	window.addEventListener('resize', update);
});

onBeforeUnmount(() => window.removeEventListener('resize', update));
</script>

<template>
	<main class="demo">
		<div class="box">160rem</div>
		<dl>
			<div><dt>viewport</dt><dd>{{ viewportWidth.toFixed(0) }}px</dd></div>
			<div><dt>root font-size</dt><dd>{{ rootSize }}</dd></div>
		</dl>
		<p>计算公式：viewport width / 375</p>
	</main>
</template>

<style scoped>
.demo { display: grid; gap: 16px; padding: 16px; box-sizing: border-box; font: 14px/1.5 system-ui; }
.box {
	display: grid;
	width: 160rem;
	height: 80rem;
	place-items: center;
	color: white;
	border-radius: 12px;
	background: linear-gradient(135deg, #2563eb, #7c3aed);
}
dl { display: grid; gap: 8px; margin: 0; }
dl div { display: flex; justify-content: space-between; gap: 24px; }
dt { color: #64748b; }
dd { margin: 0; font-family: ui-monospace, monospace; }
p { margin: 0; color: #64748b; }
</style>
```
:::
