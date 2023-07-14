import * as path from 'node:path';
import * as sass from 'sass';

export const compile = (filepath?: string, options?: any) => sass.compile(
	filepath || path.resolve(process.cwd(), `./src/index.scss`), 
	{
		style: 'compressed',
		...options
	}
);

export const compileString = (input: string, options?: any) => {
	return sass.compileString(input, {
		style: 'compressed',
		loadPaths: [path.resolve(process.cwd(), `./src`)],
		...options
	});
};