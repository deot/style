import postcss from 'postcss';
import { createGenerator } from 'unocss';
import { compile } from '../../index/__tests__/fixtures/sass';
import { presetStyle } from '../src';

type UtilityDeclarations = Record<string, Record<string, string>>;

const LEGACY_EXCLUDED_UTILITIES = new Set([
	/*
	 * Sass 的 `@for 1 through 0` 意外生成了 g-0of1；该类没有公开语义，也未出现在文档中。
	 */
	'g-0of1'
]);

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

const normalizeCSSValue = (value: string) => value
	.replace(/\s+/g, '')
	/*
	 * Sass 与 JavaScript 对 1 / 3 的序列化精度不同，统一到 Sass 当前的十位小数。
	 */
	.replace(/(^|[^\w#])-?\d*\.\d+(?!\w)/g, (matched) => {
		const prefix = matched.match(/^[^\d.-]/)?.[0] ?? '';
		const number = Number(matched.slice(prefix.length));
		return `${prefix}${Number(number.toFixed(10))}`;
	});

const extractUtility = (selector: string) => (
	selector
		.match(/^\.(g-[a-z0-9-]+(?:\\\/[a-z0-9-]+)?)(?=$|[^a-z0-9-/])/i)?.[1]
		?.replace('\\/', '/')
);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractLegacyUtilities = (css: string) => {
	const utilities = new Set<string>();
	postcss.parse(css).walkRules((rule) => {
		for (const selector of rule.selectors) {
			const utility = extractUtility(selector);
			if (utility && !LEGACY_EXCLUDED_UTILITIES.has(utility)) utilities.add(utility);
		}
	});
	return [...utilities].sort();
};

const collectUtilityDeclarations = (css: string, utilities: string[]) => {
	const utilitySet = new Set(utilities);
	const result = new Map<string, Map<string, Map<string, string>>>();
	postcss.parse(css).walkRules((rule) => {
		for (const selector of rule.selectors) {
			const utility = extractUtility(selector);
			if (!utility || !utilitySet.has(utility)) continue;

			const parents: string[] = [];
			let parent = rule.parent;
			while (parent && parent.type !== 'root') {
				if (parent.type === 'atrule') {
					parents.unshift(`@${parent.name} ${parent.params}`.replace(/\s+/g, ' ').trim());
				}
				parent = parent.parent;
			}
			const selectorUtility = utility.replace('/', '\\/');
			const normalizedSelector = selector
				.replace(new RegExp(`^\\.${escapeRegExp(selectorUtility)}`), '&')
				.replace(/\s+/g, ' ')
				.trim();
			const context = [...parents, normalizedSelector].join('|');

			const contexts = result.get(utility) ?? new Map<string, Map<string, string>>();
			const declarations = contexts.get(context) ?? new Map<string, string>();
			for (const node of rule.nodes) {
				if (node.type !== 'decl') continue;
				declarations.set(
					node.prop,
					`${normalizeCSSValue(node.value)}${node.important ? '!important' : ''}`
				);
			}
			contexts.set(context, declarations);
			result.set(utility, contexts);
		}
	});

	return Object.fromEntries(utilities.map((utility) => {
		const contexts = result.get(utility) ?? new Map<string, Map<string, string>>();
		const declarations: UtilityDeclarations = Object.fromEntries(
			[...contexts.entries()]
				.sort(([left], [right]) => left.localeCompare(right))
				.map(([context, values]) => [
					context,
					Object.fromEntries([...values.entries()].sort(([left], [right]) => left.localeCompare(right)))
				])
		);
		return [utility, declarations];
	}));
};

describe('legacy utilities', () => {
	it('matches all 600 legacy utilities and current canonical additions', async () => {
		const legacyCSS = compile().css;
		const utilities = extractLegacyUtilities(legacyCSS);
		const { css, matched } = await generateStyleOnly(utilities.join(' '));
		const legacyUtilities = utilities.filter(utility => !CURRENT_ADDITIONS.has(utility));

		expect(legacyUtilities).toHaveLength(600);
		expect(GRID_ADDITIONS).toHaveLength(132);
		expect(utilities).toHaveLength(821);
		expect([...matched].sort()).toEqual(utilities);
		expect(collectUtilityDeclarations(css, utilities))
			.toEqual(collectUtilityDeclarations(legacyCSS, utilities));
	});
});
