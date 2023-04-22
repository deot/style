import * as path from 'node:path';
import fs from 'fs-extra';
import { createRequire } from 'node:module';
import parser from 'conventional-commits-parser';
import chalk from 'chalk';
import semver from 'semver';
import { Shell, Logger } from '@deot/dev-shared';

const require$ = createRequire(import.meta.url);

const HASH = '-hash-';
const SUFFIX = '🐒💨🙊';

const parserOptions = {
	noteKeywords: ['BREAKING CHANGE', 'Breaking Change']
};
const reBreaking = new RegExp(`(${parserOptions.noteKeywords.join(')|(')})`);

interface Notes {
	breaking: string[];
	features: string[];
	fixes: string[];
	updates: string[];
}

export class Release {
	packageDir: string;

	packageName: string;

	packageOptions: {
		[key: string]: any;
		name: string;
		version: string;
	};

	config: any;

	changeLog: string;

	version: string;

	commits: Array<{
		custom: boolean;
		breaking: boolean;
		hash: string;
		type: string;
		header: string;
	}>;

	commandOptions: {
		dryRun: boolean;
		tag: boolean;
		commit: boolean;
		publish: boolean;
		push: boolean;
		forceUpdatePackage: boolean;
		skipUpdatePackage: boolean;
		customVersion: string;
		patch: boolean;
		major: boolean;
		minor: boolean;
	};

	constructor() {
		
		this.packageDir = process.cwd();
		this.packageOptions = require$(`${this.packageDir}/package.json`); // eslint-disable-line
		this.packageName = this.packageOptions.name;

		this.commits = [];
		this.changeLog = '';
		this.version = '';

		this.commandOptions = {
			dryRun: !process.argv.includes('--no-dry-run'),
			commit: !process.argv.includes('--no-commit'),
			push: !process.argv.includes('--no-push'),
			tag: !process.argv.includes('--no-tag'),
			publish: !process.argv.includes('--no-publish'),
			patch: process.argv.includes('--patch'),
			major: process.argv.includes('--major'),
			minor: process.argv.includes('--minor'),
			forceUpdatePackage: process.argv.includes('--force-update-package'),
			skipUpdatePackage: process.argv.includes('--skip-update-package'),
			customVersion: ''
		};
	}

	private async parseCommits() {
		const { packageName, commandOptions } = this;
		let params = ['tag', '--list', `'${packageName}@*'`, '--sort', '-v:refname'];
		const {
			stdout: tags
		} = await Shell.exec('git', params);
		const [latestTag] = tags.split('\n');
		Logger.log(chalk.yellow(`Last Release Tag`) + `: ${latestTag || '<none>'}`);
		params = ['--no-pager', 'log', `${latestTag}..HEAD`, `--format=%B%n${HASH}%n%H${SUFFIX}`];
		let {
			stdout
		} = await Shell.exec('git', params);

		let skipGetLog = false;
		if (latestTag) {
			const log1 = await Shell.exec('git', ['rev-parse', latestTag]);
			const log2 = await Shell.exec('git', ['--no-pager', 'log', '-1', '--format=%H']);
			if (log1.stdout === log2.stdout) {
				skipGetLog = true;
			}
		}
		if (!skipGetLog && !stdout) {
			if (latestTag) {
				params.splice(2, 1, `${latestTag}`); // 该latestTag前所有commit
			} else {
				params.splice(2, 1, 'HEAD'); // 所有commit
			}
			({ stdout } = await Shell.exec('git', params));
		}

		const reChunk = /^(fix|feat|break change|style|perf|types|refactor|chore)(\(.+\))?: .*/i;
		const commits = stdout
			.split(SUFFIX)
			.filter((commit: string) => {
				const chunk = commit.trim();
				return chunk && reChunk.test(chunk);
			})
			.map((commit) => {
				const node = parser.sync(commit);
				const body = (node.body || node.footer) as string;
				if (!node.type) node.type = parser.sync(node.header?.replace(/\(.+\)!?:/, ':') || '').type;
				if (!node.hash) node.hash = commit.split(HASH).pop()?.trim();

				node.breaking = reBreaking.test(body) || /!:/.test(node.header as string);
				node.effect = false;
				node.custom = false;
				return node;
			});

		if (!commits.length) {
			Logger.log(chalk.red(`No Commits Found.`));
		} else {
			Logger.log(chalk.yellow(`Found `) + chalk.bold(`${commits.length}`) + ` Commits`);
		}

		const { skipUpdatePackage } = commandOptions;

		if (commits.length && skipUpdatePackage) {
			Logger.log(chalk.red(`Skipping Update\n`));
			return;
		}
		
		await this.updateVersion();
		await this.updateCommits(commits);

		const { forceUpdatePackage } = commandOptions;
		// 强制更新
		if (!commits.length && forceUpdatePackage) {
			const oldVersion = this.packageOptions.version;
			const versionChanged = `\`${oldVersion}\` -> \`${this.version}\``;
			this.commits = [
				{
					type: 'chore',
					header: `chore(release): force-publish ${versionChanged}`,
					hash: '',
					breaking: false,
					custom: true
				}
			];
			
			this.changeLog = `### Force Update Package\n\n- ${versionChanged}`.trim();
		}
	}

