---
title: Notification Service v1.0.0
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

<h1 id="notification-service">Notification Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

sandbox

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="notification-service-notificationusercontroller">NotificationUserController</h1>

## NotificationUserController.createAll

<a id="opIdNotificationUserController.createAll"></a>

> Code samples

```'javascript--nodejs
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
    "actionMeta": {}
  }
];
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/notification-users/bulk',
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
    "actionMeta": {}
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
  "actionMeta": {}
}
```

<h3 id="notificationusercontroller.createall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification User model instance|[NotificationUser](#schemanotificationuser)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.count

<a id="opIdNotificationUserController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notification-users/count',
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.deleteAllHard

<a id="opIdNotificationUserController.deleteAllHard"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/notification-users/hard',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /notification-users/hard`

<h3 id="notificationusercontroller.deleteallhard-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

<h3 id="notificationusercontroller.deleteallhard-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.replaceById

<a id="opIdNotificationUserController.replaceById"></a>

> Code samples

```'javascript--nodejs
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
  "actionMeta": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/notification-users/{id}',
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
  "actionMeta": {}
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.updateById

<a id="opIdNotificationUserController.updateById"></a>

> Code samples

```'javascript--nodejs
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
  "actionMeta": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/notification-users/{id}',
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
  "actionMeta": {}
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.findById

<a id="opIdNotificationUserController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notification-users/{id}',
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
  "actionMeta": {}
}
```

<h3 id="notificationusercontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|NotificationUser instance|[NotificationUser](#schemanotificationuser)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.deleteById

<a id="opIdNotificationUserController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/notification-users/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /notification-users/{id}`

<h3 id="notificationusercontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="notificationusercontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|NotificationUser DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.create

<a id="opIdNotificationUserController.create"></a>

> Code samples

```'javascript--nodejs
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
  "actionMeta": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/notification-users',
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
  "actionMeta": {}
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
  "actionMeta": {}
}
```

<h3 id="notificationusercontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|NotificationUser model instance|[NotificationUser](#schemanotificationuser)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.updateAll

<a id="opIdNotificationUserController.updateAll"></a>

> Code samples

```'javascript--nodejs
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
  "actionMeta": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/notification-users',
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
  "actionMeta": {}
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.find

<a id="opIdNotificationUserController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notification-users',
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
    "actionMeta": {}
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationUserController.deleteAll

<a id="opIdNotificationUserController.deleteAll"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/notification-users',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /notification-users`

<h3 id="notificationusercontroller.deleteall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

<h3 id="notificationusercontroller.deleteall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="notification-service-notificationusernotificationcontroller">NotificationUserNotificationController</h1>

## NotificationUserNotificationController.getNotification

<a id="opIdNotificationUserNotificationController.getNotification"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notification-users/{id}/notification',
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
    "options": {}
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
|»» receiver|object|true|none|none|
|»» type|number|true|none|none|
|»» sentDate|string(date-time)|false|none|none|
|»» options|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="notification-service-pubnubnotificationcontroller">PubnubNotificationController</h1>

## PubnubNotificationController.grantAccess

<a id="opIdPubnubNotificationController.grantAccess"></a>

> Code samples

