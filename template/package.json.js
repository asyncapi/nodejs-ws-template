const { kebabCase, oneLine } = require('../helper/index');
const { File } = require('@asyncapi/generator-react-sdk');

function packageFile({ asyncapi }) {
  const dependencies = {
    '@asyncapi/parser': '^3.1.0',
    'express': '4.19.2',
    'express-ws': '4.0.0',
    'node-yaml-config': '0.0.6'
  };

  let packageJSON = {};

  if (asyncapi.info().title()) {
    packageJSON.name = kebabCase(asyncapi.info().title());
  }
  if (asyncapi.info().version()) {
    packageJSON.version = asyncapi.info().version();
  }
  if (asyncapi.info().description()) {
    packageJSON.description = oneLine(asyncapi.info().description());
  }

  packageJSON = {
    ...packageJSON,
    scripts: {
      start: 'node src/api/index.js'
    },
    dependencies
  };

  return (
    <File name={'package.json'}>{JSON.stringify(packageJSON, null, 2)}</File>
  );
}

module.exports = packageFile;