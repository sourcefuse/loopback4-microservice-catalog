---
title: Notification Service v1.0.0
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

<h1 id="notification-service">Notification Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

notification microservice.

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="notification-service-notificationusercontroller">NotificationUserController</h1>

## NotificationUserController.createAll

<a id="opIdNotificationUserController.createAll"></a>

> Code samples

```javascript
const inputBody = '[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "notificationId": "string",
    "userId": "string",
    "isRead": true,
    "actionMeta": {},
    "isDraft": true
  }
]';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/bulk',
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
const inputBody = [
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "notificationId": "string",
    "userId": "string",
    "isRead": true,
    "actionMeta": {},
    "isDraft": true
  }
];
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/bulk',
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

`POST /notification-users/bulk`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

> Body parameter

```json
[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "notificationId": "string",
    "userId": "string",
    "isRead": true,
    "actionMeta": {},
    "isDraft": true
  }
]
```

<h3 id="notificationusercontroller.createall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewNotificationUser](#schemanewnotificationuser)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationusercontroller.createall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification User model instance|[NotificationUser](#schemanotificationuser)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.count

<a id="opIdNotificationUserController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/count',
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

fetch('/notification-users/count',
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

`GET /notification-users/count`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

<h3 id="notificationusercontroller.count-parameters">Parameters</h3>

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

<h3 id="notificationusercontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|NotificationUser model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.deleteAllHard

<a id="opIdNotificationUserController.deleteAllHard"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/hard',
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

fetch('/notification-users/hard',
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

`DELETE /notification-users/hard`

| Permissions |
| ------- |
| DeleteNotification   |
| 4   |

<h3 id="notificationusercontroller.deleteallhard-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

<h3 id="notificationusercontroller.deleteallhard-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.replaceById

<a id="opIdNotificationUserController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/{id}',
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
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/{id}',
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

`PUT /notification-users/{id}`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationusercontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NotificationUser](#schemanotificationuser)|false|none|

<h3 id="notificationusercontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|NotificationUser PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.updateById

<a id="opIdNotificationUserController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/{id}',
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
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/{id}',
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

`PATCH /notification-users/{id}`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationusercontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NotificationUserPartial](#schemanotificationuserpartial)|false|none|

<h3 id="notificationusercontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|NotificationUser PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.findById

<a id="opIdNotificationUserController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/{id}',
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

fetch('/notification-users/{id}',
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

`GET /notification-users/{id}`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

<h3 id="notificationusercontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationusercontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|NotificationUser instance|[NotificationUser](#schemanotificationuser)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.deleteById

<a id="opIdNotificationUserController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/{id}',
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

fetch('/notification-users/{id}',
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

`DELETE /notification-users/{id}`

| Permissions |
| ------- |
| DeleteNotification   |
| 4   |

<h3 id="notificationusercontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="notificationusercontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|NotificationUser DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.create

<a id="opIdNotificationUserController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users',
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
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users',
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

`POST /notification-users`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationusercontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewNotificationUser](#schemanewnotificationuser)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationusercontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|NotificationUser model instance|[NotificationUser](#schemanotificationuser)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.updateAll

<a id="opIdNotificationUserController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users',
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
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users',
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

`PATCH /notification-users`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationusercontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[NotificationUserPartial](#schemanotificationuserpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="notificationusercontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|NotificationUser PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.find

<a id="opIdNotificationUserController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users',
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

fetch('/notification-users',
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

`GET /notification-users`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

<h3 id="notificationusercontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[notification_users.Filter](#schemanotification_users.filter)|false|none|

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
    "id": "string",
    "notificationId": "string",
    "userId": "string",
    "isRead": true,
    "actionMeta": {},
    "isDraft": true
  }
]
```

<h3 id="notificationusercontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of NotificationUser model instances|Inline|

<h3 id="notificationusercontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[NotificationUser](#schemanotificationuser)]|false|none|none|
|» NotificationUser|[NotificationUser](#schemanotificationuser)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» id|string|false|none|none|
|»» notificationId|string|true|none|none|
|»» userId|string|true|none|none|
|»» isRead|boolean|false|none|none|
|»» actionMeta|object|false|none|none|
|»» isDraft|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationUserController.deleteAll

<a id="opIdNotificationUserController.deleteAll"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users',
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

fetch('/notification-users',
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

`DELETE /notification-users`

| Permissions |
| ------- |
| DeleteNotification   |
| 4   |

<h3 id="notificationusercontroller.deleteall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

<h3 id="notificationusercontroller.deleteall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="notification-service-notificationusernotificationcontroller">NotificationUserNotificationController</h1>

## NotificationUserNotificationController.getNotification

<a id="opIdNotificationUserNotificationController.getNotification"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notification-users/{id}/notification',
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

fetch('/notification-users/{id}/notification',
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

`GET /notification-users/{id}/notification`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

<h3 id="notificationusernotificationcontroller.getnotification-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "subject": "string",
    "body": "string",
    "receiver": {},
    "type": 0,
    "sentDate": "2019-08-24T14:15:22Z",
    "options": {},
    "isDraft": true,
    "groupKey": "string",
    "isCritical": true
  }
]
```

<h3 id="notificationusernotificationcontroller.getnotification-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification belonging to NotificationUser|Inline|

<h3 id="notificationusernotificationcontroller.getnotification-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Notification](#schemanotification)]|false|none|none|
|» Notification|[Notification](#schemanotification)|false|none|none|
|»» id|string|false|none|none|
|»» subject|string¦null|false|none|none|
|»» body|string|true|none|none|
|»» receiver|object|false|none|none|
|»» type|number|true|none|none|
|»» sentDate|string(date-time)|false|none|none|
|»» options|object|false|none|none|
|»» isDraft|boolean|false|none|none|
|»» groupKey|string|false|none|none|
|»» isCritical|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="notification-service-pubnubnotificationcontroller">PubnubNotificationController</h1>

## PubnubNotificationController.grantAccess

<a id="opIdPubnubNotificationController.grantAccess"></a>

> Code samples

```javascript
const inputBody = '{
  "receiver": {},
  "type": 0,
  "options": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string',
  'pubnubToken':'string'
};

