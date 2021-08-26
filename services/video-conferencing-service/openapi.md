---
title: Video Conferencing Service v1.0.0
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

<h1 id="video-conferencing-service">Video Conferencing Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Microservice providing Video-Conferencing service

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="video-conferencing-service-videochatarchivecontroller">VideoChatArchiveController</h1>

## VideoChatArchiveController.setUploadTarget

<a id="opIdVideoChatArchiveController.setUploadTarget"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/archives/storage-target',
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
const inputBody = {};
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/archives/storage-target',
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

Configures custom storage target to a custom Amazon s3 bucket or Microsoft Azure Storage.

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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatArchiveController.getArchive

<a id="opIdVideoChatArchiveController.getArchive"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/archives/{archiveId}',
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

fetch('/archives/{archiveId}',
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

Used to fetch a specific archive w.r.t archiveId. If archive is not present, it will throw HTTP Not Found Error.

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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatArchiveController.deleteArchive

<a id="opIdVideoChatArchiveController.deleteArchive"></a>

> Code samples

```javascript

const headers = {
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/archives/{archiveId}',
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
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/archives/{archiveId}',
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

Used to delete a specific archive w.r.t archiveId. If archive is not present, it will throw HTTP Not Found Error.

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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatArchiveController.getArchives

<a id="opIdVideoChatArchiveController.getArchives"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/archives',
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

fetch('/archives',
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

Used to fetch a list of archives (meetings that were recorded).

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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="video-conferencing-service-videochatsessioncontroller">VideoChatSessionController</h1>

## VideoChatSessionController.getAttendeesList

<a id="opIdVideoChatSessionController.getAttendeesList"></a>

> Code samples

```javascript

const headers = {
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/session/{meetingLinkId}/attendees',
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
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/session/{meetingLinkId}/attendees',
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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatSessionController.endSession

<a id="opIdVideoChatSessionController.endSession"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/session/{meetingLinkId}/end',
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

fetch('/session/{meetingLinkId}/end',
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

`PATCH /session/{meetingLinkId}/end`

Used to stop the current active meeting. Meeting cannot be stopped again if it is 
      already stopped. Successful execution will add the endTime attribute to a recently 
      ending session.

<h3 id="videochatsessioncontroller.endsession-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|meetingLinkId|path|string|true|none|

<h3 id="videochatsessioncontroller.endsession-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|MessageRecipient PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatSessionController.getMeetingToken

<a id="opIdVideoChatSessionController.getMeetingToken"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/session/{meetingLinkId}/token',
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
const inputBody = {};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/session/{meetingLinkId}/token',
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

Used for Generating token, which is used for connecting to a room/session on a client side. 
      In vonage, there are three different roles (Moderator, Subscriber, Publisher). 
      We can use expire time for limited validity of a token. Successful 
      execution will send a token.

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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatSessionController.editMeeting

<a id="opIdVideoChatSessionController.editMeeting"></a>

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
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/session/{meetingLinkId}',
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
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/session/{meetingLinkId}',
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

Used for editing the meeting

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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatSessionController.getMeetingLink

<a id="opIdVideoChatSessionController.getMeetingLink"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/session',
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
const inputBody = {};
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/plain',
  'Authorization':'Bearer {access-token}'
};

fetch('/session',
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

Used for Creating a session with options such as end to end encryption, archive mode. 
      Note: Archiving Option cannot be enabled while using end to end encryption, otherwise 
      an Error will be thrown. Successful execution will send a meeting link 
      id which can be used to amend in client url.

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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## VideoChatSessionController.checkWebhookPayload

<a id="opIdVideoChatSessionController.checkWebhookPayload"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/webhooks/session',
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
const inputBody = {};
const headers = {
  'Content-Type':'application/json'
};

fetch('/webhooks/session',
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

Webhook API hit from a third party to add/update session attendees in a meeting.

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

