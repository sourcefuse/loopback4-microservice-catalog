---
title: Audit Service v1.0.0
language_tabs:
  - javascript: JavaScript
  - javascript--nodejs: Node.JS
language_clients:
  - javascript: request
  - javascript--nodejs: ""
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="audit-service">Audit Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Audit logging Microservice.

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="audit-service-auditcontroller">AuditController</h1>

## AuditController.archive

<a id="opIdAuditController.archive"></a>

> Code samples

```javascript
const inputBody = '{
  "date": {
    "fromDate": "2023-01-01T00:00:00.000Z",
    "toDate": "2023-01-01T00:00:00.000Z"
  },
  "deleted": true,
  "entityId": "string",
  "actedOn": "string",
  "actedOnList": [
    "string"
  ],
  "actionGroupList": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs/archive',
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
  "date": {
    "fromDate": "2023-01-01T00:00:00.000Z",
    "toDate": "2023-01-01T00:00:00.000Z"
  },
  "deleted": true,
  "entityId": "string",
  "actedOn": "string",
  "actedOnList": [
    "string"
  ],
  "actionGroupList": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs/archive',
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

`POST /audit-logs/archive`

| Permissions |
| ------- |
| ArchiveLogs   |
| 6   |

> Body parameter

```json
{
  "date": {
    "fromDate": "2023-01-01T00:00:00.000Z",
    "toDate": "2023-01-01T00:00:00.000Z"
  },
  "deleted": true,
  "entityId": "string",
  "actedOn": "string",
  "actedOnList": [
    "string"
  ],
  "actionGroupList": [
    "string"
  ]
}
```

<h3 id="auditcontroller.archive-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CustomFilter](#schemacustomfilter)|false|none|

> Example responses

> 200 Response

```json
{
  "message": "string",
  "numberOfEntriesArchived": 0,
  "file": "string"
}
```

<h3 id="auditcontroller.archive-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Archive logs status|Inline|

<h3 id="auditcontroller.archive-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|none|
|» numberOfEntriesArchived|number|false|none|none|
|» file|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuditController.count

<a id="opIdAuditController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs/count',
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

fetch('/audit-logs/count',
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

| Permissions |
| ------- |
| ViewAudit   |
| 1   |

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

## AuditController.export

<a id="opIdAuditController.export"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs/export',
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

fetch('/audit-logs/export',
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

`GET /audit-logs/export`

| Permissions |
| ------- |
| ExportLogs   |
| 5   |

<h3 id="auditcontroller.export-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|includeArchivedLogs|query|boolean|false|none|
|filter|query|[audit_logs.Filter](#schemaaudit_logs.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "jobId": "string",
  "message": "string"
}
```

<h3 id="auditcontroller.export-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Responds with jobId if includeArchiveLogs  is true or the success message otherwise.|Inline|

<h3 id="auditcontroller.export-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» jobId|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuditController.jobStatus

<a id="opIdAuditController.jobStatus"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs/jobs/{jobId}',
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

fetch('/audit-logs/jobs/{jobId}',
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

`GET /audit-logs/jobs/{jobId}`

| Permissions |
| ------- |
| ViewAudit   |
| 1   |

<h3 id="auditcontroller.jobstatus-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|jobId|path|string|true|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "status": "string",
    "operation": "string",
    "filterUsed": {},
    "result": "string",
    "tenantId": "string"
  }
]
```

<h3 id="auditcontroller.jobstatus-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of AuditLog model instances|Inline|

<h3 id="auditcontroller.jobstatus-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[JobWithRelations](#schemajobwithrelations)]|false|none|[(tsType: JobWithRelations, schemaOptions: { includeRelations: true })]|
|» JobWithRelations|[JobWithRelations](#schemajobwithrelations)|false|none|(tsType: JobWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|false|none|none|
|»» status|string|true|none|none|
|»» operation|string|false|none|none|
|»» filterUsed|object|false|none|none|
|»» result|string|false|none|none|
|»» tenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuditController.findById

<a id="opIdAuditController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs/{id}',
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

fetch('/audit-logs/{id}',
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

| Permissions |
| ------- |
| ViewAudit   |
| 1   |

<h3 id="auditcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[audit_logs.Filter1](#schemaaudit_logs.filter1)|false|none|

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
  "actionGroup": "string",
  "tenantId": "string"
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

```javascript
const inputBody = '{
  "action": "string",
  "actedAt": "2019-08-24T14:15:22Z",
  "actedOn": "string",
  "actionKey": "string",
  "entityId": "string",
  "actor": "string",
  "before": {},
  "after": {},
  "actionGroup": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs',
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

fetch('/audit-logs',
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

| Permissions |
| ------- |
| CreateAudit   |
| 2   |

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
  "actionGroup": "string",
  "tenantId": "string"
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

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/audit-logs',
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

fetch('/audit-logs',
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

| Permissions |
| ------- |
| ViewAudit   |
| 1   |

<h3 id="auditcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|includeArchivedLogs|query|boolean|false|none|
|filter|query|[audit_logs.Filter](#schemaaudit_logs.filter)|false|none|

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
    "actionGroup": "string",
    "tenantId": "string"
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
|»» tenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
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
  "actionGroup": "string",
  "tenantId": "string"
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
|tenantId|string|true|none|none|

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

<h2 id="tocS_JobWithRelations">JobWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemajobwithrelations"></a>
<a id="schema_JobWithRelations"></a>
<a id="tocSjobwithrelations"></a>
<a id="tocsjobwithrelations"></a>

```json
{
  "id": "string",
  "status": "string",
  "operation": "string",
  "filterUsed": {},
  "result": "string",
  "tenantId": "string"
}

```

JobWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|status|string|true|none|none|
|operation|string|false|none|none|
|filterUsed|object|false|none|none|
|result|string|false|none|none|
|tenantId|string|true|none|none|

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
  "actionGroup": "string",
  "tenantId": "string"
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
|tenantId|string|true|none|none|

<h2 id="tocS_CustomFilter">CustomFilter</h2>
<!-- backwards compatibility -->
<a id="schemacustomfilter"></a>
<a id="schema_CustomFilter"></a>
<a id="tocScustomfilter"></a>
<a id="tocscustomfilter"></a>

```json
{
  "date": {
    "fromDate": "2023-01-01T00:00:00.000Z",
    "toDate": "2023-01-01T00:00:00.000Z"
  },
  "deleted": true,
  "entityId": "string",
  "actedOn": "string",
  "actedOnList": [
    "string"
  ],
  "actionGroupList": [
    "string"
  ]
}

```

CustomFilter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|date|object|false|none|none|
|» fromDate|string|false|none|none|
|» toDate|string|false|none|none|
|deleted|boolean|false|none|none|
|entityId|string|false|none|none|
|actedOn|string|false|none|none|
|actedOnList|[string]|false|none|none|
|actionGroupList|[string]|false|none|none|

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
    "actionGroup": true,
    "tenantId": true
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
|»» tenantId|boolean|false|none|none|

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
    "actionGroup": true,
    "tenantId": true
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
|»» tenantId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

