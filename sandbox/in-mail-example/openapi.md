---
title: In-mail Service v1.0.0
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

<h1 id="in-mail-service">In-mail Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

in mail example

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>


# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="in-mail-service-originatorcontroller">OriginatorController</h1>

## API provides an interface for restore message from trash.

<a id="opIdOriginatorController.restore"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/mails/bulk/restore',
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

`PATCH /mails/bulk/restore`

> Body parameter

```json
{
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
}
```

<h3 id="api-provides-an-interface-for-restore-message-from-trash.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|object|false|none|
|body|body|[IdArraysPartial](#schemaidarrayspartial)|false|none|

<h3 id="api-provides-an-interface-for-restore-message-from-trash.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Restore Message Successful!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Message identity does not exist.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|

<aside class="success">
This operation does not require authentication
</aside>

## API for moving mails to trash and then delete

<a id="opIdOriginatorController.trashBulk"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/mails/bulk/{storage}/{action}',
{
  method: 'DELETE',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /mails/bulk/{storage}/{action}`

> Body parameter

```json
{
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
}
```

<h3 id="api-for-moving-mails-to-trash-and-then-delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|storage|path|string|true|none|
|action|path|string|true|none|
|filter|query|object|false|none|
|body|body|[IdArraysPartial](#schemaidarrayspartial)|false|none|

<h3 id="api-for-moving-mails-to-trash-and-then-delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Trash/Deletion of Mail(s) sucessful!|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Message identity does not exist.|None|

<aside class="success">
This operation does not require authentication
</aside>

## API provides interface to mark read, unread and important

<a id="opIdOriginatorController.markMail"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/mails/marking/{markType}',
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

`PATCH /mails/marking/{markType}`

> Body parameter

```json
{
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
}
```

<h3 id="api-provides-interface-to-mark-read,-unread-and-important-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|markType|path|string|true|none|
|body|body|[IdArraysPartial](#schemaidarrayspartial)|false|none|

<h3 id="api-provides-interface-to-mark-read,-unread-and-important-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message is marked read/unread/important|None|

<aside class="success">
This operation does not require authentication
</aside>

## API provides an interface for removing attachment before message is sent

<a id="opIdOriginatorController.removeAttachment"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/mails/{messageId}/attachments/{attachmentId}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /mails/{messageId}/attachments/{attachmentId}`

<h3 id="api-provides-an-interface-for-removing-attachment-before-message-is-sent-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|messageId|path|string|true|none|
|attachmentId|path|string|true|none|
|filter|query|object|false|none|

<h3 id="api-provides-an-interface-for-removing-attachment-before-message-is-sent-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Deletetion of Attachment Successful!|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Message identity does not exist.|None|

<aside class="success">
This operation does not require authentication
</aside>

## API provides an interface for adding attachment before message is sent.

<a id="opIdOriginatorController.addAttachment"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/mails/{messageId}/attachments',
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

`POST /mails/{messageId}/attachments`

> Body parameter

```json
{
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ]
}
```

<h3 id="api-provides-an-interface-for-adding-attachment-before-message-is-sent.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|messageId|path|string|true|none|
|filter|query|object|false|none|
|body|body|object|false|none|
|» attachments|body|[[AttachmentPartial](#schemaattachmentpartial)]|false|[(tsType: Partial<Attachment>, schemaOptions: { partial: true })]|
|»» AttachmentPartial|body|[AttachmentPartial](#schemaattachmentpartial)|false|(tsType: Partial<Attachment>, schemaOptions: { partial: true })|
|»»» deleted|body|boolean|false|none|
|»»» deletedOn|body|string(date-time)¦null|false|none|
|»»» deletedBy|body|string¦null|false|none|
|»»» createdOn|body|string(date-time)|false|none|
|»»» modifiedOn|body|string(date-time)|false|none|
|»»» createdBy|body|string|false|none|
|»»» modifiedBy|body|string|false|none|
|»»» id|body|string|false|none|
|»»» name|body|string|false|none|
|»»» path|body|string|false|none|
|»»» thumbnail|body|string|false|none|
|»»» mime|body|string|false|none|
|»»» extId|body|string|false|none|
|»»» extMetadata|body|object|false|none|
|»»» messageId|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "items": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ]
}
```

<h3 id="api-provides-an-interface-for-adding-attachment-before-message-is-sent.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|collect single attachment for user by message identifier|[Attachment add response schema](#schemaattachment add response schema)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Message identity does not exist.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|

<aside class="success">
This operation does not require authentication
</aside>

## API for sending a drafted message.

<a id="opIdOriginatorController.sendDraft"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/mails/{messageId}/send',
{
  method: 'PATCH'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /mails/{messageId}/send`

<h3 id="api-for-sending-a-drafted-message.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|messageId|path|string|true|none|
|filter|query|object|false|none|

<h3 id="api-for-sending-a-drafted-message.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Mail is Successfully sent!|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Message identity does not exist.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|

<aside class="success">
This operation does not require authentication
</aside>

## Update API. Update draft messages.

<a id="opIdOriginatorController.updateDraft"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "threadId": "string",
  "groups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string"
    }
  ],
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "body": "string",
  "subject": "string",
  "status": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/mails/{messageId}',
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

`PUT /mails/{messageId}`

> Body parameter

```json
{
  "threadId": "string",
  "groups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string"
    }
  ],
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "body": "string",
  "subject": "string",
  "status": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="update-api.-update-draft-messages.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|messageId|path|string|true|none|
|body|body|[composeMailBody](#schemacomposemailbody)|false|none|

> Example responses

<h3 id="update-api.-update-draft-messages.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Message identity does not exist.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|
|application/json|Unknown|collect single message for user by message identifier|None|

<h3 id="update-api.-update-draft-messages.-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## ComposeAPI. For drafting, reply on and create new message

<a id="opIdOriginatorController.composeMail"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "threadId": "string",
  "groups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string"
    }
  ],
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "body": "string",
  "subject": "string",
  "status": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/mails',
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

`POST /mails`

> Body parameter

```json
{
  "threadId": "string",
  "groups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string"
    }
  ],
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "body": "string",
  "subject": "string",
  "status": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="composeapi.-for-drafting,-reply-on-and-create-new-message-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[composeMailBody](#schemacomposemailbody)|false|none|

