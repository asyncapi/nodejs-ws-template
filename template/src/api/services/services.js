const { File } = require('@asyncapi/generator-react-sdk');
const { convertToFilename } = require('../../../../helper/index');

function generateService(channel) {
  let serviceContent = '';
  if (channel.subscribe()) {
    const subscribe = channel.subscribe();
    serviceContent += `
/**
 * ${subscribe.summary() || ''}
 * @param {object} ws WebSocket connection.
 */
service.${subscribe.id()} = async (ws) => {
  ws.send('Message from the server: Implement here your business logic that sends messages to a client after it connects.');
};
`;
  }
  if (channel.publish()) {
    const publish = channel.publish();
    const message = publish.message();

    serviceContent += `
/**
 * ${publish.summary() || ''}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.
 * @param {${message.payload().type()}} options.message The received message.
 */
service.${publish.id()} = async (ws, { message, path, query }) => {
  ws.send('Message from the server: Implement here your business logic that reacts on messages sent from a client.');
};
`;
  }
  return serviceContent;
}

module.exports = function servicesRender({ asyncapi }) {
  const files = [];

  Object.keys(asyncapi.channels()).forEach(channelName => {
    const channel = asyncapi.channels()[channelName];
    const service = generateService(channel);
    files.push(
      <File name={`${convertToFilename(channelName)}.js`}>
{`const service_${convertToFilename(channelName)} = {};

${service}
`}
      </File>
    );
  });
  return files;
}