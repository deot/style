import * as path from 'node:path';
import fs from 'fs-extra';
import sass from 'sass';

import postcss from 'postcss';
import atImport from "postcss-import";
import atUrl from "postcss-url";
import flexBugs from "postcss-flexbugs-fixes";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";

import typescript from '@rollup/plugin-typescript';
import { rollup as rollupBuilder } from 'rollup';

let filepath = path.resolve('./src/index.scss'); 
class Build { 
	async impl() {
		await fs.remove(path.resolve('./dist'));
		this.buildCSS();
		this.buildJS();
	}

	async buildCSS() {
		const data = sass.compile(filepath, { style: 'compressed' });
		const source = await postcss()
			// @imoport资源，引进使用的代码，而不是@import '../xxx';
			.use(atImport())
			// css 中 url相对路径转化* inline 为使用base64
			.use(atUrl())
			// flex优化
			.use(flexBugs())
			// 压缩代码，删除重复部分
			.use(cssnano())
			// 适配浏览器前缀
			.use(autoprefixer({ remove: false }))
			.process(data.css, { from: filepath });

		fs.outputFileSync(path.resolve('./dist/index.css'), source.css);
	}

	async buildJS() {
		const builder = await rollupBuilder({
			input: path.resolve('./src/index.ts'),
			plugins: [
				typescript({
					exclude: [`tests/**/*`],
					include: [`src/**/*`],
					compilerOptions: {
						declaration: true,
						rootDir: '.',
						outDir: `./dist`
					}
				})
			]
		});

		await builder.write({
			file: path.resolve('./dist/index.js'),
			format: 'es',
			exports: 'named',
			sourcemap: false
		});
		await fs.rename(path.resolve('./dist/src/index.d.ts'), path.resolve('./dist/index.d.ts'));
		await fs.remove(path.resolve('./dist/src'));
	}
}

new Build().impl();
