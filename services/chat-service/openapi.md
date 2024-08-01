---
title: Chat Service v1.0.0
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

<h1 id="chat-service">Chat Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

chat-service microservice.

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="chat-service-attachmentfilecontroller">AttachmentFileController</h1>

## AttachmentFileController.createBulk

<a id="opIdAttachmentFileController.createBulk"></a>

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
  "attachmentFiles": [
    null
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files/bulk',
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
  "attachmentFiles": [
    null
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files/bulk',
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

`POST /attach-files/bulk`

| Permissions |
| ------- |
| CreateAttachmentFile   |

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
  "attachmentFiles": [
    null
  ]
}
```

<h3 id="attachmentfilecontroller.createbulk-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[New Attachment Files](#schemanew attachment files)|false|none|

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
  "attachmentFiles": [
    null
  ]
}
```

<h3 id="attachmentfilecontroller.createbulk-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attachment model instance|[AttachmentFileDto](#schemaattachmentfiledto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AttachmentFileController.count

<a id="opIdAttachmentFileController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files/count',
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

fetch('/attach-files/count',
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

`GET /attach-files/count`

| Permissions |
| ------- |
| ViewAttachmentFile   |

<h3 id="attachmentfilecontroller.count-parameters">Parameters</h3>

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

<h3 id="attachmentfilecontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AttachmentFile model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AttachmentFileController.replaceById

<a id="opIdAttachmentFileController.replaceById"></a>

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/attach-files/{id}',
{
  method: 'PUT',
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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/attach-files/{id}',
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

`PUT /attach-files/{id}`

| Permissions |
| ------- |
| UpdateAttachmentFile   |

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}
```

<h3 id="attachmentfilecontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[AttachmentFile](#schemaattachmentfile)|false|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="attachmentfilecontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of AttachmentFileController.replaceById|None|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="attachmentfilecontroller.replacebyid-responseschema">Response Schema</h3>

Status Code **204**

*AttachmentFile PUT success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentFileController.updateById

<a id="opIdAttachmentFileController.updateById"></a>

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files/{id}',
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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files/{id}',
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

`PATCH /attach-files/{id}`

| Permissions |
| ------- |
| UpdateAttachmentFile   |

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}
```

<h3 id="attachmentfilecontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[AttachmentFilePartial](#schemaattachmentfilepartial)|false|none|

<h3 id="attachmentfilecontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|AttachmentFile PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AttachmentFileController.findById

<a id="opIdAttachmentFileController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files/{id}',
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

fetch('/attach-files/{id}',
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

`GET /attach-files/{id}`

| Permissions |
| ------- |
| ViewAttachmentFile   |

<h3 id="attachmentfilecontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[message_files.Filter](#schemamessage_files.filter)|false|none|

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {},
  "message": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string",
    "messageRecipients": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "forwardedBy": "string",
        "isFavorite": true,
        "isForwarded": true,
        "isRead": true,
        "recipientId": "string",
        "messageId": "string",
        "message": {},
        "foreignKey": null
      }
    ],
    "attachmentFiles": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "fileKey": "string",
        "messageId": "string",
        "metaData": {},
        "message": {},
        "foreignKey": null
      }
    ],
    "parentMessage": {},
    "foreignKey": null,
    "messages": [
      {}
    ]
  },
  "foreignKey": null
}
```

<h3 id="attachmentfilecontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AttachmentFile model instance|[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AttachmentFileController.deleteById

<a id="opIdAttachmentFileController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/attach-files/{id}',
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
  'Accept':'application/json'
};

fetch('/attach-files/{id}',
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

`DELETE /attach-files/{id}`

| Permissions |
| ------- |
| DeleteAttachmentFile   |

<h3 id="attachmentfilecontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="attachmentfilecontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of AttachmentFileController.deleteById|None|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="attachmentfilecontroller.deletebyid-responseschema">Response Schema</h3>

Status Code **204**

*Attachment File DELETE success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentFileController.create

<a id="opIdAttachmentFileController.create"></a>

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files',
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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files',
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

`POST /attach-files`

| Permissions |
| ------- |
| CreateAttachmentFile   |

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}
```

<h3 id="attachmentfilecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewAttachmentFile](#schemanewattachmentfile)|false|none|

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}
```

<h3 id="attachmentfilecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attachment model instance|[AttachmentFile](#schemaattachmentfile)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AttachmentFileController.updateAll

<a id="opIdAttachmentFileController.updateAll"></a>

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files',
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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files',
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

`PATCH /attach-files`

| Permissions |
| ------- |
| UpdateAttachmentFile   |

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}
```

<h3 id="attachmentfilecontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[AttachmentFilePartial](#schemaattachmentfilepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="attachmentfilecontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AttachmentFile PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AttachmentFileController.find

<a id="opIdAttachmentFileController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/attach-files',
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

