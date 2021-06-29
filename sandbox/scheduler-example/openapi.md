---
title: Scheduler Service v1.0.0
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

<h1 id="scheduler-service">Scheduler Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

scheduler-example

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>


# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="scheduler-service-attachmentcontroller">AttachmentController</h1>

## AttachmentController.count

<a id="opIdAttachmentController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/attachments/count',
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

`GET /attachments/count`

<h3 id="attachmentcontroller.count-parameters">Parameters</h3>

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

<h3 id="attachmentcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attachment model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentController.replaceById

<a id="opIdAttachmentController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/attachments/{id}',
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

`PUT /attachments/{id}`

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attachmentcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Attachment](#schemaattachment)|false|none|

<h3 id="attachmentcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Attachment PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentController.updateById

<a id="opIdAttachmentController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/attachments/{id}',
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

`PATCH /attachments/{id}`

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attachmentcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[AttachmentPartial](#schemaattachmentpartial)|false|none|

<h3 id="attachmentcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Attachment PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentController.findById

<a id="opIdAttachmentController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/attachments/{id}',
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

`GET /attachments/{id}`

<h3 id="attachmentcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[attachments.Filter](#schemaattachments.filter)|false|none|

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {},
  "event": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {}
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    },
    "parentEvent": {},
    "attendees": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "identifier": "string",
        "isOptional": true,
        "isOrganizer": true,
        "messages": "string",
        "responseStatus": "needsAction",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
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
        "fileUrl": "string",
        "iconLink": "string",
        "mimeType": "string",
        "title": "string",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
      }
    ]
  }
}
```

<h3 id="attachmentcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attachment model instance|[AttachmentWithRelations](#schemaattachmentwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentController.deleteById

<a id="opIdAttachmentController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/attachments/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /attachments/{id}`

<h3 id="attachmentcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="attachmentcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Attachment DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentController.create

<a id="opIdAttachmentController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/attachments',
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

`POST /attachments`

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attachmentcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewAttachment](#schemanewattachment)|false|none|

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attachmentcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attachment model instance|[Attachment](#schemaattachment)|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentController.updateAll

<a id="opIdAttachmentController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/attachments',
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

`PATCH /attachments`

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attachmentcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[AttachmentPartial](#schemaattachmentpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="attachmentcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attachment PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## AttachmentController.find

<a id="opIdAttachmentController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/attachments',
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

`GET /attachments`

<h3 id="attachmentcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[attachments.Filter1](#schemaattachments.filter1)|false|none|

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
    "fileUrl": "string",
    "iconLink": "string",
    "mimeType": "string",
    "title": "string",
    "eventId": "string",
    "extId": "string",
    "extMetadata": {},
    "event": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "calendarId": "string",
      "parentEventId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [
          {}
        ],
        "workingHours": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "dayOfWeek": 0,
            "end": "string",
            "start": "string",
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ],
        "subscriptions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "accessRole": "freeBusyReader",
            "bgColor": "string",
            "fgColor": "string",
            "isHidden": true,
            "isPrimary": true,
            "identifier": "string",
            "defaultReminders": {},
            "notificationSettings": {},
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ]
      },
      "parentEvent": {},
      "attendees": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "identifier": "string",
          "isOptional": true,
          "isOrganizer": true,
          "messages": "string",
          "responseStatus": "needsAction",
          "eventId": "string",
          "extId": "string",
          "extMetadata": {},
          "event": {}
        }
      ],
      "attachments": [
        {}
      ]
    }
  }
]
```

<h3 id="attachmentcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Attachment model instances|Inline|

<h3 id="attachmentcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|[(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })]|
|» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» fileUrl|string|true|none|none|
|»» iconLink|string|false|none|none|
|»» mimeType|string|false|none|none|
|»» title|string|false|none|none|
|»» eventId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|
|»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» bgColor|string|false|none|none|
|»»» description|string|false|none|none|
|»»» endDateTime|string(date-time)|false|none|none|
|»»» fgColor|string|false|none|none|
|»»» iCalUid|string|false|none|none|
|»»» isFullDayEvent|boolean|false|none|none|
|»»» isLocked|boolean|false|none|none|
|»»» link|string|false|none|none|
|»»» location|string|false|none|none|
|»»» meetingLink|string|false|none|none|
|»»» identifier|string|false|none|none|
|»»» startDateTime|string(date-time)|false|none|none|
|»»» status|string|false|none|none|
|»»» summary|string|false|none|none|
|»»» timezone|string|false|none|none|
|»»» calendarId|string|true|none|none|
|»»» parentEventId|string|false|none|none|
|»»» extId|string|false|none|none|
|»»» extMetadata|object|false|none|none|
|»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» source|string|false|none|none|
|»»»» enableWorkingHours|boolean|false|none|none|
|»»»» location|string|false|none|none|
|»»»» identifier|string|true|none|none|
|»»»» summary|string|false|none|none|
|»»»» timezone|string|false|none|none|
|»»»» extId|string|false|none|none|
|»»»» extMetadata|object|false|none|none|
|»»»» events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» dayOfWeek|number|false|none|none|
|»»»»»» end|string|false|none|none|
|»»»»»» start|string|false|none|none|
|»»»»»» calendarId|string|true|none|none|
|»»»»»» extId|string|false|none|none|
|»»»»»» extMetadata|object|false|none|none|
|»»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»» subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» accessRole|string|false|none|none|
|»»»»»» bgColor|string|false|none|none|
|»»»»»» fgColor|string|false|none|none|
|»»»»»» isHidden|boolean|false|none|none|
|»»»»»» isPrimary|boolean|false|none|none|
|»»»»»» identifier|string|true|none|none|
|»»»»»» defaultReminders|object|false|none|none|
|»»»»»» notificationSettings|object|false|none|none|
|»»»»»» calendarId|string|true|none|none|
|»»»»»» extId|string|false|none|none|
|»»»»»» extMetadata|object|false|none|none|
|»»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» identifier|string|true|none|none|
|»»»»» isOptional|boolean|false|none|none|
|»»»»» isOrganizer|boolean|false|none|none|
|»»»»» messages|string|false|none|none|
|»»»»» responseStatus|string|false|none|none|
|»»»»» eventId|string|true|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-attendeecontroller">AttendeeController</h1>

## AttendeeController.count

<a id="opIdAttendeeController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/attendees/count',
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

`GET /attendees/count`

<h3 id="attendeecontroller.count-parameters">Parameters</h3>

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

<h3 id="attendeecontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attendee model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## AttendeeController.replaceById

<a id="opIdAttendeeController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/attendees/{id}',
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

`PUT /attendees/{id}`

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attendeecontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Attendee](#schemaattendee)|false|none|

<h3 id="attendeecontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Attendee PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AttendeeController.updateById

<a id="opIdAttendeeController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/attendees/{id}',
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

`PATCH /attendees/{id}`

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attendeecontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[AttendeePartial](#schemaattendeepartial)|false|none|

<h3 id="attendeecontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Attendee PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AttendeeController.findById

<a id="opIdAttendeeController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/attendees/{id}',
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

`GET /attendees/{id}`

<h3 id="attendeecontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[attendees.Filter](#schemaattendees.filter)|false|none|

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {},
  "event": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {}
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    },
    "parentEvent": {},
    "attendees": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "identifier": "string",
        "isOptional": true,
        "isOrganizer": true,
        "messages": "string",
        "responseStatus": "needsAction",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
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
        "fileUrl": "string",
        "iconLink": "string",
        "mimeType": "string",
        "title": "string",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
      }
    ]
  }
}
```

<h3 id="attendeecontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attendee model instance|[AttendeeWithRelations](#schemaattendeewithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## AttendeeController.deleteById

<a id="opIdAttendeeController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/attendees/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /attendees/{id}`

<h3 id="attendeecontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="attendeecontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Attendee DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## AttendeeController.create

<a id="opIdAttendeeController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/attendees',
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

`POST /attendees`

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attendeecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewAttendee](#schemanewattendee)|false|none|

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attendeecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attendee model instance|[Attendee](#schemaattendee)|

<aside class="success">
This operation does not require authentication
</aside>

## AttendeeController.updateAll

<a id="opIdAttendeeController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/attendees',
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

`PATCH /attendees`

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="attendeecontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[AttendeePartial](#schemaattendeepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="attendeecontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Attendee PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## AttendeeController.find

<a id="opIdAttendeeController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/attendees',
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

`GET /attendees`

<h3 id="attendeecontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[attendees.Filter1](#schemaattendees.filter1)|false|none|

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
    "identifier": "string",
    "isOptional": true,
    "isOrganizer": true,
    "messages": "string",
    "responseStatus": "needsAction",
    "eventId": "string",
    "extId": "string",
    "extMetadata": {},
    "event": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "calendarId": "string",
      "parentEventId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [
          {}
        ],
        "workingHours": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "dayOfWeek": 0,
            "end": "string",
            "start": "string",
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ],
        "subscriptions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "accessRole": "freeBusyReader",
            "bgColor": "string",
            "fgColor": "string",
            "isHidden": true,
            "isPrimary": true,
            "identifier": "string",
            "defaultReminders": {},
            "notificationSettings": {},
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ]
      },
      "parentEvent": {},
      "attendees": [
        {}
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
          "fileUrl": "string",
          "iconLink": "string",
          "mimeType": "string",
          "title": "string",
          "eventId": "string",
          "extId": "string",
          "extMetadata": {},
          "event": {}
        }
      ]
    }
  }
]
```

<h3 id="attendeecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Attendee model instances|Inline|

<h3 id="attendeecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|[(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })]|
|» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» identifier|string|true|none|none|
|»» isOptional|boolean|false|none|none|
|»» isOrganizer|boolean|false|none|none|
|»» messages|string|false|none|none|
|»» responseStatus|string|false|none|none|
|»» eventId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|
|»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» bgColor|string|false|none|none|
|»»» description|string|false|none|none|
|»»» endDateTime|string(date-time)|false|none|none|
|»»» fgColor|string|false|none|none|
|»»» iCalUid|string|false|none|none|
|»»» isFullDayEvent|boolean|false|none|none|
|»»» isLocked|boolean|false|none|none|
|»»» link|string|false|none|none|
|»»» location|string|false|none|none|
|»»» meetingLink|string|false|none|none|
|»»» identifier|string|false|none|none|
|»»» startDateTime|string(date-time)|false|none|none|
|»»» status|string|false|none|none|
|»»» summary|string|false|none|none|
|»»» timezone|string|false|none|none|
|»»» calendarId|string|true|none|none|
|»»» parentEventId|string|false|none|none|
|»»» extId|string|false|none|none|
|»»» extMetadata|object|false|none|none|
|»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» source|string|false|none|none|
|»»»» enableWorkingHours|boolean|false|none|none|
|»»»» location|string|false|none|none|
|»»»» identifier|string|true|none|none|
|»»»» summary|string|false|none|none|
|»»»» timezone|string|false|none|none|
|»»»» extId|string|false|none|none|
|»»»» extMetadata|object|false|none|none|
|»»»» events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» dayOfWeek|number|false|none|none|
|»»»»»» end|string|false|none|none|
|»»»»»» start|string|false|none|none|
|»»»»»» calendarId|string|true|none|none|
|»»»»»» extId|string|false|none|none|
|»»»»»» extMetadata|object|false|none|none|
|»»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»» subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» accessRole|string|false|none|none|
|»»»»»» bgColor|string|false|none|none|
|»»»»»» fgColor|string|false|none|none|
|»»»»»» isHidden|boolean|false|none|none|
|»»»»»» isPrimary|boolean|false|none|none|
|»»»»»» identifier|string|true|none|none|
|»»»»»» defaultReminders|object|false|none|none|
|»»»»»» notificationSettings|object|false|none|none|
|»»»»»» calendarId|string|true|none|none|
|»»»»»» extId|string|false|none|none|
|»»»»»» extMetadata|object|false|none|none|
|»»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»» attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» fileUrl|string|true|none|none|
|»»»»» iconLink|string|false|none|none|
|»»»»» mimeType|string|false|none|none|
|»»»»» title|string|false|none|none|
|»»»»» eventId|string|true|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-calendarcontroller">CalendarController</h1>

## CalendarController.createWithSubscription

<a id="opIdCalendarController.createWithSubscription"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/calendarSubscription',
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

`POST /calendars/calendarSubscription`

> Body parameter

```json
{
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
}
```

<h3 id="calendarcontroller.createwithsubscription-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewCalendar](#schemanewcalendar)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
}
```

<h3 id="calendarcontroller.createwithsubscription-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar model instance|[CalendarDTO](#schemacalendardto)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.count

<a id="opIdCalendarController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/count',
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

`GET /calendars/count`

<h3 id="calendarcontroller.count-parameters">Parameters</h3>

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

<h3 id="calendarcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.replaceById

<a id="opIdCalendarController.replaceById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "id": "string",
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/calendars/{id}',
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

`PUT /calendars/{id}`

> Body parameter

```json
{
  "id": "string",
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
}
```

<h3 id="calendarcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[CalendarDTO](#schemacalendardto)|false|none|

<h3 id="calendarcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Calendar PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.updateById

<a id="opIdCalendarController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/calendars/{id}',
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

`PATCH /calendars/{id}`

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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[CalendarPartial](#schemacalendarpartial)|false|none|

<h3 id="calendarcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Calendar PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.findById

<a id="opIdCalendarController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}',
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

`GET /calendars/{id}`

<h3 id="calendarcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[calendars.Filter](#schemacalendars.filter)|false|none|

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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "events": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "calendarId": "string",
      "parentEventId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [],
        "workingHours": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "dayOfWeek": 0,
            "end": "string",
            "start": "string",
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ],
        "subscriptions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "accessRole": "freeBusyReader",
            "bgColor": "string",
            "fgColor": "string",
            "isHidden": true,
            "isPrimary": true,
            "identifier": "string",
            "defaultReminders": {},
            "notificationSettings": {},
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ]
      },
      "parentEvent": {},
      "attendees": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "identifier": "string",
          "isOptional": true,
          "isOrganizer": true,
          "messages": "string",
          "responseStatus": "needsAction",
          "eventId": "string",
          "extId": "string",
          "extMetadata": {},
          "event": {}
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
          "fileUrl": "string",
          "iconLink": "string",
          "mimeType": "string",
          "title": "string",
          "eventId": "string",
          "extId": "string",
          "extMetadata": {},
          "event": {}
        }
      ]
    }
  ],
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "bgColor": "string",
            "description": "string",
            "endDateTime": "2019-08-24T14:15:22Z",
            "fgColor": "string",
            "iCalUid": "string",
            "isFullDayEvent": true,
            "isLocked": true,
            "link": "string",
            "location": "string",
            "meetingLink": "string",
            "identifier": "string",
            "startDateTime": "2019-08-24T14:15:22Z",
            "status": "confirmed",
            "summary": "string",
            "timezone": "string",
            "calendarId": "string",
            "parentEventId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {},
            "parentEvent": {},
            "attendees": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "identifier": "string",
                "isOptional": true,
                "isOrganizer": true,
                "messages": "string",
                "responseStatus": "needsAction",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
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
                "fileUrl": "string",
                "iconLink": "string",
                "mimeType": "string",
                "title": "string",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
              }
            ]
          }
        ],
        "workingHours": [],
        "subscriptions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "accessRole": "freeBusyReader",
            "bgColor": "string",
            "fgColor": "string",
            "isHidden": true,
            "isPrimary": true,
            "identifier": "string",
            "defaultReminders": {},
            "notificationSettings": {},
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ]
      }
    }
  ],
  "subscriptions": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "accessRole": "freeBusyReader",
      "bgColor": "string",
      "fgColor": "string",
      "isHidden": true,
      "isPrimary": true,
      "identifier": "string",
      "defaultReminders": {},
      "notificationSettings": {},
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "bgColor": "string",
            "description": "string",
            "endDateTime": "2019-08-24T14:15:22Z",
            "fgColor": "string",
            "iCalUid": "string",
            "isFullDayEvent": true,
            "isLocked": true,
            "link": "string",
            "location": "string",
            "meetingLink": "string",
            "identifier": "string",
            "startDateTime": "2019-08-24T14:15:22Z",
            "status": "confirmed",
            "summary": "string",
            "timezone": "string",
            "calendarId": "string",
            "parentEventId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {},
            "parentEvent": {},
            "attendees": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "identifier": "string",
                "isOptional": true,
                "isOrganizer": true,
                "messages": "string",
                "responseStatus": "needsAction",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
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
                "fileUrl": "string",
                "iconLink": "string",
                "mimeType": "string",
                "title": "string",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
              }
            ]
          }
        ],
        "workingHours": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "dayOfWeek": 0,
            "end": "string",
            "start": "string",
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ],
        "subscriptions": []
      }
    }
  ]
}
```

<h3 id="calendarcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar model instance|[CalendarWithRelations](#schemacalendarwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.deleteById

<a id="opIdCalendarController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/calendars/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /calendars/{id}`

