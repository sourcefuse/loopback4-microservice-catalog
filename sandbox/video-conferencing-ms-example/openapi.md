---
title: Video Conferencing Service v1.0.0
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

<h1 id="video-conferencing-service">Video Conferencing Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

A Video conferencing service example

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="video-conferencing-service-videochatarchivecontroller">VideoChatArchiveController</h1>

## VideoChatArchiveController.setUploadTarget

<a id="opIdVideoChatArchiveController.setUploadTarget"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {};
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/plain'
};

fetch('http://localhost:3000/archives/storage-target',
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

`PUT /archives/storage-target`

> Body parameter

```json
{}
```

<h3 id="videochatarchivecontroller.setuploadtarget-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```
null
```

<h3 id="videochatarchivecontroller.setuploadtarget-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|text|

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatArchiveController.getArchive

<a id="opIdVideoChatArchiveController.getArchive"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/archives/{archiveId}',
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

`GET /archives/{archiveId}`

<h3 id="videochatarchivecontroller.getarchive-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|archiveId|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="videochatarchivecontroller.getarchive-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="videochatarchivecontroller.getarchive-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatArchiveController.deleteArchive

<a id="opIdVideoChatArchiveController.deleteArchive"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'text/plain'
};

fetch('http://localhost:3000/archives/{archiveId}',
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

`DELETE /archives/{archiveId}`

<h3 id="videochatarchivecontroller.deletearchive-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|archiveId|path|string|true|none|

> Example responses

> 200 Response

```
null
```

<h3 id="videochatarchivecontroller.deletearchive-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|text|

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatArchiveController.getArchives

<a id="opIdVideoChatArchiveController.getArchives"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/archives',
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

`GET /archives`

> Example responses

> 200 Response

```json
{}
```

<h3 id="videochatarchivecontroller.getarchives-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="videochatarchivecontroller.getarchives-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="video-conferencing-service-videochatsessioncontroller">VideoChatSessionController</h1>

## VideoChatSessionController.getAttendeesList

<a id="opIdVideoChatSessionController.getAttendeesList"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'text/plain'
};

fetch('http://localhost:3000/session/{meetingLinkId}/attendees',
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

`GET /session/{meetingLinkId}/attendees`

<h3 id="videochatsessioncontroller.getattendeeslist-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|meetingLinkId|path|string|true|none|
|active|query|string|false|none|

> Example responses

> 200 Response

```
[]
```

<h3 id="videochatsessioncontroller.getattendeeslist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="videochatsessioncontroller.getattendeeslist-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatSessionController.endSession

<a id="opIdVideoChatSessionController.endSession"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/session/{meetingLinkId}/end',
{
  method: 'PATCH'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /session/{meetingLinkId}/end`

<h3 id="videochatsessioncontroller.endsession-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|meetingLinkId|path|string|true|none|

<h3 id="videochatsessioncontroller.endsession-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|MessageRecipient PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatSessionController.getMeetingToken

<a id="opIdVideoChatSessionController.getMeetingToken"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/session/{meetingLinkId}/token',
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

`POST /session/{meetingLinkId}/token`

> Body parameter

```json
{}
```

<h3 id="videochatsessioncontroller.getmeetingtoken-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|meetingLinkId|path|string|true|none|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="videochatsessioncontroller.getmeetingtoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

<h3 id="videochatsessioncontroller.getmeetingtoken-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatSessionController.editMeeting

<a id="opIdVideoChatSessionController.editMeeting"></a>

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
  "id": 0,
  "sessionId": "string",
  "meetingLink": "string",
  "isScheduled": true,
  "scheduleTime": "2019-08-24T14:15:22Z",
  "isArchived": true,
  "archiveId": "string",
  "uploadTarget": "string",
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/session/{meetingLinkId}',
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

`PATCH /session/{meetingLinkId}`

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
  "id": 0,
  "sessionId": "string",
  "meetingLink": "string",
  "isScheduled": true,
  "scheduleTime": "2019-08-24T14:15:22Z",
  "isArchived": true,
  "archiveId": "string",
  "uploadTarget": "string",
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="videochatsessioncontroller.editmeeting-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|meetingLinkId|path|string|true|none|
|body|body|[VideoChatSessionPartial](#schemavideochatsessionpartial)|false|none|

<h3 id="videochatsessioncontroller.editmeeting-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Session details PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatSessionController.getMeetingLink

<a id="opIdVideoChatSessionController.getMeetingLink"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {};
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/plain'
};

fetch('http://localhost:3000/session',
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

`POST /session`

> Body parameter

```json
{}
```

<h3 id="videochatsessioncontroller.getmeetinglink-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```
"string"
```

<h3 id="videochatsessioncontroller.getmeetinglink-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|

<aside class="success">
This operation does not require authentication
</aside>

## VideoChatSessionController.checkWebhookPayload

<a id="opIdVideoChatSessionController.checkWebhookPayload"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/webhooks/session',
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

`POST /webhooks/session`

> Body parameter

```json
{}
```

<h3 id="videochatsessioncontroller.checkwebhookpayload-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

<h3 id="videochatsessioncontroller.checkwebhookpayload-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|POST /webhooks/session Success|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_VideoChatSessionPartial">VideoChatSessionPartial</h2>
<!-- backwards compatibility -->
<a id="schemavideochatsessionpartial"></a>
<a id="schema_VideoChatSessionPartial"></a>
<a id="tocSvideochatsessionpartial"></a>
<a id="tocsvideochatsessionpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": 0,
  "sessionId": "string",
  "meetingLink": "string",
  "isScheduled": true,
  "scheduleTime": "2019-08-24T14:15:22Z",
  "isArchived": true,
  "archiveId": "string",
  "uploadTarget": "string",
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z",
  "extId": "string",
  "extMetadata": {}
}

```

VideoChatSessionPartial

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
|id|number|false|none|none|
|sessionId|string|false|none|none|
|meetingLink|string|false|none|none|
|isScheduled|boolean|false|none|none|
|scheduleTime|string(date-time)|false|none|none|
|isArchived|boolean|false|none|none|
|archiveId|string|false|none|none|
|uploadTarget|string|false|none|none|
|startTime|string(date-time)|false|none|none|
|endTime|string(date-time)|false|none|none|
|extId|string|false|none|none|
|extMetadata|object|false|none|none|

