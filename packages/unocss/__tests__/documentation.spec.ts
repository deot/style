import { readFileSync } from 'node:fs';
import { extractLegacyUtilities } from '../../index/__tests__/fixtures/utilities';

const documents = [
	'../../../README.md',
	'../../../docs/DOCUMENT.md',
	'../../../docs/getting-started.md',
	'../../../docs/integration.md',
	'../../../docs/playground.md',
	'../../../docs/unocss-mini.md',
	'../../index/README.md',
	'../README.md'
].map(path => readFileSync(new URL(path, import.meta.url), 'utf8'));

const removedTokens = [
	'g-col', 'g-col-2',
	...Array.from({ length: 5 }, (_, total) => total + 1).flatMap(total => (
		Array.from({ length: total }, (_, part) => `g-${part + 1}of${total}`)
	)),
	'g-fw-w', 'g-fw-wr', 'g-fw-n', 'g-fw-1', 'g-row',
	'g-bs', 'g-bs-t', 'g-bs-bb', 'g-b', 'g-bt', 'g-br', 'g-bb', 'g-bl',
	'g-dp-n', 'g-dp-b', 'g-dp-i', 'g-dp-ib',
	'g-tc', 'g-tl', 'g-tr', 'g-width-full', 'g-height-full',
	'g-td-lh', 'g-td-ul', 'g-nowrap', 'g-break',
	'g-line-one', 'g-line-two', 'g-lh-one', 'g-lh-two', 'g-divide',
	'g-td-ol', 'g-td-n',
	'g-ar-sq', 'g-ar-v', 'g-od-f', 'g-od-l', 'g-od-n',
	'g-stroke-offset-2'
];

const removedPrefixes = [
	'g-img-', 'g-imgc-', 'g-imgr-',
	'g-g-x-', 'g-g-col-', 'g-g-y-', 'g-g-row-', 'g-tdo-',
	'g-stroke-dash-[', 'g-stroke-offset-('
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('public documentation', () => {
	it('documents every shipped deprecated utility in the dedicated migration table', () => {
		const migration = readFileSync(`${process.cwd()}/docs/deprecated.md`, 'utf8');
		const baseline = readFileSync(`${process.cwd()}/packages/index/__tests__/fixtures/deprecated.css`, 'utf8');
		const patterns = migration.split('\n')
			.filter(line => line.startsWith('| `g-'))
			.flatMap(line => [...line.split('|')[1].matchAll(/`(g-[^`]+)`/g)].map(match => match[1]))
			.map(token => new RegExp(`^${escapeRegExp(token).replace(/\\\{(?:part|total|n)\\\}/g, '\\d+')}$`));
		for (const token of extractLegacyUtilities(baseline)) {
			expect(patterns.some(pattern => pattern.test(token)), token).toBe(true);
		}
		expect(migration).toContain('无直接替代');
		expect(migration).toContain('!important');
		expect(migration).toContain('index.deprecated.css');
	});

	it('only presents current utility names', () => {
		for (const document of documents) {
			for (const token of removedTokens) {
				expect(document).not.toMatch(new RegExp(`${escapeRegExp(token)}(?![a-z0-9-])`, 'i'));
			}
			for (const prefix of removedPrefixes) expect(document).not.toContain(prefix);
		}
	});
});
