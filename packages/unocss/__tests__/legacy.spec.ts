import { readFileSync } from 'node:fs';
import { createGenerator } from 'unocss';
import { compile, compileString } from '../../index/__tests__/fixtures/sass';
import { collectUtilityDeclarations, extractLegacyUtilities } from '../../index/__tests__/fixtures/utilities';
import { presetStyle } from '../src';

const GRID_ADDITIONS = [
	'g-grid',
	...['gtc', 'gtr'].flatMap(name => [
		...Array.from({ length: 12 }, (_, index) => `g-${name}-${index + 1}`),
		`g-${name}-none`,
		`g-${name}-subgrid`
	]),
	...['gc', 'gr'].flatMap(name => [
		...Array.from({ length: 12 }, (_, index) => `g-${name}-${index + 1}`),
		...Array.from({ length: 12 }, (_, index) => `g-${name}-span-${index + 1}`),
		`g-${name}-span-full`
	]),
	...['gcs', 'gce', 'grs', 'gre'].flatMap(name => (
		Array.from({ length: 12 }, (_, index) => `g-${name}-${index + 1}`)
	)),
	'g-gaf-r', 'g-gaf-c', 'g-gaf-d', 'g-gaf-rd', 'g-gaf-cd'
];

const IMAGE_SIZES = [256, 150, 128, 100, 96, 64, 56, 40, 32, 24];

const CURRENT_ADDITIONS = new Set([
	'g-ws-nw',
	'g-h-full',
	'g-w-full',
	'g-bd',
	'g-bdt',
	'g-bdr',
	'g-bdb',
	'g-bdl',
	'g-bsh',
	'g-bsh-t',
	'g-bsz-bb',
	'g-divider',
	'g-d-n',
	'g-d-b',
	'g-d-i',
	'g-d-ib',
	'g-fwr-w',
	'g-fwr-wr',
	'g-fwr-n',
	'g-fl-row',
	...Array.from({ length: 12 }, (_, index) => `g-fl-${index + 1}/12`),
	...IMAGE_SIZES.flatMap(value => [
		`g-image-${value}`,
		`g-image-circle-${value}`,
		`g-image-radius-${value}`
	]),
	'g-tdl-lt',
	'g-tdl-ul',
	'g-tdl-ol',
	'g-tdl-n',
	'g-line-1',
	'g-line-2',
	...['l', 'r', 'c', 'j', 's', 'e', 'ja', 'mp'].map(value => `g-ta-${value}`),
	'g-f-0',
	'g-f-1',
	'g-f-2',
	'g-f-1/1',
	...Array.from({ length: 4 }, (_, index) => index + 2).flatMap(total => (
		Array.from({ length: total - 1 }, (_, index) => `g-f-${index + 1}/${total}`)
	)),
	...GRID_ADDITIONS
]);

const generateStyleOnly = async (tokens: string) => {
	const { rules = [] } = presetStyle();
	const uno = await createGenerator({ rules });
	return uno.generate(tokens);
};

describe('legacy utilities', () => {
	it('covers the 600 historical utilities across current rules and Sass compatibility CSS', async () => {
		const fullCSS = compile().css;
		const current = extractLegacyUtilities(fullCSS);
		const baseline = readFileSync(`${process.cwd()}/packages/index/__tests__/fixtures/deprecated.css`, 'utf8');
		const deprecated = extractLegacyUtilities(baseline);
		const compatibilityCSS = compileString('@use \'./index.deprecated\'').css;
		const historical = [...new Set([...current, ...deprecated])];
		const { css, matched } = await generateStyleOnly(current.join(' '));

		expect(historical.filter(utility => !CURRENT_ADDITIONS.has(utility))).toHaveLength(600);
		expect(GRID_ADDITIONS).toHaveLength(132);
		expect(deprecated).toHaveLength(85);
		expect(extractLegacyUtilities(compatibilityCSS)).toEqual(deprecated);
		expect([...matched].sort()).toEqual(current);
		expect(collectUtilityDeclarations(css, current))
			.toEqual(collectUtilityDeclarations(fullCSS, current));
		expect(collectUtilityDeclarations(compatibilityCSS, deprecated))
			.toEqual(collectUtilityDeclarations(baseline, deprecated));
		expect(deprecated.filter(utility => current.includes(utility))).toEqual([]);
	});
});
