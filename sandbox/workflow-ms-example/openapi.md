---
title: Bpmn Service v1.0.0
language_tabs:
  - "'javascript": JavaScript
  - "'javascript--nodejs": Node.JS'
language_clients:
  - "'javascript": request'
  - "'javascript--nodejs": ""
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="bpmn-service">Bpmn Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

A workflow microservice example

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="bpmn-service-workflowcontroller">WorkflowController</h1>

## WorkflowController.startWorkflow

<a id="opIdWorkflowController.startWorkflow"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "workflowVersion": 0,
  "input": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/workflow/{id}/execute',
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

`POST /workflow/{id}/execute`

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
None
</aside>

## WorkflowController.updateById

<a id="opIdWorkflowController.updateById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/workflow/{id}',
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

`PATCH /workflow/{id}`

> Body parameter

```json
{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {}
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
None
</aside>

## WorkflowController.count

<a id="opIdWorkflowController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/workflow/{id}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /workflow/{id}`

<h3 id="workflowcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="workflowcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Workflow Model|None|

<aside class="success">
This operation does not require authentication
</aside>

## WorkflowController.deleteById

<a id="opIdWorkflowController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/workflow/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /workflow/{id}`

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
None
</aside>

## WorkflowController.create

<a id="opIdWorkflowController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/workflow',
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

`POST /workflow`

> Body parameter

```json
{
  "name": "string",
  "bpmnFile": "string",
  "inputSchema": {}
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
None
</aside>

## WorkflowController.find

<a id="opIdWorkflowController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/workflow',
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

`GET /workflow`

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
|»» workflowVersion|number|true|none|none|
|»» externalIdentifier|string|true|none|none|
|»» name|string|false|none|none|
|»» provider|string|true|none|none|
|»» inputSchema|object|true|none|none|
|»» description|string|false|none|none|

<aside class="success">
This operation does not require authentication
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
|workflowVersion|number|true|none|none|
|externalIdentifier|string|true|none|none|
|name|string|false|none|none|
|provider|string|true|none|none|
|inputSchema|object|true|none|none|
|description|string|false|none|none|

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
  "inputSchema": {}
}

```

NewWorkflow

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|bpmnFile|string|true|none|none|
|inputSchema|object|true|none|none|

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
  "inputSchema": {}
}

```

WorkflowDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|none|
|bpmnFile|string|true|none|none|
|inputSchema|object|true|none|none|

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
  "inputSchema": {}
}

```

WorkflowDtoPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|bpmnFile|string|false|none|none|
|inputSchema|object|false|none|none|

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
  "relation": "string",
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
      "relation": "string",
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