> Example responses

<h3 id="composeapi.-for-drafting,-reply-on-and-create-new-message-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|collect single message for user by message identifier|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Message identity does not exist.|None|

<h3 id="composeapi.-for-drafting,-reply-on-and-create-new-message-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="in-mail-service-collectorcontroller">CollectorController</h1>

## GET Message API. Collect a single message based on message identity.

<a id="opIdCollectorController.fetchById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/mails/{messageId}',
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

`GET /mails/{messageId}`

<h3 id="get-message-api.-collect-a-single-message-based-on-message-identity.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|messageId|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "item": "string"
}
```

<h3 id="get-message-api.-collect-a-single-message-based-on-message-identity.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Gets mail details based on unique message id|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthrized token in header.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Message identity does not exist|None|

<h3 id="get-message-api.-collect-a-single-message-based-on-message-identity.-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» item|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Collect a list of all messages.

<a id="opIdCollectorController.fetchMailList"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/mails',
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

`GET /mails`

<h3 id="collect-a-list-of-all-messages.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|messageFilter|query|object|false|none|
|groupFilter|query|object|false|none|

> Example responses

<h3 id="collect-a-list-of-all-messages.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|fetch mails|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthrized token in header.|None|

<h3 id="collect-a-list-of-all-messages.-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## GET Thread Message API. Collect complete single message thread based on thread identity.

<a id="opIdCollectorController.fetchThreadById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/threads/{threadId}',
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

`GET /threads/{threadId}`

<h3 id="get-thread-message-api.-collect-complete-single-message-thread-based-on-thread-identity.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|threadId|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "item": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "subject": "string",
    "messageCounts": 0,
    "extId": "string",
    "extMetadata": {}
  }
}
```

<h3 id="get-thread-message-api.-collect-complete-single-message-thread-based-on-thread-identity.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Fetches a thread along with message, group, attachment(s) etc based on unique thread Id|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Message identity does not exist|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|

<h3 id="get-thread-message-api.-collect-complete-single-message-thread-based-on-thread-identity.-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» item|[Thread](#schemathread)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» subject|string|true|none|none|
|»» messageCounts|number|false|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Thread List API. Collect a list of all threads.

<a id="opIdCollectorController.fetchThreadList"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/threads',
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

`GET /threads`

