const { File } = require('@asyncapi/generator-react-sdk'); 

function configFile() {
  return (
    <File name="config.js">
      {`const path = require('path');
const yamlConfig = require('node-yaml-config');

const config = yamlConfig.load(path.join(__dirname, '../../config/common.yml'));

module.exports = config;
`}
    </File>
  );
}

module.exports = configFile;