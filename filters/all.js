
const filter = module.exports;
const URL = require('url');
const path = require('path');

function port(url, defaultPort) {
  const parsed = URL.parse(url);
  return parsed.port || defaultPort || 80;
};
filter.port = port;

function pathResolve(pathName, basePath = '/') {
  return path.resolve(basePath, pathName);
};
filter.pathResolve = pathResolve;
