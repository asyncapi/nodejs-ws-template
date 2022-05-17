////////////////////////////////////////////////////////////////
//
// {{ asyncapi.info().title() }}: streaming client example
//
////////////////////////////////////////////////////////////////
const WebSocket = require('ws')

////////////////////////////////////////////////////////////////
//
// This client handles the one-way websocket streaming use case
// It assumes only one channel on the server!
// It assumes only subscribe oepration in the channel!
// It supports query parameters such as ?begin=now&format=avro
//
////////////////////////////////////////////////////////////////
{%- set supported = false %}
{%- set numChannels = asyncapi.channelNames() | length %}
{%- set user_func = "processData" %}
{%- set url_queryString = "" %}
{%- set url_queryDelimiter = "?" %}
{%- set url_protocol = asyncapi.server(params.server).protocol() %}
{%- set url_server = asyncapi.server(params.server).url() %}
{%- set url_path = asyncapi.channelNames()[0] %}
{%- set msg_type = "" %}

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
        {%- set user_func = channel.subscribe().id() %}
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
                {%- set url_queryString = url_queryString + url_queryDelimiter + propKey + "=" + sValue %}
              {%- endif %}
              {%- if url_queryDelimiter == "?" %}
                {%- set url_queryDelimiter = "&" %}
              {%- endif %}
            {%- endfor %}
          {%- endif %}
        {%- endif %}
        {%- set msg_type = channel.subscribe().message().payload().type() %}
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
const {{user_func}} = (wsClient) => {
    wsClient.on('message', function message(data) {
        console.log('received some data:')
        const records = eval(data.toString())
{%- if msg_type == "array" %}
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
    const serviceURL = '{{url_protocol}}://{{url_server}}{{url_path}}{{url_queryString}}'

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
    {{user_func}}(wsClient)
}

init()

{% else %}
//
// the use case is NOT supported in this client.
//
{% endif %}
