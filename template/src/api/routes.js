const util = require('util');
const { Router } = require('express');
const { yellow } = require('../lib/colors');

{%- for channel in asyncapi.channels() -%}
{%- for operation in channel.operations() %}
{%- if operation.isClientSubscribing() %}
{%- if operation.id() === undefined -%}
{ { 'This template requires operationId to be set in every operation.' | logError }}
{%- endif %}
const {{ channel.path() | camelCase }}Service = require('./services/{{ channel.path() | kebabCase }}');
{%- endif -%}
{%- endfor -%}
{%- endfor %}
const router = Router();
module.exports = router;
{%- for channel in asyncapi.channels() -%}
{%- for operation in channel.operations() %}
{%- if operation.isClientSubscribing() %}
  {%- if operation.summary() %}
/**
 * {{ operation.summary() }}
 */
  {%- endif %}
router.ws('{{ channel.path() | pathResolve }}', async (ws, req) => {
  ws.on('message', async (msg) => {
    const path = req.path.substr(0, req.path.length - '/.websocket'.length);
    console.log(`${yellow(path)} message was received:`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await {{ channel.path() | camelCase }}Service.{{ operation.id() }}(ws, { message: msg, path, query: req.query });
  });
});
{%- endif %}
{%- endfor %}
{% endfor -%}