<h3 id="calendarcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="calendarcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Calendar DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.create

<a id="opIdCalendarController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars',
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

`POST /calendars`

> Body parameter

```json
{
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
}
```

<h3 id="calendarcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewCalendar](#schemanewcalendar)|false|none|

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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar model instance|[Calendar](#schemacalendar)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.updateAll

<a id="opIdCalendarController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars',
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

`PATCH /calendars`

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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[CalendarPartial](#schemacalendarpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="calendarcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarController.find

<a id="opIdCalendarController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars',
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

`GET /calendars`

<h3 id="calendarcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[calendars.Filter1](#schemacalendars.filter1)|false|none|

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
    "source": "string",
    "enableWorkingHours": true,
    "location": "string",
    "identifier": "string",
    "summary": "string",
    "timezone": "string",
    "extId": "string",
    "extMetadata": {},
    "events": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {},
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
    ],
    "workingHours": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "dayOfWeek": 0,
        "end": "string",
        "start": "string",
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ],
    "subscriptions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "accessRole": "freeBusyReader",
        "bgColor": "string",
        "fgColor": "string",
        "isHidden": true,
        "isPrimary": true,
        "identifier": "string",
        "defaultReminders": {},
        "notificationSettings": {},
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ]
  }
]
```

<h3 id="calendarcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Calendar model instances|Inline|

<h3 id="calendarcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[CalendarWithRelations](#schemacalendarwithrelations)]|false|none|[(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })]|
|» CalendarWithRelations|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» source|string|false|none|none|
|»» enableWorkingHours|boolean|false|none|none|
|»» location|string|false|none|none|
|»» identifier|string|true|none|none|
|»» summary|string|false|none|none|
|»» timezone|string|false|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|
|»» events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» bgColor|string|false|none|none|
|»»»» description|string|false|none|none|
|»»»» endDateTime|string(date-time)|false|none|none|
|»»»» fgColor|string|false|none|none|
|»»»» iCalUid|string|false|none|none|
|»»»» isFullDayEvent|boolean|false|none|none|
|»»»» isLocked|boolean|false|none|none|
|»»»» link|string|false|none|none|
|»»»» location|string|false|none|none|
|»»»» meetingLink|string|false|none|none|
|»»»» identifier|string|false|none|none|
|»»»» startDateTime|string(date-time)|false|none|none|
|»»»» status|string|false|none|none|
|»»»» summary|string|false|none|none|
|»»»» timezone|string|false|none|none|
|»»»» calendarId|string|true|none|none|
|»»»» parentEventId|string|false|none|none|
|»»»» extId|string|false|none|none|
|»»»» extMetadata|object|false|none|none|
|»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»» parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» identifier|string|true|none|none|
|»»»»»» isOptional|boolean|false|none|none|
|»»»»»» isOrganizer|boolean|false|none|none|
|»»»»»» messages|string|false|none|none|
|»»»»»» responseStatus|string|false|none|none|
|»»»»»» eventId|string|true|none|none|
|»»»»»» extId|string|false|none|none|
|»»»»»» extMetadata|object|false|none|none|
|»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» fileUrl|string|true|none|none|
|»»»»»» iconLink|string|false|none|none|
|»»»»»» mimeType|string|false|none|none|
|»»»»»» title|string|false|none|none|
|»»»»»» eventId|string|true|none|none|
|»»»»»» extId|string|false|none|none|
|»»»»»» extMetadata|object|false|none|none|
|»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»» workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» dayOfWeek|number|false|none|none|
|»»»» end|string|false|none|none|
|»»»» start|string|false|none|none|
|»»»» calendarId|string|true|none|none|
|»»»» extId|string|false|none|none|
|»»»» extMetadata|object|false|none|none|
|»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»» subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» accessRole|string|false|none|none|
|»»»» bgColor|string|false|none|none|
|»»»» fgColor|string|false|none|none|
|»»»» isHidden|boolean|false|none|none|
|»»»» isPrimary|boolean|false|none|none|
|»»»» identifier|string|true|none|none|
|»»»» defaultReminders|object|false|none|none|
|»»»» notificationSettings|object|false|none|none|
|»»»» calendarId|string|true|none|none|
|»»»» extId|string|false|none|none|
|»»»» extMetadata|object|false|none|none|
|»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-subscriptioncontroller">SubscriptionController</h1>

## SubscriptionController.findMe

<a id="opIdSubscriptionController.findMe"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/subscriptions/me',
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

`GET /calendars/subscriptions/me`

<h3 id="subscriptioncontroller.findme-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[subscriptions.Filter](#schemasubscriptions.filter)|false|none|

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
    "accessRole": "freeBusyReader",
    "bgColor": "string",
    "fgColor": "string",
    "isHidden": true,
    "isPrimary": true,
    "identifier": "string",
    "defaultReminders": {},
    "notificationSettings": {},
    "calendarId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "bgColor": "string",
          "description": "string",
          "endDateTime": "2019-08-24T14:15:22Z",
          "fgColor": "string",
          "iCalUid": "string",
          "isFullDayEvent": true,
          "isLocked": true,
          "link": "string",
          "location": "string",
          "meetingLink": "string",
          "identifier": "string",
          "startDateTime": "2019-08-24T14:15:22Z",
          "status": "confirmed",
          "summary": "string",
          "timezone": "string",
          "calendarId": "string",
          "parentEventId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {},
          "parentEvent": {},
          "attendees": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "identifier": "string",
              "isOptional": true,
              "isOrganizer": true,
              "messages": "string",
              "responseStatus": "needsAction",
              "eventId": "string",
              "extId": "string",
              "extMetadata": {},
              "event": {}
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
              "fileUrl": "string",
              "iconLink": "string",
              "mimeType": "string",
              "title": "string",
              "eventId": "string",
              "extId": "string",
              "extMetadata": {},
              "event": {}
            }
          ]
        }
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {}
      ]
    }
  }
]
```

<h3 id="subscriptioncontroller.findme-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Subscription model instances|Inline|

<h3 id="subscriptioncontroller.findme-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|[(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })]|
|» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» accessRole|string|false|none|none|
|»» bgColor|string|false|none|none|
|»» fgColor|string|false|none|none|
|»» isHidden|boolean|false|none|none|
|»» isPrimary|boolean|false|none|none|
|»» identifier|string|true|none|none|
|»» defaultReminders|object|false|none|none|
|»» notificationSettings|object|false|none|none|
|»» calendarId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|
|»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» source|string|false|none|none|
|»»» enableWorkingHours|boolean|false|none|none|
|»»» location|string|false|none|none|
|»»» identifier|string|true|none|none|
|»»» summary|string|false|none|none|
|»»» timezone|string|false|none|none|
|»»» extId|string|false|none|none|
|»»» extMetadata|object|false|none|none|
|»»» events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» bgColor|string|false|none|none|
|»»»»» description|string|false|none|none|
|»»»»» endDateTime|string(date-time)|false|none|none|
|»»»»» fgColor|string|false|none|none|
|»»»»» iCalUid|string|false|none|none|
|»»»»» isFullDayEvent|boolean|false|none|none|
|»»»»» isLocked|boolean|false|none|none|
|»»»»» link|string|false|none|none|
|»»»»» location|string|false|none|none|
|»»»»» meetingLink|string|false|none|none|
|»»»»» identifier|string|false|none|none|
|»»»»» startDateTime|string(date-time)|false|none|none|
|»»»»» status|string|false|none|none|
|»»»»» summary|string|false|none|none|
|»»»»» timezone|string|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» parentEventId|string|false|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» identifier|string|true|none|none|
|»»»»»»» isOptional|boolean|false|none|none|
|»»»»»»» isOrganizer|boolean|false|none|none|
|»»»»»»» messages|string|false|none|none|
|»»»»»»» responseStatus|string|false|none|none|
|»»»»»»» eventId|string|true|none|none|
|»»»»»»» extId|string|false|none|none|
|»»»»»»» extMetadata|object|false|none|none|
|»»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» fileUrl|string|true|none|none|
|»»»»»»» iconLink|string|false|none|none|
|»»»»»»» mimeType|string|false|none|none|
|»»»»»»» title|string|false|none|none|
|»»»»»»» eventId|string|true|none|none|
|»»»»»»» extId|string|false|none|none|
|»»»»»»» extMetadata|object|false|none|none|
|»»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» dayOfWeek|number|false|none|none|
|»»»»» end|string|false|none|none|
|»»»»» start|string|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.count

<a id="opIdSubscriptionController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/subscriptions/count',
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

`GET /subscriptions/count`

<h3 id="subscriptioncontroller.count-parameters">Parameters</h3>

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

<h3 id="subscriptioncontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.replaceById

<a id="opIdSubscriptionController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/subscriptions/{id}',
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

`PUT /subscriptions/{id}`

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="subscriptioncontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Subscription](#schemasubscription)|false|none|

<h3 id="subscriptioncontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Subscription PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.updateById

<a id="opIdSubscriptionController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/subscriptions/{id}',
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

`PATCH /subscriptions/{id}`

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="subscriptioncontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[SubscriptionPartial](#schemasubscriptionpartial)|false|none|

<h3 id="subscriptioncontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Subscription PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.findById

<a id="opIdSubscriptionController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/subscriptions/{id}',
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

`GET /subscriptions/{id}`

<h3 id="subscriptioncontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[subscriptions.Filter1](#schemasubscriptions.filter1)|false|none|

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {},
  "calendar": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "source": "string",
    "enableWorkingHours": true,
    "location": "string",
    "identifier": "string",
    "summary": "string",
    "timezone": "string",
    "extId": "string",
    "extMetadata": {},
    "events": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {},
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
    ],
    "workingHours": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "dayOfWeek": 0,
        "end": "string",
        "start": "string",
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ],
    "subscriptions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "accessRole": "freeBusyReader",
        "bgColor": "string",
        "fgColor": "string",
        "isHidden": true,
        "isPrimary": true,
        "identifier": "string",
        "defaultReminders": {},
        "notificationSettings": {},
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ]
  }
}
```

<h3 id="subscriptioncontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription model instance|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.deleteById

<a id="opIdSubscriptionController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/subscriptions/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /subscriptions/{id}`

<h3 id="subscriptioncontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="subscriptioncontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Subscription DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.create

<a id="opIdSubscriptionController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/subscriptions',
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

`POST /subscriptions`

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="subscriptioncontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewSubscription](#schemanewsubscription)|false|none|

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="subscriptioncontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription model instance|[Subscription](#schemasubscription)|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.updateAll

<a id="opIdSubscriptionController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/subscriptions',
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

`PATCH /subscriptions`

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="subscriptioncontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[SubscriptionPartial](#schemasubscriptionpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="subscriptioncontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## SubscriptionController.find

<a id="opIdSubscriptionController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/subscriptions',
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

`GET /subscriptions`

<h3 id="subscriptioncontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[subscriptions.Filter](#schemasubscriptions.filter)|false|none|

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
    "accessRole": "freeBusyReader",
    "bgColor": "string",
    "fgColor": "string",
    "isHidden": true,
    "isPrimary": true,
    "identifier": "string",
    "defaultReminders": {},
    "notificationSettings": {},
    "calendarId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "bgColor": "string",
          "description": "string",
          "endDateTime": "2019-08-24T14:15:22Z",
          "fgColor": "string",
          "iCalUid": "string",
          "isFullDayEvent": true,
          "isLocked": true,
          "link": "string",
          "location": "string",
          "meetingLink": "string",
          "identifier": "string",
          "startDateTime": "2019-08-24T14:15:22Z",
          "status": "confirmed",
          "summary": "string",
          "timezone": "string",
          "calendarId": "string",
          "parentEventId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {},
          "parentEvent": {},
          "attendees": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "identifier": "string",
              "isOptional": true,
              "isOrganizer": true,
              "messages": "string",
              "responseStatus": "needsAction",
              "eventId": "string",
              "extId": "string",
              "extMetadata": {},
              "event": {}
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
              "fileUrl": "string",
              "iconLink": "string",
              "mimeType": "string",
              "title": "string",
              "eventId": "string",
              "extId": "string",
              "extMetadata": {},
              "event": {}
            }
          ]
        }
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {}
      ]
    }
  }
]
```

<h3 id="subscriptioncontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Subscription model instances|Inline|

<h3 id="subscriptioncontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|[(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })]|
|» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» accessRole|string|false|none|none|
|»» bgColor|string|false|none|none|
|»» fgColor|string|false|none|none|
|»» isHidden|boolean|false|none|none|
|»» isPrimary|boolean|false|none|none|
|»» identifier|string|true|none|none|
|»» defaultReminders|object|false|none|none|
|»» notificationSettings|object|false|none|none|
|»» calendarId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|
|»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» source|string|false|none|none|
|»»» enableWorkingHours|boolean|false|none|none|
|»»» location|string|false|none|none|
|»»» identifier|string|true|none|none|
|»»» summary|string|false|none|none|
|»»» timezone|string|false|none|none|
|»»» extId|string|false|none|none|
|»»» extMetadata|object|false|none|none|
|»»» events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» bgColor|string|false|none|none|
|»»»»» description|string|false|none|none|
|»»»»» endDateTime|string(date-time)|false|none|none|
|»»»»» fgColor|string|false|none|none|
|»»»»» iCalUid|string|false|none|none|
|»»»»» isFullDayEvent|boolean|false|none|none|
|»»»»» isLocked|boolean|false|none|none|
|»»»»» link|string|false|none|none|
|»»»»» location|string|false|none|none|
|»»»»» meetingLink|string|false|none|none|
|»»»»» identifier|string|false|none|none|
|»»»»» startDateTime|string(date-time)|false|none|none|
|»»»»» status|string|false|none|none|
|»»»»» summary|string|false|none|none|
|»»»»» timezone|string|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» parentEventId|string|false|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» identifier|string|true|none|none|
|»»»»»»» isOptional|boolean|false|none|none|
|»»»»»»» isOrganizer|boolean|false|none|none|
|»»»»»»» messages|string|false|none|none|
|»»»»»»» responseStatus|string|false|none|none|
|»»»»»»» eventId|string|true|none|none|
|»»»»»»» extId|string|false|none|none|
|»»»»»»» extMetadata|object|false|none|none|
|»»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» fileUrl|string|true|none|none|
|»»»»»»» iconLink|string|false|none|none|
|»»»»»»» mimeType|string|false|none|none|
|»»»»»»» title|string|false|none|none|
|»»»»»»» eventId|string|true|none|none|
|»»»»»»» extId|string|false|none|none|
|»»»»»»» extMetadata|object|false|none|none|
|»»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» dayOfWeek|number|false|none|none|
|»»»»» end|string|false|none|none|
|»»»»» start|string|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-calendareventcontroller">CalendarEventController</h1>

## CalendarEventController.create

<a id="opIdCalendarEventController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/events',
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

`POST /calendars/{id}/events`

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendareventcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewEventInCalendar](#schemaneweventincalendar)|false|none|

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendareventcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar model instance|[Event](#schemaevent)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarEventController.patch

<a id="opIdCalendarEventController.patch"></a>

> Code samples

```'javascript--nodejs
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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/events',
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