<h3 id="thread-list-api.-collect-a-list-of-all-threads.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|threadFilter|query|object|false|none|
|groupFilter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "version": "string",
  "items": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "subject": "string",
      "messageCounts": 0,
      "extId": "string",
      "extMetadata": {}
    }
  ]
}
```

<h3 id="thread-list-api.-collect-a-list-of-all-threads.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|fetch threads|Inline|

<h3 id="thread-list-api.-collect-a-list-of-all-threads.-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» version|string|false|none|none|
|» items|[[Thread](#schemathread)]|false|none|none|
|»» Thread|[Thread](#schemathread)|false|none|none|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» subject|string|true|none|none|
|»»» messageCounts|number|false|none|none|
|»»» extId|string|false|none|none|
|»»» extMetadata|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="in-mail-service-pingcontroller">PingController</h1>

## PingController.ping

<a id="opIdPingController.ping"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/ping',
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

`GET /ping`

> Example responses

> 200 Response

```json
{
  "greeting": "string",
  "date": "string",
  "url": "string",
  "headers": {
    "Content-Type": "string"
  }
}
```

<h3 id="pingcontroller.ping-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Ping Response|[PingResponse](#schemapingresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="in-mail-service-replyandforwardcontroller">ReplyAndForwardController</h1>

## API provides interface to forward single message.

<a id="opIdReplyAndForwardController.forward"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "groups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string"
    }
  ],
  "subject": "string",
  "body": "string",
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "status": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/threads/{threadId}/forward',
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

`PATCH /threads/{threadId}/forward`

> Body parameter

```json
{
  "groups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string"
    }
  ],
  "subject": "string",
  "body": "string",
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "status": "string"
}
```

<h3 id="api-provides-interface-to-forward-single-message.-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|threadId|path|string|true|none|
|body|body|object|false|none|
|» groups|body|[[GroupPartial](#schemagrouppartial)]|true|[(tsType: Partial<Group>, schemaOptions: { partial: true })]|
|»» GroupPartial|body|[GroupPartial](#schemagrouppartial)|false|(tsType: Partial<Group>, schemaOptions: { partial: true })|
|»»» deleted|body|boolean|false|none|
|»»» deletedOn|body|string(date-time)¦null|false|none|
|»»» deletedBy|body|string¦null|false|none|
|»»» createdOn|body|string(date-time)|false|none|
|»»» modifiedOn|body|string(date-time)|false|none|
|»»» createdBy|body|string|false|none|
|»»» modifiedBy|body|string|false|none|
|»»» id|body|string|false|none|
|»»» party|body|string|false|none|
|»»» type|body|string|false|none|
|»»» isImportant|body|boolean|false|none|
|»»» storage|body|string|false|none|
|»»» visibility|body|string|false|none|
|»»» extId|body|string|false|none|
|»»» extMetadata|body|object|false|none|
|»»» messageId|body|string|false|none|
|»»» threadId|body|string|false|none|
|» subject|body|string|false|none|
|» body|body|string|false|none|
|» attachments|body|[[AttachmentPartial](#schemaattachmentpartial)]|false|[(tsType: Partial<Attachment>, schemaOptions: { partial: true })]|
|»» AttachmentPartial|body|[AttachmentPartial](#schemaattachmentpartial)|false|(tsType: Partial<Attachment>, schemaOptions: { partial: true })|
|»»» deleted|body|boolean|false|none|
|»»» deletedOn|body|string(date-time)¦null|false|none|
|»»» deletedBy|body|string¦null|false|none|
|»»» createdOn|body|string(date-time)|false|none|
|»»» modifiedOn|body|string(date-time)|false|none|
|»»» createdBy|body|string|false|none|
|»»» modifiedBy|body|string|false|none|
|»»» id|body|string|false|none|
|»»» name|body|string|false|none|
|»»» path|body|string|false|none|
|»»» thumbnail|body|string|false|none|
|»»» mime|body|string|false|none|
|»»» extId|body|string|false|none|
|»»» extMetadata|body|object|false|none|
|»»» messageId|body|string|false|none|
|» meta|body|[[MetaPartial](#schemametapartial)]|false|[(tsType: Partial<Meta>, schemaOptions: { partial: true })]|
|»» MetaPartial|body|[MetaPartial](#schemametapartial)|false|(tsType: Partial<Meta>, schemaOptions: { partial: true })|
|»»» deleted|body|boolean|false|none|
|»»» deletedOn|body|string(date-time)¦null|false|none|
|»»» deletedBy|body|string¦null|false|none|
|»»» createdOn|body|string(date-time)|false|none|
|»»» modifiedOn|body|string(date-time)|false|none|
|»»» createdBy|body|string|false|none|
|»»» modifiedBy|body|string|false|none|
|»»» id|body|string|false|none|
|»»» key|body|string|false|none|
|»»» value|body|string|false|none|
|»»» extId|body|string|false|none|
|»»» extMetadata|body|object|false|none|
|»»» messageId|body|string|false|none|
|» status|body|string|false|none|

#### Enumerated Values

|Parameter|Value|
|---|---|
|»»» type|from|
|»»» type|to|
|»»» type|cc|
|»»» type|bcc|
|»»» storage|draft|
|»»» storage|send|
|»»» storage|inbox|
|»»» storage|trash|
|»»» visibility|read|
|»»» visibility|new|
|»»» visibility|unread|
|»»» visibility|important|
|»»» visibility|not-important|

> Example responses

<h3 id="api-provides-interface-to-forward-single-message.-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Message is forwarded to another recipient|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Message identity does not exist.|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden request due to unauthorized token in header.|None|

<h3 id="api-provides-interface-to-forward-single-message.-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## API provides interface to reply to a single message

<a id="opIdReplyAndForwardController.replyMail"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "body": "string",
  "subject": "string",
  "status": "string",
  "extId": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/threads/{threadId}/mails/{messageId}/replies',
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

`PATCH /threads/{threadId}/mails/{messageId}/replies`

> Body parameter

```json
{
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "body": "string",
  "subject": "string",
  "status": "string",
  "extId": "string"
}
```

<h3 id="api-provides-interface-to-reply-to-a-single-message-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|threadId|path|string|true|none|
|messageId|path|string|true|none|
|replyAll|query|boolean|false|none|
|body|body|object|false|none|
|» attachments|body|[[AttachmentPartial](#schemaattachmentpartial)]|false|[(tsType: Partial<Attachment>, schemaOptions: { partial: true })]|
|»» AttachmentPartial|body|[AttachmentPartial](#schemaattachmentpartial)|false|(tsType: Partial<Attachment>, schemaOptions: { partial: true })|
|»»» deleted|body|boolean|false|none|
|»»» deletedOn|body|string(date-time)¦null|false|none|
|»»» deletedBy|body|string¦null|false|none|
|»»» createdOn|body|string(date-time)|false|none|
|»»» modifiedOn|body|string(date-time)|false|none|
|»»» createdBy|body|string|false|none|
|»»» modifiedBy|body|string|false|none|
|»»» id|body|string|false|none|
|»»» name|body|string|false|none|
|»»» path|body|string|false|none|
|»»» thumbnail|body|string|false|none|
|»»» mime|body|string|false|none|
|»»» extId|body|string|false|none|
|»»» extMetadata|body|object|false|none|
|»»» messageId|body|string|false|none|
|» meta|body|[[MetaPartial](#schemametapartial)]|false|[(tsType: Partial<Meta>, schemaOptions: { partial: true })]|
|»» MetaPartial|body|[MetaPartial](#schemametapartial)|false|(tsType: Partial<Meta>, schemaOptions: { partial: true })|
|»»» deleted|body|boolean|false|none|
|»»» deletedOn|body|string(date-time)¦null|false|none|
|»»» deletedBy|body|string¦null|false|none|
|»»» createdOn|body|string(date-time)|false|none|
|»»» modifiedOn|body|string(date-time)|false|none|
|»»» createdBy|body|string|false|none|
|»»» modifiedBy|body|string|false|none|
|»»» id|body|string|false|none|
|»»» key|body|string|false|none|
|»»» value|body|string|false|none|
|»»» extId|body|string|false|none|
|»»» extMetadata|body|object|false|none|
|»»» messageId|body|string|false|none|
|» body|body|string|true|none|
|» subject|body|string|false|none|
|» status|body|string|true|none|
|» extId|body|string|false|none|

<h3 id="api-provides-interface-to-reply-to-a-single-message-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Message is replied back to the sender|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_idResponse">idResponse</h2>
<!-- backwards compatibility -->
<a id="schemaidresponse"></a>
<a id="schema_idResponse"></a>
<a id="tocSidresponse"></a>
<a id="tocsidresponse"></a>

```json
false