fetch('/notifications/access/{id}',
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
  "receiver": {},
  "type": 0,
  "options": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string',
  'pubnubToken':'string'
};

fetch('/notifications/access/{id}',
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

`PATCH /notifications/access/{id}`

| Permissions |
| ------- |
| CanGetNotificationAccess   |
| 5   |

> Body parameter

```json
{
  "receiver": {},
  "type": 0,
  "options": {}
}
```

<h3 id="pubnubnotificationcontroller.grantaccess-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|Authorization|header|string|false|none|
|pubnubToken|header|string|true|none|
|body|body|[NotificationAccess](#schemanotificationaccess)|false|none|

> Example responses

> 200 Response

```json
{
  "ttl": 0,
  "cipherKey": "string"
}
```

<h3 id="pubnubnotificationcontroller.grantaccess-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Access response|[AccessResponseDto](#schemaaccessresponsedto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## PubnubNotificationController.revokeAccess

<a id="opIdPubnubNotificationController.revokeAccess"></a>

> Code samples

```javascript

fetch('/notifications/access/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/notifications/access/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /notifications/access/{id}`

<h3 id="pubnubnotificationcontroller.revokeaccess-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="pubnubnotificationcontroller.revokeaccess-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Object with success|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="notification-service-notificationcontroller">NotificationController</h1>

## NotificationController.createBulkNotificaitions

<a id="opIdNotificationController.createBulkNotificaitions"></a>

> Code samples

```javascript
const inputBody = '[
  {
    "subject": "string",
    "body": "string",
    "receiver": {},
    "type": 0,
    "sentDate": "2019-08-24T14:15:22Z",
    "options": {},
    "isDraft": true,
    "groupKey": "string",
    "isCritical": true
  }
]';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/bulk',
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
const inputBody = [
  {
    "subject": "string",
    "body": "string",
    "receiver": {},
    "type": 0,
    "sentDate": "2019-08-24T14:15:22Z",
    "options": {},
    "isDraft": true,
    "groupKey": "string",
    "isCritical": true
  }
];
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/bulk',
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

`POST /notifications/bulk`

| Permissions |
| ------- |
| CreateNotification   |
| 2   |

> Body parameter

```json
[
  {
    "subject": "string",
    "body": "string",
    "receiver": {},
    "type": 0,
    "sentDate": "2019-08-24T14:15:22Z",
    "options": {},
    "isDraft": true,
    "groupKey": "string",
    "isCritical": true
  }
]
```

<h3 id="notificationcontroller.createbulknotificaitions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NotificationExcluding_id_](#schemanotificationexcluding_id_)|false|none|

> Example responses

<h3 id="notificationcontroller.createbulknotificaitions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Notifications, to send notifications as bulk.|None|

<h3 id="notificationcontroller.createbulknotificaitions-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.count

<a id="opIdNotificationController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/count',
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

fetch('/notifications/count',
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

`GET /notifications/count`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

<h3 id="notificationcontroller.count-parameters">Parameters</h3>

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

<h3 id="notificationcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.draftNotification

<a id="opIdNotificationController.draftNotification"></a>

> Code samples

```javascript
const inputBody = '{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/drafts',
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
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/drafts',
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

`POST /notifications/drafts`

| Permissions |
| ------- |
| CreateNotification   |
| 2   |

> Body parameter

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
}
```

<h3 id="notificationcontroller.draftnotification-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NotificationExcluding_id-isDraft_](#schemanotificationexcluding_id-isdraft_)|false|none|

> Example responses

> 200 Response

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
}
```

<h3 id="notificationcontroller.draftnotification-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|This API is used to draft notifications, here in case isDraft .|[NotificationExcluding_id-isDraft_](#schemanotificationexcluding_id-isdraft_)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.sendGroupedNotificationByGroupKey

<a id="opIdNotificationController.sendGroupedNotificationByGroupKey"></a>

> Code samples

```javascript
const inputBody = '{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "isCritical": true,
  "type": 0,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/groups/{groupKey}',
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
  "subject": "string",
  "body": "string",
  "receiver": {},
  "isCritical": true,
  "type": 0,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/groups/{groupKey}',
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

`POST /notifications/groups/{groupKey}`

| Permissions |
| ------- |
| CreateNotification   |
| 2   |

> Body parameter

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "isCritical": true,
  "type": 0,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}
```

<h3 id="notificationcontroller.sendgroupednotificationbygroupkey-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|groupKey|path|string|true|none|
|body|body|[NotificationDtoExcluding_id-groupKey_](#schemanotificationdtoexcluding_id-groupkey_)|false|none|

> Example responses

> 200 Response

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "isCritical": true,
  "type": 0,
  "groupKey": "string",
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}
```

<h3 id="notificationcontroller.sendgroupednotificationbygroupkey-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|This API is used to send notification by grouping by given key in the end point.|[NotificationDtoExcluding_id_](#schemanotificationdtoexcluding_id_)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.sendNotificationForSleepTimeUsers

<a id="opIdNotificationController.sendNotificationForSleepTimeUsers"></a>

> Code samples

```javascript
const inputBody = '{
  "ids": [
    "string"
  ],
  "userId": [
    "string"
  ],
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/send',
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
  "ids": [
    "string"
  ],
  "userId": [
    "string"
  ],
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/send',
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

`POST /notifications/send`

| Permissions |
| ------- |
| CreateNotification   |
| 2   |

> Body parameter

```json
{
  "ids": [
    "string"
  ],
  "userId": [
    "string"
  ],
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z"
}
```

<h3 id="notificationcontroller.sendnotificationforsleeptimeusers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NotificationSettingsDto](#schemanotificationsettingsdto)|false|none|

> Example responses

> 200 Response

```json
{
  "ids": [
    "string"
  ],
  "userId": [
    "string"
  ],
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z"
}
```

<h3 id="notificationcontroller.sendnotificationforsleeptimeusers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|This API is used to send notifications for given search criteria.|[NotificationSettingsDto](#schemanotificationsettingsdto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.sendNotificationById

<a id="opIdNotificationController.sendNotificationById"></a>

> Code samples

```javascript
const inputBody = '{
  "isCritical": true,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/send',
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
  "isCritical": true,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/send',
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

`POST /notifications/{id}/send`

| Permissions |
| ------- |
| CreateNotification   |
| 2   |

> Body parameter

```json
{
  "isCritical": true,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}
```

<h3 id="notificationcontroller.sendnotificationbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NotificationDtoExcluding_id-groupKey-receiver-subject-body-type_](#schemanotificationdtoexcluding_id-groupkey-receiver-subject-body-type_)|false|none|

> Example responses

> 200 Response

```json
{
  "isCritical": true,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}
```

<h3 id="notificationcontroller.sendnotificationbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|This API is used to send notifications for given Notification Id.|[NotificationDtoExcluding_id-groupKey-receiver-subject-body-type_](#schemanotificationdtoexcluding_id-groupkey-receiver-subject-body-type_)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.updateById

<a id="opIdNotificationController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}',
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
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}',
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

`PATCH /notifications/{id}`

| Permissions |
| ------- |
| UpdateNotification   |
| 3   |

> Body parameter

```json
{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}
```

<h3 id="notificationcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NotificationPartial](#schemanotificationpartial)|false|none|

<h3 id="notificationcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.findById

<a id="opIdNotificationController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/notifications/{id}',
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

fetch('/notifications/{id}',
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

`GET /notifications/{id}`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

<h3 id="notificationcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}
```

<h3 id="notificationcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|, to get the notification by ID|[Notification](#schemanotification)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.create

<a id="opIdNotificationController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications',
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
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications',
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

`POST /notifications`

| Permissions |
| ------- |
| CreateNotification   |
| 2   |

> Body parameter

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
}
```

<h3 id="notificationcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NotificationExcluding_id-isDraft_](#schemanotificationexcluding_id-isdraft_)|false|This API is used to send notifications, the request body contains the object of notification model.|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}
```