`PATCH /calendars/{id}/events`

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendareventcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[EventPartial](#schemaeventpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="calendareventcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar.Event PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarEventController.find

<a id="opIdCalendarEventController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/events',
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

`GET /calendars/{id}/events`

<h3 id="calendareventcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|
|timeMax|query|string(date-time)|false|none|
|timeMin|query|string(date-time)|false|none|

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
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="calendareventcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Calendar has many Event|Inline|

<h3 id="calendareventcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Event](#schemaevent)]|false|none|none|
|» Event|[Event](#schemaevent)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» bgColor|string|false|none|none|
|»» description|string|false|none|none|
|»» endDateTime|string(date-time)|false|none|none|
|»» fgColor|string|false|none|none|
|»» iCalUid|string|false|none|none|
|»» isFullDayEvent|boolean|false|none|none|
|»» isLocked|boolean|false|none|none|
|»» link|string|false|none|none|
|»» location|string|false|none|none|
|»» meetingLink|string|false|none|none|
|»» identifier|string|false|none|none|
|»» startDateTime|string(date-time)|false|none|none|
|»» status|string|false|none|none|
|»» summary|string|false|none|none|
|»» timezone|string|false|none|none|
|»» calendarId|string|true|none|none|
|»» parentEventId|string|false|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarEventController.delete

<a id="opIdCalendarEventController.delete"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/events',
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

`DELETE /calendars/{id}/events`

<h3 id="calendareventcontroller.delete-parameters">Parameters</h3>

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

<h3 id="calendareventcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar.Event DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-calendarsubscriptioncontroller">CalendarSubscriptionController</h1>

## CalendarSubscriptionController.create

<a id="opIdCalendarSubscriptionController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/subscriptions',
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

`POST /calendars/{id}/subscriptions`

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarsubscriptioncontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewSubscriptionInCalendar](#schemanewsubscriptionincalendar)|false|none|

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarsubscriptioncontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar model instance|[Subscription](#schemasubscription)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarSubscriptionController.patch

<a id="opIdCalendarSubscriptionController.patch"></a>

> Code samples

```'javascript--nodejs
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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/subscriptions',
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

`PATCH /calendars/{id}/subscriptions`

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarsubscriptioncontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[SubscriptionPartial](#schemasubscriptionpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="calendarsubscriptioncontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar.Subscription PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarSubscriptionController.find

<a id="opIdCalendarSubscriptionController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/subscriptions',
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

`GET /calendars/{id}/subscriptions`

<h3 id="calendarsubscriptioncontroller.find-parameters">Parameters</h3>

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
    "accessRole": "freeBusyReader",
    "bgColor": "string",
    "fgColor": "string",
    "isHidden": true,
    "isPrimary": true,
    "identifier": "string",
    "defaultReminders": {},
    "notificationSettings": {},
    "calendarId": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="calendarsubscriptioncontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Calendar has many Subscriptions|Inline|

<h3 id="calendarsubscriptioncontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Subscription](#schemasubscription)]|false|none|none|
|» Subscription|[Subscription](#schemasubscription)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» accessRole|string|false|none|none|
|»» bgColor|string|false|none|none|
|»» fgColor|string|false|none|none|
|»» isHidden|boolean|false|none|none|
|»» isPrimary|boolean|false|none|none|
|»» identifier|string|true|none|none|
|»» defaultReminders|object|false|none|none|
|»» notificationSettings|object|false|none|none|
|»» calendarId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarSubscriptionController.delete

<a id="opIdCalendarSubscriptionController.delete"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/subscriptions',
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

`DELETE /calendars/{id}/subscriptions`

<h3 id="calendarsubscriptioncontroller.delete-parameters">Parameters</h3>

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

<h3 id="calendarsubscriptioncontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar.Subscription DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-calendarworkinghourcontroller">CalendarWorkingHourController</h1>

## CalendarWorkingHourController.create

<a id="opIdCalendarWorkingHourController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/working-hours',
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

`POST /calendars/{id}/working-hours`

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarworkinghourcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewWorkingHourInCalendar](#schemanewworkinghourincalendar)|false|none|

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarworkinghourcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar model instance|[WorkingHour](#schemaworkinghour)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarWorkingHourController.patch

<a id="opIdCalendarWorkingHourController.patch"></a>

> Code samples

```'javascript--nodejs
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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/working-hours',
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

`PATCH /calendars/{id}/working-hours`

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="calendarworkinghourcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[WorkingHourPartial](#schemaworkinghourpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="calendarworkinghourcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar.WorkingHour PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarWorkingHourController.find

<a id="opIdCalendarWorkingHourController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/working-hours',
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

`GET /calendars/{id}/working-hours`

<h3 id="calendarworkinghourcontroller.find-parameters">Parameters</h3>

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
    "dayOfWeek": 0,
    "end": "string",
    "start": "string",
    "calendarId": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="calendarworkinghourcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Calendar has many WorkingHour|Inline|

<h3 id="calendarworkinghourcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[WorkingHour](#schemaworkinghour)]|false|none|none|
|» WorkingHour|[WorkingHour](#schemaworkinghour)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» dayOfWeek|number|false|none|none|
|»» end|string|false|none|none|
|»» start|string|false|none|none|
|»» calendarId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<aside class="success">
This operation does not require authentication
</aside>

## CalendarWorkingHourController.delete

<a id="opIdCalendarWorkingHourController.delete"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/calendars/{id}/working-hours',
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

`DELETE /calendars/{id}/working-hours`

<h3 id="calendarworkinghourcontroller.delete-parameters">Parameters</h3>

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

<h3 id="calendarworkinghourcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Calendar.WorkingHour DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-eventcontroller">EventController</h1>

## EventController.count

<a id="opIdEventController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/count',
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

<aside class="success">
This operation does not require authentication
</aside>

## EventController.getFeeBusyStatus

<a id="opIdEventController.getFeeBusyStatus"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "timeMax": "2019-08-24T14:15:22Z",
  "timeMin": "2019-08-24T14:15:22Z",
  "items": [
    {
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "extId": "string",
      "extMetadata": {},
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "attendeeId": "string",
      "isOptional": true,
      "attendeeIdentifier": "string",
      "isOrganizer": true,
      "messages": "string",
      "eventId": "string"
    }
  ]
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/events/freeBusy',
{
  method: 'GET',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /events/freeBusy`

> Body parameter

```json
{
  "timeMax": "2019-08-24T14:15:22Z",
  "timeMin": "2019-08-24T14:15:22Z",
  "items": [
    {
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "extId": "string",
      "extMetadata": {},
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "attendeeId": "string",
      "isOptional": true,
      "attendeeIdentifier": "string",
      "isOrganizer": true,
      "messages": "string",
      "eventId": "string"
    }
  ]
}
```

<h3 id="eventcontroller.getfeebusystatus-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[FreeBusyRequest](#schemafreebusyrequest)|false|none|

<h3 id="eventcontroller.getfeebusystatus-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of EventController.getFeeBusyStatus|None|

<aside class="success">
This operation does not require authentication
</aside>

## EventController.replaceById

<a id="opIdEventController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/events/{id}',
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

`PUT /events/{id}`

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Event](#schemaevent)|false|none|

<h3 id="eventcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Event PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## EventController.updateById

<a id="opIdEventController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/events/{id}',
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

`PATCH /events/{id}`

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[EventPartial](#schemaeventpartial)|false|none|

<h3 id="eventcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Event PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## EventController.findById

<a id="opIdEventController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}',
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

<h3 id="eventcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[events.Filter](#schemaevents.filter)|false|none|

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {},
  "calendar": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "source": "string",
    "enableWorkingHours": true,
    "location": "string",
    "identifier": "string",
    "summary": "string",
    "timezone": "string",
    "extId": "string",
    "extMetadata": {},
    "events": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {},
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
    ],
    "workingHours": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "dayOfWeek": 0,
        "end": "string",
        "start": "string",
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ],
    "subscriptions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "accessRole": "freeBusyReader",
        "bgColor": "string",
        "fgColor": "string",
        "isHidden": true,
        "isPrimary": true,
        "identifier": "string",
        "defaultReminders": {},
        "notificationSettings": {},
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ]
  },
  "parentEvent": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {}
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    },
    "parentEvent": {},
    "attendees": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "identifier": "string",
        "isOptional": true,
        "isOrganizer": true,
        "messages": "string",
        "responseStatus": "needsAction",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
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
        "fileUrl": "string",
        "iconLink": "string",
        "mimeType": "string",
        "title": "string",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
      }
    ]
  },
  "attendees": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "identifier": "string",
      "isOptional": true,
      "isOrganizer": true,
      "messages": "string",
      "responseStatus": "needsAction",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {},
      "event": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "source": "string",
          "enableWorkingHours": true,
          "location": "string",
          "identifier": "string",
          "summary": "string",
          "timezone": "string",
          "extId": "string",
          "extMetadata": {},
          "events": [
            {}
          ],
          "workingHours": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "dayOfWeek": 0,
              "end": "string",
              "start": "string",
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ],
          "subscriptions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "accessRole": "freeBusyReader",
              "bgColor": "string",
              "fgColor": "string",
              "isHidden": true,
              "isPrimary": true,
              "identifier": "string",
              "defaultReminders": {},
              "notificationSettings": {},
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ]
        },
        "parentEvent": {},
        "attendees": [],
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
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
      "fileUrl": "string",
      "iconLink": "string",
      "mimeType": "string",
      "title": "string",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {},
      "event": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "source": "string",
          "enableWorkingHours": true,
          "location": "string",
          "identifier": "string",
          "summary": "string",
          "timezone": "string",
          "extId": "string",
          "extMetadata": {},
          "events": [
            {}
          ],
          "workingHours": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "dayOfWeek": 0,
              "end": "string",
              "start": "string",
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ],
          "subscriptions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "accessRole": "freeBusyReader",
              "bgColor": "string",
              "fgColor": "string",
              "isHidden": true,
              "isPrimary": true,
              "identifier": "string",
              "defaultReminders": {},
              "notificationSettings": {},
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ]
        },
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ],
        "attachments": []
      }
    }
  ]
}
```

<h3 id="eventcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event model instance|[EventWithRelations](#schemaeventwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## EventController.deleteById

<a id="opIdEventController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/events/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /events/{id}`

<h3 id="eventcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="eventcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Event DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## EventController.create

<a id="opIdEventController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "attachments": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "fileUrl": "string",
      "iconLink": "string",
      "mimeType": "string",
      "title": "string",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "attendees": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "identifier": "string",
      "isOptional": true,
      "isOrganizer": true,
      "messages": "string",
      "responseStatus": "needsAction",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/events',
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

`POST /events`

> Body parameter

```json
{
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "attachments": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "fileUrl": "string",
      "iconLink": "string",
      "mimeType": "string",
      "title": "string",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "attendees": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "identifier": "string",
      "isOptional": true,
      "isOrganizer": true,
      "messages": "string",
      "responseStatus": "needsAction",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewEvent](#schemanewevent)|false|none|

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event model instance|[Event](#schemaevent)|

<aside class="success">
This operation does not require authentication
</aside>

## EventController.updateAll

<a id="opIdEventController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/events',
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

`PATCH /events`

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[EventPartial](#schemaeventpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="eventcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## EventController.find

<a id="opIdEventController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/events',
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

<h3 id="eventcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[events_attendees_view.Filter](#schemaevents_attendees_view.filter)|false|none|

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
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {}
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    },
    "parentEvent": {},
    "attendees": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "identifier": "string",
        "isOptional": true,
        "isOrganizer": true,
        "messages": "string",
        "responseStatus": "needsAction",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
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
        "fileUrl": "string",
        "iconLink": "string",
        "mimeType": "string",
        "title": "string",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
      }
    ]
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
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» bgColor|string|false|none|none|
|»» description|string|false|none|none|
|»» endDateTime|string(date-time)|false|none|none|
|»» fgColor|string|false|none|none|
|»» iCalUid|string|false|none|none|
|»» isFullDayEvent|boolean|false|none|none|
|»» isLocked|boolean|false|none|none|
|»» link|string|false|none|none|
|»» location|string|false|none|none|
|»» meetingLink|string|false|none|none|
|»» identifier|string|false|none|none|
|»» startDateTime|string(date-time)|false|none|none|
|»» status|string|false|none|none|
|»» summary|string|false|none|none|
|»» timezone|string|false|none|none|
|»» calendarId|string|true|none|none|
|»» parentEventId|string|false|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|
|»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» source|string|false|none|none|
|»»» enableWorkingHours|boolean|false|none|none|
|»»» location|string|false|none|none|
|»»» identifier|string|true|none|none|
|»»» summary|string|false|none|none|
|»»» timezone|string|false|none|none|
|»»» extId|string|false|none|none|
|»»» extMetadata|object|false|none|none|
|»»» events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» dayOfWeek|number|false|none|none|
|»»»»» end|string|false|none|none|
|»»»»» start|string|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» accessRole|string|false|none|none|
|»»»»» bgColor|string|false|none|none|
|»»»»» fgColor|string|false|none|none|
|»»»»» isHidden|boolean|false|none|none|
|»»»»» isPrimary|boolean|false|none|none|
|»»»»» identifier|string|true|none|none|
|»»»»» defaultReminders|object|false|none|none|
|»»»»» notificationSettings|object|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»» parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»» attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» identifier|string|true|none|none|
|»»»» isOptional|boolean|false|none|none|
|»»»» isOrganizer|boolean|false|none|none|
|»»»» messages|string|false|none|none|
|»»»» responseStatus|string|false|none|none|
|»»»» eventId|string|true|none|none|
|»»»» extId|string|false|none|none|
|»»»» extMetadata|object|false|none|none|
|»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»» attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» fileUrl|string|true|none|none|
|»»»» iconLink|string|false|none|none|
|»»»» mimeType|string|false|none|none|
|»»»» title|string|false|none|none|
|»»»» eventId|string|true|none|none|
|»»»» extId|string|false|none|none|
|»»»» extMetadata|object|false|none|none|
|»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-eventattachmentcontroller">EventAttachmentController</h1>

## EventAttachmentController.create

<a id="opIdEventAttachmentController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attachments',
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

`POST /events/{id}/attachments`

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventattachmentcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewAttachmentInEvent](#schemanewattachmentinevent)|false|none|

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventattachmentcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event model instance|[Attachment](#schemaattachment)|

<aside class="success">
This operation does not require authentication
</aside>

## EventAttachmentController.patch

<a id="opIdEventAttachmentController.patch"></a>

> Code samples

```'javascript--nodejs
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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attachments',
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

`PATCH /events/{id}/attachments`

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventattachmentcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[AttachmentPartial](#schemaattachmentpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="eventattachmentcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event.Attachment PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## EventAttachmentController.find

<a id="opIdEventAttachmentController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attachments',
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

`GET /events/{id}/attachments`

<h3 id="eventattachmentcontroller.find-parameters">Parameters</h3>

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
    "fileUrl": "string",
    "iconLink": "string",
    "mimeType": "string",
    "title": "string",
    "eventId": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="eventattachmentcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Event has many Attachment|Inline|

<h3 id="eventattachmentcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Attachment](#schemaattachment)]|false|none|none|
|» Attachment|[Attachment](#schemaattachment)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» fileUrl|string|true|none|none|
|»» iconLink|string|false|none|none|
|»» mimeType|string|false|none|none|
|»» title|string|false|none|none|
|»» eventId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## EventAttachmentController.delete

<a id="opIdEventAttachmentController.delete"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attachments',
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

`DELETE /events/{id}/attachments`

<h3 id="eventattachmentcontroller.delete-parameters">Parameters</h3>

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

<h3 id="eventattachmentcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event.Attachment DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-eventattendeecontroller">EventAttendeeController</h1>

## EventAttendeeController.create

<a id="opIdEventAttendeeController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attendees',
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

`POST /events/{id}/attendees`

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventattendeecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewAttendeeInEvent](#schemanewattendeeinevent)|false|none|

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventattendeecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event model instance|[Attendee](#schemaattendee)|

<aside class="success">
This operation does not require authentication
</aside>

## EventAttendeeController.patch

<a id="opIdEventAttendeeController.patch"></a>

> Code samples

```'javascript--nodejs
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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attendees',
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

`PATCH /events/{id}/attendees`

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="eventattendeecontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[AttendeePartial](#schemaattendeepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="eventattendeecontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event.Attendee PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## EventAttendeeController.find

<a id="opIdEventAttendeeController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attendees',
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

`GET /events/{id}/attendees`

<h3 id="eventattendeecontroller.find-parameters">Parameters</h3>

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
    "identifier": "string",
    "isOptional": true,
    "isOrganizer": true,
    "messages": "string",
    "responseStatus": "needsAction",
    "eventId": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="eventattendeecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Event has many Attendee|Inline|

<h3 id="eventattendeecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Attendee](#schemaattendee)]|false|none|none|
|» Attendee|[Attendee](#schemaattendee)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» identifier|string|true|none|none|
|»» isOptional|boolean|false|none|none|
|»» isOrganizer|boolean|false|none|none|
|»» messages|string|false|none|none|
|»» responseStatus|string|false|none|none|
|»» eventId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<aside class="success">
This operation does not require authentication
</aside>

## EventAttendeeController.delete

<a id="opIdEventAttendeeController.delete"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/events/{id}/attendees',
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

`DELETE /events/{id}/attendees`

<h3 id="eventattendeecontroller.delete-parameters">Parameters</h3>

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

<h3 id="eventattendeecontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event.Attendee DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-pingcontroller">PingController</h1>

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

<h1 id="scheduler-service-settingscontroller">SettingsController</h1>

## SettingsController.count

<a id="opIdSettingsController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/settings/count',
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

`GET /settings/count`

<h3 id="settingscontroller.count-parameters">Parameters</h3>

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

<h3 id="settingscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Settings model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## SettingsController.replaceById

<a id="opIdSettingsController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/settings/{id}',
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

`PUT /settings/{id}`

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="settingscontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Settings](#schemasettings)|false|none|

<h3 id="settingscontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Settings PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## SettingsController.updateById

<a id="opIdSettingsController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/settings/{id}',
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

`PATCH /settings/{id}`

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="settingscontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[SettingsPartial](#schemasettingspartial)|false|none|

<h3 id="settingscontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Settings PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## SettingsController.findById

<a id="opIdSettingsController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/settings/{id}',
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

`GET /settings/{id}`

<h3 id="settingscontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[settings.Filter](#schemasettings.filter)|false|none|

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="settingscontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Settings model instance|[SettingsWithRelations](#schemasettingswithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## SettingsController.deleteById

<a id="opIdSettingsController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/settings/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /settings/{id}`

<h3 id="settingscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="settingscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Settings DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## SettingsController.create

<a id="opIdSettingsController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/settings',
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

`POST /settings`

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="settingscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewSettings](#schemanewsettings)|false|none|

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="settingscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Settings model instance|[Settings](#schemasettings)|

<aside class="success">
This operation does not require authentication
</aside>

## SettingsController.updateAll

<a id="opIdSettingsController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/settings',
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

`PATCH /settings`

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="settingscontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[SettingsPartial](#schemasettingspartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="settingscontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Settings PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## SettingsController.find

<a id="opIdSettingsController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/settings',
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

`GET /settings`

<h3 id="settingscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[settings.Filter1](#schemasettings.filter1)|false|none|

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
    "ownerId": "string",
    "ownerType": "global",
    "settingName": "string",
    "settingValue": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="settingscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Settings model instances|Inline|

<h3 id="settingscontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[SettingsWithRelations](#schemasettingswithrelations)]|false|none|[(tsType: SettingsWithRelations, schemaOptions: { includeRelations: true })]|
|» SettingsWithRelations|[SettingsWithRelations](#schemasettingswithrelations)|false|none|(tsType: SettingsWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» ownerId|string|true|none|none|
|»» ownerType|string|false|none|none|
|»» settingName|string|false|none|none|
|»» settingValue|string|false|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|ownerType|global|
|ownerType|user|
|ownerType|calendar|
|ownerType|event|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-themecontroller">ThemeController</h1>

## ThemeController.count

<a id="opIdThemeController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/themes/count',
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

`GET /themes/count`

<h3 id="themecontroller.count-parameters">Parameters</h3>

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

<h3 id="themecontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Theme model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## ThemeController.replaceById

<a id="opIdThemeController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/themes/{id}',
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

`PUT /themes/{id}`

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="themecontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Theme](#schematheme)|false|none|

<h3 id="themecontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Theme PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## ThemeController.updateById

<a id="opIdThemeController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/themes/{id}',
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

`PATCH /themes/{id}`

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="themecontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ThemePartial](#schemathemepartial)|false|none|

<h3 id="themecontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Theme PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## ThemeController.findById

<a id="opIdThemeController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/themes/{id}',
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

`GET /themes/{id}`

<h3 id="themecontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[themes.Filter](#schemathemes.filter)|false|none|

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="themecontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Theme model instance|[ThemeWithRelations](#schemathemewithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## ThemeController.deleteById

<a id="opIdThemeController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/themes/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /themes/{id}`

<h3 id="themecontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="themecontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Theme DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## ThemeController.create

<a id="opIdThemeController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/themes',
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

`POST /themes`

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="themecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTheme](#schemanewtheme)|false|none|

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="themecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Theme model instance|[Theme](#schematheme)|

<aside class="success">
This operation does not require authentication
</aside>

## ThemeController.updateAll

<a id="opIdThemeController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/themes',
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

`PATCH /themes`

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="themecontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[ThemePartial](#schemathemepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="themecontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Theme PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## ThemeController.find

<a id="opIdThemeController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/themes',
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

`GET /themes`

<h3 id="themecontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[themes.Filter1](#schemathemes.filter1)|false|none|

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
    "calBg": "string",
    "calFg": "string",
    "eventBg": "string",
    "eventFg": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="themecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Theme model instances|Inline|

<h3 id="themecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[ThemeWithRelations](#schemathemewithrelations)]|false|none|[(tsType: ThemeWithRelations, schemaOptions: { includeRelations: true })]|
|» ThemeWithRelations|[ThemeWithRelations](#schemathemewithrelations)|false|none|(tsType: ThemeWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» calBg|string|false|none|none|
|»» calFg|string|false|none|none|
|»» eventBg|string|false|none|none|
|»» eventFg|string|false|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="scheduler-service-workinghourcontroller">WorkingHourController</h1>

## WorkingHourController.count

<a id="opIdWorkingHourController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/working-hours/count',
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

`GET /working-hours/count`

<h3 id="workinghourcontroller.count-parameters">Parameters</h3>

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

<h3 id="workinghourcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|WorkingHour model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## WorkingHourController.replaceById

<a id="opIdWorkingHourController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/working-hours/{id}',
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

`PUT /working-hours/{id}`

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="workinghourcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[WorkingHour](#schemaworkinghour)|false|none|

<h3 id="workinghourcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|WorkingHour PUT success|None|

<aside class="success">
This operation does not require authentication
</aside>

## WorkingHourController.updateById

<a id="opIdWorkingHourController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/working-hours/{id}',
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

`PATCH /working-hours/{id}`

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="workinghourcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[WorkingHourPartial](#schemaworkinghourpartial)|false|none|

<h3 id="workinghourcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|WorkingHour PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## WorkingHourController.findById

<a id="opIdWorkingHourController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/working-hours/{id}',
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

`GET /working-hours/{id}`

<h3 id="workinghourcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[working_hours.Filter](#schemaworking_hours.filter)|false|none|

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {},
  "calendar": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "source": "string",
    "enableWorkingHours": true,
    "location": "string",
    "identifier": "string",
    "summary": "string",
    "timezone": "string",
    "extId": "string",
    "extMetadata": {},
    "events": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {},
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
    ],
    "workingHours": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "dayOfWeek": 0,
        "end": "string",
        "start": "string",
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ],
    "subscriptions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "accessRole": "freeBusyReader",
        "bgColor": "string",
        "fgColor": "string",
        "isHidden": true,
        "isPrimary": true,
        "identifier": "string",
        "defaultReminders": {},
        "notificationSettings": {},
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ]
  }
}
```

<h3 id="workinghourcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|WorkingHour model instance|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## WorkingHourController.deleteById

<a id="opIdWorkingHourController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/working-hours/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /working-hours/{id}`

<h3 id="workinghourcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="workinghourcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|WorkingHour DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## WorkingHourController.create

<a id="opIdWorkingHourController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/working-hours',
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

`POST /working-hours`

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="workinghourcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewWorkingHour](#schemanewworkinghour)|false|none|

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="workinghourcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|WorkingHour model instance|[WorkingHour](#schemaworkinghour)|

<aside class="success">
This operation does not require authentication
</aside>

## WorkingHourController.updateAll

<a id="opIdWorkingHourController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/working-hours',
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

`PATCH /working-hours`

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="workinghourcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[WorkingHourPartial](#schemaworkinghourpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="workinghourcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|WorkingHour PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## WorkingHourController.find

<a id="opIdWorkingHourController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/working-hours',
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

`GET /working-hours`

<h3 id="workinghourcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[working_hours.Filter1](#schemaworking_hours.filter1)|false|none|

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
    "dayOfWeek": 0,
    "end": "string",
    "start": "string",
    "calendarId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "bgColor": "string",
          "description": "string",
          "endDateTime": "2019-08-24T14:15:22Z",
          "fgColor": "string",
          "iCalUid": "string",
          "isFullDayEvent": true,
          "isLocked": true,
          "link": "string",
          "location": "string",
          "meetingLink": "string",
          "identifier": "string",
          "startDateTime": "2019-08-24T14:15:22Z",
          "status": "confirmed",
          "summary": "string",
          "timezone": "string",
          "calendarId": "string",
          "parentEventId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {},
          "parentEvent": {},
          "attendees": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "identifier": "string",
              "isOptional": true,
              "isOrganizer": true,
              "messages": "string",
              "responseStatus": "needsAction",
              "eventId": "string",
              "extId": "string",
              "extMetadata": {},
              "event": {}
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
              "fileUrl": "string",
              "iconLink": "string",
              "mimeType": "string",
              "title": "string",
              "eventId": "string",
              "extId": "string",
              "extMetadata": {},
              "event": {}
            }
          ]
        }
      ],
      "workingHours": [
        {}
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    }
  }
]
```

<h3 id="workinghourcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of WorkingHour model instances|Inline|

<h3 id="workinghourcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|[(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })]|
|» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» dayOfWeek|number|false|none|none|
|»» end|string|false|none|none|
|»» start|string|false|none|none|
|»» calendarId|string|true|none|none|
|»» extId|string|false|none|none|
|»» extMetadata|object|false|none|none|
|»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» source|string|false|none|none|
|»»» enableWorkingHours|boolean|false|none|none|
|»»» location|string|false|none|none|
|»»» identifier|string|true|none|none|
|»»» summary|string|false|none|none|
|»»» timezone|string|false|none|none|
|»»» extId|string|false|none|none|
|»»» extMetadata|object|false|none|none|
|»»» events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»» EventWithRelations|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» bgColor|string|false|none|none|
|»»»»» description|string|false|none|none|
|»»»»» endDateTime|string(date-time)|false|none|none|
|»»»»» fgColor|string|false|none|none|
|»»»»» iCalUid|string|false|none|none|
|»»»»» isFullDayEvent|boolean|false|none|none|
|»»»»» isLocked|boolean|false|none|none|
|»»»»» link|string|false|none|none|
|»»»»» location|string|false|none|none|
|»»»»» meetingLink|string|false|none|none|
|»»»»» identifier|string|false|none|none|
|»»»»» startDateTime|string(date-time)|false|none|none|
|»»»»» status|string|false|none|none|
|»»»»» summary|string|false|none|none|
|»»»»» timezone|string|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» parentEventId|string|false|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» AttendeeWithRelations|[AttendeeWithRelations](#schemaattendeewithrelations)|false|none|(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» identifier|string|true|none|none|
|»»»»»»» isOptional|boolean|false|none|none|
|»»»»»»» isOrganizer|boolean|false|none|none|
|»»»»»»» messages|string|false|none|none|
|»»»»»»» responseStatus|string|false|none|none|
|»»»»»»» eventId|string|true|none|none|
|»»»»»»» extId|string|false|none|none|
|»»»»»»» extMetadata|object|false|none|none|
|»»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» AttachmentWithRelations|[AttachmentWithRelations](#schemaattachmentwithrelations)|false|none|(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» fileUrl|string|true|none|none|
|»»»»»»» iconLink|string|false|none|none|
|»»»»»»» mimeType|string|false|none|none|
|»»»»»»» title|string|false|none|none|
|»»»»»»» eventId|string|true|none|none|
|»»»»»»» extId|string|false|none|none|
|»»»»»»» extMetadata|object|false|none|none|
|»»»»»»» event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|»»» workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»»» WorkingHourWithRelations|[WorkingHourWithRelations](#schemaworkinghourwithrelations)|false|none|(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })|
|»»» subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»» SubscriptionWithRelations|[SubscriptionWithRelations](#schemasubscriptionwithrelations)|false|none|(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» accessRole|string|false|none|none|
|»»»»» bgColor|string|false|none|none|
|»»»»» fgColor|string|false|none|none|
|»»»»» isHidden|boolean|false|none|none|
|»»»»» isPrimary|boolean|false|none|none|
|»»»»» identifier|string|true|none|none|
|»»»»» defaultReminders|object|false|none|none|
|»»»»» notificationSettings|object|false|none|none|
|»»»»» calendarId|string|true|none|none|
|»»»»» extId|string|false|none|none|
|»»»»» extMetadata|object|false|none|none|
|»»»»» calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
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
|fileUrl|string|true|none|none|
|iconLink|string|false|none|none|
|mimeType|string|false|none|none|
|title|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_NewAttachment">NewAttachment</h2>
<!-- backwards compatibility -->
<a id="schemanewattachment"></a>
<a id="schema_NewAttachment"></a>
<a id="tocSnewattachment"></a>
<a id="tocsnewattachment"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewAttachment

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
|fileUrl|string|true|none|none|
|iconLink|string|false|none|none|
|mimeType|string|false|none|none|
|title|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_AttendeeWithRelations">AttendeeWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaattendeewithrelations"></a>
<a id="schema_AttendeeWithRelations"></a>
<a id="tocSattendeewithrelations"></a>
<a id="tocsattendeewithrelations"></a>

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {},
  "event": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {}
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    },
    "parentEvent": {},
    "attendees": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "identifier": "string",
        "isOptional": true,
        "isOrganizer": true,
        "messages": "string",
        "responseStatus": "needsAction",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
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
        "fileUrl": "string",
        "iconLink": "string",
        "mimeType": "string",
        "title": "string",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
      }
    ]
  }
}

```

