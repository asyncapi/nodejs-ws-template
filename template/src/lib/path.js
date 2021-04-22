module.exports.pathParser = (path) => {
  return path.substr(0, path.length - '/.websocket'.length);
};