fetch('/attach-files',
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

`GET /attach-files`

| Permissions |
| ------- |
| ViewAttachmentFile   |

<h3 id="attachmentfilecontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[message_files.Filter1](#schemamessage_files.filter1)|false|none|

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
    "channelId": "string",
    "fileKey": "string",
    "messageId": "string",
    "metaData": {},
    "message": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "body": "string",
      "channelId": "string",
      "channelType": "string",
      "status": 0,
      "subject": "string",
      "toUserId": "string",
      "parentMessageId": "string",
      "messageRecipients": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "channelId": "string",
          "forwardedBy": "string",
          "isFavorite": true,
          "isForwarded": true,
          "isRead": true,
          "recipientId": "string",
          "messageId": "string",
          "message": {},
          "foreignKey": null
        }
      ],
      "attachmentFiles": [
        {}
      ],
      "parentMessage": {},
      "foreignKey": null,
      "messages": [
        {}
      ]
    },
    "foreignKey": null
  }
]
```

<h3 id="attachmentfilecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of AttachmentFile model instances|Inline|

<h3 id="attachmentfilecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)]|false|none|[(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })]|
|» AttachmentFileWithRelations|[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)|false|none|(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» channelId|string|false|none|none|
|»» fileKey|string|false|none|none|
|»» messageId|string|false|none|none|
|»» metaData|object|false|none|none|
|»» message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» body|string|true|none|none|
|»»» channelId|string|true|none|none|
|»»» channelType|string|true|none|none|
|»»» status|number|false|none|none|
|»»» subject|string|false|none|none|
|»»» toUserId|string|false|none|none|
|»»» parentMessageId|string|false|none|none|
|»»» messageRecipients|[[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)]|false|none|(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })|
|»»»» MessageRecipientWithRelations|[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)|false|none|(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» channelId|string|true|none|none|
|»»»»» forwardedBy|string|false|none|none|
|»»»»» isFavorite|boolean|false|none|none|
|»»»»» isForwarded|boolean|false|none|none|
|»»»»» isRead|boolean|false|none|none|
|»»»»» recipientId|string|true|none|none|
|»»»»» messageId|string|true|none|none|
|»»»»» message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» foreignKey|any|false|none|none|
|»»» attachmentFiles|[[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)]|false|none|(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })|
|»»»» AttachmentFileWithRelations|[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)|false|none|(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })|
|»»» parentMessage|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»» foreignKey|any|false|none|none|
|»»» messages|[[MessageWithRelations](#schemamessagewithrelations)]|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»»» MessageWithRelations|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»» foreignKey|any|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="chat-service-messagerecipientcontroller">MessageRecipientController</h1>

## MessageRecipientController.count

<a id="opIdMessageRecipientController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/count',
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

fetch('/message-recipients/count',
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

`GET /message-recipients/count`

| Permissions |
| ------- |
| ViewMessageRecipient   |
| 6   |

<h3 id="messagerecipientcontroller.count-parameters">Parameters</h3>

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

<h3 id="messagerecipientcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|MessageRecipient model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageRecipientController.replaceById

<a id="opIdMessageRecipientController.replaceById"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/{id}',
{
  method: 'PUT',
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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/{id}',
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

`PUT /message-recipients/{id}`

| Permissions |
| ------- |
| UpdateMessageRecipient   |
| 7   |

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagerecipientcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[MessageRecipient](#schemamessagerecipient)|false|none|

<h3 id="messagerecipientcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|MessageRecipient PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageRecipientController.updateById

<a id="opIdMessageRecipientController.updateById"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/{id}',
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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/{id}',
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

`PATCH /message-recipients/{id}`

| Permissions |
| ------- |
| UpdateMessageRecipient   |
| 7   |

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagerecipientcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[MessageRecipientPartial](#schemamessagerecipientpartial)|false|none|

<h3 id="messagerecipientcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|MessageRecipient PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageRecipientController.findById

<a id="opIdMessageRecipientController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/{id}',
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

fetch('/message-recipients/{id}',
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

`GET /message-recipients/{id}`

| Permissions |
| ------- |
| ViewMessageRecipient   |
| 6   |

<h3 id="messagerecipientcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[message_recipients.Filter](#schemamessage_recipients.filter)|false|none|

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string",
  "message": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string",
    "messageRecipients": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "forwardedBy": "string",
        "isFavorite": true,
        "isForwarded": true,
        "isRead": true,
        "recipientId": "string",
        "messageId": "string",
        "message": {},
        "foreignKey": null
      }
    ],
    "attachmentFiles": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "fileKey": "string",
        "messageId": "string",
        "metaData": {},
        "message": {},
        "foreignKey": null
      }
    ],
    "parentMessage": {},
    "foreignKey": null,
    "messages": [
      {}
    ]
  },
  "foreignKey": null
}
```

<h3 id="messagerecipientcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|MessageRecipient model instance|[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageRecipientController.deleteById

<a id="opIdMessageRecipientController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/{id}',
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

fetch('/message-recipients/{id}',
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

`DELETE /message-recipients/{id}`

| Permissions |
| ------- |
| DeleteMessageRecipient   |
| 8   |

<h3 id="messagerecipientcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="messagerecipientcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|MessageRecipient DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageRecipientController.create

<a id="opIdMessageRecipientController.create"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients',
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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients',
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

`POST /message-recipients`

| Permissions |
| ------- |
| CreateMessageRecipient   |
| 5   |

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagerecipientcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewMessageRecipient](#schemanewmessagerecipient)|false|none|

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagerecipientcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|MessageRecipient model instance|[MessageRecipient](#schemamessagerecipient)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageRecipientController.updateAll

<a id="opIdMessageRecipientController.updateAll"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients',
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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients',
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

`PATCH /message-recipients`

| Permissions |
| ------- |
| UpdateMessageRecipient   |
| 7   |

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagerecipientcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[MessageRecipientPartial](#schemamessagerecipientpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="messagerecipientcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|MessageRecipient PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageRecipientController.find

<a id="opIdMessageRecipientController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients',
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

fetch('/message-recipients',
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

`GET /message-recipients`

| Permissions |
| ------- |
| ViewMessageRecipient   |
| 6   |

<h3 id="messagerecipientcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[message_recipients.Filter1](#schemamessage_recipients.filter1)|false|none|

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
    "channelId": "string",
    "forwardedBy": "string",
    "isFavorite": true,
    "isForwarded": true,
    "isRead": true,
    "recipientId": "string",
    "messageId": "string",
    "message": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "body": "string",
      "channelId": "string",
      "channelType": "string",
      "status": 0,
      "subject": "string",
      "toUserId": "string",
      "parentMessageId": "string",
      "messageRecipients": [
        {}
      ],
      "attachmentFiles": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "channelId": "string",
          "fileKey": "string",
          "messageId": "string",
          "metaData": {},
          "message": {},
          "foreignKey": null
        }
      ],
      "parentMessage": {},
      "foreignKey": null,
      "messages": [
        {}
      ]
    },
    "foreignKey": null
  }
]
```

<h3 id="messagerecipientcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of MessageRecipient model instances|Inline|

<h3 id="messagerecipientcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)]|false|none|[(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })]|
|» MessageRecipientWithRelations|[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)|false|none|(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» channelId|string|true|none|none|
|»» forwardedBy|string|false|none|none|
|»» isFavorite|boolean|false|none|none|
|»» isForwarded|boolean|false|none|none|
|»» isRead|boolean|false|none|none|
|»» recipientId|string|true|none|none|
|»» messageId|string|true|none|none|
|»» message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» body|string|true|none|none|
|»»» channelId|string|true|none|none|
|»»» channelType|string|true|none|none|
|»»» status|number|false|none|none|
|»»» subject|string|false|none|none|
|»»» toUserId|string|false|none|none|
|»»» parentMessageId|string|false|none|none|
|»»» messageRecipients|[[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)]|false|none|(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })|
|»»»» MessageRecipientWithRelations|[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)|false|none|(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })|
|»»» attachmentFiles|[[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)]|false|none|(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })|
|»»»» AttachmentFileWithRelations|[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)|false|none|(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» channelId|string|false|none|none|
|»»»»» fileKey|string|false|none|none|
|»»»»» messageId|string|false|none|none|
|»»»»» metaData|object|false|none|none|
|»»»»» message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» foreignKey|any|false|none|none|
|»»» parentMessage|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»» foreignKey|any|false|none|none|
|»»» messages|[[MessageWithRelations](#schemamessagewithrelations)]|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»»» MessageWithRelations|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»» foreignKey|any|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="chat-service-messagerecipientmessagecontroller">MessageRecipientMessageController</h1>

## MessageRecipientMessageController.getMessage

<a id="opIdMessageRecipientMessageController.getMessage"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/message-recipients/{id}/message',
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

fetch('/message-recipients/{id}/message',
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

`GET /message-recipients/{id}/message`

| Permissions |
| ------- |
| ViewMessage   |
| 1   |

<h3 id="messagerecipientmessagecontroller.getmessage-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

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
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string"
  }
]
```

