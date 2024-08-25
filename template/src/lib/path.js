const { File } = require('@asyncapi/generator-react-sdk');

function pathFile() {
  return (
    <File name="path.js">
      {`module.exports.pathParser = (path) => {
  return path.substr(0, path.length - '/.websocket'.length);
};`}
    </File>
  );
}

module.exports = pathFile;