<h3 id="notificationcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model instance, This API end point will be used to send the notification to the user.|[Notification](#schemanotification)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.updateAll

<a id="opIdNotificationController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications',
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
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications',
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

`PATCH /notifications`

| Permissions |
| ------- |
| UpdateNotification   |
| 3   |

> Body parameter

```json
{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}
```

<h3 id="notificationcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[NotificationPartial](#schemanotificationpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="notificationcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.find

<a id="opIdNotificationController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications',
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

fetch('/notifications',
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

`GET /notifications`

<h3 id="notificationcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[notifications.Filter](#schemanotifications.filter)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "subject": "string",
    "body": "string",
    "receiver": {},
    "type": 0,
    "sentDate": "2019-08-24T14:15:22Z",
    "options": {},
    "isDraft": true,
    "groupKey": "string",
    "isCritical": true
  }
]
```

<h3 id="notificationcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Notification model instances, To get the notifications|Inline|

<h3 id="notificationcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Notification](#schemanotification)]|false|none|none|
|» Notification|[Notification](#schemanotification)|false|none|none|
|»» id|string|false|none|none|
|»» subject|string¦null|false|none|none|
|»» body|string|true|none|none|
|»» receiver|object|false|none|none|
|»» type|number|true|none|none|
|»» sentDate|string(date-time)|false|none|none|
|»» options|object|false|none|none|
|»» isDraft|boolean|false|none|none|
|»» groupKey|string|false|none|none|
|»» isCritical|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationController.deleteAll

<a id="opIdNotificationController.deleteAll"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications',
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

fetch('/notifications',
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

`DELETE /notifications`

| Permissions |
| ------- |
| DeleteNotification   |
| 4   |

<h3 id="notificationcontroller.deleteall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

<h3 id="notificationcontroller.deleteall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="notification-service-notificationnotificationusercontroller">NotificationNotificationUserController</h1>

## NotificationNotificationUserController.create

<a id="opIdNotificationNotificationUserController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/notification-users',
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
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/notification-users',
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

`POST /notifications/{id}/notification-users`

| Permissions |
| ------- |
| CreateNotification   |
| 2   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationnotificationusercontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewNotificationUserInNotification](#schemanewnotificationuserinnotification)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationnotificationusercontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model instance|[NotificationUser](#schemanotificationuser)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationNotificationUserController.patch

<a id="opIdNotificationNotificationUserController.patch"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/notification-users',
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
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/notification-users',
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

`PATCH /notifications/{id}/notification-users`

| Permissions |
| ------- |
| UpdateNotification   |
| 3   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}
```