<h3 id="messagerecipientmessagecontroller.getmessage-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message belonging to MessageRecipient|Inline|

<h3 id="messagerecipientmessagecontroller.getmessage-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Message](#schemamessage)]|false|none|none|
|» Message|[Message](#schemamessage)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» body|string|true|none|none|
|»» channelId|string|true|none|none|
|»» channelType|string|true|none|none|
|»» status|number|false|none|none|
|»» subject|string|false|none|none|
|»» toUserId|string|false|none|none|
|»» parentMessageId|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="chat-service-messagecontroller">MessageController</h1>

## MessageController.count

<a id="opIdMessageController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/count',
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

fetch('/messages/count',
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

`GET /messages/count`

| Permissions |
| ------- |
| ViewMessage   |
| 1   |

<h3 id="messagecontroller.count-parameters">Parameters</h3>

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

<h3 id="messagecontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageController.replaceById

<a id="opIdMessageController.replaceById"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}',
{
  method: 'PUT',
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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}',
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

`PUT /messages/{id}`

| Permissions |
| ------- |
| UpdateMessage   |
| 3   |

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagecontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Message](#schemamessage)|false|none|

<h3 id="messagecontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Message PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageController.updateById

<a id="opIdMessageController.updateById"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}',
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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}',
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

`PATCH /messages/{id}`

| Permissions |
| ------- |
| UpdateMessage   |
| 3   |

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagecontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[MessagePartial](#schemamessagepartial)|false|none|

<h3 id="messagecontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Message PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageController.findById

<a id="opIdMessageController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}',
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

fetch('/messages/{id}',
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

`GET /messages/{id}`

| Permissions |
| ------- |
| ViewMessage   |
| 1   |

<h3 id="messagecontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[messages.Filter](#schemamessages.filter)|false|none|

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string",
  "messageRecipients": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "channelId": "string",
      "forwardedBy": "string",
      "isFavorite": true,
      "isForwarded": true,
      "isRead": true,
      "recipientId": "string",
      "messageId": "string",
      "message": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "body": "string",
        "channelId": "string",
        "channelType": "string",
        "status": 0,
        "subject": "string",
        "toUserId": "string",
        "parentMessageId": "string",
        "messageRecipients": [],
        "attachmentFiles": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "channelId": "string",
            "fileKey": "string",
            "messageId": "string",
            "metaData": {},
            "message": {},
            "foreignKey": null
          }
        ],
        "parentMessage": {},
        "foreignKey": null,
        "messages": [
          {}
        ]
      },
      "foreignKey": null
    }
  ],
  "attachmentFiles": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "channelId": "string",
      "fileKey": "string",
      "messageId": "string",
      "metaData": {},
      "message": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "body": "string",
        "channelId": "string",
        "channelType": "string",
        "status": 0,
        "subject": "string",
        "toUserId": "string",
        "parentMessageId": "string",
        "messageRecipients": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "channelId": "string",
            "forwardedBy": "string",
            "isFavorite": true,
            "isForwarded": true,
            "isRead": true,
            "recipientId": "string",
            "messageId": "string",
            "message": {},
            "foreignKey": null
          }
        ],
        "attachmentFiles": [],
        "parentMessage": {},
        "foreignKey": null,
        "messages": [
          {}
        ]
      },
      "foreignKey": null
    }
  ],
  "parentMessage": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string",
    "messageRecipients": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "forwardedBy": "string",
        "isFavorite": true,
        "isForwarded": true,
        "isRead": true,
        "recipientId": "string",
        "messageId": "string",
        "message": {},
        "foreignKey": null
      }
    ],
    "attachmentFiles": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "fileKey": "string",
        "messageId": "string",
        "metaData": {},
        "message": {},
        "foreignKey": null
      }
    ],
    "parentMessage": {},
    "foreignKey": null,
    "messages": [
      {}
    ]
  },
  "foreignKey": null,
  "messages": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "body": "string",
      "channelId": "string",
      "channelType": "string",
      "status": 0,
      "subject": "string",
      "toUserId": "string",
      "parentMessageId": "string",
      "messageRecipients": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "channelId": "string",
          "forwardedBy": "string",
          "isFavorite": true,
          "isForwarded": true,
          "isRead": true,
          "recipientId": "string",
          "messageId": "string",
          "message": {},
          "foreignKey": null
        }
      ],
      "attachmentFiles": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "channelId": "string",
          "fileKey": "string",
          "messageId": "string",
          "metaData": {},
          "message": {},
          "foreignKey": null
        }
      ],
      "parentMessage": {},
      "foreignKey": null,
      "messages": []
    }
  ]
}
```

<h3 id="messagecontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message model instance|[MessageWithRelations](#schemamessagewithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageController.deleteById

<a id="opIdMessageController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}',
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

fetch('/messages/{id}',
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

`DELETE /messages/{id}`

| Permissions |
| ------- |
| DeleteMessage   |
| 4   |

<h3 id="messagecontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="messagecontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Message DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageController.create

<a id="opIdMessageController.create"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages',
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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages',
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

`POST /messages`

| Permissions |
| ------- |
| CreateMessage   |
| 2   |

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewMessage](#schemanewmessage)|false|none|

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message model instance|[Message](#schemamessage)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageController.updateAll

<a id="opIdMessageController.updateAll"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages',
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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages',
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

`PATCH /messages`

| Permissions |
| ------- |
| UpdateMessage   |
| 3   |

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagecontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[MessagePartial](#schemamessagepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="messagecontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageController.find

<a id="opIdMessageController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages',
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

fetch('/messages',
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

`GET /messages`

| Permissions |
| ------- |
| ViewMessage   |
| 1   |

<h3 id="messagecontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[messages.Filter1](#schemamessages.filter1)|false|none|

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
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string",
    "messageRecipients": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "forwardedBy": "string",
        "isFavorite": true,
        "isForwarded": true,
        "isRead": true,
        "recipientId": "string",
        "messageId": "string",
        "message": {},
        "foreignKey": null
      }
    ],
    "attachmentFiles": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "fileKey": "string",
        "messageId": "string",
        "metaData": {},
        "message": {},
        "foreignKey": null
      }
    ],
    "parentMessage": {},
    "foreignKey": null,
    "messages": [
      {}
    ]
  }
]
```