	private rebuildChangeLog(commits: Release["commits"]) {
		const { packageDir } = this;
		const homepage = 'https://github.com/deot/style';
		const logPath = path.resolve(packageDir, './CHANGELOG.md');
		const logFile = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf-8') : '';
		const notes: Notes = {
			breaking: [],
			features: [],
			fixes: [],
			updates: []
		};

		/**
		 * (close #1) -> issues
		 * close (#1) -> issues
		 * (#1) -> pull request
		 *
		 * JS支持后行断言
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Assertions
		 */
		const closeRegxp = /\(?(closes? )\(?#((\d+))\)/ig;
		const pullRegxp = /(?<!closes? )\((#(\d+))\)/ig;

		for (const commit of commits) {
			const { breaking, hash, header, type } = commit;
			/**
			 * 确保当log一样时，commit hash判断log是不一致的
			 * close: commit下自行提交（log可能会相同）需添加ref
			 * pr: 由github pr生成一条提交记录（唯一的, 无需添加ref）
			 */
			const ref = !hash || pullRegxp.test(header)
				? '' 
				: ` ([${hash?.substring(0, 7)}](${homepage}/commit/${hash}))`;

			// eslint-disable-next-line no-unsafe-optional-chaining
			let message = header?.trim();
			message = message
				.replace(pullRegxp, `[$1](${homepage}/pull/$2)`)
				.replace(closeRegxp, `[$1$2](${homepage}/issues/$2)`) + ref;
			if (breaking) {
				notes.breaking.push(message);
			} else if (type === 'fix') {
				notes.fixes.push(message);
			} else if (type === 'feat') {
				notes.features.push(message);
			} else {
				notes.updates.push(message);
			}
		}

		// 过滤已存在的commit
		(Object.keys(notes) as Array<keyof Notes>).forEach(i => {
			notes[i] = notes[i].filter((j: string) => {
				return !logFile.includes(j);
			});
		});

		const parts = [
			notes.breaking.length ? `### Breaking Changes\n\n- ${notes.breaking.join('\n- ')}`.trim() : '',
			notes.fixes.length ? `### Bugfixes\n\n- ${notes.fixes.join('\n- ')}`.trim() : '',
			notes.features.length ? `### Features\n\n- ${notes.features.join('\n- ')}`.trim() : '',
			notes.updates.length ? `### Updates\n\n- ${notes.updates.join('\n- ')}`.trim() : ''
		].filter(Boolean);

		const newLog = parts.join('\n\n'); 
		return !parts.length || logFile.includes(newLog)
			? ''
			: newLog;
	}

	private async updateVersion() {
		const { packageOptions, commits, commandOptions } = this;
		const { version } = packageOptions;
		let newVersion = '';
		if (commandOptions.customVersion) {
			newVersion = commandOptions.customVersion;
		} else {
			const intersection: any[] = [
				commandOptions.major && 'major', 
				commandOptions.minor && 'minor', 
				commandOptions.patch && 'patch'
			].filter(i => !!i);
			if (intersection.length) {
				newVersion = semver.inc(version, intersection[0]) || '';
			} else {
				const types = new Set(commits.map(({
					type
				}) => type));
				const breaking = commits.some((commit) => !!commit.breaking);
				const level = breaking 
					? 'major' 
					: types.has('feat') 
						? 'minor' 
						: 'patch';
				newVersion = semver.inc(version, level) || '';
			}
		}

		this.version = newVersion;
	}

	private isChanged() {
		return !!this.commits.length;
	}

	async updateCommits(commits: Release['commits'], source?: string) {
		if (!commits.length) return;
		const { packageName } = this;
		const olds = this.commits.map(i => JSON.stringify(i));

		const newCommits = commits
			.filter(i => {
				return !olds.includes(JSON.stringify(i));
			})
			.map(j => {
				return {
					...j,
					effect: !!source
				};
			});

		// 去除自定义的，如强制更新commit 
		if (newCommits.length && this.commits.length) {
			this.commits = this.commits.filter(i => !i.custom);
		}

		const commits$ = this.commits.concat(newCommits);

		if (source) {
			Logger.log(
				chalk.magenta(`MERGE COMMITS: `)
				+ chalk.bold(`${commits.length}`) + ` Commits. `
				+ 'merge ' + chalk.yellow(source) + ' into ' + chalk.green(packageName)
			);
		} else {
			Logger.log(``); // = `\n`;
		}

		const changeLog = this.rebuildChangeLog(commits$);
		if (changeLog) {
			this.commits = commits$;
			this.changeLog = changeLog;
		} else if (commits.length) {
			Logger.log(chalk.red(`${commits.length} Commits Already Exists.`));
		}
	}

	async updatePackageOptions() {
		if (!this.isChanged()) return;

		const { packageDir, packageOptions, commandOptions } = this;
		const newVersion = this.version; // 这个在解析commit时已经生成了

		Logger.log(chalk.yellow(`New Version: `) + `${newVersion}`);
		packageOptions.version = newVersion;

		if (commandOptions.dryRun) {
			Logger.log(chalk.yellow(`Skipping package.json Update`));
			return;
		}
		Logger.log(chalk.yellow(`Updating `) + 'package.json');
		
		fs.outputFileSync(`${packageDir}/package.json`, JSON.stringify(packageOptions, null, 2));
	}

	async updateChangelog() {
		if (!this.isChanged()) return;

		const { packageName, packageDir, packageOptions, commandOptions } = this;
		const title = `# ${packageName} ChangeLog`;
		const [date] = new Date().toISOString().split('T');
		const logPath = path.resolve(packageDir, './CHANGELOG.md');
		const logFile = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf-8') : '';
		const oldNotes = logFile.startsWith(title) ? logFile.slice(title.length).trim() : logFile;
		
		const parts = [
			`## v${packageOptions.version}`,
			`_${date}_`,
			this.changeLog
		].filter(Boolean);
		const newLog = parts.join('\n\n');
		if (commandOptions.dryRun) {
			Logger.log(chalk.yellow(`New ChangeLog:`) + `\n${newLog}`);
			return;
		}
		Logger.log(chalk.yellow(`Updating `) + `CHANGELOG.md`);
		let content = [title, newLog, oldNotes].filter(Boolean).join('\n\n');
		if (!content.endsWith('\n')) content += '\n';
		fs.writeFileSync(logPath, content, 'utf-8');
	}

	async test() {
		if (!this.isChanged()) return;
		const { commandOptions } = this;

		if (commandOptions.dryRun) {
			Logger.log(chalk.yellow('Skipping Test'));	
			return;
		} else {
			Logger.log(chalk.yellow('Test...'));
		}

		await Shell.exec(`npm run test`);
	}

	async build() {
		if (!this.isChanged()) return;
		const { commandOptions } = this;

		if (commandOptions.dryRun) {
			Logger.log(chalk.yellow('Skipping Build'));	
			return;
		} else {
			Logger.log(chalk.yellow('Build...'));
		}

		await Shell.exec(`npm run build`);
	}

	async publish() {
		if (!this.isChanged()) return;
		const { commandOptions, packageDir } = this;

		if (commandOptions.dryRun || !commandOptions.publish) {
			Logger.log(chalk.yellow(`Skipping Publish`));
			return;
		}
		Logger.log(chalk.cyan(`\n Publishing to NPM`));
		await Shell.spawn(
			'npm', 
			['publish', '--no-git-checks', '--access', 'public'],
			{
				cwd: packageDir
			}
		);
	}

	async tag() {
		if (!this.isChanged()) return;
		const { commandOptions, packageDir } = this;

		const { packageName, packageOptions } = this;
		if (commandOptions.dryRun || !commandOptions.tag) {
			Logger.log(chalk.yellow(`Skipping Git Tag`));
			return;
		}
		// 用于版本更新搜索
		const tagName = `${packageName}@${packageOptions.version}`;
		Logger.log(chalk.blue(`\n Tagging`) + chalk.grey(`${tagName}`));
		await Shell.spawn(
			'git', 
			['tag', tagName],
			{
				cwd: packageDir
			}
		);
	}

	async commit() {
		const { packageName, packageOptions, packageDir, commandOptions } = this;
		const { commit, dryRun } = commandOptions;

		let message = `chore(release): publish\n\n`;
		message += `- ${packageName}@${packageOptions.version}\n`;

		if (!this.isChanged()) {
			Logger.log(chalk.magenta(`COMMIT: `) + 'Nothing Chanaged Found.');
		} else if (dryRun || !commit) {
			Logger.log(chalk.magenta(`COMMIT: `) + chalk.yellow(`Skipping Git Commit`) + `\n${message}`);	
		} else {
			Logger.log(chalk.magenta(`CHANGED: `) + `pnpm-lock.yaml`);
			await Shell.spawn('npx', ['pnpm', 'install', '--lockfile-only']);

			Logger.log(chalk.magenta(`COMMIT: `) + `CHANGELOG.md, package.json, pnpm-lock.yaml`);
			await Shell.spawn('git', ['add', packageDir]);
			await Shell.spawn('git', ['commit', '--m', `'${message}'`]);
		}
	}

	async push() {
		const { push, dryRun } = this.commandOptions;

		if (dryRun || !push) {
			Logger.log(chalk.magenta(`FINISH: `) + 'Skipping Git Push');	
		} else if (!this.isChanged()) {
			Logger.log(chalk.magenta(`FINISH: `) + 'Nothing Chanaged.');	
		} else {
			// 提交到远程仓库或自行提交
			await Shell.spawn('git', ['push']);
			await Shell.spawn('git', ['push', '--tags']);
		}
	}

	async process() {
		const { commandOptions, packageName, packageDir } = this;
		if (!packageDir || !fs.pathExists(packageDir)) {
			throw new RangeError(`Could not find directory for package`);
		}

		const { dryRun } = commandOptions;
		if (dryRun) {
			Logger.log(
				chalk.magenta(`DRY RUN: `) 
				+ 'No files will be modified.' 
			);
		}

		Logger.log(chalk.cyan(`Releasing ${packageName}`));

		await this.parseCommits();
		await this.test();
		await this.build();
		await this.updatePackageOptions();
		await this.updateChangelog();
		await this.commit();
		await this.publish();
		await this.tag();
		await this.push();

		if (dryRun) {
			Logger.log(
				chalk.green('NO DRY RUN WAY: ')
				+ chalk.grey(`npm run release -- --no-dry-run\n`)
			);
		}
	}
}

new Release().process();