AttendeeWithRelations

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
|identifier|string|true|none|none|
|isOptional|boolean|false|none|none|
|isOrganizer|boolean|false|none|none|
|messages|string|false|none|none|
|responseStatus|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<h2 id="tocS_EventWithRelations">EventWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaeventwithrelations"></a>
<a id="schema_EventWithRelations"></a>
<a id="tocSeventwithrelations"></a>
<a id="tocseventwithrelations"></a>

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {},
  "calendar": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "source": "string",
    "enableWorkingHours": true,
    "location": "string",
    "identifier": "string",
    "summary": "string",
    "timezone": "string",
    "extId": "string",
    "extMetadata": {},
    "events": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {},
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
    ],
    "workingHours": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "dayOfWeek": 0,
        "end": "string",
        "start": "string",
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ],
    "subscriptions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "accessRole": "freeBusyReader",
        "bgColor": "string",
        "fgColor": "string",
        "isHidden": true,
        "isPrimary": true,
        "identifier": "string",
        "defaultReminders": {},
        "notificationSettings": {},
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ]
  },
  "parentEvent": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {}
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    },
    "parentEvent": {},
    "attendees": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "identifier": "string",
        "isOptional": true,
        "isOrganizer": true,
        "messages": "string",
        "responseStatus": "needsAction",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
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
        "fileUrl": "string",
        "iconLink": "string",
        "mimeType": "string",
        "title": "string",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
      }
    ]
  },
  "attendees": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "identifier": "string",
      "isOptional": true,
      "isOrganizer": true,
      "messages": "string",
      "responseStatus": "needsAction",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {},
      "event": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "source": "string",
          "enableWorkingHours": true,
          "location": "string",
          "identifier": "string",
          "summary": "string",
          "timezone": "string",
          "extId": "string",
          "extMetadata": {},
          "events": [
            {}
          ],
          "workingHours": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "dayOfWeek": 0,
              "end": "string",
              "start": "string",
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ],
          "subscriptions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "accessRole": "freeBusyReader",
              "bgColor": "string",
              "fgColor": "string",
              "isHidden": true,
              "isPrimary": true,
              "identifier": "string",
              "defaultReminders": {},
              "notificationSettings": {},
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ]
        },
        "parentEvent": {},
        "attendees": [],
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
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
      "fileUrl": "string",
      "iconLink": "string",
      "mimeType": "string",
      "title": "string",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {},
      "event": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "source": "string",
          "enableWorkingHours": true,
          "location": "string",
          "identifier": "string",
          "summary": "string",
          "timezone": "string",
          "extId": "string",
          "extMetadata": {},
          "events": [
            {}
          ],
          "workingHours": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "dayOfWeek": 0,
              "end": "string",
              "start": "string",
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ],
          "subscriptions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "accessRole": "freeBusyReader",
              "bgColor": "string",
              "fgColor": "string",
              "isHidden": true,
              "isPrimary": true,
              "identifier": "string",
              "defaultReminders": {},
              "notificationSettings": {},
              "calendarId": "string",
              "extId": "string",
              "extMetadata": {},
              "calendar": {}
            }
          ]
        },
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ],
        "attachments": []
      }
    }
  ]
}

