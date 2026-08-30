import { configure } from '@deot/dev-eslint';

export default [
	...await configure(),
	{
		files: ['**/*.md/**'],
		rules: {
			'no-useless-assignment': 'off'
		}
	}
];
