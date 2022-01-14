
const filter = module.exports;
const URL = require('url');
const path = require('path');

function port(url, defaultPort) {
  const parsed = URL.parse(url);
  return parsed.port || defaultPort || 80;
}
filter.port = port;

function pathResolve(pathName, basePath = '/') {
  if (pathName.startsWith('/')) {
    return pathName;
  }
  
  return path.resolve(pathName).replace(/C:\\/g, '/');
}
filter.pathResolve = pathResolve;

/*
 * returns comma separated string of all operationIds of a given channel
*/
const parseOperationId = (channel, opName) => {
  const id = opName === 'subscribe' ? channel.subscribe().id() : channel.publish().id();
  if (!id) throw new Error('This template requires operationId to be set in every operation.');
  return id;
};

function getOperationIds(channel) {
  const list = [];
  if (channel.hasSubscribe()) {
    list.push(parseOperationId(channel, 'subscribe'));
  }
  if (channel.hasPublish()) {
    list.push(parseOperationId(channel, 'publish'));
  }
  return list.filter(Boolean).join(', ');
}
filter.getOperationIds = getOperationIds;
