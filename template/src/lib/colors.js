const { File } = require('@asyncapi/generator-react-sdk'); 

function colorsFile() {
  return (
    <File name="colors.js">
      {`module.exports.yellow = (text) => {
  return \`\\x1b[33m\${text}\\x1b[0m\`;
};`}
    </File>
  );
}

module.exports = colorsFile;