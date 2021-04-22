
const filter = module.exports;
const URL = require('url');
const path = require('path');

function port(url, defaultPort) {
  const parsed = URL.parse(url);
  return parsed.port || defaultPort || 80;
}
filter.port = port;

function pathResolve(pathName, basePath = '/') {
  return path.resolve(basePath, pathName);
}
filter.pathResolve = pathResolve;

/*
 * returns comma separated string of all operationIds of a given channel
*/
function getOperationIds(channel) {
  const noOperationIdError = 'This template requires operationId to be set in every operation.'
  let list = '';
  let parseOperationId = (channel, opName) => {
    const id = opName === 'subscribe' ? channel.subscribe().id() : channel.publish().id();
    if (!id) throw new Error(noOperationIdError);

    return `, ${id}`;
  }

  if (channel.hasSubscribe()) {
    list += parseOperationId(channel, 'subscribe');
  }

  if (channel.hasPublish()) {
    list += parseOperationId(channel, 'publish');
  }

  return list.substring(1);
}
filter.getOperationIds = getOperationIds;