<h3 id="notificationnotificationusercontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[NotificationUserPartial](#schemanotificationuserpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="notificationnotificationusercontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification.NotificationUser PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationNotificationUserController.find

<a id="opIdNotificationNotificationUserController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/notification-users',
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

fetch('/notifications/{id}/notification-users',
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

`GET /notifications/{id}/notification-users`

| Permissions |
| ------- |
| ViewNotification   |
| 1   |

<h3 id="notificationnotificationusercontroller.find-parameters">Parameters</h3>

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
    "id": "string",
    "notificationId": "string",
    "userId": "string",
    "isRead": true,
    "actionMeta": {},
    "isDraft": true
  }
]
```

<h3 id="notificationnotificationusercontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Notification has many NotificationUser|Inline|

<h3 id="notificationnotificationusercontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[NotificationUser](#schemanotificationuser)]|false|none|none|
|» NotificationUser|[NotificationUser](#schemanotificationuser)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» id|string|false|none|none|
|»» notificationId|string|true|none|none|
|»» userId|string|true|none|none|
|»» isRead|boolean|false|none|none|
|»» actionMeta|object|false|none|none|
|»» isDraft|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## NotificationNotificationUserController.delete

<a id="opIdNotificationNotificationUserController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/notifications/{id}/notification-users',
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

fetch('/notifications/{id}/notification-users',
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

`DELETE /notifications/{id}/notification-users`

| Permissions |
| ------- |
| DeleteNotification   |
| 4   |

<h3 id="notificationnotificationusercontroller.delete-parameters">Parameters</h3>

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

<h3 id="notificationnotificationusercontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification.NotificationUser DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="notification-service-usernotificationsettingscontroller">UserNotificationSettingsController</h1>

## UserNotificationSettingsController.count

<a id="opIdUserNotificationSettingsController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-notification-settings/count',
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

fetch('/user-notification-settings/count',
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

`GET /user-notification-settings/count`

| Permissions |
| ------- |
| ViewNotificationUserSettings   |

<h3 id="usernotificationsettingscontroller.count-parameters">Parameters</h3>

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

<h3 id="usernotificationsettingscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserNotificationSettings model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## UserNotificationSettingsController.replaceById

<a id="opIdUserNotificationSettingsController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings/{id}',
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
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings/{id}',
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

`PUT /user-notification-settings/{id}`

| Permissions |
| ------- |
| UpdateNotificationUserSettings   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}
```

<h3 id="usernotificationsettingscontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UserNotificationSettings](#schemausernotificationsettings)|false|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="usernotificationsettingscontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of UserNotificationSettingsController.replaceById|None|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="usernotificationsettingscontroller.replacebyid-responseschema">Response Schema</h3>

Status Code **204**

*UserNotificationSettings PUT success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## UserNotificationSettingsController.updateById

<a id="opIdUserNotificationSettingsController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings/{id}',
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
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings/{id}',
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

`PATCH /user-notification-settings/{id}`

| Permissions |
| ------- |
| UpdateNotificationUserSettings   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}
```

<h3 id="usernotificationsettingscontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[UserNotificationSettingsPartial](#schemausernotificationsettingspartial)|false|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="usernotificationsettingscontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of UserNotificationSettingsController.updateById|None|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="usernotificationsettingscontroller.updatebyid-responseschema">Response Schema</h3>

Status Code **204**

*UserNotificationSettings PATCH success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## UserNotificationSettingsController.findById

<a id="opIdUserNotificationSettingsController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-notification-settings/{id}',
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

fetch('/user-notification-settings/{id}',
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

`GET /user-notification-settings/{id}`

| Permissions |
| ------- |
| ViewNotificationUserSettings   |

<h3 id="usernotificationsettingscontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}
```