<h3 id="messagecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Message model instances|Inline|

<h3 id="messagecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[MessageWithRelations](#schemamessagewithrelations)]|false|none|[(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })]|
|» MessageWithRelations|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» body|string|true|none|none|
|»» channelId|string|true|none|none|
|»» channelType|string|true|none|none|
|»» status|number|false|none|none|
|»» subject|string|false|none|none|
|»» toUserId|string|false|none|none|
|»» parentMessageId|string|false|none|none|
|»» messageRecipients|[[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)]|false|none|(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })|
|»»» MessageRecipientWithRelations|[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)|false|none|(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» channelId|string|true|none|none|
|»»»» forwardedBy|string|false|none|none|
|»»»» isFavorite|boolean|false|none|none|
|»»»» isForwarded|boolean|false|none|none|
|»»»» isRead|boolean|false|none|none|
|»»»» recipientId|string|true|none|none|
|»»»» messageId|string|true|none|none|
|»»»» message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»»» foreignKey|any|false|none|none|
|»» attachmentFiles|[[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)]|false|none|(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })|
|»»» AttachmentFileWithRelations|[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)|false|none|(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» channelId|string|false|none|none|
|»»»» fileKey|string|false|none|none|
|»»»» messageId|string|false|none|none|
|»»»» metaData|object|false|none|none|
|»»»» message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»»» foreignKey|any|false|none|none|
|»» parentMessage|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»» foreignKey|any|false|none|none|
|»» messages|[[MessageWithRelations](#schemamessagewithrelations)]|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|»»» MessageWithRelations|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="chat-service-messagemessagerecipientcontroller">MessageMessageRecipientController</h1>

## MessageMessageRecipientController.create

<a id="opIdMessageMessageRecipientController.create"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/message-recipients',
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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/message-recipients',
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

`POST /messages/{id}/message-recipients`

| Permissions |
| ------- |
| CreateMessageRecipient   |
| 5   |

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagemessagerecipientcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewMessageRecipientInMessage](#schemanewmessagerecipientinmessage)|false|none|

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagemessagerecipientcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message model instance|[MessageRecipient](#schemamessagerecipient)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageMessageRecipientController.patch

<a id="opIdMessageMessageRecipientController.patch"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/message-recipients',
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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/message-recipients',
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

`PATCH /messages/{id}/message-recipients`

| Permissions |
| ------- |
| UpdateMessageRecipient   |
| 7   |

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}
```

<h3 id="messagemessagerecipientcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[MessageRecipientPartial](#schemamessagerecipientpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="messagemessagerecipientcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message.MessageRecipient PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageMessageRecipientController.find

<a id="opIdMessageMessageRecipientController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/message-recipients',
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

fetch('/messages/{id}/message-recipients',
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

`GET /messages/{id}/message-recipients`

| Permissions |
| ------- |
| ViewMessageRecipient   |
| 6   |

<h3 id="messagemessagerecipientcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

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
    "channelId": "string",
    "forwardedBy": "string",
    "isFavorite": true,
    "isForwarded": true,
    "isRead": true,
    "recipientId": "string",
    "messageId": "string"
  }
]
```

<h3 id="messagemessagerecipientcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Message has many MessageRecipient|Inline|

<h3 id="messagemessagerecipientcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[MessageRecipient](#schemamessagerecipient)]|false|none|none|
|» MessageRecipient|[MessageRecipient](#schemamessagerecipient)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» channelId|string|true|none|none|
|»» forwardedBy|string|false|none|none|
|»» isFavorite|boolean|false|none|none|
|»» isForwarded|boolean|false|none|none|
|»» isRead|boolean|false|none|none|
|»» recipientId|string|true|none|none|
|»» messageId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageMessageRecipientController.delete

<a id="opIdMessageMessageRecipientController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/message-recipients',
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
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/message-recipients',
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

`DELETE /messages/{id}/message-recipients`

| Permissions |
| ------- |
| DeleteMessageRecipient   |
| 8   |

<h3 id="messagemessagerecipientcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="messagemessagerecipientcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message.MessageRecipient DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="chat-service-messagemessagecontroller">MessageMessageController</h1>

## MessageMessageController.create

<a id="opIdMessageMessageController.create"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/messages',
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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/messages',
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

`POST /messages/{id}/messages`

| Permissions |
| ------- |
| CreateMessage   |
| 2   |

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagemessagecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewMessageInMessage](#schemanewmessageinmessage)|false|none|

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagemessagecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message model instance|[Message](#schemamessage)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageMessageController.patch

<a id="opIdMessageMessageController.patch"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/messages',
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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/messages',
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

`PATCH /messages/{id}/messages`

| Permissions |
| ------- |
| UpdateMessage   |
| 3   |

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}
```

<h3 id="messagemessagecontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[MessagePartial](#schemamessagepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="messagemessagecontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message.Message PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageMessageController.find

<a id="opIdMessageMessageController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/messages',
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

fetch('/messages/{id}/messages',
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

`GET /messages/{id}/messages`

| Permissions |
| ------- |
| ViewMessage   |
| 1   |

<h3 id="messagemessagecontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

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
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string"
  }
]
```

<h3 id="messagemessagecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Message has many Message|Inline|

<h3 id="messagemessagecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Message](#schemamessage)]|false|none|none|
|» Message|[Message](#schemamessage)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» body|string|true|none|none|
|»» channelId|string|true|none|none|
|»» channelType|string|true|none|none|
|»» status|number|false|none|none|
|»» subject|string|false|none|none|
|»» toUserId|string|false|none|none|
|»» parentMessageId|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## MessageMessageController.delete

<a id="opIdMessageMessageController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/messages',
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
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/messages/{id}/messages',
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

`DELETE /messages/{id}/messages`

| Permissions |
| ------- |
| DeleteMessage   |
| 4   |

<h3 id="messagemessagecontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="messagemessagecontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message.Message DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

# Schemas

<h2 id="tocS_Message">Message</h2>
<!-- backwards compatibility -->
<a id="schemamessage"></a>
<a id="schema_Message"></a>
<a id="tocSmessage"></a>
<a id="tocsmessage"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}

```

Message

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
|body|string|true|none|none|
|channelId|string|true|none|none|
|channelType|string|true|none|none|
|status|number|false|none|none|
|subject|string|false|none|none|
|toUserId|string|false|none|none|
|parentMessageId|string|false|none|none|

<h2 id="tocS_NewMessage">NewMessage</h2>
<!-- backwards compatibility -->
<a id="schemanewmessage"></a>
<a id="schema_NewMessage"></a>
<a id="tocSnewmessage"></a>
<a id="tocsnewmessage"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}

```

NewMessage

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
|body|string|true|none|none|
|channelId|string|true|none|none|
|channelType|string|true|none|none|
|status|number|false|none|none|
|subject|string|false|none|none|
|toUserId|string|false|none|none|
|parentMessageId|string|false|none|none|

<h2 id="tocS_MessageWithRelations">MessageWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemamessagewithrelations"></a>
<a id="schema_MessageWithRelations"></a>
<a id="tocSmessagewithrelations"></a>
<a id="tocsmessagewithrelations"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string",
  "messageRecipients": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "channelId": "string",
      "forwardedBy": "string",
      "isFavorite": true,
      "isForwarded": true,
      "isRead": true,
      "recipientId": "string",
      "messageId": "string",
      "message": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "body": "string",
        "channelId": "string",
        "channelType": "string",
        "status": 0,
        "subject": "string",
        "toUserId": "string",
        "parentMessageId": "string",
        "messageRecipients": [],
        "attachmentFiles": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "channelId": "string",
            "fileKey": "string",
            "messageId": "string",
            "metaData": {},
            "message": {},
            "foreignKey": null
          }
        ],
        "parentMessage": {},
        "foreignKey": null,
        "messages": [
          {}
        ]
      },
      "foreignKey": null
    }
  ],
  "attachmentFiles": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "channelId": "string",
      "fileKey": "string",
      "messageId": "string",
      "metaData": {},
      "message": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "body": "string",
        "channelId": "string",
        "channelType": "string",
        "status": 0,
        "subject": "string",
        "toUserId": "string",
        "parentMessageId": "string",
        "messageRecipients": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "channelId": "string",
            "forwardedBy": "string",
            "isFavorite": true,
            "isForwarded": true,
            "isRead": true,
            "recipientId": "string",
            "messageId": "string",
            "message": {},
            "foreignKey": null
          }
        ],
        "attachmentFiles": [],
        "parentMessage": {},
        "foreignKey": null,
        "messages": [
          {}
        ]
      },
      "foreignKey": null
    }
  ],
  "parentMessage": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string",
    "messageRecipients": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "forwardedBy": "string",
        "isFavorite": true,
        "isForwarded": true,
        "isRead": true,
        "recipientId": "string",
        "messageId": "string",
        "message": {},
        "foreignKey": null
      }
    ],
    "attachmentFiles": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "fileKey": "string",
        "messageId": "string",
        "metaData": {},
        "message": {},
        "foreignKey": null
      }
    ],
    "parentMessage": {},
    "foreignKey": null,
    "messages": [
      {}
    ]
  },
  "foreignKey": null,
  "messages": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "body": "string",
      "channelId": "string",
      "channelType": "string",
      "status": 0,
      "subject": "string",
      "toUserId": "string",
      "parentMessageId": "string",
      "messageRecipients": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "channelId": "string",
          "forwardedBy": "string",
          "isFavorite": true,
          "isForwarded": true,
          "isRead": true,
          "recipientId": "string",
          "messageId": "string",
          "message": {},
          "foreignKey": null
        }
      ],
      "attachmentFiles": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "channelId": "string",
          "fileKey": "string",
          "messageId": "string",
          "metaData": {},
          "message": {},
          "foreignKey": null
        }
      ],
      "parentMessage": {},
      "foreignKey": null,
      "messages": []
    }
  ]
}

