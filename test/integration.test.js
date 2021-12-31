const path = require('path');
const Generator = require('@asyncapi/generator');
const {readFile} = require('fs').promises;
const fetch = require('node-fetch');
const fs = require('fs');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', ' integrationTestResult');
const URL = 'https://raw.githubusercontent.com/asyncapi/generator/master/test/docs/ws.yml'

describe('template integration test using generator', () => {
	const generateFolderName = () => {
		return path.resolve(MAIN_TEST_RESULT_PATH, Date.now().toString());
	};

	jest.setTimeout(30000);

	it('should generate application files ', async () => {
		const outputDir = generateFolderName();
		const asyncapiFile = await fetch(URL);
        const params = {
			server: 'localhost'
		}
        const generator = new Generator(path.normalize('./'), outputDir, {
			forceWrite: true,
			templateParams: params
		});
		await generator.generateFromString(await asyncapiFile.text());
		const expectedFiles = [
			'README.md',
			'template/src/api/index.js',
			'template/src/api/routes.js',
			'template/src/lib/asyncapi.js',
			'template/src/lib/colors.js',
			'template/src/lib/config.js',
			'template/src/lib/path.js'
        ];

		for (const index in expectedFiles) {
			const file = await readFile(expectedFiles[index], 'utf8');
			expect(file).toMatchSnapshot();
		}


	});
});