<h3 id="usernotificationsettingscontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserNotificationSettings model instance|[UserNotificationSettingsWithRelations](#schemausernotificationsettingswithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## UserNotificationSettingsController.deleteById

<a id="opIdUserNotificationSettingsController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-notification-settings/{id}',
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

fetch('/user-notification-settings/{id}',
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

`DELETE /user-notification-settings/{id}`

| Permissions |
| ------- |
| DeleteNotificationUserSettings   |

<h3 id="usernotificationsettingscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="usernotificationsettingscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of UserNotificationSettingsController.deleteById|None|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="usernotificationsettingscontroller.deletebyid-responseschema">Response Schema</h3>

Status Code **204**

*UserNotificationSettings DELETE success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## UserNotificationSettingsController.create

<a id="opIdUserNotificationSettingsController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings',
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
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings',
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

`POST /user-notification-settings`

| Permissions |
| ------- |
| CreateNotificationUserSettings   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}
```

<h3 id="usernotificationsettingscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewUserNotificationSettings](#schemanewusernotificationsettings)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}
```

<h3 id="usernotificationsettingscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserNotificationSettings model instance|[UserNotificationSettings](#schemausernotificationsettings)|

<aside class="success">
This operation does not require authentication
</aside>

## UserNotificationSettingsController.updateAll

<a id="opIdUserNotificationSettingsController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings',
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
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-notification-settings',
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

`PATCH /user-notification-settings`

| Permissions |
| ------- |
| UpdateNotificationUserSettings   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}
```

<h3 id="usernotificationsettingscontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[UserNotificationSettingsPartial](#schemausernotificationsettingspartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="usernotificationsettingscontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserNotificationSettings PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## UserNotificationSettingsController.find

<a id="opIdUserNotificationSettingsController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-notification-settings',
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

fetch('/user-notification-settings',
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

`GET /user-notification-settings`

| Permissions |
| ------- |
| ViewNotificationUserSettings   |

<h3 id="usernotificationsettingscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[user_notification_settings.Filter](#schemauser_notification_settings.filter)|false|none|

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
    "id": "string",
    "userId": "string",
    "sleepStartTime": "2019-08-24T14:15:22Z",
    "sleepEndTime": "2019-08-24T14:15:22Z",
    "type": 0
  }
]
```

<h3 id="usernotificationsettingscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of UserNotificationSettings model instances|Inline|

<h3 id="usernotificationsettingscontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserNotificationSettingsWithRelations](#schemausernotificationsettingswithrelations)]|false|none|[(tsType: UserNotificationSettingsWithRelations, schemaOptions: { includeRelations: true })]|
|» UserNotificationSettingsWithRelations|[UserNotificationSettingsWithRelations](#schemausernotificationsettingswithrelations)|false|none|(tsType: UserNotificationSettingsWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» id|string|false|none|none|
|»» userId|string|true|none|none|
|»» sleepStartTime|string(date-time)|true|none|none|
|»» sleepEndTime|string(date-time)|true|none|none|
|»» type|number|true|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Notification">Notification</h2>
<!-- backwards compatibility -->
<a id="schemanotification"></a>
<a id="schema_Notification"></a>
<a id="tocSnotification"></a>
<a id="tocsnotification"></a>

```json
{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}

```

Notification

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|subject|string¦null|false|none|none|
|body|string|true|none|none|
|receiver|object|false|none|none|
|type|number|true|none|none|
|sentDate|string(date-time)|false|none|none|
|options|object|false|none|none|
|isDraft|boolean|false|none|none|
|groupKey|string|false|none|none|
|isCritical|boolean|false|none|none|

<h2 id="tocS_NotificationExcluding_id-isDraft_">NotificationExcluding_id-isDraft_</h2>
<!-- backwards compatibility -->
<a id="schemanotificationexcluding_id-isdraft_"></a>
<a id="schema_NotificationExcluding_id-isDraft_"></a>
<a id="tocSnotificationexcluding_id-isdraft_"></a>
<a id="tocsnotificationexcluding_id-isdraft_"></a>

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "groupKey": "string",
  "isCritical": true
}

```

NotificationExcluding_id-isDraft_

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|subject|string¦null|false|none|none|
|body|string|true|none|none|
|receiver|object|false|none|none|
|type|number|true|none|none|
|sentDate|string(date-time)|false|none|none|
|options|object|false|none|none|
|groupKey|string|false|none|none|
|isCritical|boolean|false|none|none|

<h2 id="tocS_NotificationDtoExcluding_id_">NotificationDtoExcluding_id_</h2>
<!-- backwards compatibility -->
<a id="schemanotificationdtoexcluding_id_"></a>
<a id="schema_NotificationDtoExcluding_id_"></a>
<a id="tocSnotificationdtoexcluding_id_"></a>
<a id="tocsnotificationdtoexcluding_id_"></a>

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "isCritical": true,
  "type": 0,
  "groupKey": "string",
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}

```

