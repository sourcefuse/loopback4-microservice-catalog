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

<h1 id="bpmn-service-eventcontroller">EventController</h1>

## EventController.count

<a id="opIdEventController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/events/count',
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

fetch('/events/count',
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

`GET /events/count`

| Permissions |
| ------- |
| 16002   |

<h3 id="eventcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="eventcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## EventController.mapEventToWorkflow

<a id="opIdEventController.mapEventToWorkflow"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "eventKey": "string",
  "workflowKey": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
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
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "eventKey": "string",
  "workflowKey": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
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
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "eventKey": "string",
  "workflowKey": "string"
}
```

<h3 id="eventcontroller.mapeventtoworkflow-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[EventWorkflowMapping](#schemaeventworkflowmapping)|false|none|

<h3 id="eventcontroller.mapeventtoworkflow-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## EventController.findById

<a id="opIdEventController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/events/{id}',
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

fetch('/events/{id}',
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

`GET /events/{id}`

| Permissions |
| ------- |
| 16002   |

<h3 id="eventcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[events.Filter](#schemaevents.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {},
  "timestamp": 0
}
```

<h3 id="eventcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event model instance|[EventWithRelations](#schemaeventwithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## EventController.find

<a id="opIdEventController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/events',
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

fetch('/events',
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

`GET /events`

| Permissions |
| ------- |
| 16002   |

<h3 id="eventcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[events.Filter1](#schemaevents.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "key": "string",
    "description": "string",
    "source": "string",
    "payload": {},
    "timestamp": 0
  }
]
```

<h3 id="eventcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Event model instances|Inline|

<h3 id="eventcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[EventWithRelations](#schemaeventwithrelations)]|false|none|[(tsType: EventWithRelations, schemaOptions: { includeRelations: true })]|
|» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|false|none|none|
|»» key|string|true|none|An identifier for a particular event queued by a service or a user|
|»» description|string|true|none|A short description of an event|
|»» source|string|true|none|Origination of an event- can be a service or from a user|
|»» payload|object|true|none|A dynamic object that contains information to be run in the workers of a bpmn engine|
|»» timestamp|number|true|none|A short message to indicate the progression of the event|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="bpmn-service-taskcontroller">TaskController</h1>

## TaskController.count

<a id="opIdTaskController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/count',
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

fetch('/tasks/count',
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

`GET /tasks/count`

| Permissions |
| ------- |
| 16003   |

<h3 id="taskcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="taskcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Task model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskController.mapTaskToWorkflow

<a id="opIdTaskController.mapTaskToWorkflow"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "workflowKey": "string",
  "taskKey": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
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
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "workflowKey": "string",
  "taskKey": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
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

| Permissions |
| ------- |
| 16006   |

> Body parameter

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
  "workflowKey": "string",
  "taskKey": "string"
}
```

<h3 id="taskcontroller.maptasktoworkflow-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[TaskWorkFlowMapping](#schemataskworkflowmapping)|false|none|

<h3 id="taskcontroller.maptasktoworkflow-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskController.updateById

<a id="opIdTaskController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{id}',
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
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{id}',
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

`PATCH /tasks/{id}`

| Permissions |
| ------- |
| 16011   |

> Body parameter

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
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
}
```

<h3 id="taskcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TaskPartial](#schemataskpartial)|false|none|

<h3 id="taskcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Task UPDATE by id success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskController.findById

<a id="opIdTaskController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{id}',
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

fetch('/tasks/{id}',
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

`GET /tasks/{id}`

| Permissions |
| ------- |
| 16003   |

<h3 id="taskcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[tasks.Filter](#schematasks.filter)|false|none|

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
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string",
  "userTasks": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "taskId": "string",
      "status": "string",
      "externalId": "string"
    }
  ]
}
```

<h3 id="taskcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Task model instance|[TaskWithRelations](#schemataskwithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskController.deleteById

<a id="opIdTaskController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{id}',
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