```

EventWithRelations

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
|bgColor|string|false|none|none|
|description|string|false|none|none|
|endDateTime|string(date-time)|false|none|none|
|fgColor|string|false|none|none|
|iCalUid|string|false|none|none|
|isFullDayEvent|boolean|false|none|none|
|isLocked|boolean|false|none|none|
|link|string|false|none|none|
|location|string|false|none|none|
|meetingLink|string|false|none|none|
|identifier|string|false|none|none|
|startDateTime|string(date-time)|false|none|none|
|status|string|false|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|calendarId|string|true|none|none|
|parentEventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|
|parentEvent|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|
|attendees|[[AttendeeWithRelations](#schemaattendeewithrelations)]|false|none|[(tsType: AttendeeWithRelations, schemaOptions: { includeRelations: true })]|
|attachments|[[AttachmentWithRelations](#schemaattachmentwithrelations)]|false|none|[(tsType: AttachmentWithRelations, schemaOptions: { includeRelations: true })]|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|

<h2 id="tocS_AttachmentWithRelations">AttachmentWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentwithrelations"></a>
<a id="schema_AttachmentWithRelations"></a>
<a id="tocSattachmentwithrelations"></a>
<a id="tocsattachmentwithrelations"></a>

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {},
  "event": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "bgColor": "string",
    "description": "string",
    "endDateTime": "2019-08-24T14:15:22Z",
    "fgColor": "string",
    "iCalUid": "string",
    "isFullDayEvent": true,
    "isLocked": true,
    "link": "string",
    "location": "string",
    "meetingLink": "string",
    "identifier": "string",
    "startDateTime": "2019-08-24T14:15:22Z",
    "status": "confirmed",
    "summary": "string",
    "timezone": "string",
    "calendarId": "string",
    "parentEventId": "string",
    "extId": "string",
    "extMetadata": {},
    "calendar": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "source": "string",
      "enableWorkingHours": true,
      "location": "string",
      "identifier": "string",
      "summary": "string",
      "timezone": "string",
      "extId": "string",
      "extMetadata": {},
      "events": [
        {}
      ],
      "workingHours": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "dayOfWeek": 0,
          "end": "string",
          "start": "string",
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ],
      "subscriptions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "accessRole": "freeBusyReader",
          "bgColor": "string",
          "fgColor": "string",
          "isHidden": true,
          "isPrimary": true,
          "identifier": "string",
          "defaultReminders": {},
          "notificationSettings": {},
          "calendarId": "string",
          "extId": "string",
          "extMetadata": {},
          "calendar": {}
        }
      ]
    },
    "parentEvent": {},
    "attendees": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "identifier": "string",
        "isOptional": true,
        "isOrganizer": true,
        "messages": "string",
        "responseStatus": "needsAction",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
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
        "fileUrl": "string",
        "iconLink": "string",
        "mimeType": "string",
        "title": "string",
        "eventId": "string",
        "extId": "string",
        "extMetadata": {},
        "event": {}
      }
    ]
  }
}

```

AttachmentWithRelations

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
|fileUrl|string|true|none|none|
|iconLink|string|false|none|none|
|mimeType|string|false|none|none|
|title|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|event|[EventWithRelations](#schemaeventwithrelations)|false|none|(tsType: EventWithRelations, schemaOptions: { includeRelations: true })|

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
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
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
|fileUrl|string|false|none|none|
|iconLink|string|false|none|none|
|mimeType|string|false|none|none|
|title|string|false|none|none|
|eventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_Attendee">Attendee</h2>
<!-- backwards compatibility -->
<a id="schemaattendee"></a>
<a id="schema_Attendee"></a>
<a id="tocSattendee"></a>
<a id="tocsattendee"></a>

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

Attendee

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
|identifier|string|true|none|none|
|isOptional|boolean|false|none|none|
|isOrganizer|boolean|false|none|none|
|messages|string|false|none|none|
|responseStatus|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<h2 id="tocS_NewAttendee">NewAttendee</h2>
<!-- backwards compatibility -->
<a id="schemanewattendee"></a>
<a id="schema_NewAttendee"></a>
<a id="tocSnewattendee"></a>
<a id="tocsnewattendee"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewAttendee

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
|identifier|string|true|none|none|
|isOptional|boolean|false|none|none|
|isOrganizer|boolean|false|none|none|
|messages|string|false|none|none|
|responseStatus|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<h2 id="tocS_AttendeePartial">AttendeePartial</h2>
<!-- backwards compatibility -->
<a id="schemaattendeepartial"></a>
<a id="schema_AttendeePartial"></a>
<a id="tocSattendeepartial"></a>
<a id="tocsattendeepartial"></a>

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
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

AttendeePartial

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
|identifier|string|false|none|none|
|isOptional|boolean|false|none|none|
|isOrganizer|boolean|false|none|none|
|messages|string|false|none|none|
|responseStatus|string|false|none|none|
|eventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<h2 id="tocS_Calendar">Calendar</h2>
<!-- backwards compatibility -->
<a id="schemacalendar"></a>
<a id="schema_Calendar"></a>
<a id="tocScalendar"></a>
<a id="tocscalendar"></a>

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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {}
}

```

Calendar

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
|source|string|false|none|none|
|enableWorkingHours|boolean|false|none|none|
|location|string|false|none|none|
|identifier|string|true|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_WorkingHourExcluding_id_">WorkingHourExcluding_id_</h2>
<!-- backwards compatibility -->
<a id="schemaworkinghourexcluding_id_"></a>
<a id="schema_WorkingHourExcluding_id_"></a>
<a id="tocSworkinghourexcluding_id_"></a>
<a id="tocsworkinghourexcluding_id_"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

WorkingHourExcluding_id_

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
|dayOfWeek|number|false|none|none|
|end|string|false|none|none|
|start|string|false|none|none|
|calendarId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<h2 id="tocS_NewCalendar">NewCalendar</h2>
<!-- backwards compatibility -->
<a id="schemanewcalendar"></a>
<a id="schema_NewCalendar"></a>
<a id="tocSnewcalendar"></a>
<a id="tocsnewcalendar"></a>

```json
{
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
}

```

NewCalendar

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|source|string|false|none|none|
|enableWorkingHours|boolean|false|none|none|
|location|string|false|none|none|
|identifier|string|true|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|workingHours|[[WorkingHourExcluding_id_](#schemaworkinghourexcluding_id_)]|false|none|[(tsType: Omit<WorkingHour, 'id'>, schemaOptions: { exclude: [ 'id' ] })]|
|subscription|object|false|none|none|

<h2 id="tocS_WorkingHour">WorkingHour</h2>
<!-- backwards compatibility -->
<a id="schemaworkinghour"></a>
<a id="schema_WorkingHour"></a>
<a id="tocSworkinghour"></a>
<a id="tocsworkinghour"></a>

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

WorkingHour

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
|dayOfWeek|number|false|none|none|
|end|string|false|none|none|
|start|string|false|none|none|
|calendarId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<h2 id="tocS_CalendarDTO">CalendarDTO</h2>
<!-- backwards compatibility -->
<a id="schemacalendardto"></a>
<a id="schema_CalendarDTO"></a>
<a id="tocScalendardto"></a>
<a id="tocscalendardto"></a>

```json
{
  "id": "string",
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "subscription": {}
}