```

### Properties

*None*

<h2 id="tocS_composeMailBody">composeMailBody</h2>
<!-- backwards compatibility -->
<a id="schemacomposemailbody"></a>
<a id="schema_composeMailBody"></a>
<a id="tocScomposemailbody"></a>
<a id="tocscomposemailbody"></a>

```json
{
  "threadId": "string",
  "groups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string"
    }
  ],
  "attachments": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "meta": [
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
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ],
  "body": "string",
  "subject": "string",
  "status": "string",
  "extId": "string",
  "extMetadata": {}
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|threadId|string|false|none|none|
|groups|[[GroupPartial](#schemagrouppartial)]|true|none|[(tsType: Partial<Group>, schemaOptions: { partial: true })]|
|attachments|[[AttachmentPartial](#schemaattachmentpartial)]|false|none|[(tsType: Partial<Attachment>, schemaOptions: { partial: true })]|
|meta|[[MetaPartial](#schemametapartial)]|false|none|[(tsType: Partial<Meta>, schemaOptions: { partial: true })]|
|body|string|true|none|none|
|subject|string|false|none|none|
|status|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_Attachment">Attachment</h2>
<!-- backwards compatibility -->
<a id="schemaattachment"></a>
<a id="schema_Attachment"></a>
<a id="tocSattachment"></a>
<a id="tocsattachment"></a>

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
  "path": "string",
  "thumbnail": "string",
  "mime": "string",
  "extId": "string",
  "extMetadata": {},
  "messageId": "string"
}

```

Attachment

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
|path|string|true|none|none|
|thumbnail|string|true|none|none|
|mime|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|messageId|string|false|none|none|

<h2 id="tocS_AttachmentPartial">AttachmentPartial</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentpartial"></a>
<a id="schema_AttachmentPartial"></a>
<a id="tocSattachmentpartial"></a>
<a id="tocsattachmentpartial"></a>

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
  "path": "string",
  "thumbnail": "string",
  "mime": "string",
  "extId": "string",
  "extMetadata": {},
  "messageId": "string"
}

```

AttachmentPartial

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
|name|string|false|none|none|
|path|string|false|none|none|
|thumbnail|string|false|none|none|
|mime|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|messageId|string|false|none|none|

<h2 id="tocS_IdArraysPartial">IdArraysPartial</h2>
<!-- backwards compatibility -->
<a id="schemaidarrayspartial"></a>
<a id="schema_IdArraysPartial"></a>
<a id="tocSidarrayspartial"></a>
<a id="tocsidarrayspartial"></a>

```json
{
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
}

```

IdArraysPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|messageIds|[string]|false|none|none|
|threadIds|[string]|false|none|none|

<h2 id="tocS_IdArrays">IdArrays</h2>
<!-- backwards compatibility -->
<a id="schemaidarrays"></a>
<a id="schema_IdArrays"></a>
<a id="tocSidarrays"></a>
<a id="tocsidarrays"></a>

```json
{
  "messageIds": [
    "string"
  ],
  "threadIds": [
    "string"
  ]
}

```

IdArrays

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|messageIds|[string]|false|none|none|
|threadIds|[string]|false|none|none|

<h2 id="tocS_MetaPartial">MetaPartial</h2>
<!-- backwards compatibility -->
<a id="schemametapartial"></a>
<a id="schema_MetaPartial"></a>
<a id="tocSmetapartial"></a>
<a id="tocsmetapartial"></a>

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
  "value": "string",
  "extId": "string",
  "extMetadata": {},
  "messageId": "string"
}

```

MetaPartial

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
|key|string|false|none|none|
|value|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|messageId|string|false|none|none|

<h2 id="tocS_GroupPartial">GroupPartial</h2>
<!-- backwards compatibility -->
<a id="schemagrouppartial"></a>
<a id="schema_GroupPartial"></a>
<a id="tocSgrouppartial"></a>
<a id="tocsgrouppartial"></a>

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
  "party": "string",
  "type": "from",
  "isImportant": true,
  "storage": "inbox",
  "visibility": "new",
  "extId": "string",
  "extMetadata": {},
  "messageId": "string",
  "threadId": "string"
}

```

GroupPartial

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
|party|string|false|none|none|
|type|string|false|none|none|
|isImportant|boolean|false|none|none|
|storage|string|false|none|none|
|visibility|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|messageId|string|false|none|none|
|threadId|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|type|from|
|type|to|
|type|cc|
|type|bcc|
|storage|draft|
|storage|send|
|storage|inbox|
|storage|trash|
|visibility|read|
|visibility|new|
|visibility|unread|
|visibility|important|
|visibility|not-important|

<h2 id="tocS_Attachment add response schema">Attachment add response schema</h2>
<!-- backwards compatibility -->
<a id="schemaattachment add response schema"></a>
<a id="schema_Attachment add response schema"></a>
<a id="tocSattachment add response schema"></a>
<a id="tocsattachment add response schema"></a>

```json
{
  "items": [
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
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string"
    }
  ]
}

```

Attachment add response schema

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|items|[[Attachment](#schemaattachment)]|false|none|none|

<h2 id="tocS_AttachmentExcluding_deleted_WithRelations">AttachmentExcluding_deleted_WithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentexcluding_deleted_withrelations"></a>
<a id="schema_AttachmentExcluding_deleted_WithRelations"></a>
<a id="tocSattachmentexcluding_deleted_withrelations"></a>
<a id="tocsattachmentexcluding_deleted_withrelations"></a>

```json
{
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "path": "string",
  "thumbnail": "string",
  "mime": "string",
  "extId": "string",
  "extMetadata": {},
  "messageId": "string",
  "message": {
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "sender": "string",
    "subject": "string",
    "body": "string",
    "status": "draft",
    "extId": "string",
    "extMetadata": {},
    "threadId": "string",
    "attachment": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "path": "string",
        "thumbnail": "string",
        "mime": "string",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "message": {}
      }
    ],
    "group": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "party": "string",
        "type": "from",
        "isImportant": true,
        "storage": "inbox",
        "visibility": "new",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "threadId": "string",
        "message": {},
        "thread": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "subject": "string",
          "messageCounts": 0,
          "extId": "string",
          "extMetadata": {},
          "message": [
            {}
          ],
          "group": [
            {}
          ]
        }
      }
    ],
    "meta": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "key": "string",
        "value": "string",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "message": {}
      }
    ],
    "thread": {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "subject": "string",
      "messageCounts": 0,
      "extId": "string",
      "extMetadata": {},
      "message": [
        {}
      ],
      "group": [
        {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "party": "string",
          "type": "from",
          "isImportant": true,
          "storage": "inbox",
          "visibility": "new",
          "extId": "string",
          "extMetadata": {},
          "messageId": "string",
          "threadId": "string",
          "message": {},
          "thread": {}
        }
      ]
    }
  }
}

```

AttachmentExcluding_deleted_WithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|name|string|true|none|none|
|path|string|true|none|none|
|thumbnail|string|true|none|none|
|mime|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|messageId|string|false|none|none|
|message|[MessageExcluding_deleted_WithRelations](#schemamessageexcluding_deleted_withrelations)|false|none|(tsType: Omit<MessageWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })|

<h2 id="tocS_ThreadExcluding_deleted_WithRelations">ThreadExcluding_deleted_WithRelations</h2>
<!-- backwards compatibility -->
<a id="schemathreadexcluding_deleted_withrelations"></a>
<a id="schema_ThreadExcluding_deleted_WithRelations"></a>
<a id="tocSthreadexcluding_deleted_withrelations"></a>
<a id="tocsthreadexcluding_deleted_withrelations"></a>

```json
{
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "subject": "string",
  "messageCounts": 0,
  "extId": "string",
  "extMetadata": {},
  "message": [
    {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "sender": "string",
      "subject": "string",
      "body": "string",
      "status": "draft",
      "extId": "string",
      "extMetadata": {},
      "threadId": "string",
      "attachment": [
        {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "path": "string",
          "thumbnail": "string",
          "mime": "string",
          "extId": "string",
          "extMetadata": {},
          "messageId": "string",
          "message": {}
        }
      ],
      "group": [
        {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "party": "string",
          "type": "from",
          "isImportant": true,
          "storage": "inbox",
          "visibility": "new",
          "extId": "string",
          "extMetadata": {},
          "messageId": "string",
          "threadId": "string",
          "message": {},
          "thread": {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "subject": "string",
            "messageCounts": 0,
            "extId": "string",
            "extMetadata": {},
            "message": [],
            "group": [
              {}
            ]
          }
        }
      ],
      "meta": [
        {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "key": "string",
          "value": "string",
          "extId": "string",
          "extMetadata": {},
          "messageId": "string",
          "message": {}
        }
      ],
      "thread": {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "subject": "string",
        "messageCounts": 0,
        "extId": "string",
        "extMetadata": {},
        "message": [],
        "group": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "party": "string",
            "type": "from",
            "isImportant": true,
            "storage": "inbox",
            "visibility": "new",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "threadId": "string",
            "message": {},
            "thread": {}
          }
        ]
      }
    }
  ],
  "group": [
    {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string",
      "message": {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "sender": "string",
        "subject": "string",
        "body": "string",
        "status": "draft",
        "extId": "string",
        "extMetadata": {},
        "threadId": "string",
        "attachment": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "path": "string",
            "thumbnail": "string",
            "mime": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "group": [
          {}
        ],
        "meta": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "key": "string",
            "value": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "thread": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "subject": "string",
          "messageCounts": 0,
          "extId": "string",
          "extMetadata": {},
          "message": [
            {}
          ],
          "group": []
        }
      },
      "thread": {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "subject": "string",
        "messageCounts": 0,
        "extId": "string",
        "extMetadata": {},
        "message": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "sender": "string",
            "subject": "string",
            "body": "string",
            "status": "draft",
            "extId": "string",
            "extMetadata": {},
            "threadId": "string",
            "attachment": [
              {
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "path": "string",
                "thumbnail": "string",
                "mime": "string",
                "extId": "string",
                "extMetadata": {},
                "messageId": "string",
                "message": {}
              }
            ],
            "group": [
              {}
            ],
            "meta": [
              {
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "key": "string",
                "value": "string",
                "extId": "string",
                "extMetadata": {},
                "messageId": "string",
                "message": {}
              }
            ],
            "thread": {}
          }
        ],
        "group": []
      }
    }
  ]
}

```

ThreadExcluding_deleted_WithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|subject|string|true|none|none|
|messageCounts|number|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|message|[[MessageExcluding_deleted_WithRelations](#schemamessageexcluding_deleted_withrelations)]|false|none|[(tsType: Omit<MessageWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })]|
|group|[[GroupExcluding_deleted_WithRelations](#schemagroupexcluding_deleted_withrelations)]|false|none|[(tsType: Omit<GroupWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })]|

<h2 id="tocS_GroupExcluding_deleted_WithRelations">GroupExcluding_deleted_WithRelations</h2>
<!-- backwards compatibility -->
<a id="schemagroupexcluding_deleted_withrelations"></a>
<a id="schema_GroupExcluding_deleted_WithRelations"></a>
<a id="tocSgroupexcluding_deleted_withrelations"></a>
<a id="tocsgroupexcluding_deleted_withrelations"></a>

```json
{
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "party": "string",
  "type": "from",
  "isImportant": true,
  "storage": "inbox",
  "visibility": "new",
  "extId": "string",
  "extMetadata": {},
  "messageId": "string",
  "threadId": "string",
  "message": {
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "sender": "string",
    "subject": "string",
    "body": "string",
    "status": "draft",
    "extId": "string",
    "extMetadata": {},
    "threadId": "string",
    "attachment": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "path": "string",
        "thumbnail": "string",
        "mime": "string",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "message": {}
      }
    ],
    "group": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "party": "string",
        "type": "from",
        "isImportant": true,
        "storage": "inbox",
        "visibility": "new",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "threadId": "string",
        "message": {},
        "thread": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "subject": "string",
          "messageCounts": 0,
          "extId": "string",
          "extMetadata": {},
          "message": [
            {}
          ],
          "group": [
            {}
          ]
        }
      }
    ],
    "meta": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "key": "string",
        "value": "string",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "message": {}
      }
    ],
    "thread": {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "subject": "string",
      "messageCounts": 0,
      "extId": "string",
      "extMetadata": {},
      "message": [
        {}
      ],
      "group": [
        {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "party": "string",
          "type": "from",
          "isImportant": true,
          "storage": "inbox",
          "visibility": "new",
          "extId": "string",
          "extMetadata": {},
          "messageId": "string",
          "threadId": "string",
          "message": {},
          "thread": {}
        }
      ]
    }
  },
  "thread": {
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "subject": "string",
    "messageCounts": 0,
    "extId": "string",
    "extMetadata": {},
    "message": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "sender": "string",
        "subject": "string",
        "body": "string",
        "status": "draft",
        "extId": "string",
        "extMetadata": {},
        "threadId": "string",
        "attachment": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "path": "string",
            "thumbnail": "string",
            "mime": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "group": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "party": "string",
            "type": "from",
            "isImportant": true,
            "storage": "inbox",
            "visibility": "new",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "threadId": "string",
            "message": {},
            "thread": {}
          }
        ],
        "meta": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "key": "string",
            "value": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "thread": {}
      }
    ],
    "group": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "party": "string",
        "type": "from",
        "isImportant": true,
        "storage": "inbox",
        "visibility": "new",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "threadId": "string",
        "message": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "sender": "string",
          "subject": "string",
          "body": "string",
          "status": "draft",
          "extId": "string",
          "extMetadata": {},
          "threadId": "string",
          "attachment": [
            {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "path": "string",
              "thumbnail": "string",
              "mime": "string",
              "extId": "string",
              "extMetadata": {},
              "messageId": "string",
              "message": {}
            }
          ],
          "group": [
            {}
          ],
          "meta": [
            {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "key": "string",
              "value": "string",
              "extId": "string",
              "extMetadata": {},
              "messageId": "string",
              "message": {}
            }
          ],
          "thread": {}
        },
        "thread": {}
      }
    ]
  }
}

```

GroupExcluding_deleted_WithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|party|string|true|none|none|
|type|string|true|none|none|
|isImportant|boolean|false|none|none|
|storage|string|false|none|none|
|visibility|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|messageId|string|false|none|none|
|threadId|string|false|none|none|
|message|[MessageExcluding_deleted_WithRelations](#schemamessageexcluding_deleted_withrelations)|false|none|(tsType: Omit<MessageWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })|
|thread|[ThreadExcluding_deleted_WithRelations](#schemathreadexcluding_deleted_withrelations)|false|none|(tsType: Omit<ThreadWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|type|from|
|type|to|
|type|cc|
|type|bcc|
|storage|draft|
|storage|send|
|storage|inbox|
|storage|trash|
|visibility|read|
|visibility|new|
|visibility|unread|
|visibility|important|
|visibility|not-important|

<h2 id="tocS_MetaExcluding_deleted_WithRelations">MetaExcluding_deleted_WithRelations</h2>
<!-- backwards compatibility -->
<a id="schemametaexcluding_deleted_withrelations"></a>
<a id="schema_MetaExcluding_deleted_WithRelations"></a>
<a id="tocSmetaexcluding_deleted_withrelations"></a>
<a id="tocsmetaexcluding_deleted_withrelations"></a>

```json
{
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "key": "string",
  "value": "string",
  "extId": "string",
  "extMetadata": {},
  "messageId": "string",
  "message": {
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "sender": "string",
    "subject": "string",
    "body": "string",
    "status": "draft",
    "extId": "string",
    "extMetadata": {},
    "threadId": "string",
    "attachment": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "path": "string",
        "thumbnail": "string",
        "mime": "string",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "message": {}
      }
    ],
    "group": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "party": "string",
        "type": "from",
        "isImportant": true,
        "storage": "inbox",
        "visibility": "new",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "threadId": "string",
        "message": {},
        "thread": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "subject": "string",
          "messageCounts": 0,
          "extId": "string",
          "extMetadata": {},
          "message": [
            {}
          ],
          "group": [
            {}
          ]
        }
      }
    ],
    "meta": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "key": "string",
        "value": "string",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "message": {}
      }
    ],
    "thread": {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "subject": "string",
      "messageCounts": 0,
      "extId": "string",
      "extMetadata": {},
      "message": [
        {}
      ],
      "group": [
        {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "party": "string",
          "type": "from",
          "isImportant": true,
          "storage": "inbox",
          "visibility": "new",
          "extId": "string",
          "extMetadata": {},
          "messageId": "string",
          "threadId": "string",
          "message": {},
          "thread": {}
        }
      ]
    }
  }
}

```

MetaExcluding_deleted_WithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|key|string|true|none|none|
|value|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|messageId|string|false|none|none|
|message|[MessageExcluding_deleted_WithRelations](#schemamessageexcluding_deleted_withrelations)|false|none|(tsType: Omit<MessageWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })|

<h2 id="tocS_MessageExcluding_deleted_WithRelations">MessageExcluding_deleted_WithRelations</h2>
<!-- backwards compatibility -->
<a id="schemamessageexcluding_deleted_withrelations"></a>
<a id="schema_MessageExcluding_deleted_WithRelations"></a>
<a id="tocSmessageexcluding_deleted_withrelations"></a>
<a id="tocsmessageexcluding_deleted_withrelations"></a>

```json
{
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "sender": "string",
  "subject": "string",
  "body": "string",
  "status": "draft",
  "extId": "string",
  "extMetadata": {},
  "threadId": "string",
  "attachment": [
    {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "path": "string",
      "thumbnail": "string",
      "mime": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "message": {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "sender": "string",
        "subject": "string",
        "body": "string",
        "status": "draft",
        "extId": "string",
        "extMetadata": {},
        "threadId": "string",
        "attachment": [],
        "group": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "party": "string",
            "type": "from",
            "isImportant": true,
            "storage": "inbox",
            "visibility": "new",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "threadId": "string",
            "message": {},
            "thread": {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "subject": "string",
              "messageCounts": 0,
              "extId": "string",
              "extMetadata": {},
              "message": [
                {}
              ],
              "group": [
                {}
              ]
            }
          }
        ],
        "meta": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "key": "string",
            "value": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "thread": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "subject": "string",
          "messageCounts": 0,
          "extId": "string",
          "extMetadata": {},
          "message": [
            {}
          ],
          "group": [
            {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "party": "string",
              "type": "from",
              "isImportant": true,
              "storage": "inbox",
              "visibility": "new",
              "extId": "string",
              "extMetadata": {},
              "messageId": "string",
              "threadId": "string",
              "message": {},
              "thread": {}
            }
          ]
        }
      }
    }
  ],
  "group": [
    {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "party": "string",
      "type": "from",
      "isImportant": true,
      "storage": "inbox",
      "visibility": "new",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "threadId": "string",
      "message": {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "sender": "string",
        "subject": "string",
        "body": "string",
        "status": "draft",
        "extId": "string",
        "extMetadata": {},
        "threadId": "string",
        "attachment": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "path": "string",
            "thumbnail": "string",
            "mime": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "group": [],
        "meta": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "key": "string",
            "value": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "thread": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "subject": "string",
          "messageCounts": 0,
          "extId": "string",
          "extMetadata": {},
          "message": [
            {}
          ],
          "group": [
            {}
          ]
        }
      },
      "thread": {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "subject": "string",
        "messageCounts": 0,
        "extId": "string",
        "extMetadata": {},
        "message": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "sender": "string",
            "subject": "string",
            "body": "string",
            "status": "draft",
            "extId": "string",
            "extMetadata": {},
            "threadId": "string",
            "attachment": [
              {
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "path": "string",
                "thumbnail": "string",
                "mime": "string",
                "extId": "string",
                "extMetadata": {},
                "messageId": "string",
                "message": {}
              }
            ],
            "group": [],
            "meta": [
              {
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "key": "string",
                "value": "string",
                "extId": "string",
                "extMetadata": {},
                "messageId": "string",
                "message": {}
              }
            ],
            "thread": {}
          }
        ],
        "group": [
          {}
        ]
      }
    }
  ],
  "meta": [
    {
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "key": "string",
      "value": "string",
      "extId": "string",
      "extMetadata": {},
      "messageId": "string",
      "message": {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "sender": "string",
        "subject": "string",
        "body": "string",
        "status": "draft",
        "extId": "string",
        "extMetadata": {},
        "threadId": "string",
        "attachment": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "path": "string",
            "thumbnail": "string",
            "mime": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "group": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "party": "string",
            "type": "from",
            "isImportant": true,
            "storage": "inbox",
            "visibility": "new",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "threadId": "string",
            "message": {},
            "thread": {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "subject": "string",
              "messageCounts": 0,
              "extId": "string",
              "extMetadata": {},
              "message": [
                {}
              ],
              "group": [
                {}
              ]
            }
          }
        ],
        "meta": [],
        "thread": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "subject": "string",
          "messageCounts": 0,
          "extId": "string",
          "extMetadata": {},
          "message": [
            {}
          ],
          "group": [
            {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "party": "string",
              "type": "from",
              "isImportant": true,
              "storage": "inbox",
              "visibility": "new",
              "extId": "string",
              "extMetadata": {},
              "messageId": "string",
              "threadId": "string",
              "message": {},
              "thread": {}
            }
          ]
        }
      }
    }
  ],
  "thread": {
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "subject": "string",
    "messageCounts": 0,
    "extId": "string",
    "extMetadata": {},
    "message": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "sender": "string",
        "subject": "string",
        "body": "string",
        "status": "draft",
        "extId": "string",
        "extMetadata": {},
        "threadId": "string",
        "attachment": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "path": "string",
            "thumbnail": "string",
            "mime": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "group": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "party": "string",
            "type": "from",
            "isImportant": true,
            "storage": "inbox",
            "visibility": "new",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "threadId": "string",
            "message": {},
            "thread": {}
          }
        ],
        "meta": [
          {
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "key": "string",
            "value": "string",
            "extId": "string",
            "extMetadata": {},
            "messageId": "string",
            "message": {}
          }
        ],
        "thread": {}
      }
    ],
    "group": [
      {
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "party": "string",
        "type": "from",
        "isImportant": true,
        "storage": "inbox",
        "visibility": "new",
        "extId": "string",
        "extMetadata": {},
        "messageId": "string",
        "threadId": "string",
        "message": {
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "sender": "string",
          "subject": "string",
          "body": "string",
          "status": "draft",
          "extId": "string",
          "extMetadata": {},
          "threadId": "string",
          "attachment": [
            {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "path": "string",
              "thumbnail": "string",
              "mime": "string",
              "extId": "string",
              "extMetadata": {},
              "messageId": "string",
              "message": {}
            }
          ],
          "group": [
            {}
          ],
          "meta": [
            {
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "key": "string",
              "value": "string",
              "extId": "string",
              "extMetadata": {},
              "messageId": "string",
              "message": {}
            }
          ],
          "thread": {}
        },
        "thread": {}
      }
    ]
  }
}

```

MessageExcluding_deleted_WithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|sender|string|true|none|none|
|subject|string|true|none|none|
|body|string|true|none|none|
|status|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|threadId|string|false|none|none|
|attachment|[[AttachmentExcluding_deleted_WithRelations](#schemaattachmentexcluding_deleted_withrelations)]|false|none|[(tsType: Omit<AttachmentWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })]|
|group|[[GroupExcluding_deleted_WithRelations](#schemagroupexcluding_deleted_withrelations)]|false|none|[(tsType: Omit<GroupWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })]|
|meta|[[MetaExcluding_deleted_WithRelations](#schemametaexcluding_deleted_withrelations)]|false|none|[(tsType: Omit<MetaWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })]|
|thread|[ThreadExcluding_deleted_WithRelations](#schemathreadexcluding_deleted_withrelations)|false|none|(tsType: Omit<ThreadWithRelations, 'deleted'>, schemaOptions: { exclude: [ 'deleted' ], includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|status|draft|
|status|send|

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
  "sender": "string",
  "subject": "string",
  "body": "string",
  "status": "draft",
  "extId": "string",
  "extMetadata": {},
  "threadId": "string"
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
|sender|string|true|none|none|
|subject|string|true|none|none|
|body|string|true|none|none|
|status|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|threadId|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|draft|
|status|send|

<h2 id="tocS_PingResponse">PingResponse</h2>
<!-- backwards compatibility -->
<a id="schemapingresponse"></a>
<a id="schema_PingResponse"></a>
<a id="tocSpingresponse"></a>
<a id="tocspingresponse"></a>

```json
{
  "greeting": "string",
  "date": "string",
  "url": "string",
  "headers": {
    "Content-Type": "string"
  }
}

```

PingResponse

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|greeting|string|false|none|none|
|date|string|false|none|none|
|url|string|false|none|none|
|headers|object|false|none|none|
|» Content-Type|string|false|none|none|

<h2 id="tocS_Thread">Thread</h2>
<!-- backwards compatibility -->
<a id="schemathread"></a>
<a id="schema_Thread"></a>
<a id="tocSthread"></a>
<a id="tocsthread"></a>

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
  "subject": "string",
  "messageCounts": 0,
  "extId": "string",
  "extMetadata": {}
}

```

Thread

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
|subject|string|true|none|none|
|messageCounts|number|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