fetch('/tasks/{id}',
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

`DELETE /tasks/{id}`

| Permissions |
| ------- |
| 16008   |

<h3 id="taskcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|cascade|query|boolean|false|none|

<h3 id="taskcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Task DELETE by id success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskController.updateAll

<a id="opIdTaskController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks',
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
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks',
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

`PATCH /tasks`

| Permissions |
| ------- |
| 16011   |

> Body parameter

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
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
}
```

<h3 id="taskcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TaskPartial](#schemataskpartial)|false|none|

<h3 id="taskcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tasks UPDATE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskController.find

<a id="opIdTaskController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks',
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

fetch('/tasks',
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

`GET /tasks`

| Permissions |
| ------- |
| 16003   |

<h3 id="taskcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[tasks.Filter1](#schematasks.filter1)|false|none|

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
    "key": "string",
    "name": "string",
    "description": "string",
    "status": "string",
    "priority": "string",
    "severity": "string",
    "type": "string",
    "startDate": "2019-08-24T14:15:22Z",
    "dueDate": "2019-08-24T14:15:22Z",
    "endDate": "2019-08-24T14:15:22Z",
    "assigneeId": "string",
    "metadata": {},
    "externalId": "string",
    "userTasks": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "taskId": "string",
        "status": "string",
        "externalId": "string"
      }
    ]
  }
]
```

<h3 id="taskcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Task model instances|Inline|