```'javascript--nodejs
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

fetch('http://localhost:3000/notifications/access/{id}',
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

<aside class="success">
This operation does not require authentication
</aside>

## PubnubNotificationController.revokeAccess

<a id="opIdPubnubNotificationController.revokeAccess"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/notifications/access/{id}',
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

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = [
  {
    "subject": "string",
    "body": "string",
    "receiver": {},
    "type": 0,
    "sentDate": "2019-08-24T14:15:22Z",
    "options": {}
  }
];
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications/bulk',
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

> Body parameter

```json
[
  {
    "subject": "string",
    "body": "string",
    "receiver": {},
    "type": 0,
    "sentDate": "2019-08-24T14:15:22Z",
    "options": {}
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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Notifications|None|

<h3 id="notificationcontroller.createbulknotificaitions-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.count

<a id="opIdNotificationController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications/count',
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.findById

<a id="opIdNotificationController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications/{id}',
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
  "options": {}
}
```

<h3 id="notificationcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model instance|[Notification](#schemanotification)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.create

<a id="opIdNotificationController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications',
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

> Body parameter

```json
{
  "subject": "string",
  "body": "string",
  "receiver": {},
  "type": 0,
  "sentDate": "2019-08-24T14:15:22Z",
  "options": {}
}
```

<h3 id="notificationcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NotificationExcluding_id_](#schemanotificationexcluding_id_)|false|none|

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
  "options": {}
}
```

<h3 id="notificationcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model instance|[Notification](#schemanotification)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.find

<a id="opIdNotificationController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications',
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
    "options": {}
  }
]
```

<h3 id="notificationcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Notification model instances|Inline|

<h3 id="notificationcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Notification](#schemanotification)]|false|none|none|
|» Notification|[Notification](#schemanotification)|false|none|none|
|»» id|string|false|none|none|
|»» subject|string¦null|false|none|none|
|»» body|string|true|none|none|
|»» receiver|object|true|none|none|
|»» type|number|true|none|none|
|»» sentDate|string(date-time)|false|none|none|
|»» options|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationController.deleteAll

<a id="opIdNotificationController.deleteAll"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/notifications',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /notifications`

<h3 id="notificationcontroller.deleteall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

<h3 id="notificationcontroller.deleteall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Notification DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="notification-service-notificationnotificationusercontroller">NotificationNotificationUserController</h1>

## NotificationNotificationUserController.create

<a id="opIdNotificationNotificationUserController.create"></a>

> Code samples

```'javascript--nodejs
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
  "actionMeta": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications/{id}/notification-users',
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
  "actionMeta": {}
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
  "actionMeta": {}
}
```

<h3 id="notificationnotificationusercontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Notification model instance|[NotificationUser](#schemanotificationuser)|

<aside class="success">
This operation does not require authentication
</aside>

## NotificationNotificationUserController.patch

<a id="opIdNotificationNotificationUserController.patch"></a>

> Code samples

```'javascript--nodejs
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
  "actionMeta": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications/{id}/notification-users',
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
  "actionMeta": {}
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationNotificationUserController.find

<a id="opIdNotificationNotificationUserController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications/{id}/notification-users',
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
    "actionMeta": {}
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

<aside class="success">
This operation does not require authentication
</aside>

## NotificationNotificationUserController.delete

<a id="opIdNotificationNotificationUserController.delete"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/notifications/{id}/notification-users',
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

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="notification-service-pingcontroller">PingController</h1>

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

<h1 id="notification-service-homepagecontroller">HomePageController</h1>

## HomePageController.homePage

<a id="opIdHomePageController.homePage"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'text/html'
};

fetch('http://localhost:3000/',
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

`GET /`

> Example responses

> 200 Response

```
"string"
```

<h3 id="homepagecontroller.homepage-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Home Page|string|

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
  "options": {}
}

```

Notification

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|subject|string¦null|false|none|none|
|body|string|true|none|none|
|receiver|object|true|none|none|
|type|number|true|none|none|
|sentDate|string(date-time)|false|none|none|
|options|object|false|none|none|

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
  "options": {}
}

```

NotificationExcluding_id_

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|subject|string¦null|false|none|none|
|body|string|true|none|none|
|receiver|object|true|none|none|
|type|number|true|none|none|
|sentDate|string(date-time)|false|none|none|
|options|object|false|none|none|

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
  "actionMeta": {}
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
  "actionMeta": {}
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
  "actionMeta": {}
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
  "actionMeta": {}
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

notification_users.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[notification_users.ScopeFilter](#schemanotification_users.scopefilter)|false|none|none|

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
    "actionMeta": true
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

notifications.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[notifications.ScopeFilter](#schemanotifications.scopefilter)|false|none|none|

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
    "options": true
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

