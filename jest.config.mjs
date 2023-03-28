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
	watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
	testPathIgnorePatterns: [
		'/node_modules/'
	],
	testMatch: [
		`<rootDir>/tests/**.(spec|test).[jt]s?(x)`
	],

	collectCoverage: true,
	coverageDirectory: 'coverage',
	collectCoverageFrom: [
		`src/**/*.scss`,
		`!tests/**/*`
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
