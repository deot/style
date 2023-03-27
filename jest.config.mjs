export default {
	rootDir: '.',
	preset: 'ts-jest',
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: {
					target: 'esnext',
					sourceMap: true
				}
			}
		]
	},
	setupFiles: [],
	testEnvironment: 'node-single-context',
	// 匹配相关
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	moduleNameMapper: {
		"^.+\\.(css|less|scss)$": "identity-obj-proxy"
	},
	// 匹配规则很重要
	rootDir: process.cwd(),
	watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
	testPathIgnorePatterns: [
		'/node_modules/'
	],
	testMatch: [
		`<rootDir>/src/__tests__/**.(spec|test).[jt]s?(x)`
	],

	collectCoverage: true,
	coverageDirectory: 'coverage',
	collectCoverageFrom: [
		`src/**/*.scss`,
		`!src/__tests__/**/*`
	],
	coverageThreshold: {
		global: {
			branches: 95,
			functions: 95,
			lines: 95,
			statements: 95,
		}
	},
	globals: {}
};
