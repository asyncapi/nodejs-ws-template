const util = require('util');
const { Router } = require('express');
const { pathParser } = require('../lib/path');
const { yellow } = require('../lib/colors');
{%- for channelName, channel in asyncapi.channels() -%}
{% set allOperationIds = channel | getOperationIds %}
const { {{ allOperationIds }} } = require('./services/{{ channelName | kebabCase }}');
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
  const path = pathParser(req.path);
  console.log(`${yellow(path)} client connected.`);

  ws.on('message', async (msg) => {
    const path = pathParser(req.path);
    console.log(`${yellow(path)} message was received:`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await {{ channel.publish().id() }}(ws, { message: msg, path, query: req.query });
  });
});
{%- endif %}
{% endfor -%}

{% for channelName, channel in asyncapi.channels() -%}
{%- if channel.hasSubscribe() %}
  {%- if channel.subscribe().summary() %}
/**
 * {{ channel.subscribe().summary() }}
 */
  {%- endif %}
router.ws('{{ channelName | pathResolve }}', async (ws, req) => {
    const path = pathParser(req.path);
    console.log(`${yellow(path)} client connected.`);
    await {{ channel.subscribe().id() }}(ws);
});

{%- endif %}
{% endfor -%}