```

CalendarDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|source|string|false|none|none|
|enableWorkingHours|boolean|false|none|none|
|location|string|false|none|none|
|identifier|string|true|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|workingHours|[[WorkingHour](#schemaworkinghour)]|false|none|none|
|subscription|object|false|none|none|

<h2 id="tocS_CalendarWithRelations">CalendarWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemacalendarwithrelations"></a>
<a id="schema_CalendarWithRelations"></a>
<a id="tocScalendarwithrelations"></a>
<a id="tocscalendarwithrelations"></a>

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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {},
  "events": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "calendarId": "string",
      "parentEventId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [],
        "workingHours": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "dayOfWeek": 0,
            "end": "string",
            "start": "string",
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ],
        "subscriptions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "accessRole": "freeBusyReader",
            "bgColor": "string",
            "fgColor": "string",
            "isHidden": true,
            "isPrimary": true,
            "identifier": "string",
            "defaultReminders": {},
            "notificationSettings": {},
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ]
      },
      "parentEvent": {},
      "attendees": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "identifier": "string",
          "isOptional": true,
          "isOrganizer": true,
          "messages": "string",
          "responseStatus": "needsAction",
          "eventId": "string",
          "extId": "string",
          "extMetadata": {},
          "event": {}
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
          "fileUrl": "string",
          "iconLink": "string",
          "mimeType": "string",
          "title": "string",
          "eventId": "string",
          "extId": "string",
          "extMetadata": {},
          "event": {}
        }
      ]
    }
  ],
  "workingHours": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "dayOfWeek": 0,
      "end": "string",
      "start": "string",
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "bgColor": "string",
            "description": "string",
            "endDateTime": "2019-08-24T14:15:22Z",
            "fgColor": "string",
            "iCalUid": "string",
            "isFullDayEvent": true,
            "isLocked": true,
            "link": "string",
            "location": "string",
            "meetingLink": "string",
            "identifier": "string",
            "startDateTime": "2019-08-24T14:15:22Z",
            "status": "confirmed",
            "summary": "string",
            "timezone": "string",
            "calendarId": "string",
            "parentEventId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {},
            "parentEvent": {},
            "attendees": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "identifier": "string",
                "isOptional": true,
                "isOrganizer": true,
                "messages": "string",
                "responseStatus": "needsAction",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
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
                "fileUrl": "string",
                "iconLink": "string",
                "mimeType": "string",
                "title": "string",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
              }
            ]
          }
        ],
        "workingHours": [],
        "subscriptions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "accessRole": "freeBusyReader",
            "bgColor": "string",
            "fgColor": "string",
            "isHidden": true,
            "isPrimary": true,
            "identifier": "string",
            "defaultReminders": {},
            "notificationSettings": {},
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ]
      }
    }
  ],
  "subscriptions": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "accessRole": "freeBusyReader",
      "bgColor": "string",
      "fgColor": "string",
      "isHidden": true,
      "isPrimary": true,
      "identifier": "string",
      "defaultReminders": {},
      "notificationSettings": {},
      "calendarId": "string",
      "extId": "string",
      "extMetadata": {},
      "calendar": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "source": "string",
        "enableWorkingHours": true,
        "location": "string",
        "identifier": "string",
        "summary": "string",
        "timezone": "string",
        "extId": "string",
        "extMetadata": {},
        "events": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "bgColor": "string",
            "description": "string",
            "endDateTime": "2019-08-24T14:15:22Z",
            "fgColor": "string",
            "iCalUid": "string",
            "isFullDayEvent": true,
            "isLocked": true,
            "link": "string",
            "location": "string",
            "meetingLink": "string",
            "identifier": "string",
            "startDateTime": "2019-08-24T14:15:22Z",
            "status": "confirmed",
            "summary": "string",
            "timezone": "string",
            "calendarId": "string",
            "parentEventId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {},
            "parentEvent": {},
            "attendees": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "identifier": "string",
                "isOptional": true,
                "isOrganizer": true,
                "messages": "string",
                "responseStatus": "needsAction",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
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
                "fileUrl": "string",
                "iconLink": "string",
                "mimeType": "string",
                "title": "string",
                "eventId": "string",
                "extId": "string",
                "extMetadata": {},
                "event": {}
              }
            ]
          }
        ],
        "workingHours": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "dayOfWeek": 0,
            "end": "string",
            "start": "string",
            "calendarId": "string",
            "extId": "string",
            "extMetadata": {},
            "calendar": {}
          }
        ],
        "subscriptions": []
      }
    }
  ]
}

```

CalendarWithRelations

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
|source|string|false|none|none|
|enableWorkingHours|boolean|false|none|none|
|location|string|false|none|none|
|identifier|string|true|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|events|[[EventWithRelations](#schemaeventwithrelations)]|false|none|[(tsType: EventWithRelations, schemaOptions: { includeRelations: true })]|
|workingHours|[[WorkingHourWithRelations](#schemaworkinghourwithrelations)]|false|none|[(tsType: WorkingHourWithRelations, schemaOptions: { includeRelations: true })]|
|subscriptions|[[SubscriptionWithRelations](#schemasubscriptionwithrelations)]|false|none|[(tsType: SubscriptionWithRelations, schemaOptions: { includeRelations: true })]|

<h2 id="tocS_CalendarPartial">CalendarPartial</h2>
<!-- backwards compatibility -->
<a id="schemacalendarpartial"></a>
<a id="schema_CalendarPartial"></a>
<a id="tocScalendarpartial"></a>
<a id="tocscalendarpartial"></a>

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
  "source": "string",
  "enableWorkingHours": true,
  "location": "string",
  "identifier": "string",
  "summary": "string",
  "timezone": "string",
  "extId": "string",
  "extMetadata": {}
}

```

CalendarPartial

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
|source|string|false|none|none|
|enableWorkingHours|boolean|false|none|none|
|location|string|false|none|none|
|identifier|string|false|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_Event">Event</h2>
<!-- backwards compatibility -->
<a id="schemaevent"></a>
<a id="schema_Event"></a>
<a id="tocSevent"></a>
<a id="tocsevent"></a>

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

Event

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
|bgColor|string|false|none|none|
|description|string|false|none|none|
|endDateTime|string(date-time)|false|none|none|
|fgColor|string|false|none|none|
|iCalUid|string|false|none|none|
|isFullDayEvent|boolean|false|none|none|
|isLocked|boolean|false|none|none|
|link|string|false|none|none|
|location|string|false|none|none|
|meetingLink|string|false|none|none|
|identifier|string|false|none|none|
|startDateTime|string(date-time)|false|none|none|
|status|string|false|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|calendarId|string|true|none|none|
|parentEventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|

<h2 id="tocS_AttachmentExcluding_id_">AttachmentExcluding_id_</h2>
<!-- backwards compatibility -->
<a id="schemaattachmentexcluding_id_"></a>
<a id="schema_AttachmentExcluding_id_"></a>
<a id="tocSattachmentexcluding_id_"></a>
<a id="tocsattachmentexcluding_id_"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

AttachmentExcluding_id_

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
|fileUrl|string|true|none|none|
|iconLink|string|false|none|none|
|mimeType|string|false|none|none|
|title|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_AttendeeExcluding_id_">AttendeeExcluding_id_</h2>
<!-- backwards compatibility -->
<a id="schemaattendeeexcluding_id_"></a>
<a id="schema_AttendeeExcluding_id_"></a>
<a id="tocSattendeeexcluding_id_"></a>
<a id="tocsattendeeexcluding_id_"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

AttendeeExcluding_id_

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
|identifier|string|true|none|none|
|isOptional|boolean|false|none|none|
|isOrganizer|boolean|false|none|none|
|messages|string|false|none|none|
|responseStatus|string|false|none|none|
|eventId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

<h2 id="tocS_NewEvent">NewEvent</h2>
<!-- backwards compatibility -->
<a id="schemanewevent"></a>
<a id="schema_NewEvent"></a>
<a id="tocSnewevent"></a>
<a id="tocsnewevent"></a>

```json
{
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "attachments": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "fileUrl": "string",
      "iconLink": "string",
      "mimeType": "string",
      "title": "string",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "attendees": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "identifier": "string",
      "isOptional": true,
      "isOrganizer": true,
      "messages": "string",
      "responseStatus": "needsAction",
      "eventId": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ],
  "extId": "string",
  "extMetadata": {}
}

```

NewEvent

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|bgColor|string|false|none|none|
|description|string|false|none|none|
|endDateTime|string(date-time)|false|none|none|
|fgColor|string|false|none|none|
|iCalUid|string|false|none|none|
|isFullDayEvent|boolean|false|none|none|
|isLocked|boolean|false|none|none|
|link|string|false|none|none|
|location|string|false|none|none|
|meetingLink|string|false|none|none|
|identifier|string|false|none|none|
|startDateTime|string(date-time)|false|none|none|
|status|string|false|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|calendarId|string|true|none|none|
|parentEventId|string|false|none|none|
|attachments|[[AttachmentExcluding_id_](#schemaattachmentexcluding_id_)]|false|none|[(tsType: Omit<Attachment, 'id'>, schemaOptions: { exclude: [ 'id' ] })]|
|attendees|[[AttendeeExcluding_id_](#schemaattendeeexcluding_id_)]|false|none|[(tsType: Omit<Attendee, 'id'>, schemaOptions: { exclude: [ 'id' ] })]|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|

<h2 id="tocS_EventAttendeeViewItemDTO">EventAttendeeViewItemDTO</h2>
<!-- backwards compatibility -->
<a id="schemaeventattendeeviewitemdto"></a>
<a id="schema_EventAttendeeViewItemDTO"></a>
<a id="tocSeventattendeeviewitemdto"></a>
<a id="tocseventattendeeviewitemdto"></a>

```json
{
  "id": "string",
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "extId": "string",
  "extMetadata": {},
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "attendeeId": "string",
  "isOptional": true,
  "attendeeIdentifier": "string",
  "isOrganizer": true,
  "messages": "string",
  "eventId": "string"
}

```

EventAttendeeViewItemDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|bgColor|string|false|none|none|
|description|string|false|none|none|
|endDateTime|string(date-time)|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|fgColor|string|false|none|none|
|iCalUid|string|false|none|none|
|isFullDayEvent|boolean|false|none|none|
|isLocked|boolean|false|none|none|
|link|string|false|none|none|
|location|string|false|none|none|
|meetingLink|string|false|none|none|
|identifier|string|false|none|none|
|startDateTime|string(date-time)|false|none|none|
|status|string|false|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|attendeeId|string|false|none|none|
|isOptional|boolean|false|none|none|
|attendeeIdentifier|string|false|none|none|
|isOrganizer|boolean|false|none|none|
|messages|string|false|none|none|
|eventId|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|

<h2 id="tocS_FreeBusyRequest">FreeBusyRequest</h2>
<!-- backwards compatibility -->
<a id="schemafreebusyrequest"></a>
<a id="schema_FreeBusyRequest"></a>
<a id="tocSfreebusyrequest"></a>
<a id="tocsfreebusyrequest"></a>

```json
{
  "timeMax": "2019-08-24T14:15:22Z",
  "timeMin": "2019-08-24T14:15:22Z",
  "items": [
    {
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "extId": "string",
      "extMetadata": {},
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "attendeeId": "string",
      "isOptional": true,
      "attendeeIdentifier": "string",
      "isOrganizer": true,
      "messages": "string",
      "eventId": "string"
    }
  ]
}

```

FreeBusyRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|timeMax|string(date-time)|true|none|none|
|timeMin|string(date-time)|true|none|none|
|items|[[EventAttendeeViewItemDTO](#schemaeventattendeeviewitemdto)]|false|none|none|

<h2 id="tocS_FreeBusyDTO">FreeBusyDTO</h2>
<!-- backwards compatibility -->
<a id="schemafreebusydto"></a>
<a id="schema_FreeBusyDTO"></a>
<a id="tocSfreebusydto"></a>
<a id="tocsfreebusydto"></a>

```json
{
  "timeMax": "2019-08-24T14:15:22Z",
  "timeMin": "2019-08-24T14:15:22Z",
  "items": [
    {
      "id": "string",
      "bgColor": "string",
      "description": "string",
      "endDateTime": "2019-08-24T14:15:22Z",
      "extId": "string",
      "extMetadata": {},
      "fgColor": "string",
      "iCalUid": "string",
      "isFullDayEvent": true,
      "isLocked": true,
      "link": "string",
      "location": "string",
      "meetingLink": "string",
      "identifier": "string",
      "startDateTime": "2019-08-24T14:15:22Z",
      "status": "confirmed",
      "summary": "string",
      "timezone": "string",
      "attendeeId": "string",
      "isOptional": true,
      "attendeeIdentifier": "string",
      "isOrganizer": true,
      "messages": "string",
      "eventId": "string"
    }
  ]
}

```

FreeBusyDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|timeMax|string(date-time)|true|none|none|
|timeMin|string(date-time)|true|none|none|
|items|[[EventAttendeeViewItemDTO](#schemaeventattendeeviewitemdto)]|false|none|none|

<h2 id="tocS_EventPartial">EventPartial</h2>
<!-- backwards compatibility -->
<a id="schemaeventpartial"></a>
<a id="schema_EventPartial"></a>
<a id="tocSeventpartial"></a>
<a id="tocseventpartial"></a>

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
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

EventPartial

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
|bgColor|string|false|none|none|
|description|string|false|none|none|
|endDateTime|string(date-time)|false|none|none|
|fgColor|string|false|none|none|
|iCalUid|string|false|none|none|
|isFullDayEvent|boolean|false|none|none|
|isLocked|boolean|false|none|none|
|link|string|false|none|none|
|location|string|false|none|none|
|meetingLink|string|false|none|none|
|identifier|string|false|none|none|
|startDateTime|string(date-time)|false|none|none|
|status|string|false|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|calendarId|string|false|none|none|
|parentEventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|

<h2 id="tocS_Settings">Settings</h2>
<!-- backwards compatibility -->
<a id="schemasettings"></a>
<a id="schema_Settings"></a>
<a id="tocSsettings"></a>
<a id="tocssettings"></a>

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}

```

Settings

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
|ownerId|string|true|none|none|
|ownerType|string|false|none|none|
|settingName|string|false|none|none|
|settingValue|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|ownerType|global|
|ownerType|user|
|ownerType|calendar|
|ownerType|event|

<h2 id="tocS_NewSettings">NewSettings</h2>
<!-- backwards compatibility -->
<a id="schemanewsettings"></a>
<a id="schema_NewSettings"></a>
<a id="tocSnewsettings"></a>
<a id="tocsnewsettings"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewSettings

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
|ownerId|string|true|none|none|
|ownerType|string|false|none|none|
|settingName|string|false|none|none|
|settingValue|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|ownerType|global|
|ownerType|user|
|ownerType|calendar|
|ownerType|event|

<h2 id="tocS_SettingsWithRelations">SettingsWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemasettingswithrelations"></a>
<a id="schema_SettingsWithRelations"></a>
<a id="tocSsettingswithrelations"></a>
<a id="tocssettingswithrelations"></a>

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}

```

SettingsWithRelations

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
|ownerId|string|true|none|none|
|ownerType|string|false|none|none|
|settingName|string|false|none|none|
|settingValue|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|ownerType|global|
|ownerType|user|
|ownerType|calendar|
|ownerType|event|

<h2 id="tocS_SettingsPartial">SettingsPartial</h2>
<!-- backwards compatibility -->
<a id="schemasettingspartial"></a>
<a id="schema_SettingsPartial"></a>
<a id="tocSsettingspartial"></a>
<a id="tocssettingspartial"></a>

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
  "ownerId": "string",
  "ownerType": "global",
  "settingName": "string",
  "settingValue": "string",
  "extId": "string",
  "extMetadata": {}
}

```

SettingsPartial

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
|ownerId|string|false|none|none|
|ownerType|string|false|none|none|
|settingName|string|false|none|none|
|settingValue|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|ownerType|global|
|ownerType|user|
|ownerType|calendar|
|ownerType|event|

<h2 id="tocS_Subscription">Subscription</h2>
<!-- backwards compatibility -->
<a id="schemasubscription"></a>
<a id="schema_Subscription"></a>
<a id="tocSsubscription"></a>
<a id="tocssubscription"></a>

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

Subscription

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
|accessRole|string|false|none|none|
|bgColor|string|false|none|none|
|fgColor|string|false|none|none|
|isHidden|boolean|false|none|none|
|isPrimary|boolean|false|none|none|
|identifier|string|true|none|none|
|defaultReminders|object|false|none|none|
|notificationSettings|object|false|none|none|
|calendarId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<h2 id="tocS_NewSubscription">NewSubscription</h2>
<!-- backwards compatibility -->
<a id="schemanewsubscription"></a>
<a id="schema_NewSubscription"></a>
<a id="tocSnewsubscription"></a>
<a id="tocsnewsubscription"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewSubscription

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
|accessRole|string|false|none|none|
|bgColor|string|false|none|none|
|fgColor|string|false|none|none|
|isHidden|boolean|false|none|none|
|isPrimary|boolean|false|none|none|
|identifier|string|true|none|none|
|defaultReminders|object|false|none|none|
|notificationSettings|object|false|none|none|
|calendarId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<h2 id="tocS_SubscriptionWithRelations">SubscriptionWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptionwithrelations"></a>
<a id="schema_SubscriptionWithRelations"></a>
<a id="tocSsubscriptionwithrelations"></a>
<a id="tocssubscriptionwithrelations"></a>

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {},
  "calendar": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "source": "string",
    "enableWorkingHours": true,
    "location": "string",
    "identifier": "string",
    "summary": "string",
    "timezone": "string",
    "extId": "string",
    "extMetadata": {},
    "events": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {},
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
    ],
    "workingHours": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "dayOfWeek": 0,
        "end": "string",
        "start": "string",
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ],
    "subscriptions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "accessRole": "freeBusyReader",
        "bgColor": "string",
        "fgColor": "string",
        "isHidden": true,
        "isPrimary": true,
        "identifier": "string",
        "defaultReminders": {},
        "notificationSettings": {},
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ]
  }
}