NotificationDtoExcluding_id_

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|subject|string¦null|false|none|none|
|body|string|false|none|none|
|receiver|object|false|none|none|
|isCritical|boolean|false|none|none|
|type|number|true|none|none|
|groupKey|string|false|none|none|
|options|object|false|none|none|
|sentDate|string(date-time)|false|none|none|

<h2 id="tocS_NotificationDtoExcluding_id-groupKey_">NotificationDtoExcluding_id-groupKey_</h2>
<!-- backwards compatibility -->
<a id="schemanotificationdtoexcluding_id-groupkey_"></a>
<a id="schema_NotificationDtoExcluding_id-groupKey_"></a>
<a id="tocSnotificationdtoexcluding_id-groupkey_"></a>
<a id="tocsnotificationdtoexcluding_id-groupkey_"></a>

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "isCritical": true,
  "type": 0,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}

```

NotificationDtoExcluding_id-groupKey_

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|subject|string¦null|false|none|none|
|body|string|false|none|none|
|receiver|object|false|none|none|
|isCritical|boolean|false|none|none|
|type|number|true|none|none|
|options|object|false|none|none|
|sentDate|string(date-time)|false|none|none|

<h2 id="tocS_NotificationDtoExcluding_id-groupKey-receiver-subject-body-type_">NotificationDtoExcluding_id-groupKey-receiver-subject-body-type_</h2>
<!-- backwards compatibility -->
<a id="schemanotificationdtoexcluding_id-groupkey-receiver-subject-body-type_"></a>
<a id="schema_NotificationDtoExcluding_id-groupKey-receiver-subject-body-type_"></a>
<a id="tocSnotificationdtoexcluding_id-groupkey-receiver-subject-body-type_"></a>
<a id="tocsnotificationdtoexcluding_id-groupkey-receiver-subject-body-type_"></a>

```json
{
  "isCritical": true,
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}

```

NotificationDtoExcluding_id-groupKey-receiver-subject-body-type_

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|isCritical|boolean|false|none|none|
|options|object|false|none|none|
|sentDate|string(date-time)|false|none|none|

<h2 id="tocS_NotificationDto">NotificationDto</h2>
<!-- backwards compatibility -->
<a id="schemanotificationdto"></a>
<a id="schema_NotificationDto"></a>
<a id="tocSnotificationdto"></a>
<a id="tocsnotificationdto"></a>

```json
{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "isCritical": true,
  "type": 0,
  "groupKey": "string",
  "options": {},
  "sentDate": "2019-08-24T14:15:22Z"
}

```

NotificationDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|subject|string¦null|false|none|none|
|body|string|false|none|none|
|receiver|object|false|none|none|
|isCritical|boolean|false|none|none|
|type|number|true|none|none|
|groupKey|string|false|none|none|
|options|object|false|none|none|
|sentDate|string(date-time)|false|none|none|

<h2 id="tocS_NotificationSettingsDto">NotificationSettingsDto</h2>
<!-- backwards compatibility -->
<a id="schemanotificationsettingsdto"></a>
<a id="schema_NotificationSettingsDto"></a>
<a id="tocSnotificationsettingsdto"></a>
<a id="tocsnotificationsettingsdto"></a>

```json
{
  "ids": [
    "string"
  ],
  "userId": [
    "string"
  ],
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z"
}

```

NotificationSettingsDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|ids|[string]|false|none|none|
|userId|[string]|false|none|none|
|startTime|string(date-time)|false|none|none|
|endTime|string(date-time)|false|none|none|

<h2 id="tocS_NotificationExcluding_id_">NotificationExcluding_id_</h2>
<!-- backwards compatibility -->
<a id="schemanotificationexcluding_id_"></a>
<a id="schema_NotificationExcluding_id_"></a>
<a id="tocSnotificationexcluding_id_"></a>
<a id="tocsnotificationexcluding_id_"></a>

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}

```

NotificationExcluding_id_

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|subject|string¦null|false|none|none|
|body|string|true|none|none|
|receiver|object|false|none|none|
|type|number|true|none|none|
|sentDate|string(date-time)|false|none|none|
|options|object|false|none|none|
|isDraft|boolean|false|none|none|
|groupKey|string|false|none|none|
|isCritical|boolean|false|none|none|

<h2 id="tocS_NotificationPartial">NotificationPartial</h2>
<!-- backwards compatibility -->
<a id="schemanotificationpartial"></a>
<a id="schema_NotificationPartial"></a>
<a id="tocSnotificationpartial"></a>
<a id="tocsnotificationpartial"></a>

```json
{
  "id": "string",
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {},
  "isDraft": true,
  "groupKey": "string",
  "isCritical": true
}

```

NotificationPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|subject|string¦null|false|none|none|
|body|string|false|none|none|
|receiver|object|false|none|none|
|type|number|false|none|none|
|sentDate|string(date-time)|false|none|none|
|options|object|false|none|none|
|isDraft|boolean|false|none|none|
|groupKey|string|false|none|none|
|isCritical|boolean|false|none|none|