<h3 id="taskcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TaskWithRelations](#schemataskwithrelations)]|false|none|[(tsType: TaskWithRelations, schemaOptions: { includeRelations: true })]|
|» TaskWithRelations|[TaskWithRelations](#schemataskwithrelations)|false|none|(tsType: TaskWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» key|string|true|none|An identifier for a particular task within an event|
|»» name|string|true|none|A name given by the consumer service for this task|
|»» description|string|false|none|A short description of this task|
|»» status|string|false|none|A short message to indicate the progression of the task|
|»» priority|string|true|none|none|
|»» severity|string|true|none|none|
|»» type|string|true|none|none|
|»» startDate|string(date-time)|false|none|none|
|»» dueDate|string(date-time)|false|none|none|
|»» endDate|string(date-time)|false|none|none|
|»» assigneeId|string|false|none|none|
|»» metadata|object|true|none|none|
|»» externalId|string|false|none|none|
|»» userTasks|[[UserTaskWithRelations](#schemausertaskwithrelations)]|false|none|[(tsType: UserTaskWithRelations, schemaOptions: { includeRelations: true })]|
|»»» UserTaskWithRelations|[UserTaskWithRelations](#schemausertaskwithrelations)|false|none|(tsType: UserTaskWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» name|string|true|none|none|
|»»»» taskId|string|true|none|none|
|»»»» status|string|true|none|none|
|»»»» externalId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskController.delete

<a id="opIdTaskController.delete"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks',
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

fetch('/tasks',
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

`DELETE /tasks`

| Permissions |
| ------- |
| 16008   |

<h3 id="taskcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|cascade|query|boolean|false|none|

<h3 id="taskcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tasks DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="bpmn-service-taskusertaskcontroller">TaskUserTaskController</h1>

## TaskUserTaskController.count

<a id="opIdTaskUserTaskController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{taskId}/user-tasks/count',
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

fetch('/tasks/{taskId}/user-tasks/count',
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

`GET /tasks/{taskId}/user-tasks/count`

| Permissions |
| ------- |
| 16004   |

<h3 id="taskusertaskcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|taskId|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="taskusertaskcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Task model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskUserTaskController.completeTask

<a id="opIdTaskUserTaskController.completeTask"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{taskId}/user-tasks/{userTaskId}/complete',
{
  method: 'PATCH',

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

fetch('/tasks/{taskId}/user-tasks/{userTaskId}/complete',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /tasks/{taskId}/user-tasks/{userTaskId}/complete`

| Permissions |
| ------- |
| 16005   |

<h3 id="taskusertaskcontroller.completetask-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|taskId|path|string|true|none|
|userTaskId|path|string|true|none|

<h3 id="taskusertaskcontroller.completetask-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskUserTaskController.findById

<a id="opIdTaskUserTaskController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{taskId}/user-tasks/{userTaskId}',
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

fetch('/tasks/{taskId}/user-tasks/{userTaskId}',
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

`GET /tasks/{taskId}/user-tasks/{userTaskId}`

| Permissions |
| ------- |
| 16004   |

<h3 id="taskusertaskcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|taskId|path|string|true|none|
|userTaskId|path|string|true|none|
|filter|query|[user_tasks.Filter](#schemauser_tasks.filter)|false|none|

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
  "name": "string",
  "taskId": "string",
  "status": "string",
  "externalId": "string"
}
```

<h3 id="taskusertaskcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserTask model instance|[UserTaskWithRelations](#schemausertaskwithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskUserTaskController.deleteById

<a id="opIdTaskUserTaskController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{taskId}/user-tasks/{id}',
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

fetch('/tasks/{taskId}/user-tasks/{id}',
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

`DELETE /tasks/{taskId}/user-tasks/{id}`

| Permissions |
| ------- |
| 16009   |

<h3 id="taskusertaskcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="taskusertaskcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|UserTasks DELETE by id success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskUserTaskController.find

<a id="opIdTaskUserTaskController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{taskId}/user-tasks',
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

fetch('/tasks/{taskId}/user-tasks',
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

`GET /tasks/{taskId}/user-tasks`

| Permissions |
| ------- |
| 16004   |

<h3 id="taskusertaskcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|taskId|path|string|true|none|
|filter|query|[user_tasks.Filter1](#schemauser_tasks.filter1)|false|none|

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
    "name": "string",
    "taskId": "string",
    "status": "string",
    "externalId": "string"
  }
]
```

<h3 id="taskusertaskcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of UserTask model instances|Inline|

<h3 id="taskusertaskcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserTaskWithRelations](#schemausertaskwithrelations)]|false|none|[(tsType: UserTaskWithRelations, schemaOptions: { includeRelations: true })]|
|» UserTaskWithRelations|[UserTaskWithRelations](#schemausertaskwithrelations)|false|none|(tsType: UserTaskWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» name|string|true|none|none|
|»» taskId|string|true|none|none|
|»» status|string|true|none|none|
|»» externalId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TaskUserTaskController.delete

<a id="opIdTaskUserTaskController.delete"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tasks/{taskId}/user-tasks',
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

fetch('/tasks/{taskId}/user-tasks',
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

`DELETE /tasks/{taskId}/user-tasks`

| Permissions |
| ------- |
| 16009   |

<h3 id="taskusertaskcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

<h3 id="taskusertaskcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|UserTasks DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
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
| ExecuteWorkflow   |
| 5   |

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

<h2 id="tocS_EventWithRelations">EventWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaeventwithrelations"></a>
<a id="schema_EventWithRelations"></a>
<a id="tocSeventwithrelations"></a>
<a id="tocseventwithrelations"></a>

```json
{
  "id": "string",
  "key": "string",
  "description": "string",
  "source": "string",
  "payload": {},
  "timestamp": 0
}

```

EventWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|key|string|true|none|An identifier for a particular event queued by a service or a user|
|description|string|true|none|A short description of an event|
|source|string|true|none|Origination of an event- can be a service or from a user|
|payload|object|true|none|A dynamic object that contains information to be run in the workers of a bpmn engine|
|timestamp|number|true|none|A short message to indicate the progression of the event|

<h2 id="tocS_EventWorkflowMapping">EventWorkflowMapping</h2>
<!-- backwards compatibility -->
<a id="schemaeventworkflowmapping"></a>
<a id="schema_EventWorkflowMapping"></a>
<a id="tocSeventworkflowmapping"></a>
<a id="tocseventworkflowmapping"></a>

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
  "eventKey": "string",
  "workflowKey": "string"
}

```

EventWorkflowMapping

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
|eventKey|string|true|none|An identifier for a particular event queued by a service or a user|
|workflowKey|string|true|none|An identifier for a particular workflow|

<h2 id="tocS_UserTaskWithRelations">UserTaskWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemausertaskwithrelations"></a>
<a id="schema_UserTaskWithRelations"></a>
<a id="tocSusertaskwithrelations"></a>
<a id="tocsusertaskwithrelations"></a>

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
  "name": "string",
  "taskId": "string",
  "status": "string",
  "externalId": "string"
}

```

UserTaskWithRelations

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
|name|string|true|none|none|
|taskId|string|true|none|none|
|status|string|true|none|none|
|externalId|string|true|none|none|

<h2 id="tocS_TaskWithRelations">TaskWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemataskwithrelations"></a>
<a id="schema_TaskWithRelations"></a>
<a id="tocStaskwithrelations"></a>
<a id="tocstaskwithrelations"></a>

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
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string",
  "userTasks": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "taskId": "string",
      "status": "string",
      "externalId": "string"
    }
  ]
}

```

TaskWithRelations

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
|key|string|true|none|An identifier for a particular task within an event|
|name|string|true|none|A name given by the consumer service for this task|
|description|string|false|none|A short description of this task|
|status|string|false|none|A short message to indicate the progression of the task|
|priority|string|true|none|none|
|severity|string|true|none|none|
|type|string|true|none|none|
|startDate|string(date-time)|false|none|none|
|dueDate|string(date-time)|false|none|none|
|endDate|string(date-time)|false|none|none|
|assigneeId|string|false|none|none|
|metadata|object|true|none|none|
|externalId|string|false|none|none|
|userTasks|[[UserTaskWithRelations](#schemausertaskwithrelations)]|false|none|[(tsType: UserTaskWithRelations, schemaOptions: { includeRelations: true })]|

<h2 id="tocS_TaskWorkFlowMapping">TaskWorkFlowMapping</h2>
<!-- backwards compatibility -->
<a id="schemataskworkflowmapping"></a>
<a id="schema_TaskWorkFlowMapping"></a>
<a id="tocStaskworkflowmapping"></a>
<a id="tocstaskworkflowmapping"></a>

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
  "workflowKey": "string",
  "taskKey": "string"
}

```

TaskWorkFlowMapping

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
|workflowKey|string|true|none|An identifier for a particular workflow|
|taskKey|string|true|none|An identifier for a particular task within an event|

<h2 id="tocS_TaskPartial">TaskPartial</h2>
<!-- backwards compatibility -->
<a id="schemataskpartial"></a>
<a id="schema_TaskPartial"></a>
<a id="tocStaskpartial"></a>
<a id="tocstaskpartial"></a>

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
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
}

```

TaskPartial

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
|key|string|false|none|An identifier for a particular task within an event|
|name|string|false|none|A name given by the consumer service for this task|
|description|string|false|none|A short description of this task|
|status|string|false|none|A short message to indicate the progression of the task|
|priority|string|false|none|none|
|severity|string|false|none|none|
|type|string|false|none|none|
|startDate|string(date-time)|false|none|none|
|dueDate|string(date-time)|false|none|none|
|endDate|string(date-time)|false|none|none|
|assigneeId|string|false|none|none|
|metadata|object|false|none|none|
|externalId|string|false|none|none|

<h2 id="tocS_Task">Task</h2>
<!-- backwards compatibility -->
<a id="schematask"></a>
<a id="schema_Task"></a>
<a id="tocStask"></a>
<a id="tocstask"></a>

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
  "key": "string",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "severity": "string",
  "type": "string",
  "startDate": "2019-08-24T14:15:22Z",
  "dueDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "assigneeId": "string",
  "metadata": {},
  "externalId": "string"
}

```

Task

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
|key|string|true|none|An identifier for a particular task within an event|
|name|string|true|none|A name given by the consumer service for this task|
|description|string|false|none|A short description of this task|
|status|string|false|none|A short message to indicate the progression of the task|
|priority|string|true|none|none|
|severity|string|true|none|none|
|type|string|true|none|none|
|startDate|string(date-time)|false|none|none|
|dueDate|string(date-time)|false|none|none|
|endDate|string(date-time)|false|none|none|
|assigneeId|string|false|none|none|
|metadata|object|true|none|none|
|externalId|string|false|none|none|

<h2 id="tocS_loopback.Count">loopback.Count</h2>
<!-- backwards compatibility -->
<a id="schemaloopback.count"></a>
<a id="schema_loopback.Count"></a>
<a id="tocSloopback.count"></a>
<a id="tocsloopback.count"></a>

```json
{
  "count": 0
}

```

loopback.Count

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|number|false|none|none|

<h2 id="tocS_events.Filter">events.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaevents.filter"></a>
<a id="schema_events.Filter"></a>
<a id="tocSevents.filter"></a>
<a id="tocsevents.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "key": true,
    "description": true,
    "source": true,
    "payload": true,
    "timestamp": true
  }
}

```

events.Filter

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
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» id|boolean|false|none|none|
|»» key|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» source|boolean|false|none|none|
|»» payload|boolean|false|none|none|
|»» timestamp|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_events.Filter1">events.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemaevents.filter1"></a>
<a id="schema_events.Filter1"></a>
<a id="tocSevents.filter1"></a>
<a id="tocsevents.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "key": true,
    "description": true,
    "source": true,
    "payload": true,
    "timestamp": true
  }
}

```

events.Filter

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
|»» id|boolean|false|none|none|
|»» key|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» source|boolean|false|none|none|
|»» payload|boolean|false|none|none|
|»» timestamp|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_user_tasks.Filter">user_tasks.Filter</h2>
<!-- backwards compatibility -->
<a id="schemauser_tasks.filter"></a>
<a id="schema_user_tasks.Filter"></a>
<a id="tocSuser_tasks.filter"></a>
<a id="tocsuser_tasks.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "name": true,
    "taskId": true,
    "status": true,
    "externalId": true
  }
}

```

user_tasks.Filter

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
|»» name|boolean|false|none|none|
|»» taskId|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» externalId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_user_tasks.Filter1">user_tasks.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemauser_tasks.filter1"></a>
<a id="schema_user_tasks.Filter1"></a>
<a id="tocSuser_tasks.filter1"></a>
<a id="tocsuser_tasks.filter1"></a>

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
    "name": true,
    "taskId": true,
    "status": true,
    "externalId": true
  }
}

```

user_tasks.Filter

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
|»» name|boolean|false|none|none|
|»» taskId|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» externalId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_tasks.ScopeFilter">tasks.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schematasks.scopefilter"></a>
<a id="schema_tasks.ScopeFilter"></a>
<a id="tocStasks.scopefilter"></a>
<a id="tocstasks.scopefilter"></a>

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

tasks.ScopeFilter

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

<h2 id="tocS_tasks.IncludeFilter.Items">tasks.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schematasks.includefilter.items"></a>
<a id="schema_tasks.IncludeFilter.Items"></a>
<a id="tocStasks.includefilter.items"></a>
<a id="tocstasks.includefilter.items"></a>

```json
{
  "relation": "userTasks",
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

tasks.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[tasks.ScopeFilter](#schematasks.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|userTasks|

<h2 id="tocS_tasks.Filter">tasks.Filter</h2>
<!-- backwards compatibility -->
<a id="schematasks.filter"></a>
<a id="schema_tasks.Filter"></a>
<a id="tocStasks.filter"></a>
<a id="tocstasks.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "key": true,
    "name": true,
    "description": true,
    "status": true,
    "priority": true,
    "severity": true,
    "type": true,
    "startDate": true,
    "dueDate": true,
    "endDate": true,
    "assigneeId": true,
    "metadata": true,
    "externalId": true
  },
  "include": [
    {
      "relation": "userTasks",
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

tasks.Filter

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
|»» key|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» priority|boolean|false|none|none|
|»» severity|boolean|false|none|none|
|»» type|boolean|false|none|none|
|»» startDate|boolean|false|none|none|
|»» dueDate|boolean|false|none|none|
|»» endDate|boolean|false|none|none|
|»» assigneeId|boolean|false|none|none|
|»» metadata|boolean|false|none|none|
|»» externalId|boolean|false|none|none|

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
|» *anonymous*|[tasks.IncludeFilter.Items](#schematasks.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_tasks.Filter1">tasks.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematasks.filter1"></a>
<a id="schema_tasks.Filter1"></a>
<a id="tocStasks.filter1"></a>
<a id="tocstasks.filter1"></a>

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
    "key": true,
    "name": true,
    "description": true,
    "status": true,
    "priority": true,
    "severity": true,
    "type": true,
    "startDate": true,
    "dueDate": true,
    "endDate": true,
    "assigneeId": true,
    "metadata": true,
    "externalId": true
  },
  "include": [
    {
      "relation": "userTasks",
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

tasks.Filter

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
|»» key|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» priority|boolean|false|none|none|
|»» severity|boolean|false|none|none|
|»» type|boolean|false|none|none|
|»» startDate|boolean|false|none|none|
|»» dueDate|boolean|false|none|none|
|»» endDate|boolean|false|none|none|
|»» assigneeId|boolean|false|none|none|
|»» metadata|boolean|false|none|none|
|»» externalId|boolean|false|none|none|

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
|» *anonymous*|[tasks.IncludeFilter.Items](#schematasks.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

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