```

SubscriptionWithRelations

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
|accessRole|string|false|none|none|
|bgColor|string|false|none|none|
|fgColor|string|false|none|none|
|isHidden|boolean|false|none|none|
|isPrimary|boolean|false|none|none|
|identifier|string|true|none|none|
|defaultReminders|object|false|none|none|
|notificationSettings|object|false|none|none|
|calendarId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<h2 id="tocS_SubscriptionPartial">SubscriptionPartial</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptionpartial"></a>
<a id="schema_SubscriptionPartial"></a>
<a id="tocSsubscriptionpartial"></a>
<a id="tocssubscriptionpartial"></a>

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
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

SubscriptionPartial

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
|accessRole|string|false|none|none|
|bgColor|string|false|none|none|
|fgColor|string|false|none|none|
|isHidden|boolean|false|none|none|
|isPrimary|boolean|false|none|none|
|identifier|string|false|none|none|
|defaultReminders|object|false|none|none|
|notificationSettings|object|false|none|none|
|calendarId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<h2 id="tocS_Theme">Theme</h2>
<!-- backwards compatibility -->
<a id="schematheme"></a>
<a id="schema_Theme"></a>
<a id="tocStheme"></a>
<a id="tocstheme"></a>

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}

```

Theme

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
|calBg|string|false|none|none|
|calFg|string|false|none|none|
|eventBg|string|false|none|none|
|eventFg|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_NewTheme">NewTheme</h2>
<!-- backwards compatibility -->
<a id="schemanewtheme"></a>
<a id="schema_NewTheme"></a>
<a id="tocSnewtheme"></a>
<a id="tocsnewtheme"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewTheme

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
|calBg|string|false|none|none|
|calFg|string|false|none|none|
|eventBg|string|false|none|none|
|eventFg|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_ThemeWithRelations">ThemeWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemathemewithrelations"></a>
<a id="schema_ThemeWithRelations"></a>
<a id="tocSthemewithrelations"></a>
<a id="tocsthemewithrelations"></a>

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}

```

ThemeWithRelations

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
|calBg|string|false|none|none|
|calFg|string|false|none|none|
|eventBg|string|false|none|none|
|eventFg|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_ThemePartial">ThemePartial</h2>
<!-- backwards compatibility -->
<a id="schemathemepartial"></a>
<a id="schema_ThemePartial"></a>
<a id="tocSthemepartial"></a>
<a id="tocsthemepartial"></a>

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
  "calBg": "string",
  "calFg": "string",
  "eventBg": "string",
  "eventFg": "string",
  "extId": "string",
  "extMetadata": {}
}

```

ThemePartial

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
|calBg|string|false|none|none|
|calFg|string|false|none|none|
|eventBg|string|false|none|none|
|eventFg|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_NewWorkingHour">NewWorkingHour</h2>
<!-- backwards compatibility -->
<a id="schemanewworkinghour"></a>
<a id="schema_NewWorkingHour"></a>
<a id="tocSnewworkinghour"></a>
<a id="tocsnewworkinghour"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewWorkingHour

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
|dayOfWeek|number|false|none|none|
|end|string|false|none|none|
|start|string|false|none|none|
|calendarId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<h2 id="tocS_WorkingHourWithRelations">WorkingHourWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaworkinghourwithrelations"></a>
<a id="schema_WorkingHourWithRelations"></a>
<a id="tocSworkinghourwithrelations"></a>
<a id="tocsworkinghourwithrelations"></a>

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {},
  "calendar": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "source": "string",
    "enableWorkingHours": true,
    "location": "string",
    "identifier": "string",
    "summary": "string",
    "timezone": "string",
    "extId": "string",
    "extMetadata": {},
    "events": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "bgColor": "string",
        "description": "string",
        "endDateTime": "2019-08-24T14:15:22Z",
        "fgColor": "string",
        "iCalUid": "string",
        "isFullDayEvent": true,
        "isLocked": true,
        "link": "string",
        "location": "string",
        "meetingLink": "string",
        "identifier": "string",
        "startDateTime": "2019-08-24T14:15:22Z",
        "status": "confirmed",
        "summary": "string",
        "timezone": "string",
        "calendarId": "string",
        "parentEventId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {},
        "parentEvent": {},
        "attendees": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "identifier": "string",
            "isOptional": true,
            "isOrganizer": true,
            "messages": "string",
            "responseStatus": "needsAction",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
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
            "fileUrl": "string",
            "iconLink": "string",
            "mimeType": "string",
            "title": "string",
            "eventId": "string",
            "extId": "string",
            "extMetadata": {},
            "event": {}
          }
        ]
      }
    ],
    "workingHours": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "dayOfWeek": 0,
        "end": "string",
        "start": "string",
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ],
    "subscriptions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "accessRole": "freeBusyReader",
        "bgColor": "string",
        "fgColor": "string",
        "isHidden": true,
        "isPrimary": true,
        "identifier": "string",
        "defaultReminders": {},
        "notificationSettings": {},
        "calendarId": "string",
        "extId": "string",
        "extMetadata": {},
        "calendar": {}
      }
    ]
  }
}

```

WorkingHourWithRelations

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
|dayOfWeek|number|false|none|none|
|end|string|false|none|none|
|start|string|false|none|none|
|calendarId|string|true|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|
|calendar|[CalendarWithRelations](#schemacalendarwithrelations)|false|none|(tsType: CalendarWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<h2 id="tocS_WorkingHourPartial">WorkingHourPartial</h2>
<!-- backwards compatibility -->
<a id="schemaworkinghourpartial"></a>
<a id="schema_WorkingHourPartial"></a>
<a id="tocSworkinghourpartial"></a>
<a id="tocsworkinghourpartial"></a>

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
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

WorkingHourPartial

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
|dayOfWeek|number|false|none|none|
|end|string|false|none|none|
|start|string|false|none|none|
|calendarId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<h2 id="tocS_Date">Date</h2>
<!-- backwards compatibility -->
<a id="schemadate"></a>
<a id="schema_Date"></a>
<a id="tocSdate"></a>
<a id="tocsdate"></a>

```json
null

