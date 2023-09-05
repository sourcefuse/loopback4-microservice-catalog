---
title: Bpmn Service v1.0.0
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

<h1 id="bpmn-service">Bpmn Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

a Reusable, customizable and workflow based task service

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="bpmn-service-apikeycontroller">ApiKeyController</h1>

## ApiKeyController.generateApiKeys

<a id="opIdApiKeyController.generateApiKeys"></a>

> Code samples

```javascript

fetch('/api-keys',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/api-keys',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /api-keys`

| Permissions |
| ------- |
| APIAdmin   |

> Example responses

<h3 id="apikeycontroller.generateapikeys-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of ApiKeyController.generateApiKeys|None|

<h3 id="apikeycontroller.generateapikeys-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="bpmn-service-eventqueuecontroller">EventQueueController</h1>

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

| Permissions |
| ------- |
| AddToQueue   |

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
|body|body|[Event](#schemaevent)|false|none|

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Enque model instance|[Event](#schemaevent)|
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

| Permissions |
| ------- |
| StartListening   |

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

| Permissions |
| ------- |
| StopListening   |

<h3 id="eventqueuecontroller.stoplistening-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Stopped listening to events|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Failed to stop listening to events|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="bpmn-service-eventscontroller">EventsController</h1>

## EventsController.mapTaskToWorkflow

<a id="opIdEventsController.mapTaskToWorkflow"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "eventKey": "string",
  "workflowKey": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/events/mapping',
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
  "eventKey": "string",
  "workflowKey": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/events/mapping',
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

`POST /events/mapping`

> Body parameter

```json
{
  "id": "string",
  "eventKey": "string",
  "workflowKey": "string"
}
```

<h3 id="eventscontroller.maptasktoworkflow-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[EventWorkflowMapping](#schemaeventworkflowmapping)|false|none|

> Example responses

<h3 id="eventscontroller.maptasktoworkflow-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of EventsController.mapTaskToWorkflow|None|

<h3 id="eventscontroller.maptasktoworkflow-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="bpmn-service-taskservicecontroller">TaskServiceController</h1>

## TaskServiceController.mapTaskToWorkflow

<a id="opIdTaskServiceController.mapTaskToWorkflow"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "workflowKey": "string",
  "taskKey": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tasks/mapping',
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
  "workflowKey": "string",
  "taskKey": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/tasks/mapping',
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

`POST /tasks/mapping`

> Body parameter

```json
{
  "id": "string",
  "workflowKey": "string",
  "taskKey": "string"
}
```

<h3 id="taskservicecontroller.maptasktoworkflow-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[TaskWorkFlowMapping](#schemataskworkflowmapping)|false|none|

> Example responses

<h3 id="taskservicecontroller.maptasktoworkflow-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of TaskServiceController.mapTaskToWorkflow|None|

<h3 id="taskservicecontroller.maptasktoworkflow-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## TaskServiceController.subscribeToWebhook

<a id="opIdTaskServiceController.subscribeToWebhook"></a>

> Code samples

```javascript
const inputBody = '{
  "url": "string",
  "key": "string",
  "id": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tasks/subscribe',
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
  "url": "string",
  "key": "string",
  "id": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/tasks/subscribe',
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

`POST /tasks/subscribe`

> Body parameter

```json
{
  "url": "string",
  "key": "string",
  "id": "string"
}
```

<h3 id="taskservicecontroller.subscribetowebhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[SubscriberDTO](#schemasubscriberdto)|false|none|

> Example responses

<h3 id="taskservicecontroller.subscribetowebhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of TaskServiceController.subscribeToWebhook|None|

<h3 id="taskservicecontroller.subscribetowebhook-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## TaskServiceController.updateTask

<a id="opIdTaskServiceController.updateTask"></a>

> Code samples

```javascript
const inputBody = '{
  "taskKey": "string",
  "payload": {},
  "id": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tasks',
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
  "taskKey": "string",
  "payload": {},
  "id": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/tasks',
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

`POST /tasks`

> Body parameter

```json
{
  "taskKey": "string",
  "payload": {},
  "id": "string"
}
```

<h3 id="taskservicecontroller.updatetask-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[TaskDto](#schemataskdto)|false|none|

> Example responses

<h3 id="taskservicecontroller.updatetask-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of TaskServiceController.updateTask|None|

<h3 id="taskservicecontroller.updatetask-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="bpmn-service-workflowcontroller">WorkflowController</h1>

## WorkflowController.startWorkflow

<a id="opIdWorkflowController.startWorkflow"></a>

> Code samples

```javascript
const inputBody = '{
  "workflowVersion": 0,
  "input": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}/execute',
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
  "workflowVersion": 0,
  "input": {}
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}/execute',
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

`POST /workflows/{id}/execute`

| Permissions |
| ------- |
| CreateWorkflow   |
| 2   |

> Body parameter

```json
{
  "workflowVersion": 0,
  "input": {}
}
```

<h3 id="workflowcontroller.startworkflow-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ExecuteWorkflowDto](#schemaexecuteworkflowdto)|false|none|

<h3 id="workflowcontroller.startworkflow-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Workflow instance|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## WorkflowController.deleteVersionById

<a id="opIdWorkflowController.deleteVersionById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}/version/{version}',
{
  method: 'DELETE',

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
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}/version/{version}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /workflows/{id}/version/{version}`

| Permissions |
| ------- |
| DeleteWorkflow   |
| 4   |

<h3 id="workflowcontroller.deleteversionbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|version|path|number|true|none|

<h3 id="workflowcontroller.deleteversionbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Workflow DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## WorkflowController.updateById

<a id="opIdWorkflowController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}',
{
  method: 'PATCH',
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
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /workflows/{id}`

| Permissions |
| ------- |
| UpdateWorkflow   |
| 3   |

> Body parameter

```json
{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
}
```

<h3 id="workflowcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[WorkflowDtoPartial](#schemaworkflowdtopartial)|false|none|

<h3 id="workflowcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Workflow PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## WorkflowController.count

<a id="opIdWorkflowController.count"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}',
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
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}',
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

`GET /workflows/{id}`

| Permissions |
| ------- |
| ViewWorkflow   |
| 1   |

<h3 id="workflowcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="workflowcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Workflow Model|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## WorkflowController.deleteById

<a id="opIdWorkflowController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}',
{
  method: 'DELETE',

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
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /workflows/{id}`

| Permissions |
| ------- |
| DeleteWorkflow   |
| 4   |

<h3 id="workflowcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="workflowcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Workflow DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## WorkflowController.create

<a id="opIdWorkflowController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows',
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
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows',
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

`POST /workflows`

| Permissions |
| ------- |
| CreateWorkflow   |
| 2   |

> Body parameter

```json
{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
}
```

<h3 id="workflowcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewWorkflow](#schemanewworkflow)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "workflowVersion": 0,
  "externalIdentifier": "string",
  "name": "string",
  "provider": "string",
  "inputSchema": {},
  "description": "string"
}
```

<h3 id="workflowcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Workflow model instance|[Workflow](#schemaworkflow)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## WorkflowController.find

<a id="opIdWorkflowController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows',
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
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/workflows',
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

`GET /workflows`

| Permissions |
| ------- |
| ViewWorkflow   |
| 1   |

<h3 id="workflowcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[workflows.Filter](#schemaworkflows.filter)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "workflowVersion": 0,
    "externalIdentifier": "string",
    "name": "string",
    "provider": "string",
    "inputSchema": {},
    "description": "string"
  }
]
```

<h3 id="workflowcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Workflow model instances|Inline|

<h3 id="workflowcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Workflow](#schemaworkflow)]|false|none|none|
|» Workflow|[Workflow](#schemaworkflow)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» workflowVersion|number|true|none|Last deployed workflow version|
|»» externalIdentifier|string|true|none|The key that is used to identify the workflow in the respective workflow engine.|
|»» name|string|false|none|Name of the workflow|
|»» provider|string|true|none|Provider could be the engine that will handle the workflow - camunda, zeebe, etc|
|»» inputSchema|object|true|none|Schema used for validation during workflow execution|
|»» description|string|false|none|Description of the workflow|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

# Schemas

<h2 id="tocS_Workflow">Workflow</h2>
<!-- backwards compatibility -->
<a id="schemaworkflow"></a>
<a id="schema_Workflow"></a>
<a id="tocSworkflow"></a>
<a id="tocsworkflow"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "workflowVersion": 0,
  "externalIdentifier": "string",
  "name": "string",
  "provider": "string",
  "inputSchema": {},
  "description": "string"
}

```

Workflow

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|workflowVersion|number|true|none|Last deployed workflow version|
|externalIdentifier|string|true|none|The key that is used to identify the workflow in the respective workflow engine.|
|name|string|false|none|Name of the workflow|
|provider|string|true|none|Provider could be the engine that will handle the workflow - camunda, zeebe, etc|
|inputSchema|object|true|none|Schema used for validation during workflow execution|
|description|string|false|none|Description of the workflow|

<h2 id="tocS_NewWorkflow">NewWorkflow</h2>
<!-- backwards compatibility -->
<a id="schemanewworkflow"></a>
<a id="schema_NewWorkflow"></a>
<a id="tocSnewworkflow"></a>
<a id="tocsnewworkflow"></a>

```json
{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
}

```

NewWorkflow

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|bpmnFile|string|true|none|none|
|inputSchema|object|true|none|none|
|description|string|false|none|none|

<h2 id="tocS_WorkflowDto">WorkflowDto</h2>
<!-- backwards compatibility -->
<a id="schemaworkflowdto"></a>
<a id="schema_WorkflowDto"></a>
<a id="tocSworkflowdto"></a>
<a id="tocsworkflowdto"></a>

```json
{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
}

```

WorkflowDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|bpmnFile|string|true|none|none|
|inputSchema|object|true|none|none|
|description|string|false|none|none|

<h2 id="tocS_WorkflowDtoPartial">WorkflowDtoPartial</h2>
<!-- backwards compatibility -->
<a id="schemaworkflowdtopartial"></a>
<a id="schema_WorkflowDtoPartial"></a>
<a id="tocSworkflowdtopartial"></a>
<a id="tocsworkflowdtopartial"></a>

```json
{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {},
  "description": "string"
}

```

WorkflowDtoPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|bpmnFile|string|false|none|none|
|inputSchema|object|false|none|none|
|description|string|false|none|none|

<h2 id="tocS_ExecuteWorkflowDto">ExecuteWorkflowDto</h2>
<!-- backwards compatibility -->
<a id="schemaexecuteworkflowdto"></a>
<a id="schema_ExecuteWorkflowDto"></a>
<a id="tocSexecuteworkflowdto"></a>
<a id="tocsexecuteworkflowdto"></a>

```json
{
  "workflowVersion": 0,
  "input": {}
}

```

ExecuteWorkflowDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|workflowVersion|number|false|none|none|
|input|object|true|none|none|

<h2 id="tocS_Event">Event</h2>
<!-- backwards compatibility -->
<a id="schemaevent"></a>
<a id="schema_Event"></a>
<a id="tocSevent"></a>
<a id="tocsevent"></a>

```json
{
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {}
}

```

Event

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|key|string|true|none|An identifier for a particular event queued by a service or a user|
|description|string|true|none|A short description of an event|
|source|string|true|none|Origination of an event- can be a service or from a user|
|payload|object|true|none|A dynamic object that contains information to be run in the workers of a bpmn engine|

<h2 id="tocS_TaskDto">TaskDto</h2>
<!-- backwards compatibility -->
<a id="schemataskdto"></a>
<a id="schema_TaskDto"></a>
<a id="tocStaskdto"></a>
<a id="tocstaskdto"></a>

```json
{
  "taskKey": "string",
  "payload": {},
  "id": "string"
}

```

TaskDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|taskKey|string|true|none|An identifier for a particular task within an event|
|payload|object|false|none|A dynamic object that contains information to be run in the user task of a bpmn engine|
|id|string|false|none|none|

<h2 id="tocS_SubscriberDTO">SubscriberDTO</h2>
<!-- backwards compatibility -->
<a id="schemasubscriberdto"></a>
<a id="schema_SubscriberDTO"></a>
<a id="tocSsubscriberdto"></a>
<a id="tocssubscriberdto"></a>

```json
{
  "url": "string",
  "key": "string",
  "id": "string"
}

```

SubscriberDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|url|string|true|none|url of the regsiterer who is subscribed to the webhook|
|key|string|true|none|identifier of an event key or task key|
|id|string|false|none|none|

<h2 id="tocS_TaskWorkFlowMapping">TaskWorkFlowMapping</h2>
<!-- backwards compatibility -->
<a id="schemataskworkflowmapping"></a>
<a id="schema_TaskWorkFlowMapping"></a>
<a id="tocStaskworkflowmapping"></a>
<a id="tocstaskworkflowmapping"></a>

```json
{
  "id": "string",
  "workflowKey": "string",
  "taskKey": "string"
}

```

TaskWorkFlowMapping

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|workflowKey|string|true|none|An identifier for a particular workflow|
|taskKey|string|true|none|An identifier for a particular task within an event|

<h2 id="tocS_EventWorkflowMapping">EventWorkflowMapping</h2>
<!-- backwards compatibility -->
<a id="schemaeventworkflowmapping"></a>
<a id="schema_EventWorkflowMapping"></a>
<a id="tocSeventworkflowmapping"></a>
<a id="tocseventworkflowmapping"></a>

```json
{
  "id": "string",
  "eventKey": "string",
  "workflowKey": "string"
}

```

EventWorkflowMapping

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|eventKey|string|true|none|An identifier for a particular event queued by a service or a user|
|workflowKey|string|true|none|An identifier for a particular workflow|

<h2 id="tocS_workflows.ScopeFilter">workflows.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaworkflows.scopefilter"></a>
<a id="schema_workflows.ScopeFilter"></a>
<a id="tocSworkflows.scopefilter"></a>
<a id="tocsworkflows.scopefilter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {},
  "include": [
    {}
  ]
}

```

workflows.ScopeFilter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[object]|false|none|none|

<h2 id="tocS_workflows.IncludeFilter.Items">workflows.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaworkflows.includefilter.items"></a>
<a id="schema_workflows.IncludeFilter.Items"></a>
<a id="tocSworkflows.includefilter.items"></a>
<a id="tocsworkflows.includefilter.items"></a>

```json
{
  "relation": "workflowVersions",
  "scope": {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "string",
    "where": {},
    "fields": {},
    "include": [
      {}
    ]
  }
}

```

workflows.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[workflows.ScopeFilter](#schemaworkflows.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|workflowVersions|

<h2 id="tocS_workflows.Filter">workflows.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaworkflows.filter"></a>
<a id="schema_workflows.Filter"></a>
<a id="tocSworkflows.filter"></a>
<a id="tocsworkflows.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "workflowVersion": true,
    "externalIdentifier": true,
    "name": true,
    "provider": true,
    "inputSchema": true,
    "description": true
  },
  "include": [
    {
      "relation": "workflowVersions",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

workflows.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» workflowVersion|boolean|false|none|none|
|»» externalIdentifier|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» provider|boolean|false|none|none|
|»» inputSchema|boolean|false|none|none|
|»» description|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[workflows.IncludeFilter.Items](#schemaworkflows.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

