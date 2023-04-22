import * as path from 'node:path';
import fs from 'fs-extra';
import sass from 'sass';

import postcss from 'postcss';
import atImport from "postcss-import";
import atUrl from "postcss-url";
import flexBugs from "postcss-flexbugs-fixes";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

import typescript from '@rollup/plugin-typescript';
import { rollup as rollupBuilder } from 'rollup';
import { Logger } from '@deot/dev-shared';

let directory = path.resolve('./src'); 
class Build { 
	async process() {
		await fs.remove(path.resolve('./dist'));
		await this.buildCSS();
		await this.buildJS();
		await this.buildTypes();
	}

	async buildCSS() {
		const files = fs.readdirSync(directory).filter((i: string) => /\.scss$/.test(i));
		await Promise.all(files.map(async (file: string) => {
			let filepath = path.resolve('./src', file);
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

			fs.outputFileSync(path.resolve(`./dist/${file.replace(/\.scss$/g, '.css')}`), source.css);
		}));
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
						outDir: `dist`
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
	}

	async buildTypes() {
		const packageDir = process.cwd();
		// build types
		const config = path.resolve(packageDir, `api-extractor.json`);
		if (fs.existsSync(config)) {
			const result = Extractor.invoke(
				ExtractorConfig.loadFileAndPrepare(config), 
				{
					localBuild: true,
					showVerboseMessages: false
				}
			);

			if (!result.succeeded) {
				Logger.error(
					`API Extractor completed with ${result.errorCount} errors and ${result.warningCount} warnings`
				);
				process.exitCode = 1;
			}			
		}

		await fs.remove(`${packageDir}/dist/src`);
	}
}

new Build().process();
