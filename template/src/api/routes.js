const util = require('util');
const { Router } = require('express');
const { yellow } = require('../lib/colors');
{%- for channelName, channel in asyncapi.channels() -%}
{%- if channel.hasPublish() %}
{%- if channel.publish().id() === undefined -%}
{ { 'This template requires operationId to be set in every operation.' | logError }}
{%- endif %}
const {{ channelName | camelCase }}Service = require('./services/{{ channelName | kebabCase }}');
{%- endif -%}
{%- endfor %}
const router = Router();
module.exports = router;
{% for channelName, channel in asyncapi.channels() -%}
{%- if channel.hasPublish() %}
  {%- if channel.publish().summary() %}
/**
 * {{ channel.publish().summary() }}
 */
  {%- endif %}
router.ws('{{ channelName | pathResolve }}', async (ws, req) => {
  ws.on('message', async (msg) => {
    const path = req.path.substr(0, req.path.length - '/.websocket'.length);
    console.log(`${yellow(path)} message was received:`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await {{ channelName | camelCase }}Service.{{ channel.publish().id() }}(ws, { message: msg, path, query: req.query });
  });
});

{%- endif %}
{% endfor -%}
