////////////////////////////////////////////////////////////////
//
// {{ asyncapi.info().title() }}: streaming client example
//
////////////////////////////////////////////////////////////////
const WebSocket = require('ws')

////////////////////////////////////////////////////////////////
//
// This client handles the one-way websocket streaming use case
// It assumes only one channel in the server!
// It assumes only subscribe oepration in the channel!
// It supports query parameters such as ?begin=now&format=avro
//
////////////////////////////////////////////////////////////////
{%- set supported = false %}
{%- set numChannels = asyncapi.channelNames() | length %}
{%- set userFunction = "processData" %}
{%- set urlQueryString = "" %}
{%- set urlQueryDelimiter = "?" %}
{%- set urlProtocol = asyncapi.server(params.server).protocol() %}
{%- set urlServer = asyncapi.server(params.server).url() %}
{%- set urlPath = asyncapi.channelNames()[0] %}
{%- set msgType = "" %}

{%- if numChannels != 1 %}
  // Not Supported, one channel streaming client only
  {%- set supported = false %}
{%- else %}
  {%- for channelName, channel in asyncapi.channels() %}
    {%- if channel.hasPublish() %}
      // Not Supported, subscribe operation only
      {%- set supported = false %}
    {%- else %}
      {%- if channel.hasSubscribe() %}
        {%- set supported = true %}
        {%- set userFunction = channel.subscribe().id() %}
        {%- if channel.hasBindings("ws") %}
          {%- set ws_binding = channel.binding("ws") %}
          {%- if ws_binding["query"]["properties"] %}
            {%- for propKey, propValue in ws_binding["query"]["properties"] %}
              {%- set sValue = "" %}
              {%- if propValue %}
                {%- if propValue["default"] %}
                  {%- set sValue = propValue["default"] %}
                {%- else %}
                  {%- set sValue = propValue %}
                {%- endif %}
                {%- set urlQueryString = urlQueryString + urlQueryDelimiter + propKey + "=" + sValue %}
              {%- endif %}
              {%- if urlQueryDelimiter == "?" %}
                {%- set urlQueryDelimiter = "&" %}
              {%- endif %}
            {%- endfor %}
          {%- endif %}
        {%- endif %}
        {%- set msgType = channel.subscribe().message().payload().type() %}
      {%- endif %}
    {%- endif %}
  {%- endfor %}
{%- endif %}

{%- if supported %}

////////////////////////////////////////////////////////////////
//
// generic data processing with the websocket service,
// assume an array of json objects.
//
////////////////////////////////////////////////////////////////
const {{userFunction}} = (wsClient) => {
    wsClient.on('message', function message(data) {
        console.log('received some data:')
        const records = eval(data.toString())
{%- if msgType == "array" %}
        for (var i = 0; i < records.length; i++) {
	    console.log(records[i]);
            //data processing, implement user logic here. 
        }
{%- else %}
        console.log(records);
        //data processing, implement user logic here. 
{%- endif %}
    });
    wsClient.on('error', (err) => {
        console.log(err.toString());
    });
}

////////////////////////////////////////////////////////////////
//
// main entry point for the example client:
// asyncapi yaml definition is parsed to provide service
// access URL and a dedicated websocket connection is
// created to stream data from the service.
//
////////////////////////////////////////////////////////////////
const init = async () =>{
    const serviceURL = '{{urlProtocol}}://{{urlServer}}{{urlPath}}{{urlQueryString}}'

    console.log(" ");
    console.log("Establishing websocket connection to: ");
    console.log(serviceURL);
    console.log(" ");

    // establishing websocket connection to the service
    const wsClient = new WebSocket(serviceURL);

    console.log(" ");
    console.log("Start streaming data from the service ...");
    console.log(" ");

    // now start the client processing    
    {{userFunction}}(wsClient)
}

init()

{% else %}
//
// the use case is NOT supported in this client.
//
{% endif %}
