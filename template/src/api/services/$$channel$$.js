const service = module.exports = {};

{%- for operation in channel.operations() %}
{% if operation.isClientPublishing() %}
/**
 * {{ operation.summary() }}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {%raw%}{{%endraw%}{{operation.messages()[0].payload().type()}}{%raw%}}{%endraw%} options.message The message to send.
{%- if operation.messages()[0].headers() %}
{%- for fieldName, field in operation.messages()[0].headers().properties() %}
{{ field | docline(fieldName, 'options.message.headers') }}
{%- endfor %}
{%- endif %}
{%- if operation.messages()[0].payload() %}
{%- for fieldName, field in operation.messages()[0].payload().properties() %}
{{ field | docline(fieldName, 'options.message.payload') }}
{%- endfor %}
{%- endif %}
 */
service.{{ operation.id() }} = async (ws, { message }) => {
  ws.send('Message from the server: Implement your business logic here.');
};
{%- endif %}

{%- if operation.isClientSubscribing() %}
/**
 * {{ operation.summary() }}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.
 * @param {%raw%}{{%endraw%}{{operation.messages()[0].payload().type()}}{%raw%}}{%endraw%} options.message The received message.
{%- if operation.messages()[0].headers() %}
{%- for fieldName, field in operation.messages()[0].headers().properties() %}
{{ field | docline(fieldName, 'options.message.headers') }}
{%- endfor %}
{%- endif %}
{%- if operation.messages()[0].payload() %}
{%- for fieldName, field in operation.messages()[0].payload().properties() %}
{{ field | docline(fieldName, 'options.message.payload') }}
{%- endfor %}
{%- endif %}
 */
service.{{ operation.id() }} = async (ws, { message, path }) => {
  ws.send('Message from the server: Implement your business logic here.');
};
{%- endif %}
{% endfor %}