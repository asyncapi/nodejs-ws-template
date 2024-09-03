const { File } = require('@asyncapi/generator-react-sdk');
const { kebabCase } = require('../../../helper/index.js');
const { getOperationIds, pathResolve } = require('../../../filters/all.js');

function routeRender({ asyncapi }) {
  const channels = asyncapi.channels();
  
  const imports = Object.entries(channels).map(([channelName, channel]) => {
    const allOperationIds = getOperationIds(channel);
    if (!allOperationIds) return '';
    return `const { ${allOperationIds} } = require('./services/${kebabCase(channelName)}');`;
  }).filter(Boolean).join('\n');

  const routes = Object.entries(channels).map(([channelName, channel]) => {
    const subscribeOp = channel.subscribe ? channel.subscribe() : null;
    const publishOp = channel.publish ? channel.publish() : null;

    return `router.ws('${pathResolve(channelName)}', async (ws, req) => {
  const path = pathParser(req.path);
  console.log(\`\${yellow(path)} client connected.\`);
  ${subscribeOp ? `await ${subscribeOp.id()}(ws);` : ''}
  ${publishOp ? `ws.on('message', async (msg) => {
    console.log(\`\${yellow(path)} message was received:\`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await ${publishOp.id()}(ws, { message: msg, path, query: req.query });
  });` : ''}
});`;
  }).join('\n');

  return (
    <File name="routes.js">
      {`const util = require('util');
const { Router } = require('express');
const { pathParser } = require('../lib/path');
const { yellow } = require('../lib/colors');
${imports}
const router = Router();
module.exports = router;
${routes}
`}
    </File>
  );
}

module.exports = routeRender;