```

### Properties

*None*

<h2 id="tocS_NewEventInCalendar">NewEventInCalendar</h2>
<!-- backwards compatibility -->
<a id="schemaneweventincalendar"></a>
<a id="schema_NewEventInCalendar"></a>
<a id="tocSneweventincalendar"></a>
<a id="tocsneweventincalendar"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "bgColor": "string",
  "description": "string",
  "endDateTime": "2019-08-24T14:15:22Z",
  "fgColor": "string",
  "iCalUid": "string",
  "isFullDayEvent": true,
  "isLocked": true,
  "link": "string",
  "location": "string",
  "meetingLink": "string",
  "identifier": "string",
  "startDateTime": "2019-08-24T14:15:22Z",
  "status": "confirmed",
  "summary": "string",
  "timezone": "string",
  "calendarId": "string",
  "parentEventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewEventInCalendar

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
|bgColor|string|false|none|none|
|description|string|false|none|none|
|endDateTime|string(date-time)|false|none|none|
|fgColor|string|false|none|none|
|iCalUid|string|false|none|none|
|isFullDayEvent|boolean|false|none|none|
|isLocked|boolean|false|none|none|
|link|string|false|none|none|
|location|string|false|none|none|
|meetingLink|string|false|none|none|
|identifier|string|false|none|none|
|startDateTime|string(date-time)|false|none|none|
|status|string|false|none|none|
|summary|string|false|none|none|
|timezone|string|false|none|none|
|calendarId|string|false|none|none|
|parentEventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|confirmed|
|status|tentative|
|status|cancelled|
|status|completed|

<h2 id="tocS_NewSubscriptionInCalendar">NewSubscriptionInCalendar</h2>
<!-- backwards compatibility -->
<a id="schemanewsubscriptionincalendar"></a>
<a id="schema_NewSubscriptionInCalendar"></a>
<a id="tocSnewsubscriptionincalendar"></a>
<a id="tocsnewsubscriptionincalendar"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "accessRole": "freeBusyReader",
  "bgColor": "string",
  "fgColor": "string",
  "isHidden": true,
  "isPrimary": true,
  "identifier": "string",
  "defaultReminders": {},
  "notificationSettings": {},
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewSubscriptionInCalendar

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
|accessRole|string|false|none|none|
|bgColor|string|false|none|none|
|fgColor|string|false|none|none|
|isHidden|boolean|false|none|none|
|isPrimary|boolean|false|none|none|
|identifier|string|true|none|none|
|defaultReminders|object|false|none|none|
|notificationSettings|object|false|none|none|
|calendarId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|accessRole|freeBusyReader|
|accessRole|reader|
|accessRole|writer|
|accessRole|owner|

<h2 id="tocS_NewWorkingHourInCalendar">NewWorkingHourInCalendar</h2>
<!-- backwards compatibility -->
<a id="schemanewworkinghourincalendar"></a>
<a id="schema_NewWorkingHourInCalendar"></a>
<a id="tocSnewworkinghourincalendar"></a>
<a id="tocsnewworkinghourincalendar"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "dayOfWeek": 0,
  "end": "string",
  "start": "string",
  "calendarId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewWorkingHourInCalendar

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
|dayOfWeek|number|false|none|none|
|end|string|false|none|none|
|start|string|false|none|none|
|calendarId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|dayOfWeek|0|
|dayOfWeek|1|
|dayOfWeek|2|
|dayOfWeek|3|
|dayOfWeek|4|
|dayOfWeek|5|
|dayOfWeek|6|

<h2 id="tocS_NewAttachmentInEvent">NewAttachmentInEvent</h2>
<!-- backwards compatibility -->
<a id="schemanewattachmentinevent"></a>
<a id="schema_NewAttachmentInEvent"></a>
<a id="tocSnewattachmentinevent"></a>
<a id="tocsnewattachmentinevent"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "fileUrl": "string",
  "iconLink": "string",
  "mimeType": "string",
  "title": "string",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewAttachmentInEvent

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
|fileUrl|string|true|none|none|
|iconLink|string|false|none|none|
|mimeType|string|false|none|none|
|title|string|false|none|none|
|eventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

<h2 id="tocS_NewAttendeeInEvent">NewAttendeeInEvent</h2>
<!-- backwards compatibility -->
<a id="schemanewattendeeinevent"></a>
<a id="schema_NewAttendeeInEvent"></a>
<a id="tocSnewattendeeinevent"></a>
<a id="tocsnewattendeeinevent"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "identifier": "string",
  "isOptional": true,
  "isOrganizer": true,
  "messages": "string",
  "responseStatus": "needsAction",
  "eventId": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewAttendeeInEvent

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
|identifier|string|true|none|none|
|isOptional|boolean|false|none|none|
|isOrganizer|boolean|false|none|none|
|messages|string|false|none|none|
|responseStatus|string|false|none|none|
|eventId|string|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|responseStatus|needsAction|
|responseStatus|tentative|
|responseStatus|accepted|
|responseStatus|declined|

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

<h2 id="tocS_attachments.ScopeFilter">attachments.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaattachments.scopefilter"></a>
<a id="schema_attachments.ScopeFilter"></a>
<a id="tocSattachments.scopefilter"></a>
<a id="tocsattachments.scopefilter"></a>

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

attachments.ScopeFilter

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

<h2 id="tocS_attachments.IncludeFilter.Items">attachments.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaattachments.includefilter.items"></a>
<a id="schema_attachments.IncludeFilter.Items"></a>
<a id="tocSattachments.includefilter.items"></a>
<a id="tocsattachments.includefilter.items"></a>

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

attachments.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[attachments.ScopeFilter](#schemaattachments.scopefilter)|false|none|none|

<h2 id="tocS_attachments.Filter">attachments.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaattachments.filter"></a>
<a id="schema_attachments.Filter"></a>
<a id="tocSattachments.filter"></a>
<a id="tocsattachments.filter"></a>

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
    "fileUrl": true,
    "iconLink": true,
    "mimeType": true,
    "title": true,
    "eventId": true,
    "extId": true,
    "extMetadata": true
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

attachments.Filter

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
|»» fileUrl|boolean|false|none|none|
|»» iconLink|boolean|false|none|none|
|»» mimeType|boolean|false|none|none|
|»» title|boolean|false|none|none|
|»» eventId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[attachments.IncludeFilter.Items](#schemaattachments.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_attachments.Filter1">attachments.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemaattachments.filter1"></a>
<a id="schema_attachments.Filter1"></a>
<a id="tocSattachments.filter1"></a>
<a id="tocsattachments.filter1"></a>

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
    "fileUrl": true,
    "iconLink": true,
    "mimeType": true,
    "title": true,
    "eventId": true,
    "extId": true,
    "extMetadata": true
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

attachments.Filter

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
|»» fileUrl|boolean|false|none|none|
|»» iconLink|boolean|false|none|none|
|»» mimeType|boolean|false|none|none|
|»» title|boolean|false|none|none|
|»» eventId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[attachments.IncludeFilter.Items](#schemaattachments.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_attendees.ScopeFilter">attendees.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaattendees.scopefilter"></a>
<a id="schema_attendees.ScopeFilter"></a>
<a id="tocSattendees.scopefilter"></a>
<a id="tocsattendees.scopefilter"></a>

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

attendees.ScopeFilter

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

<h2 id="tocS_attendees.IncludeFilter.Items">attendees.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaattendees.includefilter.items"></a>
<a id="schema_attendees.IncludeFilter.Items"></a>
<a id="tocSattendees.includefilter.items"></a>
<a id="tocsattendees.includefilter.items"></a>

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

attendees.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[attendees.ScopeFilter](#schemaattendees.scopefilter)|false|none|none|

<h2 id="tocS_attendees.Filter">attendees.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaattendees.filter"></a>
<a id="schema_attendees.Filter"></a>
<a id="tocSattendees.filter"></a>
<a id="tocsattendees.filter"></a>

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
    "identifier": true,
    "isOptional": true,
    "isOrganizer": true,
    "messages": true,
    "responseStatus": true,
    "eventId": true,
    "extId": true,
    "extMetadata": true
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

attendees.Filter

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
|»» identifier|boolean|false|none|none|
|»» isOptional|boolean|false|none|none|
|»» isOrganizer|boolean|false|none|none|
|»» messages|boolean|false|none|none|
|»» responseStatus|boolean|false|none|none|
|»» eventId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[attendees.IncludeFilter.Items](#schemaattendees.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_attendees.Filter1">attendees.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemaattendees.filter1"></a>
<a id="schema_attendees.Filter1"></a>
<a id="tocSattendees.filter1"></a>
<a id="tocsattendees.filter1"></a>

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
    "identifier": true,
    "isOptional": true,
    "isOrganizer": true,
    "messages": true,
    "responseStatus": true,
    "eventId": true,
    "extId": true,
    "extMetadata": true
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

attendees.Filter

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
|»» identifier|boolean|false|none|none|
|»» isOptional|boolean|false|none|none|
|»» isOrganizer|boolean|false|none|none|
|»» messages|boolean|false|none|none|
|»» responseStatus|boolean|false|none|none|
|»» eventId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[attendees.IncludeFilter.Items](#schemaattendees.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_subscriptions.ScopeFilter">subscriptions.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptions.scopefilter"></a>
<a id="schema_subscriptions.ScopeFilter"></a>
<a id="tocSsubscriptions.scopefilter"></a>
<a id="tocssubscriptions.scopefilter"></a>

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

subscriptions.ScopeFilter

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

<h2 id="tocS_subscriptions.IncludeFilter.Items">subscriptions.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptions.includefilter.items"></a>
<a id="schema_subscriptions.IncludeFilter.Items"></a>
<a id="tocSsubscriptions.includefilter.items"></a>
<a id="tocssubscriptions.includefilter.items"></a>

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

subscriptions.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[subscriptions.ScopeFilter](#schemasubscriptions.scopefilter)|false|none|none|

<h2 id="tocS_subscriptions.Filter">subscriptions.Filter</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptions.filter"></a>
<a id="schema_subscriptions.Filter"></a>
<a id="tocSsubscriptions.filter"></a>
<a id="tocssubscriptions.filter"></a>

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
    "accessRole": true,
    "bgColor": true,
    "fgColor": true,
    "isHidden": true,
    "isPrimary": true,
    "identifier": true,
    "defaultReminders": true,
    "notificationSettings": true,
    "calendarId": true,
    "extId": true,
    "extMetadata": true
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

subscriptions.Filter

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
|»» accessRole|boolean|false|none|none|
|»» bgColor|boolean|false|none|none|
|»» fgColor|boolean|false|none|none|
|»» isHidden|boolean|false|none|none|
|»» isPrimary|boolean|false|none|none|
|»» identifier|boolean|false|none|none|
|»» defaultReminders|boolean|false|none|none|
|»» notificationSettings|boolean|false|none|none|
|»» calendarId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[subscriptions.IncludeFilter.Items](#schemasubscriptions.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_calendars.ScopeFilter">calendars.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemacalendars.scopefilter"></a>
<a id="schema_calendars.ScopeFilter"></a>
<a id="tocScalendars.scopefilter"></a>
<a id="tocscalendars.scopefilter"></a>

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

calendars.ScopeFilter

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

<h2 id="tocS_calendars.IncludeFilter.Items">calendars.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemacalendars.includefilter.items"></a>
<a id="schema_calendars.IncludeFilter.Items"></a>
<a id="tocScalendars.includefilter.items"></a>
<a id="tocscalendars.includefilter.items"></a>

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

calendars.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[calendars.ScopeFilter](#schemacalendars.scopefilter)|false|none|none|

<h2 id="tocS_calendars.Filter">calendars.Filter</h2>
<!-- backwards compatibility -->
<a id="schemacalendars.filter"></a>
<a id="schema_calendars.Filter"></a>
<a id="tocScalendars.filter"></a>
<a id="tocscalendars.filter"></a>

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
    "source": true,
    "enableWorkingHours": true,
    "location": true,
    "identifier": true,
    "summary": true,
    "timezone": true,
    "extId": true,
    "extMetadata": true
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

calendars.Filter

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
|»» source|boolean|false|none|none|
|»» enableWorkingHours|boolean|false|none|none|
|»» location|boolean|false|none|none|
|»» identifier|boolean|false|none|none|
|»» summary|boolean|false|none|none|
|»» timezone|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[calendars.IncludeFilter.Items](#schemacalendars.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_calendars.Filter1">calendars.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemacalendars.filter1"></a>
<a id="schema_calendars.Filter1"></a>
<a id="tocScalendars.filter1"></a>
<a id="tocscalendars.filter1"></a>

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
    "source": true,
    "enableWorkingHours": true,
    "location": true,
    "identifier": true,
    "summary": true,
    "timezone": true,
    "extId": true,
    "extMetadata": true
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

calendars.Filter

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
|»» source|boolean|false|none|none|
|»» enableWorkingHours|boolean|false|none|none|
|»» location|boolean|false|none|none|
|»» identifier|boolean|false|none|none|
|»» summary|boolean|false|none|none|
|»» timezone|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[calendars.IncludeFilter.Items](#schemacalendars.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_events.ScopeFilter">events.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaevents.scopefilter"></a>
<a id="schema_events.ScopeFilter"></a>
<a id="tocSevents.scopefilter"></a>
<a id="tocsevents.scopefilter"></a>

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

events.ScopeFilter

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

<h2 id="tocS_events.IncludeFilter.Items">events.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaevents.includefilter.items"></a>
<a id="schema_events.IncludeFilter.Items"></a>
<a id="tocSevents.includefilter.items"></a>
<a id="tocsevents.includefilter.items"></a>

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

events.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[events.ScopeFilter](#schemaevents.scopefilter)|false|none|none|

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
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "bgColor": true,
    "description": true,
    "endDateTime": true,
    "fgColor": true,
    "iCalUid": true,
    "isFullDayEvent": true,
    "isLocked": true,
    "link": true,
    "location": true,
    "meetingLink": true,
    "identifier": true,
    "startDateTime": true,
    "status": true,
    "summary": true,
    "timezone": true,
    "calendarId": true,
    "parentEventId": true,
    "extId": true,
    "extMetadata": true
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
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» bgColor|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» endDateTime|boolean|false|none|none|
|»» fgColor|boolean|false|none|none|
|»» iCalUid|boolean|false|none|none|
|»» isFullDayEvent|boolean|false|none|none|
|»» isLocked|boolean|false|none|none|
|»» link|boolean|false|none|none|
|»» location|boolean|false|none|none|
|»» meetingLink|boolean|false|none|none|
|»» identifier|boolean|false|none|none|
|»» startDateTime|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» summary|boolean|false|none|none|
|»» timezone|boolean|false|none|none|
|»» calendarId|boolean|false|none|none|
|»» parentEventId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[events.IncludeFilter.Items](#schemaevents.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_events_attendees_view.ScopeFilter">events_attendees_view.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaevents_attendees_view.scopefilter"></a>
<a id="schema_events_attendees_view.ScopeFilter"></a>
<a id="tocSevents_attendees_view.scopefilter"></a>
<a id="tocsevents_attendees_view.scopefilter"></a>

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

events_attendees_view.ScopeFilter

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

<h2 id="tocS_events_attendees_view.IncludeFilter.Items">events_attendees_view.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaevents_attendees_view.includefilter.items"></a>
<a id="schema_events_attendees_view.IncludeFilter.Items"></a>
<a id="tocSevents_attendees_view.includefilter.items"></a>
<a id="tocsevents_attendees_view.includefilter.items"></a>

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

events_attendees_view.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[events_attendees_view.ScopeFilter](#schemaevents_attendees_view.scopefilter)|false|none|none|

<h2 id="tocS_events_attendees_view.Filter">events_attendees_view.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaevents_attendees_view.filter"></a>
<a id="schema_events_attendees_view.Filter"></a>
<a id="tocSevents_attendees_view.filter"></a>
<a id="tocsevents_attendees_view.filter"></a>

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
    "bgColor": true,
    "description": true,
    "endDateTime": true,
    "fgColor": true,
    "iCalUid": true,
    "isFullDayEvent": true,
    "isLocked": true,
    "link": true,
    "location": true,
    "meetingLink": true,
    "identifier": true,
    "startDateTime": true,
    "status": true,
    "summary": true,
    "timezone": true,
    "calendarId": true,
    "parentEventId": true,
    "extId": true,
    "extMetadata": true,
    "attendeeId": true,
    "isOptional": true,
    "attendeeIdentifier": true,
    "isOrganizer": true,
    "messages": true,
    "responseStatus": true,
    "eventId": true
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

events_attendees_view.Filter

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
|»» bgColor|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» endDateTime|boolean|false|none|none|
|»» fgColor|boolean|false|none|none|
|»» iCalUid|boolean|false|none|none|
|»» isFullDayEvent|boolean|false|none|none|
|»» isLocked|boolean|false|none|none|
|»» link|boolean|false|none|none|
|»» location|boolean|false|none|none|
|»» meetingLink|boolean|false|none|none|
|»» identifier|boolean|false|none|none|
|»» startDateTime|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» summary|boolean|false|none|none|
|»» timezone|boolean|false|none|none|
|»» calendarId|boolean|false|none|none|
|»» parentEventId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|
|»» attendeeId|boolean|false|none|none|
|»» isOptional|boolean|false|none|none|
|»» attendeeIdentifier|boolean|false|none|none|
|»» isOrganizer|boolean|false|none|none|
|»» messages|boolean|false|none|none|
|»» responseStatus|boolean|false|none|none|
|»» eventId|boolean|false|none|none|

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
|» *anonymous*|[events_attendees_view.IncludeFilter.Items](#schemaevents_attendees_view.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

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

<h2 id="tocS_settings.Filter">settings.Filter</h2>
<!-- backwards compatibility -->
<a id="schemasettings.filter"></a>
<a id="schema_settings.Filter"></a>
<a id="tocSsettings.filter"></a>
<a id="tocssettings.filter"></a>

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
    "ownerId": true,
    "ownerType": true,
    "settingName": true,
    "settingValue": true,
    "extId": true,
    "extMetadata": true
  }
}

```

settings.Filter

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
|»» ownerId|boolean|false|none|none|
|»» ownerType|boolean|false|none|none|
|»» settingName|boolean|false|none|none|
|»» settingValue|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_settings.Filter1">settings.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemasettings.filter1"></a>
<a id="schema_settings.Filter1"></a>
<a id="tocSsettings.filter1"></a>
<a id="tocssettings.filter1"></a>

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
    "ownerId": true,
    "ownerType": true,
    "settingName": true,
    "settingValue": true,
    "extId": true,
    "extMetadata": true
  }
}

```

settings.Filter

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
|»» ownerId|boolean|false|none|none|
|»» ownerType|boolean|false|none|none|
|»» settingName|boolean|false|none|none|
|»» settingValue|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_subscriptions.Filter1">subscriptions.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptions.filter1"></a>
<a id="schema_subscriptions.Filter1"></a>
<a id="tocSsubscriptions.filter1"></a>
<a id="tocssubscriptions.filter1"></a>

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
    "accessRole": true,
    "bgColor": true,
    "fgColor": true,
    "isHidden": true,
    "isPrimary": true,
    "identifier": true,
    "defaultReminders": true,
    "notificationSettings": true,
    "calendarId": true,
    "extId": true,
    "extMetadata": true
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

subscriptions.Filter

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
|»» accessRole|boolean|false|none|none|
|»» bgColor|boolean|false|none|none|
|»» fgColor|boolean|false|none|none|
|»» isHidden|boolean|false|none|none|
|»» isPrimary|boolean|false|none|none|
|»» identifier|boolean|false|none|none|
|»» defaultReminders|boolean|false|none|none|
|»» notificationSettings|boolean|false|none|none|
|»» calendarId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[subscriptions.IncludeFilter.Items](#schemasubscriptions.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_themes.Filter">themes.Filter</h2>
<!-- backwards compatibility -->
<a id="schemathemes.filter"></a>
<a id="schema_themes.Filter"></a>
<a id="tocSthemes.filter"></a>
<a id="tocsthemes.filter"></a>

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
    "calBg": true,
    "calFg": true,
    "eventBg": true,
    "eventFg": true,
    "extId": true,
    "extMetadata": true
  }
}

```

themes.Filter

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
|»» calBg|boolean|false|none|none|
|»» calFg|boolean|false|none|none|
|»» eventBg|boolean|false|none|none|
|»» eventFg|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_themes.Filter1">themes.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemathemes.filter1"></a>
<a id="schema_themes.Filter1"></a>
<a id="tocSthemes.filter1"></a>
<a id="tocsthemes.filter1"></a>

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
    "calBg": true,
    "calFg": true,
    "eventBg": true,
    "eventFg": true,
    "extId": true,
    "extMetadata": true
  }
}

```

themes.Filter

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
|»» calBg|boolean|false|none|none|
|»» calFg|boolean|false|none|none|
|»» eventBg|boolean|false|none|none|
|»» eventFg|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_working_hours.ScopeFilter">working_hours.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaworking_hours.scopefilter"></a>
<a id="schema_working_hours.ScopeFilter"></a>
<a id="tocSworking_hours.scopefilter"></a>
<a id="tocsworking_hours.scopefilter"></a>

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

working_hours.ScopeFilter

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

<h2 id="tocS_working_hours.IncludeFilter.Items">working_hours.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaworking_hours.includefilter.items"></a>
<a id="schema_working_hours.IncludeFilter.Items"></a>
<a id="tocSworking_hours.includefilter.items"></a>
<a id="tocsworking_hours.includefilter.items"></a>

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

working_hours.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[working_hours.ScopeFilter](#schemaworking_hours.scopefilter)|false|none|none|

<h2 id="tocS_working_hours.Filter">working_hours.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaworking_hours.filter"></a>
<a id="schema_working_hours.Filter"></a>
<a id="tocSworking_hours.filter"></a>
<a id="tocsworking_hours.filter"></a>

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
    "dayOfWeek": true,
    "end": true,
    "start": true,
    "calendarId": true,
    "extId": true,
    "extMetadata": true
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

working_hours.Filter

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
|»» dayOfWeek|boolean|false|none|none|
|»» end|boolean|false|none|none|
|»» start|boolean|false|none|none|
|»» calendarId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[working_hours.IncludeFilter.Items](#schemaworking_hours.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_working_hours.Filter1">working_hours.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemaworking_hours.filter1"></a>
<a id="schema_working_hours.Filter1"></a>
<a id="tocSworking_hours.filter1"></a>
<a id="tocsworking_hours.filter1"></a>

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
    "dayOfWeek": true,
    "end": true,
    "start": true,
    "calendarId": true,
    "extId": true,
    "extMetadata": true
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

working_hours.Filter

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
|»» dayOfWeek|boolean|false|none|none|
|»» end|boolean|false|none|none|
|»» start|boolean|false|none|none|
|»» calendarId|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[working_hours.IncludeFilter.Items](#schemaworking_hours.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

