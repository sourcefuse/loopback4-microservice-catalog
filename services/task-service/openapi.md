---
title: Task Service v1.0.0
language_tabs:
  - javascript: JavaScript
  - javascript--nodejs: Node.JS
language_clients:
  - javascript: request
  - javascript--nodejs: ""
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="task-service">Task Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Task microservice

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="task-service-eventqueuecontroller">EventQueueController</h1>

## EventQueueController.enqueueEvent

<a id="opIdEventQueueController.enqueueEvent"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/event-queue/enqueue-event',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/event-queue/enqueue-event',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /event-queue/enqueue-event`

> Body parameter

```json
{
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {}
}
```

<h3 id="eventqueuecontroller.enqueueevent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[EventModel](#schemaeventmodel)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {}
}
```

<h3 id="eventqueuecontroller.enqueueevent-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Enque model instance|[EventModel](#schemaeventmodel)|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Event enqueued successfully|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to enqueue event|None|

<aside class="success">
This operation does not require authentication
</aside>

## EventQueueController.healthCheck

<a id="opIdEventQueueController.healthCheck"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/event-queue/health-check',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('/event-queue/health-check',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /event-queue/health-check`

> Example responses

> 200 Response

```json
{}
```

<h3 id="eventqueuecontroller.healthcheck-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Health check response|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to perform health check|None|

<h3 id="eventqueuecontroller.healthcheck-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## EventQueueController.startListening

<a id="opIdEventQueueController.startListening"></a>

> Code samples

```javascript

fetch('/event-queue/start-listening',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/event-queue/start-listening',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /event-queue/start-listening`

<h3 id="eventqueuecontroller.startlistening-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Started listening to events|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to start listening to events|None|

<aside class="success">
This operation does not require authentication
</aside>

## EventQueueController.stopListening

<a id="opIdEventQueueController.stopListening"></a>

> Code samples

```javascript

fetch('/event-queue/stop-listening',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/event-queue/stop-listening',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /event-queue/stop-listening`

<h3 id="eventqueuecontroller.stoplistening-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Stopped listening to events|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to stop listening to events|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_EventModel">EventModel</h2>
<!-- backwards compatibility -->
<a id="schemaeventmodel"></a>
<a id="schema_EventModel"></a>
<a id="tocSeventmodel"></a>
<a id="tocseventmodel"></a>

```json
{
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {}
}

```

EventModel

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|key|string|true|none|none|
|description|string|true|none|none|
|source|string|true|none|none|
|payload|object|true|none|none|