```

MessageWithRelations

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
|body|string|true|none|none|
|channelId|string|true|none|none|
|channelType|string|true|none|none|
|status|number|false|none|none|
|subject|string|false|none|none|
|toUserId|string|false|none|none|
|parentMessageId|string|false|none|none|
|messageRecipients|[[MessageRecipientWithRelations](#schemamessagerecipientwithrelations)]|false|none|[(tsType: MessageRecipientWithRelations, schemaOptions: { includeRelations: true })]|
|attachmentFiles|[[AttachmentFileWithRelations](#schemaattachmentfilewithrelations)]|false|none|[(tsType: AttachmentFileWithRelations, schemaOptions: { includeRelations: true })]|
|parentMessage|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|
|messages|[[MessageWithRelations](#schemamessagewithrelations)]|false|none|[(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })]|

<h2 id="tocS_MessagePartial">MessagePartial</h2>
<!-- backwards compatibility -->
<a id="schemamessagepartial"></a>
<a id="schema_MessagePartial"></a>
<a id="tocSmessagepartial"></a>
<a id="tocsmessagepartial"></a>

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
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}

```

MessagePartial

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
|body|string|false|none|none|
|channelId|string|false|none|none|
|channelType|string|false|none|none|
|status|number|false|none|none|
|subject|string|false|none|none|
|toUserId|string|false|none|none|
|parentMessageId|string|false|none|none|

