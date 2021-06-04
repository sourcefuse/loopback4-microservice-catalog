---
title: Audit Service v1.0.0
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

<h1 id="audit-service">Audit Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

An audit microservice example

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="audit-service-auditcontroller">AuditController</h1>

## AuditController.count

<a id="opIdAuditController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/audit-logs/count',
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

`GET /audit-logs/count`

<h3 id="auditcontroller.count-parameters">Parameters</h3>

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

<h3 id="auditcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AuditLog model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuditController.findById

<a id="opIdAuditController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/audit-logs/{id}',
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

`GET /audit-logs/{id}`

<h3 id="auditcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[audit_logs.Filter](#schemaaudit_logs.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
}
```

<h3 id="auditcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AuditLog model instance|[AuditLogWithRelations](#schemaauditlogwithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuditController.create

<a id="opIdAuditController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/audit-logs',
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

`POST /audit-logs`

> Body parameter

```json
{
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
}
```

<h3 id="auditcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewAuditLog](#schemanewauditlog)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
}
```

<h3 id="auditcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AuditLog model instance|[AuditLog](#schemaauditlog)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuditController.find

<a id="opIdAuditController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/audit-logs',
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

`GET /audit-logs`

<h3 id="auditcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[audit_logs.Filter1](#schemaaudit_logs.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "action": "string",
    "actedAt": "2019-08-24T14:15:22Z",
    "actedOn": "string",
    "actionKey": "string",
    "entityId": "string",
    "actor": "string",
    "before": {},
    "after": {},
    "actionGroup": "string"
  }
]
```

<h3 id="auditcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of AuditLog model instances|Inline|

<h3 id="auditcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[AuditLogWithRelations](#schemaauditlogwithrelations)]|false|none|[(tsType: AuditLogWithRelations, schemaOptions: { includeRelations: true })]|
|» AuditLogWithRelations|[AuditLogWithRelations](#schemaauditlogwithrelations)|false|none|(tsType: AuditLogWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|false|none|none|
|»» action|string|true|none|none|
|»» actedAt|string(date-time)|true|none|none|
|»» actedOn|string|false|none|none|
|»» actionKey|string|true|none|none|
|»» entityId|string|true|none|none|
|»» actor|string|true|none|none|
|»» before|object|false|none|none|
|»» after|object|false|none|none|
|»» actionGroup|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="audit-service-todocontroller">ToDoController</h1>

## ToDoController.count

<a id="opIdToDoController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos/count',
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

`GET /to-dos/count`

<h3 id="todocontroller.count-parameters">Parameters</h3>

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

<h3 id="todocontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ToDo model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## ToDoController.replaceById

<a id="opIdToDoController.replaceById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos/{id}',
{
  method: 'PUT',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /to-dos/{id}`