<h2 id="tocS_NotificationUser">NotificationUser</h2>
<!-- backwards compatibility -->
<a id="schemanotificationuser"></a>
<a id="schema_NotificationUser"></a>
<a id="tocSnotificationuser"></a>
<a id="tocsnotificationuser"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}

```

NotificationUser

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|string|false|none|none|
|notificationId|string|true|none|none|
|userId|string|true|none|none|
|isRead|boolean|false|none|none|
|actionMeta|object|false|none|none|
|isDraft|boolean|false|none|none|

<h2 id="tocS_NewNotificationUser">NewNotificationUser</h2>
<!-- backwards compatibility -->
<a id="schemanewnotificationuser"></a>
<a id="schema_NewNotificationUser"></a>
<a id="tocSnewnotificationuser"></a>
<a id="tocsnewnotificationuser"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}

```

NewNotificationUser

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|notificationId|string|true|none|none|
|userId|string|true|none|none|
|isRead|boolean|false|none|none|
|actionMeta|object|false|none|none|
|isDraft|boolean|false|none|none|

<h2 id="tocS_NotificationUserPartial">NotificationUserPartial</h2>
<!-- backwards compatibility -->
<a id="schemanotificationuserpartial"></a>
<a id="schema_NotificationUserPartial"></a>
<a id="tocSnotificationuserpartial"></a>
<a id="tocsnotificationuserpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}

```

NotificationUserPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|string|false|none|none|
|notificationId|string|false|none|none|
|userId|string|false|none|none|
|isRead|boolean|false|none|none|
|actionMeta|object|false|none|none|
|isDraft|boolean|false|none|none|

<h2 id="tocS_AccessResponseDto">AccessResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaaccessresponsedto"></a>
<a id="schema_AccessResponseDto"></a>
<a id="tocSaccessresponsedto"></a>
<a id="tocsaccessresponsedto"></a>

```json
{
  "ttl": 0,
  "cipherKey": "string"
}

```

AccessResponseDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|ttl|number|false|none|none|
|cipherKey|string|false|none|none|

<h2 id="tocS_NotificationAccess">NotificationAccess</h2>
<!-- backwards compatibility -->
<a id="schemanotificationaccess"></a>
<a id="schema_NotificationAccess"></a>
<a id="tocSnotificationaccess"></a>
<a id="tocsnotificationaccess"></a>

```json
{
  "receiver": {},
  "type": 0,
  "options": {}
}

```

NotificationAccess

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|receiver|object|true|none|this will contain the list of reciever to give access|
|type|number|true|none|none|
|options|object|false|none|this will contain the ttl property for now|

<h2 id="tocS_NewNotificationUserInNotification">NewNotificationUserInNotification</h2>
<!-- backwards compatibility -->
<a id="schemanewnotificationuserinnotification"></a>
<a id="schema_NewNotificationUserInNotification"></a>
<a id="tocSnewnotificationuserinnotification"></a>
<a id="tocsnewnotificationuserinnotification"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "notificationId": "string",
  "userId": "string",
  "isRead": true,
  "actionMeta": {},
  "isDraft": true
}

```

NewNotificationUserInNotification

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|notificationId|string|false|none|none|
|userId|string|true|none|none|
|isRead|boolean|false|none|none|
|actionMeta|object|false|none|none|
|isDraft|boolean|false|none|none|

<h2 id="tocS_UserNotificationSettings">UserNotificationSettings</h2>
<!-- backwards compatibility -->
<a id="schemausernotificationsettings"></a>
<a id="schema_UserNotificationSettings"></a>
<a id="tocSusernotificationsettings"></a>
<a id="tocsusernotificationsettings"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}

```

UserNotificationSettings

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|string|false|none|none|
|userId|string|true|none|none|
|sleepStartTime|string(date-time)|true|none|none|
|sleepEndTime|string(date-time)|true|none|none|
|type|number|true|none|none|

<h2 id="tocS_NewUserNotificationSettings">NewUserNotificationSettings</h2>
<!-- backwards compatibility -->
<a id="schemanewusernotificationsettings"></a>
<a id="schema_NewUserNotificationSettings"></a>
<a id="tocSnewusernotificationsettings"></a>
<a id="tocsnewusernotificationsettings"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}

```

NewUserNotificationSettings

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|userId|string|true|none|none|
|sleepStartTime|string(date-time)|true|none|none|
|sleepEndTime|string(date-time)|true|none|none|
|type|number|true|none|none|

<h2 id="tocS_UserNotificationSettingsWithRelations">UserNotificationSettingsWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemausernotificationsettingswithrelations"></a>
<a id="schema_UserNotificationSettingsWithRelations"></a>
<a id="tocSusernotificationsettingswithrelations"></a>
<a id="tocsusernotificationsettingswithrelations"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}