<h2 id="tocS_MessageRecipient">MessageRecipient</h2>
<!-- backwards compatibility -->
<a id="schemamessagerecipient"></a>
<a id="schema_MessageRecipient"></a>
<a id="tocSmessagerecipient"></a>
<a id="tocsmessagerecipient"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}

```

MessageRecipient

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
|channelId|string|true|none|none|
|forwardedBy|string|false|none|none|
|isFavorite|boolean|false|none|none|
|isForwarded|boolean|false|none|none|
|isRead|boolean|false|none|none|
|recipientId|string|true|none|none|
|messageId|string|true|none|none|

<h2 id="tocS_NewMessageRecipient">NewMessageRecipient</h2>
<!-- backwards compatibility -->
<a id="schemanewmessagerecipient"></a>
<a id="schema_NewMessageRecipient"></a>
<a id="tocSnewmessagerecipient"></a>
<a id="tocsnewmessagerecipient"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}

```

NewMessageRecipient

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
|channelId|string|true|none|none|
|forwardedBy|string|false|none|none|
|isFavorite|boolean|false|none|none|
|isForwarded|boolean|false|none|none|
|isRead|boolean|false|none|none|
|recipientId|string|true|none|none|
|messageId|string|true|none|none|

<h2 id="tocS_MessageRecipientWithRelations">MessageRecipientWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemamessagerecipientwithrelations"></a>
<a id="schema_MessageRecipientWithRelations"></a>
<a id="tocSmessagerecipientwithrelations"></a>
<a id="tocsmessagerecipientwithrelations"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string",
  "message": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string",
    "messageRecipients": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "forwardedBy": "string",
        "isFavorite": true,
        "isForwarded": true,
        "isRead": true,
        "recipientId": "string",
        "messageId": "string",
        "message": {},
        "foreignKey": null
      }
    ],
    "attachmentFiles": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "fileKey": "string",
        "messageId": "string",
        "metaData": {},
        "message": {},
        "foreignKey": null
      }
    ],
    "parentMessage": {},
    "foreignKey": null,
    "messages": [
      {}
    ]
  },
  "foreignKey": null
}

```

MessageRecipientWithRelations

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
|channelId|string|true|none|none|
|forwardedBy|string|false|none|none|
|isFavorite|boolean|false|none|none|
|isForwarded|boolean|false|none|none|
|isRead|boolean|false|none|none|
|recipientId|string|true|none|none|
|messageId|string|true|none|none|
|message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|

<h2 id="tocS_MessageRecipientPartial">MessageRecipientPartial</h2>
<!-- backwards compatibility -->
<a id="schemamessagerecipientpartial"></a>
<a id="schema_MessageRecipientPartial"></a>
<a id="tocSmessagerecipientpartial"></a>
<a id="tocsmessagerecipientpartial"></a>

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
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}

```

MessageRecipientPartial

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
|channelId|string|false|none|none|
|forwardedBy|string|false|none|none|
|isFavorite|boolean|false|none|none|
|isForwarded|boolean|false|none|none|
|isRead|boolean|false|none|none|
|recipientId|string|false|none|none|
|messageId|string|false|none|none|

<h2 id="tocS_NewMessageInMessage">NewMessageInMessage</h2>
<!-- backwards compatibility -->
<a id="schemanewmessageinmessage"></a>
<a id="schema_NewMessageInMessage"></a>
<a id="tocSnewmessageinmessage"></a>
<a id="tocsnewmessageinmessage"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "body": "string",
  "channelId": "string",
  "channelType": "string",
  "status": 0,
  "subject": "string",
  "toUserId": "string",
  "parentMessageId": "string"
}

