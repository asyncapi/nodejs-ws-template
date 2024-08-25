const { File } = require('@asyncapi/generator-react-sdk');

function indexHtmlRender({ asyncapi }) {
  const channels = asyncapi.channels();
  const channelNames = Object.keys(channels);

  const subscribeChannels = channelNames.filter(channelName => {
    const channel = channels[channelName];
    return channel.subscribe && typeof channel.subscribe === 'function';
  });

  return (
    <File name="index.html">
      {`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${asyncapi.info().title()}</title>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
  </head>

  <body>
    <h1>Open your browser console to see the logs and details of API you can use to talk to the server.</h1>
    <script>
    let connection;

    function displayHelp() {
      console.log('Available channels:')
      ${subscribeChannels.map(channelName => `console.log('* ${channelName}');`).join('\n')}
      console.log('Available commands:')
      console.log('- listen: Establish a connection with the server at a given path.')
      console.log('  Usage: listen(channelName)');
      console.log(\`  Example: listen('${channelNames[0]}')\`);
      console.log('- send: Send a message to the server at a currently connected path.')
      console.log('  Usage: send(message)');
      console.log(\`  Example: send({ greet: 'Hello from client' })\`);
    }

    function listen(path) {
      const url = new URL(path, 'ws://${asyncapi.server('localhost').url()}').toString()
      connection = new WebSocket(url)

      connection.onerror = error => {
        console.log(\`WebSocket error: \${error}\`)
      }

      connection.onopen = () => {
        console.log('Connected to server');
      }

      connection.onmessage = e => {
        console.log('Server says:', e.data)
      }
    }

    function send(message) {
      if (!connection) {
        console.error('You have to call listen(channelName) first. See the list of available commands and below.');
        displayHelp();
        return;
      }
      let msg = message;
      if (typeof msg === 'object') msg = JSON.stringify(msg);
      connection.send(msg);
      console.info('Hint: check out the server logs to see your message.');
    }

    displayHelp();
    </script>
  </body>
</html>`}
    </File>
  );
}

module.exports = indexHtmlRender;