> Body parameter

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ToDo](#schematodo)|false|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="todocontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="todocontroller.replacebyid-responseschema">Response Schema</h3>

Status Code **204**

*ToDo PUT success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ToDoController.updateById

<a id="opIdToDoController.updateById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos/{id}',
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

`PATCH /to-dos/{id}`

> Body parameter

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ToDoPartial](#schematodopartial)|false|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="todocontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="todocontroller.updatebyid-responseschema">Response Schema</h3>

Status Code **204**

*ToDo PATCH success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ToDoController.findById

<a id="opIdToDoController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos/{id}',
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

`GET /to-dos/{id}`

<h3 id="todocontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[ToDo.Filter](#schematodo.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ToDo model instance|[ToDoWithRelations](#schematodowithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## ToDoController.deleteById

<a id="opIdToDoController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos/{id}',
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

`DELETE /to-dos/{id}`

<h3 id="todocontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="todocontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="todocontroller.deletebyid-responseschema">Response Schema</h3>

Status Code **204**

*ToDo DELETE success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ToDoController.create

<a id="opIdToDoController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos',
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

`POST /to-dos`

> Body parameter

```json
{
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewToDo](#schemanewtodo)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ToDo model instance|[ToDo](#schematodo)|

<aside class="success">
This operation does not require authentication
</aside>

## ToDoController.updateAll

<a id="opIdToDoController.updateAll"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos',
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

`PATCH /to-dos`

> Body parameter

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[ToDoPartial](#schematodopartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="todocontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ToDo PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## ToDoController.find

<a id="opIdToDoController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/to-dos',
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

`GET /to-dos`

<h3 id="todocontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[ToDo.Filter1](#schematodo.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "items": [
      "string"
    ]
  }
]
```

<h3 id="todocontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of ToDo model instances|Inline|

<h3 id="todocontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[ToDoWithRelations](#schematodowithrelations)]|false|none|[(tsType: ToDoWithRelations, schemaOptions: { includeRelations: true })]|
|» ToDoWithRelations|[ToDoWithRelations](#schematodowithrelations)|false|none|(tsType: ToDoWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|false|none|none|
|»» title|string|true|none|none|
|»» description|string|true|none|none|
|»» items|[string]|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_AuditLog">AuditLog</h2>
<!-- backwards compatibility -->
<a id="schemaauditlog"></a>
<a id="schema_AuditLog"></a>
<a id="tocSauditlog"></a>
<a id="tocsauditlog"></a>

```json
{
  "id": "string",
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
}

```

AuditLog

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|action|string|true|none|none|
|actedAt|string(date-time)|true|none|none|
|actedOn|string|false|none|none|
|actionKey|string|true|none|none|
|entityId|string|true|none|none|
|actor|string|true|none|none|
|before|object|false|none|none|
|after|object|false|none|none|
|actionGroup|string|false|none|none|

<h2 id="tocS_NewAuditLog">NewAuditLog</h2>
<!-- backwards compatibility -->
<a id="schemanewauditlog"></a>
<a id="schema_NewAuditLog"></a>
<a id="tocSnewauditlog"></a>
<a id="tocsnewauditlog"></a>

```json
{
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
}

```

NewAuditLog

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|action|string|true|none|none|
|actedAt|string(date-time)|true|none|none|
|actedOn|string|false|none|none|
|actionKey|string|true|none|none|
|entityId|string|true|none|none|
|actor|string|true|none|none|
|before|object|false|none|none|
|after|object|false|none|none|
|actionGroup|string|false|none|none|

<h2 id="tocS_AuditLogWithRelations">AuditLogWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaauditlogwithrelations"></a>
<a id="schema_AuditLogWithRelations"></a>
<a id="tocSauditlogwithrelations"></a>
<a id="tocsauditlogwithrelations"></a>

```json
{
  "id": "string",
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
}

```

AuditLogWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|action|string|true|none|none|
|actedAt|string(date-time)|true|none|none|
|actedOn|string|false|none|none|
|actionKey|string|true|none|none|
|entityId|string|true|none|none|
|actor|string|true|none|none|
|before|object|false|none|none|
|after|object|false|none|none|
|actionGroup|string|false|none|none|

<h2 id="tocS_ToDo">ToDo</h2>
<!-- backwards compatibility -->
<a id="schematodo"></a>
<a id="schema_ToDo"></a>
<a id="tocStodo"></a>
<a id="tocstodo"></a>

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

ToDo

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|title|string|true|none|none|
|description|string|true|none|none|
|items|[string]|false|none|none|

<h2 id="tocS_NewToDo">NewToDo</h2>
<!-- backwards compatibility -->
<a id="schemanewtodo"></a>
<a id="schema_NewToDo"></a>
<a id="tocSnewtodo"></a>
<a id="tocsnewtodo"></a>

```json
{
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

NewToDo

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|title|string|true|none|none|
|description|string|true|none|none|
|items|[string]|false|none|none|

<h2 id="tocS_ToDoWithRelations">ToDoWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematodowithrelations"></a>
<a id="schema_ToDoWithRelations"></a>
<a id="tocStodowithrelations"></a>
<a id="tocstodowithrelations"></a>

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

ToDoWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|title|string|true|none|none|
|description|string|true|none|none|
|items|[string]|false|none|none|

<h2 id="tocS_ToDoPartial">ToDoPartial</h2>
<!-- backwards compatibility -->
<a id="schematodopartial"></a>
<a id="schema_ToDoPartial"></a>
<a id="tocStodopartial"></a>
<a id="tocstodopartial"></a>

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

ToDoPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|title|string|false|none|none|
|description|string|false|none|none|
|items|[string]|false|none|none|

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

<h2 id="tocS_audit_logs.Filter">audit_logs.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaaudit_logs.filter"></a>
<a id="schema_audit_logs.Filter"></a>
<a id="tocSaudit_logs.filter"></a>
<a id="tocsaudit_logs.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "action": true,
    "actedAt": true,
    "actedOn": true,
    "actionKey": true,
    "entityId": true,
    "actor": true,
    "before": true,
    "after": true,
    "actionGroup": true
  }
}

```

audit_logs.Filter

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
|»» action|boolean|false|none|none|
|»» actedAt|boolean|false|none|none|
|»» actedOn|boolean|false|none|none|
|»» actionKey|boolean|false|none|none|
|»» entityId|boolean|false|none|none|
|»» actor|boolean|false|none|none|
|»» before|boolean|false|none|none|
|»» after|boolean|false|none|none|
|»» actionGroup|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_audit_logs.Filter1">audit_logs.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemaaudit_logs.filter1"></a>
<a id="schema_audit_logs.Filter1"></a>
<a id="tocSaudit_logs.filter1"></a>
<a id="tocsaudit_logs.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "action": true,
    "actedAt": true,
    "actedOn": true,
    "actionKey": true,
    "entityId": true,
    "actor": true,
    "before": true,
    "after": true,
    "actionGroup": true
  }
}

```

audit_logs.Filter

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
|»» action|boolean|false|none|none|
|»» actedAt|boolean|false|none|none|
|»» actedOn|boolean|false|none|none|
|»» actionKey|boolean|false|none|none|
|»» entityId|boolean|false|none|none|
|»» actor|boolean|false|none|none|
|»» before|boolean|false|none|none|
|»» after|boolean|false|none|none|
|»» actionGroup|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_ToDo.Filter">ToDo.Filter</h2>
<!-- backwards compatibility -->
<a id="schematodo.filter"></a>
<a id="schema_ToDo.Filter"></a>
<a id="tocStodo.filter"></a>
<a id="tocstodo.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "title": true,
    "description": true,
    "items": true
  }
}

```

ToDo.Filter

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
|»» title|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» items|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_ToDo.Filter1">ToDo.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematodo.filter1"></a>
<a id="schema_ToDo.Filter1"></a>
<a id="tocStodo.filter1"></a>
<a id="tocstodo.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "title": true,
    "description": true,
    "items": true
  }
}

```

ToDo.Filter

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
|»» title|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» items|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