```

NewMessageInMessage

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
|body|string|true|none|none|
|channelId|string|true|none|none|
|channelType|string|true|none|none|
|status|number|false|none|none|
|subject|string|false|none|none|
|toUserId|string|false|none|none|
|parentMessageId|string|false|none|none|

<h2 id="tocS_NewMessageRecipientInMessage">NewMessageRecipientInMessage</h2>
<!-- backwards compatibility -->
<a id="schemanewmessagerecipientinmessage"></a>
<a id="schema_NewMessageRecipientInMessage"></a>
<a id="tocSnewmessagerecipientinmessage"></a>
<a id="tocsnewmessagerecipientinmessage"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "channelId": "string",
  "forwardedBy": "string",
  "isFavorite": true,
  "isForwarded": true,
  "isRead": true,
  "recipientId": "string",
  "messageId": "string"
}

```

NewMessageRecipientInMessage

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
|channelId|string|true|none|none|
|forwardedBy|string|false|none|none|
|isFavorite|boolean|false|none|none|
|isForwarded|boolean|false|none|none|
|isRead|boolean|false|none|none|
|recipientId|string|true|none|none|
|messageId|string|false|none|none|

<h2 id="tocS_AttachmentFile">AttachmentFile</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentfile"></a>
<a id="schema_AttachmentFile"></a>
<a id="tocSattachmentfile"></a>
<a id="tocsattachmentfile"></a>

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}

```

AttachmentFile

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
|channelId|string|false|none|none|
|fileKey|string|false|none|none|
|messageId|string|false|none|none|
|metaData|object|false|none|none|

<h2 id="tocS_NewAttachmentFile">NewAttachmentFile</h2>
<!-- backwards compatibility -->
<a id="schemanewattachmentfile"></a>
<a id="schema_NewAttachmentFile"></a>
<a id="tocSnewattachmentfile"></a>
<a id="tocsnewattachmentfile"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}

```

NewAttachmentFile

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
|channelId|string|false|none|none|
|fileKey|string|false|none|none|
|messageId|string|false|none|none|
|metaData|object|false|none|none|

<h2 id="tocS_AttachmentFileDto">AttachmentFileDto</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentfiledto"></a>
<a id="schema_AttachmentFileDto"></a>
<a id="tocSattachmentfiledto"></a>
<a id="tocsattachmentfiledto"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "attachmentFiles": [
    null
  ]
}

```

AttachmentFileDto

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
|attachmentFiles|[any]|true|none|none|

<h2 id="tocS_New Attachment Files">New Attachment Files</h2>
<!-- backwards compatibility -->
<a id="schemanew attachment files"></a>
<a id="schema_New Attachment Files"></a>
<a id="tocSnew attachment files"></a>
<a id="tocsnew attachment files"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "attachmentFiles": [
    null
  ]
}

```

New Attachment Files

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
|attachmentFiles|[any]|true|none|none|

<h2 id="tocS_AttachmentFileWithRelations">AttachmentFileWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentfilewithrelations"></a>
<a id="schema_AttachmentFileWithRelations"></a>
<a id="tocSattachmentfilewithrelations"></a>
<a id="tocsattachmentfilewithrelations"></a>

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {},
  "message": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "body": "string",
    "channelId": "string",
    "channelType": "string",
    "status": 0,
    "subject": "string",
    "toUserId": "string",
    "parentMessageId": "string",
    "messageRecipients": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "forwardedBy": "string",
        "isFavorite": true,
        "isForwarded": true,
        "isRead": true,
        "recipientId": "string",
        "messageId": "string",
        "message": {},
        "foreignKey": null
      }
    ],
    "attachmentFiles": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "channelId": "string",
        "fileKey": "string",
        "messageId": "string",
        "metaData": {},
        "message": {},
        "foreignKey": null
      }
    ],
    "parentMessage": {},
    "foreignKey": null,
    "messages": [
      {}
    ]
  },
  "foreignKey": null
}

```

AttachmentFileWithRelations

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
|channelId|string|false|none|none|
|fileKey|string|false|none|none|
|messageId|string|false|none|none|
|metaData|object|false|none|none|
|message|[MessageWithRelations](#schemamessagewithrelations)|false|none|(tsType: MessageWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|

<h2 id="tocS_AttachmentFilePartial">AttachmentFilePartial</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentfilepartial"></a>
<a id="schema_AttachmentFilePartial"></a>
<a id="tocSattachmentfilepartial"></a>
<a id="tocsattachmentfilepartial"></a>

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
  "channelId": "string",
  "fileKey": "string",
  "messageId": "string",
  "metaData": {}
}

```

AttachmentFilePartial

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
|channelId|string|false|none|none|
|fileKey|string|false|none|none|
|messageId|string|false|none|none|
|metaData|object|false|none|none|

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

<h2 id="tocS_message_files.ScopeFilter">message_files.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemamessage_files.scopefilter"></a>
<a id="schema_message_files.ScopeFilter"></a>
<a id="tocSmessage_files.scopefilter"></a>
<a id="tocsmessage_files.scopefilter"></a>

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

message_files.ScopeFilter

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

<h2 id="tocS_message_files.IncludeFilter.Items">message_files.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemamessage_files.includefilter.items"></a>
<a id="schema_message_files.IncludeFilter.Items"></a>
<a id="tocSmessage_files.includefilter.items"></a>
<a id="tocsmessage_files.includefilter.items"></a>

