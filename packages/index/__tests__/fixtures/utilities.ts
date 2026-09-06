import postcss from 'postcss';

type UtilityDeclarations = Record<string, Record<string, string>>;

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

export const extractLegacyUtilities = (css: string) => {
	const utilities = new Set<string>();
	postcss.parse(css).walkRules((rule) => {
		for (const selector of rule.selectors) {
			const utility = extractUtility(selector);
			if (utility && utility !== 'g-0of1') utilities.add(utility);
		}
	});
	return [...utilities].sort();
};

export const collectUtilityDeclarations = (css: string, utilities: string[]) => {
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
