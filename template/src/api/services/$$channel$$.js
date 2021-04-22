const service = module.exports = {};
{% if channel.hasSubscribe() %}
/**
 * {{ channel.subscribe().summary() }}
 * @param {object} ws WebSocket connection.
 */
service.{{ channel.subscribe().id() }} = async (ws) => {
  ws.send('Message from the server: Implement here your business logic that sends messages to a client after it connects.');
};

{%- endif %}
{%- if channel.hasPublish() %}
/**
 * {{ channel.publish().summary() }}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.
 * @param {%raw%}{{%endraw%}{{channel.publish().message(0).payload().type()}}{%raw%}}{%endraw%} options.message The received message.
{%- if channel.publish().message(0).headers() %}
{%- for fieldName, field in channel.publish().message(0).headers().properties() %}
{{ field | docline(fieldName, 'options.message.headers') }}
{%- endfor %}
{%- endif %}
{%- if channel.publish().message(0).payload() %}
{%- for fieldName, field in channel.publish().message(0).payload().properties() %}
{{ field | docline(fieldName, 'options.message.payload') }}
{%- endfor %}
{%- endif %}
 */
service.{{ channel.publish().id() }} = async (ws, { message, path, query }) => {
  ws.send('Message from the server: Implement here your business logic that reacts on messages sent from a client.');
};

{%- endif %}
