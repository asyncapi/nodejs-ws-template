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
router.ws('{{channelName | pathResolve}}', async (ws, req) => {
  const path = pathParser(req.path);
  console.log(`${yellow(path)} client connected.`);
  {%- if channel.hasSubscribe() %}
  await {{ channel.subscribe().id() }}(ws);
  {%- endif %}

  {%- if channel.hasPublish() %}
  ws.on('message', async (msg) => {
    console.log(`${yellow(path)} message was received:`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await {{ channel.publish().id() }}(ws, { message: msg, path, query: req.query });
  });
  {%- endif %}
});
{% endfor -%}

