const path = require('path');
const Generator = require('@asyncapi/generator');
const {readFile} = require('fs').promises;
const console = require('console');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', ' integrationTestResult');
describe('template integration test using generator', () => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, Date.now().toString());
  };

  jest.setTimeout(30000);

  it('should generate application files ', async () => {
    const outputDir = generateFolderName();
    const params = {
      server: 'localhost'
    };
    const generator = new Generator(path.normalize('./'), outputDir, {
      forceWrite: true,
      templateParams: params
    });
    console.log(outputDir);
    const asyncApiPath = './mocks/asyncapi.yml';
    await generator.generateFromFile(path.resolve('test', asyncApiPath));
    const expectedFiles = [
      'src/api/index.js',
      'src/api/routes.js',
      'src/lib/asyncapi.js',
      'src/lib/colors.js',
      'src/lib/config.js',
      'src/lib/path.js'
    ];

    for (const index in expectedFiles) {
      const file = await readFile(path.join(outputDir, expectedFiles[index]), 'utf8');
      expect(file).toMatchSnapshot();
    }
  });
});