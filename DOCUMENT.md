[1. 准则](#1)  

[2. 文件目录](#2)

[3. 命名规范](#3) 

[4. 使用方式](#4)

[5. 样式输出](#5)

* [ 5.1 主题 ](#5.1) 
* [ 5.2 Flex ](#5.2) 
* [ 5.3 Layout ](#5.3) 
* [ 5.4 柵格 ](#5.4) 
* [ 5.5 网格 ](#5.5) 
* [ 5.6 定位 ](#5.6) 
* [ 5.7 辅助 ](#5.7) 
* [ 5.8 动画 ](#5.8) 

### <h3 id="1">1. 准则</h3>

1. 以flex布局为主，栅格布局、固定布局、流体布局，绝对定位布局，浮动布局等为辅的一套css样式表。
2. 常见的flex布局和flex单个属性类。
3. 辅助布局类。

### <h3 id="2">2. 文件目录</h3>

```console
+ functions                定义公共的函数
+ mixins                   定义公共的方法
  - bem.scss               BEM规范
  - common.scss            公共方法
+ outputs                  输出实体的样式
  - flex.scss              输出flex布局
  - ...
+ scripts                  用于兼容
  - ...
+ variables                常量
    - default.scss         默认值
    - colors.scss          颜色的具体数值
    - theme.scss           主题控制
- index.scss               输出浏览器可用的（含outputs全部）
- index.normalize.scss     比上面多一个normalize.css 
- index.rpx.scss           生成微信可用的rpx，且2倍屏（scale: 2）
- index.rem.scss           生成移动端可用rem，且2倍屏（scale: 2）
- index.rem-part.scss      仅含（边距，行高，字体），2倍屏（scale: 2）, 前缀rg-。用于浏览器混入rem开发相关

- ...
```

### <h3 id="3">3. 命名规范</h3>

 - `g-*`
 - [bem](./src/mixins/bem.scss)


### <h3 id="4">4. 使用方法</h3>
在需要引用公共变量的时候，一般里面可以去改变全局的颜色，边距，单位等变量。

```scss
  @import "../themes/default"; // 公共变量
```
在需要引用公共方法的时候，可以去调用全局定义的方法，例如：`@include commonScale(100px)`。

```scss
  @import "../mixins/common"; // 公共方法
```
在需要引用动画方法的时候，定义了例如： `@keyframes animate-fadeIn` 淡入等动画。

```scss
  @import "../mixins/animate"; // 公共动画
```

###  <h3 id="5">5. 样式输出</h3>
####  <h5 id="5.1"> 5.1 [主题](./src/variables/theme.scss) </h5>

| 值                          | 备注 | 取值                               |
| -------------------------- | -- | -------------------------------- |
| color-default              | -  | #f5f6fa                          |
| color-highlight            | -  | #5495f6                          |
| color-info                 | -  | #0177de                          |
| color-success              | -  | #00a854                          |
| color-error                | -  | #f04134                          |
| color-warning              | -  | #ffbf00                          |
| background-color-default   | -  | #f5f6fa                          |
| background-color-highlight | -  | #5495f6                          |
| border-radius-default      | -  | 8px                              |
| border-shadow-default      | -  | 0 0 8px 0 rgba(0, 0, 0, .1)      |
| border-shadow-default-top  | -  | 0 -2px 10px 0 rgba(0, 0, 0, .08) |
| line-height-default        | -  | 16px                             |
| line-height-limit          | -  | 32px                             |
| border-color-default       | -  | #c9c9c9                          |
| font-size-default          | -  | 14px                             |
| font-size-large            | -  | 16px                             |
| scrollbar-track-bg-color   | -  | rgba(0, 0, 0, 0)                 |
| scrollbar-thumb-bg-color   | -  | rgba(0, 0, 0, .2)                |
| scrollbar-track-box-shadow | -  | inset 0 0 10px rgba(0, 0, 0, 0)  |

- 所有用主题的样式用[themefix](./src/functions/theme.scss)
- 可以用过`$theme-merge-data`增加，类型map

####  <h5 id="5.2"> 5.2 [Flex](./src/outputs/flex.scss) </h5>

##### 布局

| class        | 备注     | 关键代码                                           |
| ------------ | ------ | ---------------------------------------------- |
| .g-flex      | flex布局 | `display: flex`                                |
| .g-flex-holy | 圣杯布局   | `-`                                            |
| .g-flex-cc   | 水平垂直居中 | `justify-content: center; align-items: center` |
| .g-flex-ac   | 垂直居中   | `align-items: center`                          |
| .g-col       | 占一位    | `flex: 1`                                      |
| .g-col-2     | 占两位    | `flex: 2`                                      |
| .g-1of1      | 铺满     | `flex: 0 0 100%`                               |
| .g-1of2      | 占50%   | `flex: 0 0 50%`                                |
| .g-1of3      | 占1/3   | `flex: 0 0 33.33333333%`                       |
| .g-2of3      | 占2/3   | `flex: 0 0 66.66666666%`                       |
| .g-1of4      | 占1/4   | `flex: 0 0 25%`                                |
| .g-3of4      | 占3/4   | `flex: 0 0 75%`                                |
| .g-1of5      | 占1/5   | `flex: 0 0 20%`                                |
| .g-2of5      | 占2/5   | `flex: 0 0 40%`                                |
| .g-3of5      | 占3/5   | `flex: 0 0 60%`                                |
| .g-4of5      | 占4/5   | `flex: 0 0 80%`                                |


##### 单个属性类 以g-(属性名首字母)-(属性值首字母) 命名

| <div style="width: 65px;">class</div>    | 备注                                               | 关键代码                             |
| -------- | ------------------------------------------------ | -------------------------------- |
| .g-fd-c  | 主轴为垂直方向，起点在上                                     | `flex-direction: column`         |
| .g-fd-cr | 主轴为垂直方向，倒序                                       | `flex-direction: column-reverse` |
| .g-fd-r  | 主轴为水平方向，起点在左                                     | `flex-direction: row`            |
| .g-fd-rr | 主轴为水平方向，起点在右                                     | `flex-direction: row-reverse`    |
| .g-fw-w  | 换行，第一行在上方。                                       | `flex-wrap: wrap`                |
| .g-fw-wr | 换行，第一行在下方。                                       | `flex-wrap: wrap-reverse`        |
| .g-fw-n  | 不换行                                              | `flex-wrap: nowrap`              |
| .g-jc-fs | 位于容器的开头                                          | `justify-content: flex-start`    |
| .g-jc-fe | 位于容器的结尾                                          | `justify-content: flex-end`      |
| .g-jc-c  | 位于容器的中心                                          | `justify-content: center`        |
| .g-jc-sb | 两端对齐, 间隔相等                                       | `justify-content: space-between` |
| .g-jc-sa | 间隔相等                                             | `justify-content: space-around`  |
| .g-ai-fs | 侧轴方向, 位于容器的开头, 主轴方向排列                            | `align-items: flex-start`        |
| .g-ai-fe | 侧轴方向, 位于容器的结尾, 主轴方向排列                            | `align-items: flex-end`          |
| .g-ai-c  | 侧轴方向, 位于容器的中心, 主轴方向排列                            | `align-items: center`            |
| .g-ai-b  | 侧轴方向, 位于容器的基线上, 主轴方向排列                           | `align-items: baseline`          |
| .g-ai-s  | 侧轴方向, 元素被拉伸以适应容器, 主轴方向排列                         | `align-items: stretch`           |
| .g-ac-fs | 侧轴方向, 元素位于容器的开头, 侧轴方向排列                          | `align-content: flex-start`      |
| .g-ac-fe | 侧轴方向,元素位于容器的结尾, 侧轴方向排列                           | `align-content: flex-end`        |
| .g-ac-sb | 两端对齐, 间隔相等, 侧轴方向排列                               | `align-content: space-between`   |
| .g-ac-sa | 间隔相等, 侧轴方向排列                                     | `align-content: space-around`    |
| .g-ac-s  | 元素被拉伸以适应容器, 剩余空间被所有行平分, 以扩大它们的侧轴尺寸               | `align-content: stretch`         |
| .g-as-fs | flex子项在侧轴方向上的对齐方式: 位于容器的开头                       | `align-self: flex-start`         |
| .g-as-fe | flex子项在侧轴方向上的对齐方式: 位于容器的结尾                       | `align-self: flex-end`           |
| .g-as-a  | 默认值，继承了它的父容器的 align-items 属性。如果没有父容器则为 "stretch" | `align-self: auto`               |
| .g-as-b  | 元素位于容器的基线上                                       | `align-self: baseline`           |
| .g-as-c  | flex子项在侧轴方向上的对齐方式: 元素位于容器的中心                     | `align-self: center`             |
| .g-as-s  | 元素被拉伸以适应容器                                       | `align-self: stretch`            |

####  <h5 id="5.3">  5.3 Layout </h5>

##### [重置](./src/outputs/reset.scss)

| class    | 备注   |
| -------- | ---- |
| .g-reset | 用户初始化元素的类 |
| .g-unset | 避免富文本被其他第三方初始化 |

##### [颜色](./src/outputs/color.scss)  g-(c|bg)-(颜色／变量)  颜色效果可在MarkDown编辑器中查看

| class                  | 备注        | 颜色效果                                              |
| ---------------------- | --------- | ------------------------------------------------- |
| .g-(c,bg)-blue-dark    | `#0b76fe` | <div style="background: #0b76fe; height: 10px" /> |
| .g-(c,bg)-blue-mid     | `#16a3ff` | <div style="background: #16a3ff; height: 10px" /> |
| .g-(c,bg)-blue-light   | `#6ab4ff` | <div style="background: #6ab4ff; height: 10px" /> |
| .g-(c,bg)-yellow-dark  | `#f2c300` | <div style="background: #f2c300; height: 10px" /> |
| .g-(c,bg)-yellow-mid   | `#ffd00d` | <div style="background: #ffd00d; height: 10px" /> |
| .g-(c,bg)-yellow-light | `#ffd31c` | <div style="background: #ffd31c; height: 10px" /> |
| .g-(c,bg)-orange-dark  | `#ef3528` | <div style="background: #ef3528; height: 10px" /> |
| .g-(c,bg)-orange-mid   | `#fa6f60` | <div style="background: #fa6f60; height: 10px" /> |
| .g-(c,bg)-orange-light | `#fc9780` | <div style="background: #fc9780; height: 10px" /> |
| .g-(c,bg)-gray-dark    | `#edeef0` | <div style="background: #edeef0; height: 10px" /> |
| .g-(c,bg)-gray-mid     | `#f5f6f7` | <div style="background: #f5f6f7; height: 10px" /> |
| .g-(c,bg)-gray-light   | `#f7f8fa` | <div style="background: #f7f8fa; height: 10px" /> |
| .g-(c,bg)-black-dark   | `#2e3136` | <div style="background: #2e3136; height: 10px" /> |
| .g-(c,bg)-black-mid    | `#636770` | <div style="background: #636770; height: 10px" /> |
| .g-(c,bg)-black-light  | `#9c9fa6` | <div style="background: #9c9fa6; height: 10px" /> |
| .g-(c,bg)-purple-dark  | `#8b61f3` | <div style="background: #8b61f3; height: 10px" /> |
| .g-(c,bg)-purple-mid   | `#a48efc` | <div style="background: #a48efc; height: 10px" /> |
| .g-(c,bg)-purple-light | `#cca3ff` | <div style="background: #cca3ff; height: 10px" /> |
| .g-(c,bg)-black        | `#000`    | <div style="background: #000; height: 10px" />    |
| .g-(c,bg)-white        | `#fff`    | <div style="background: #fff; height: 10px" />    |
| .g-(c,bg)-444          | `#444`    | <div style="background: #444; height: 10px" />    |
| .g-(c,bg)-67           | `#676767` | <div style="background: #676767; height: 10px" /> |
| .g-(c,bg)-f2           | `#f2f2f2` | <div style="background: #f2f2f2; height: 10px" /> |
| .g-(c,bg)-f8           | `#f8f8f8` | <div style="background: #f8f8f8; height: 10px" /> |
| .g-(c,bg)-ef           | `#efefef` | <div style="background: #efefef; height: 10px" /> |
| .g-(c,bg)-cd           | `#cdcdcd` | <div style="background: #cdcdcd; height: 10px" /> |
| .g-(c,bg)-e8           | `#e8e8e8` | <div style="background: #e8e8e8; height: 10px" /> |
| .g-(c,bg)-d9           | `#d9d9d9` | <div style="background: #d9d9d9; height: 10px" /> |
| .g-(c,bg)-f4           | `#f4f4f4` | <div style="background: #f4f4f4; height: 10px" /> |
| .g-(c,bg)-f9           | `#f9f9f9` | <div style="background: #f9f9f9; height: 10px" /> |
| .g-(c,bg)-000          | `#000000` | <div style="background: #000000; height: 10px" /> |
| .g-(c,bg)-333          | `#333333` | <div style="background: #333333; height: 10px" /> |
| .g-(c,bg)-51           | `#515151` | <div style="background: #515151; height: 10px" /> |
| .g-(c,bg)-666          | `#666666` | <div style="background: #666666; height: 10px" /> |
| .g-(c,bg)-999          | `#999999` | <div style="background: #999999; height: 10px" /> |
| .g-(c,bg)-aaa          | `#aaaaaa` | <div style="background: #aaaaaa; height: 10px" /> |
| .g-(c,bg)-bbb          | `#bbbbbb` | <div style="background: #bbbbbb; height: 10px" /> |
| .g-(c,bg)-bd           | `#bdbdbd` | <div style="background: #bdbdbd; height: 10px" /> |
| .g-(c,bg)-info         | `#0177de` | <div style="background: #0177de; height: 10px" /> |
| .g-(c,bg)-success      | `#00a854` | <div style="background: #00a854; height: 10px" /> |
| .g-(c,bg)-error        | `#f04134` | <div style="background: #f04134; height: 10px" /> |
| .g-(c,bg)-warn         | `#ffbf00` | <div style="background: #ffbf00; height: 10px" /> |

##### [字号](./src/outputs/font-size.scss) g-fs-(字号)

> 取值范围：10, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 48, 50, 60, 70, 80, 90, 100;
> 可以用过`$font-size-list-join-data`增加，类型list

| class   | 备注            
| ------- | -------------- |
| .g-fs-* | `font-size: *` |

##### [行高](./src/outputs/lint-height.scss) g-lh-(值) 

> 取值范围：16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 60, 72, 80, 88, 120;
> 可以用过`$line-height-list-join-data`增加，类型list

| class     | 备注               |
| --------- | ---------------- |
| .g-lh-*   | `line-height: *` |
| .g-lh-one | 行高32px, 高度64px   |
| .g-lh-two | 行高32px, 高度32px   |

##### [内边距](./src/outputs/padding.scss) g-pd-(方向)?-(值/变量)

> 取值范围：5, 8, 10, 12, 13, 15, 16, 18, 20, 21, 24, 25, 30, 32, 48, 56, 60;
> 可以用过`$padding-list-join-data`增加，类型list

| class      | 备注                                  |
| ---------- | ----------------------------------- |
| .g-pd-*    | `padding: *`                        |
| .g-pd-tb-* | `padding-top: *; padding-bottom: *` |
| .g-pd-lr-* | `padding-left: *; padding-right: *` |
| .g-pd-t-*  | `padding-top: *`                    |
| .g-pd-l-*  | `padding-left: *`                   |
| .g-pd-b-*  | `padding-bottom: *`                 |
| .g-pd-r-*  | `padding-right: *`                  |

##### [外边距](./src/outputs/margin.scss) g-m-(方向)?-(值/变量) 

> 取值范围：5, 8, 10, 12, 13, 15, 16, 18, 20, 21, 24, 25, 30, 32, 48, 56, 60;
> 可以用过`$margin-list-join-data`增加，类型list

| class      | 备注                                  |
| ---------- | ----------------------------------- |
| .g-m-*    | `margin: *`                        |
| .g-m-tb-* | `margin-top: *; margin-bottom: *` |
| .g-m-lr-* | `margin-left: *; margin-right: *` |
| .g-m-t-*  | `margin-top: *`                    |
| .g-m-l-*  | `margin-left: *`                   |
| .g-m-b-*  | `margin-bottom: *`                 |
| .g-m-r-*  | `margin-right: *`                  |

##### [图](./src/outputs/image.scss) 大小 g-img-(值) 

> 取值范围：256, 150, 128, 100, 96, 64, 56, 40, 32, 24
> 可以用过`$image-size-list-join-data`增加，类型list

| class     | 备注          |
| --------- | ----------- |
| .g-img-*  | 长宽`*`       |
| .g-imgc-* | 圆形，长宽`*`    |
| .g-imgr-* | 圆角4px，长宽`*` |

####  <h5 id="5.4"> 5.4 [柵格](./src/outputs/float.scss) </h5>

| class          | 备注                          |
| -------------- | --------------------------- |
| .g-row         |                             |
| .g-w-(number)  | 12>= number >=1             |
| .g-fw-(number) | 12>= number >=1 float:left; |
| .g-clearfix    | 清除浮动                        |
| .g-fr          | 右浮                          |
| .g-fl          | 左浮                          |

####  <h5 id="5.5"> 5.5 Grid </h5>

TODO

####  <h5 id="5.6">  5.6 [定位](./src/outputs/position.scss) </h5>

| class            | 备注   |
| ---------------- | ---- |
| .g-fixed         | 固定定位 |
| .g-relative      | 绝对定位 |
| .g-absolute      | 相对定位 |
| .g-absolute-full | 相对铺满 |
| .g-fixed-full    | 固定铺满 |

####  <h5 id="5.7"> 5.7 辅助 </h5>

##### [边框](./src/outputs/border.scss)

| class        | 备注                    |
| ------------ | --------------------- |
| .g-b         | 1像素边框                 |
| .g-bb        | 1像素下(border-bottom)边框 |
| .g-br        | 1像素右(border-right)边框  |
| .g-bl        | 1像素左(border-left)边框   |
| .g-bt        | 1像素上(border-top)边框    |
| .g-br-circle | border-radius: 100%;  |
| .g-br-sem    | 默认圆角 (8px)            |


##### [文本](./src/outputs/text.scss)

| class        | 备注     |
| ------------ | ------ |
| .g-tc        | 居中     |
| .g-tl        | 居左     |
| .g-tr        | 居右     |
| .g-td-lh     | 删除线    |
| .g-td-ul     | 下划线    |
| .g-nowrap    | 不换行    |
| .g-break     | 字母数字换行 |
| .g-break-all | 所有文本换行 |
| .g-line-one                 | 单行省略                    |
| .g-line-one                 | 两行省略                    |

##### [阴影](./src/outputs/box-shadow.scss)

| class   | 备注   |
| ------- | ---- |
| .g-bs   | 边框阴影 |
| .g-bs-t | 顶部阴影 |

##### [其他](./src/outputs/other.scss)

| class                      | 备注                      |
| -------------------------- | ----------------------- |
| .g-h-full                  | height: 100vh;          |
| .g-disabled                | 禁用事件                    |
| .g-unanimated              | 禁用动画                    |
| .g-show, .g-block, .g-dp-b | `display: block`        |
| .g-dp-n, .g-hide, .g-none  | `displacy: none`        |
| .g-dp-i, .g-inline         | `display: inline`       |
| .g-dp-ib, .g-inline-block  | `display: inline-block` |
| .g-pointer                 | `cursor: pointer`       |
| .g-divide                  | 分割线                     |
| .g-dot                     | 5像素的点                   |
| .g-of-h                    | `overflow: hidden`      |
| .g-operable                | 点击文字按钮样式                |
| .g-disabled                | 无点击事件                   |
| .g-scroller                | 滚动条                     |

####  <h5 id="5.8"> 5.8 动画 </h5>

目前计划是组件库内处理
