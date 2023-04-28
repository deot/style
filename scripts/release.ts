import * as Releaser from '@deot/dev-releaser';

Releaser.run({
	dryRun: !process.argv.includes('--no-dry-run'),
	commit: !process.argv.includes('--no-commit'),
	push: !process.argv.includes('--no-push'),
	tag: !process.argv.includes('--no-tag'),
	publish: !process.argv.includes('--no-publish'),
	patch: process.argv.includes('--patch'),
	major: process.argv.includes('--major'),
	minor: process.argv.includes('--minor'),
	keepLastTag: process.argv.includes('--keep-last-tag'),
	forceUpdatePackage: process.argv.includes('--force-update-package'),
	skipUpdatePackage: process.argv.includes('--skip-update-package'),
	customVersion: ''
})