```json
{
  "relation": "message",
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

message_files.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[message_files.ScopeFilter](#schemamessage_files.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|message|

<h2 id="tocS_message_files.Filter">message_files.Filter</h2>
<!-- backwards compatibility -->
<a id="schemamessage_files.filter"></a>
<a id="schema_message_files.Filter"></a>
<a id="tocSmessage_files.filter"></a>
<a id="tocsmessage_files.filter"></a>

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
    "channelId": true,
    "fileKey": true,
    "messageId": true,
    "metaData": true
  },
  "include": [
    {
      "relation": "message",
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

message_files.Filter

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
|»» channelId|boolean|false|none|none|
|»» fileKey|boolean|false|none|none|
|»» messageId|boolean|false|none|none|
|»» metaData|boolean|false|none|none|

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
|» *anonymous*|[message_files.IncludeFilter.Items](#schemamessage_files.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_message_files.Filter1">message_files.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemamessage_files.filter1"></a>
<a id="schema_message_files.Filter1"></a>
<a id="tocSmessage_files.filter1"></a>
<a id="tocsmessage_files.filter1"></a>

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
    "channelId": true,
    "fileKey": true,
    "messageId": true,
    "metaData": true
  },
  "include": [
    {
      "relation": "message",
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

message_files.Filter

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
|»» channelId|boolean|false|none|none|
|»» fileKey|boolean|false|none|none|
|»» messageId|boolean|false|none|none|
|»» metaData|boolean|false|none|none|

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
|» *anonymous*|[message_files.IncludeFilter.Items](#schemamessage_files.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_message_recipients.ScopeFilter">message_recipients.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemamessage_recipients.scopefilter"></a>
<a id="schema_message_recipients.ScopeFilter"></a>
<a id="tocSmessage_recipients.scopefilter"></a>
<a id="tocsmessage_recipients.scopefilter"></a>

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

message_recipients.ScopeFilter

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

<h2 id="tocS_message_recipients.IncludeFilter.Items">message_recipients.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemamessage_recipients.includefilter.items"></a>
<a id="schema_message_recipients.IncludeFilter.Items"></a>
<a id="tocSmessage_recipients.includefilter.items"></a>
<a id="tocsmessage_recipients.includefilter.items"></a>

```json
{
  "relation": "message",
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

message_recipients.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[message_recipients.ScopeFilter](#schemamessage_recipients.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|message|

<h2 id="tocS_message_recipients.Filter">message_recipients.Filter</h2>
<!-- backwards compatibility -->
<a id="schemamessage_recipients.filter"></a>
<a id="schema_message_recipients.Filter"></a>
<a id="tocSmessage_recipients.filter"></a>
<a id="tocsmessage_recipients.filter"></a>

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
    "channelId": true,
    "forwardedBy": true,
    "isFavorite": true,
    "isForwarded": true,
    "isRead": true,
    "recipientId": true,
    "messageId": true
  },
  "include": [
    {
      "relation": "message",
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

message_recipients.Filter

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
|»» channelId|boolean|false|none|none|
|»» forwardedBy|boolean|false|none|none|
|»» isFavorite|boolean|false|none|none|
|»» isForwarded|boolean|false|none|none|
|»» isRead|boolean|false|none|none|
|»» recipientId|boolean|false|none|none|
|»» messageId|boolean|false|none|none|

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
|» *anonymous*|[message_recipients.IncludeFilter.Items](#schemamessage_recipients.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_message_recipients.Filter1">message_recipients.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemamessage_recipients.filter1"></a>
<a id="schema_message_recipients.Filter1"></a>
<a id="tocSmessage_recipients.filter1"></a>
<a id="tocsmessage_recipients.filter1"></a>

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
    "channelId": true,
    "forwardedBy": true,
    "isFavorite": true,
    "isForwarded": true,
    "isRead": true,
    "recipientId": true,
    "messageId": true
  },
  "include": [
    {
      "relation": "message",
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

message_recipients.Filter

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
|»» channelId|boolean|false|none|none|
|»» forwardedBy|boolean|false|none|none|
|»» isFavorite|boolean|false|none|none|
|»» isForwarded|boolean|false|none|none|
|»» isRead|boolean|false|none|none|
|»» recipientId|boolean|false|none|none|
|»» messageId|boolean|false|none|none|

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
|» *anonymous*|[message_recipients.IncludeFilter.Items](#schemamessage_recipients.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_messages.ScopeFilter">messages.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemamessages.scopefilter"></a>
<a id="schema_messages.ScopeFilter"></a>
<a id="tocSmessages.scopefilter"></a>
<a id="tocsmessages.scopefilter"></a>

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

messages.ScopeFilter

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

<h2 id="tocS_messages.IncludeFilter.Items">messages.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemamessages.includefilter.items"></a>
<a id="schema_messages.IncludeFilter.Items"></a>
<a id="tocSmessages.includefilter.items"></a>
<a id="tocsmessages.includefilter.items"></a>

```json
{
  "relation": "messageRecipients",
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

messages.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[messages.ScopeFilter](#schemamessages.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|messageRecipients|
|relation|attachmentFiles|
|relation|parentMessage|
|relation|messages|

<h2 id="tocS_messages.Filter">messages.Filter</h2>
<!-- backwards compatibility -->
<a id="schemamessages.filter"></a>
<a id="schema_messages.Filter"></a>
<a id="tocSmessages.filter"></a>
<a id="tocsmessages.filter"></a>

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
    "body": true,
    "channelId": true,
    "channelType": true,
    "status": true,
    "subject": true,
    "toUserId": true,
    "parentMessageId": true
  },
  "include": [
    {
      "relation": "messageRecipients",
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

messages.Filter

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
|»» body|boolean|false|none|none|
|»» channelId|boolean|false|none|none|
|»» channelType|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» subject|boolean|false|none|none|
|»» toUserId|boolean|false|none|none|
|»» parentMessageId|boolean|false|none|none|

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
|» *anonymous*|[messages.IncludeFilter.Items](#schemamessages.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_messages.Filter1">messages.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemamessages.filter1"></a>
<a id="schema_messages.Filter1"></a>
<a id="tocSmessages.filter1"></a>
<a id="tocsmessages.filter1"></a>

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
    "body": true,
    "channelId": true,
    "channelType": true,
    "status": true,
    "subject": true,
    "toUserId": true,
    "parentMessageId": true
  },
  "include": [
    {
      "relation": "messageRecipients",
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

messages.Filter

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
|»» body|boolean|false|none|none|
|»» channelId|boolean|false|none|none|
|»» channelType|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» subject|boolean|false|none|none|
|»» toUserId|boolean|false|none|none|
|»» parentMessageId|boolean|false|none|none|

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
|» *anonymous*|[messages.IncludeFilter.Items](#schemamessages.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

