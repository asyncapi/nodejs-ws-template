const { File } = require('@asyncapi/generator-react-sdk');
const { port } = require('../../filters/all.js');

function commonConfig({ asyncapi, params }) {
  const serverUrl = asyncapi.server(params.server).url();

  return (
    <File name={'common.yml'}>
      {`default:
  port: ${port(serverUrl)}
development:
test:
staging:
production:
`}
    </File>
  );
}

module.exports = commonConfig; 