```

UserNotificationSettingsWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|string|false|none|none|
|userId|string|true|none|none|
|sleepStartTime|string(date-time)|true|none|none|
|sleepEndTime|string(date-time)|true|none|none|
|type|number|true|none|none|

<h2 id="tocS_UserNotificationSettingsPartial">UserNotificationSettingsPartial</h2>
<!-- backwards compatibility -->
<a id="schemausernotificationsettingspartial"></a>
<a id="schema_UserNotificationSettingsPartial"></a>
<a id="tocSusernotificationsettingspartial"></a>
<a id="tocsusernotificationsettingspartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "userId": "string",
  "sleepStartTime": "2019-08-24T14:15:22Z",
  "sleepEndTime": "2019-08-24T14:15:22Z",
  "type": 0
}

```

UserNotificationSettingsPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|string|false|none|none|
|userId|string|false|none|none|
|sleepStartTime|string(date-time)|false|none|none|
|sleepEndTime|string(date-time)|false|none|none|
|type|number|false|none|none|

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

<h2 id="tocS_notification_users.ScopeFilter">notification_users.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemanotification_users.scopefilter"></a>
<a id="schema_notification_users.ScopeFilter"></a>
<a id="tocSnotification_users.scopefilter"></a>
<a id="tocsnotification_users.scopefilter"></a>

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

notification_users.ScopeFilter

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

<h2 id="tocS_notification_users.IncludeFilter.Items">notification_users.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemanotification_users.includefilter.items"></a>
<a id="schema_notification_users.IncludeFilter.Items"></a>
<a id="tocSnotification_users.includefilter.items"></a>
<a id="tocsnotification_users.includefilter.items"></a>

```json
{
  "relation": "notification",
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

notification_users.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[notification_users.ScopeFilter](#schemanotification_users.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|notification|

<h2 id="tocS_notification_users.Filter">notification_users.Filter</h2>
<!-- backwards compatibility -->
<a id="schemanotification_users.filter"></a>
<a id="schema_notification_users.Filter"></a>
<a id="tocSnotification_users.filter"></a>
<a id="tocsnotification_users.filter"></a>

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
    "id": true,
    "notificationId": true,
    "userId": true,
    "isRead": true,
    "actionMeta": true,
    "isDraft": true
  },
  "include": [
    {
      "relation": "notification",
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

notification_users.Filter

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
|»» id|boolean|false|none|none|
|»» notificationId|boolean|false|none|none|
|»» userId|boolean|false|none|none|
|»» isRead|boolean|false|none|none|
|»» actionMeta|boolean|false|none|none|
|»» isDraft|boolean|false|none|none|

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
|» *anonymous*|[notification_users.IncludeFilter.Items](#schemanotification_users.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_notifications.ScopeFilter">notifications.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemanotifications.scopefilter"></a>
<a id="schema_notifications.ScopeFilter"></a>
<a id="tocSnotifications.scopefilter"></a>
<a id="tocsnotifications.scopefilter"></a>

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

notifications.ScopeFilter

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

<h2 id="tocS_notifications.IncludeFilter.Items">notifications.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemanotifications.includefilter.items"></a>
<a id="schema_notifications.IncludeFilter.Items"></a>
<a id="tocSnotifications.includefilter.items"></a>
<a id="tocsnotifications.includefilter.items"></a>

```json
{
  "relation": "notificationUsers",
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

notifications.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[notifications.ScopeFilter](#schemanotifications.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|notificationUsers|

<h2 id="tocS_notifications.Filter">notifications.Filter</h2>
<!-- backwards compatibility -->
<a id="schemanotifications.filter"></a>
<a id="schema_notifications.Filter"></a>
<a id="tocSnotifications.filter"></a>
<a id="tocsnotifications.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "subject": true,
    "body": true,
    "receiver": true,
    "type": true,
    "sentDate": true,
    "options": true,
    "isDraft": true,
    "groupKey": true,
    "isCritical": true
  },
  "include": [
    {
      "relation": "notificationUsers",
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

notifications.Filter

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
|»» subject|boolean|false|none|none|
|»» body|boolean|false|none|none|
|»» receiver|boolean|false|none|none|
|»» type|boolean|false|none|none|
|»» sentDate|boolean|false|none|none|
|»» options|boolean|false|none|none|
|»» isDraft|boolean|false|none|none|
|»» groupKey|boolean|false|none|none|
|»» isCritical|boolean|false|none|none|

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
|» *anonymous*|[notifications.IncludeFilter.Items](#schemanotifications.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_user_notification_settings.Filter">user_notification_settings.Filter</h2>
<!-- backwards compatibility -->
<a id="schemauser_notification_settings.filter"></a>
<a id="schema_user_notification_settings.Filter"></a>
<a id="tocSuser_notification_settings.filter"></a>
<a id="tocsuser_notification_settings.filter"></a>

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
    "id": true,
    "userId": true,
    "sleepStartTime": true,
    "sleepEndTime": true,
    "type": true
  }
}

```

user_notification_settings.Filter

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
|»» id|boolean|false|none|none|
|»» userId|boolean|false|none|none|
|»» sleepStartTime|boolean|false|none|none|
|»» sleepEndTime|boolean|false|none|none|
|»» type|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

