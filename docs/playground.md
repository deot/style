# Sass/CSS 示例

以下示例由文档站加载 `@deot/style/dist/index.css` 后直接运行，可以切换到 Files 查看和修改源码。它们用于体验预编译 Sass/CSS 产物，不会在浏览器中启动 UnoCSS generator；UnoCSS 的按需规则与配置见 [`@deot/style-unocss` README](../packages/unocss/README.md)。

## Flex 布局实验

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
		<section :class="['g-flex', direction, justify, align]" class="stage g-br-8 g-b g-pd-16">
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

## 工具卡片组合

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
	{ name: 'Soft', classes: ['g-bg-gray-mid', 'g-c-333', 'g-br-16', 'g-pd-16', 'g-bs'] },
	{ name: 'Warning', classes: ['g-bg-warning', 'g-c-333', 'g-br-4', 'g-pd-12'] }
];
const selected = ref(presets[0]);
</script>

<template>
	<main class="demo g-pd-16">
		<div class="g-flex g-fw-w controls">
			<button
				v-for="preset in presets"
				:key="preset.name"
				:class="{ active: selected === preset }"
				@click="selected = preset"
			>{{ preset.name }}</button>
		</div>

		<article :class="selected.classes">
			<strong class="g-fs-20">组合优于覆盖</strong>
			<p class="g-line-two g-lh-default g-m-t-8">
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

## REM 适配

示例使用 `Style.useREM(375)`。切换预览宽度时，根字号与使用 rem 的方块会同步变化。

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
