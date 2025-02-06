---
title: "@sourceloop/user-tenant-service v4.0.2"
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

<h1 id="-sourceloop-user-tenant-service">@sourceloop/user-tenant-service v4.0.2</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Sourceloop User Tenant Service

Base URLs:

* <a href="/">/</a>

<h1 id="-sourceloop-user-tenant-service-groupusercontroller">GroupUserController</h1>

## GroupUserController.createBulkUserGroups

<a id="opIdGroupUserController.createBulkUserGroups"></a>

> Code samples

```javascript
const inputBody = '[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "userTenantId": "string"
  }
]';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups/{id}/user/bulk',
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
    "createdBy": "string",
    "modifiedBy": "string",
    "userTenantId": "string"
  }
];
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups/{id}/user/bulk',
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

`POST /groups/{id}/user/bulk`

| Permissions |
| ------- |
| CreateMultipleUserGroup   |
| 31   |

> Body parameter

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
    "userTenantId": "string"
  }
]
```

<h3 id="groupusercontroller.createbulkusergroups-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewUserGroupInGroup](#schemanewusergroupingroup)|false|none|

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
    "groupId": "string",
    "userTenantId": "string"
  }
]
```

<h3 id="groupusercontroller.createbulkusergroups-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserGroup model instance|Inline|

<h3 id="groupusercontroller.createbulkusergroups-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserGroup](#schemausergroup)]|false|none|none|
|» UserGroup|[UserGroup](#schemausergroup)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» groupId|string|true|none|none|
|»» userTenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupUserController.delete

<a id="opIdGroupUserController.delete"></a>

> Code samples

```javascript

fetch('/groups/{id}/user/{userId}',
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

fetch('/groups/{id}/user/{userId}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /groups/{id}/user/{userId}`

| Permissions |
| ------- |
| RemoveMemberFromUserGroup   |
| 22   |

<h3 id="groupusercontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|userId|path|string|true|none|
|where|query|object|false|none|

<h3 id="groupusercontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|DELETE Group.UserGroup|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupUserController.create

<a id="opIdGroupUserController.create"></a>

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
  "userTenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups/{id}/user',
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
  "userTenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups/{id}/user',
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

`POST /groups/{id}/user`

| Permissions |
| ------- |
| CreateUserGroup   |
| 1   |

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
  "userTenantId": "string"
}
```

<h3 id="groupusercontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewUserGroupInGroup](#schemanewusergroupingroup)|false|none|

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
  "groupId": "string",
  "userTenantId": "string"
}
```

<h3 id="groupusercontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserGroup model instance|[UserGroup](#schemausergroup)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupUserController.find

<a id="opIdGroupUserController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/groups/{id}/user',
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

fetch('/groups/{id}/user',
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

`GET /groups/{id}/user`

| Permissions |
| ------- |
| ViewUserGroupList   |
| 2   |

<h3 id="groupusercontroller.find-parameters">Parameters</h3>

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
    "groupId": "string",
    "userTenantId": "string"
  }
]
```

<h3 id="groupusercontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of UserGroup of a Group|Inline|

<h3 id="groupusercontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserGroup](#schemausergroup)]|false|none|none|
|» UserGroup|[UserGroup](#schemausergroup)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» groupId|string|true|none|none|
|»» userTenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-tenantcontroller">TenantController</h1>

## TenantController.count

<a id="opIdTenantController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/count',
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

fetch('/tenants/count',
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

`GET /tenants/count`

| Permissions |
| ------- |
| ViewTenant   |
| 17   |

<h3 id="tenantcontroller.count-parameters">Parameters</h3>

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

<h3 id="tenantcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantController.replaceById

<a id="opIdTenantController.replaceById"></a>

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tenants/{id}',
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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/tenants/{id}',
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

`PUT /tenants/{id}`

| Permissions |
| ------- |
| UpdateTenant   |
| 18   |

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}
```

<h3 id="tenantcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Tenant](#schematenant)|false|none|

<h3 id="tenantcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantController.updateById

<a id="opIdTenantController.updateById"></a>

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tenants/{id}',
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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/tenants/{id}',
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

`PATCH /tenants/{id}`

| Permissions |
| ------- |
| UpdateTenant   |
| 18   |

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}
```

<h3 id="tenantcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TenantPartial](#schematenantpartial)|false|none|

<h3 id="tenantcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantController.findById

<a id="opIdTenantController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}',
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

fetch('/tenants/{id}',
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

`GET /tenants/{id}`

| Permissions |
| ------- |
| ViewTenant   |
| 17   |

<h3 id="tenantcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[tenants.Filter](#schematenants.filter)|false|none|

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "tenantConfigs": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "configKey": "string",
      "configValue": {},
      "tenantId": "string",
      "tenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "users": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {},
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {},
                "foreignKey": null,
                "tenant": {},
                "role": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "roleType": 15,
                  "description": "string",
                  "permissions": [
                    "string"
                  ],
                  "allowedClients": [
                    "string"
                  ],
                  "tenantId": "string",
                  "userTenants": [
                    {}
                  ],
                  "createdByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  },
                  "foreignKey": null,
                  "modifiedByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  }
                },
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            ]
          }
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "2019-08-24T14:15:22Z",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "defaultTenant": {},
                  "foreignKey": null,
                  "credentials": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "authProvider": "string",
                    "authId": "string",
                    "authToken": "string",
                    "secretKey": "string",
                    "password": "string",
                    "userId": "string",
                    "user": {},
                    "foreignKey": null
                  },
                  "userTenants": [
                    {}
                  ]
                },
                "foreignKey": null,
                "tenant": {},
                "role": {},
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "locale": "string",
                  "status": 12,
                  "userId": "string",
                  "tenantId": "string",
                  "roleId": "string",
                  "user": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "2019-08-24T14:15:22Z",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "defaultTenant": {},
                    "foreignKey": null,
                    "credentials": {},
                    "userTenants": []
                  },
                  "foreignKey": null,
                  "tenant": {},
                  "role": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "name": "string",
                    "roleType": 15,
                    "description": "string",
                    "permissions": [],
                    "allowedClients": [],
                    "tenantId": "string",
                    "userTenants": [],
                    "createdByUser": {},
                    "foreignKey": null,
                    "modifiedByUser": {}
                  },
                  "userLevelPermissions": [
                    {}
                  ],
                  "userGroups": [
                    {}
                  ],
                  "userInvitations": [
                    {}
                  ]
                }
              }
            ]
          }
        ]
      },
      "foreignKey": null
    }
  ],
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "locale": "string",
      "status": 12,
      "userId": "string",
      "tenantId": "string",
      "roleId": "string",
      "user": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [],
          "users": [
            {}
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {}
        ]
      },
      "foreignKey": null,
      "tenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [],
        "users": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {},
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {}
            ]
          }
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "role": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {}
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      },
      "userLevelPermissions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "permission": "string",
          "allowed": true,
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ],
      "userGroups": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "groupId": "string",
          "userTenantId": "string",
          "group": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {}
            ]
          },
          "foreignKey": null,
          "userTenant": {}
        }
      ],
      "userInvitations": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "expiresOn": "2019-08-24T14:15:22Z",
          "token": "string",
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ]
    }
  ],
  "users": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "2019-08-24T14:15:22Z",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "defaultTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "users": [],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {},
                "foreignKey": null,
                "tenant": {},
                "role": {},
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "locale": "string",
                  "status": 12,
                  "userId": "string",
                  "tenantId": "string",
                  "roleId": "string",
                  "user": {},
                  "foreignKey": null,
                  "tenant": {},
                  "role": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "name": "string",
                    "roleType": 15,
                    "description": "string",
                    "permissions": [],
                    "allowedClients": [],
                    "tenantId": "string",
                    "userTenants": [],
                    "createdByUser": {},
                    "foreignKey": null,
                    "modifiedByUser": {}
                  },
                  "userLevelPermissions": [
                    {}
                  ],
                  "userGroups": [
                    {}
                  ],
                  "userInvitations": [
                    {}
                  ]
                }
              }
            ]
          }
        ]
      },
      "foreignKey": null,
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {},
        "foreignKey": null
      },
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
          "foreignKey": null,
          "tenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "role": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          },
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              },
              "foreignKey": null,
              "userTenant": {}
            }
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      ]
    }
  ],
  "roles": [
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
      "roleType": 15,
      "description": "string",
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
      "tenantId": "string",
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "status": 1,
              "key": "string",
              "website": "string",
              "address": "string",
              "city": "string",
              "state": "string",
              "zip": "string",
              "country": "string",
              "tenantConfigs": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "configKey": "string",
                  "configValue": {},
                  "tenantId": "string",
                  "tenant": {},
                  "foreignKey": null
                }
              ],
              "userTenants": [
                {}
              ],
              "users": [
                {}
              ],
              "roles": [],
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
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                }
              ]
            },
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {}
            ]
          },
          "foreignKey": null,
          "tenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "2019-08-24T14:15:22Z",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "defaultTenant": {},
                "foreignKey": null,
                "credentials": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "authProvider": "string",
                  "authId": "string",
                  "authToken": "string",
                  "secretKey": "string",
                  "password": "string",
                  "userId": "string",
                  "user": {},
                  "foreignKey": null
                },
                "userTenants": [
                  {}
                ]
              }
            ],
            "roles": [],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "role": {},
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              },
              "foreignKey": null,
              "userTenant": {}
            }
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      ],
      "createdByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      },
      "foreignKey": null,
      "modifiedByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      }
    }
  ],
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
      "name": "string",
      "description": "string",
      "photoUrl": "string",
      "tenantId": "string",
      "userGroups": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "groupId": "string",
          "userTenantId": "string",
          "group": {},
          "foreignKey": null,
          "userTenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "status": 1,
                "key": "string",
                "website": "string",
                "address": "string",
                "city": "string",
                "state": "string",
                "zip": "string",
                "country": "string",
                "tenantConfigs": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "configKey": "string",
                    "configValue": {},
                    "tenantId": "string",
                    "tenant": {},
                    "foreignKey": null
                  }
                ],
                "userTenants": [
                  {}
                ],
                "users": [
                  {}
                ],
                "roles": [
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
                    "roleType": 15,
                    "description": "string",
                    "permissions": [],
                    "allowedClients": [],
                    "tenantId": "string",
                    "userTenants": [],
                    "createdByUser": {},
                    "foreignKey": null,
                    "modifiedByUser": {}
                  }
                ],
                "groups": []
              },
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "status": 1,
              "key": "string",
              "website": "string",
              "address": "string",
              "city": "string",
              "state": "string",
              "zip": "string",
              "country": "string",
              "tenantConfigs": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "configKey": "string",
                  "configValue": {},
                  "tenantId": "string",
                  "tenant": {},
                  "foreignKey": null
                }
              ],
              "userTenants": [
                {}
              ],
              "users": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "2019-08-24T14:15:22Z",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "defaultTenant": {},
                  "foreignKey": null,
                  "credentials": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "authProvider": "string",
                    "authId": "string",
                    "authToken": "string",
                    "secretKey": "string",
                    "password": "string",
                    "userId": "string",
                    "user": {},
                    "foreignKey": null
                  },
                  "userTenants": [
                    {}
                  ]
                }
              ],
              "roles": [
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
                  "roleType": 15,
                  "description": "string",
                  "permissions": [
                    "string"
                  ],
                  "allowedClients": [
                    "string"
                  ],
                  "tenantId": "string",
                  "userTenants": [
                    {}
                  ],
                  "createdByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  },
                  "foreignKey": null,
                  "modifiedByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  }
                }
              ],
              "groups": []
            },
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {}
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        }
      ]
    }
  ]
}
```

<h3 id="tenantcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model instance|[TenantWithRelations](#schematenantwithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantController.deleteById

<a id="opIdTenantController.deleteById"></a>

> Code samples

```javascript

fetch('/tenants/{id}',
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

fetch('/tenants/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /tenants/{id}`

| Permissions |
| ------- |
| DeleteTenant   |
| DeleteTenantUser   |

<h3 id="tenantcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="tenantcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantController.create

<a id="opIdTenantController.create"></a>

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants',
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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants',
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

`POST /tenants`

| Permissions |
| ------- |
| CreateTenant   |
| 16   |

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}
```

<h3 id="tenantcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTenant](#schemanewtenant)|false|none|

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}
```

<h3 id="tenantcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model instance|[Tenant](#schematenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantController.updateAll

<a id="opIdTenantController.updateAll"></a>

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants',
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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants',
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

`PATCH /tenants`

| Permissions |
| ------- |
| UpdateTenant   |
| 18   |

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
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}
```

<h3 id="tenantcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TenantPartial](#schematenantpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tenantcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantController.find

<a id="opIdTenantController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants',
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

fetch('/tenants',
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

`GET /tenants`

| Permissions |
| ------- |
| ViewTenant   |
| 17   |

<h3 id="tenantcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[tenants.Filter1](#schematenants.filter1)|false|none|

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
    "name": "string",
    "status": 1,
    "key": "string",
    "website": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string",
    "tenantConfigs": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "configKey": "string",
        "configValue": {},
        "tenantId": "string",
        "tenant": {},
        "foreignKey": null
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {},
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    ],
    "users": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {},
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ]
      }
    ],
    "roles": [
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
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {},
            "role": {},
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      }
    ],
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
        "name": "string",
        "description": "string",
        "photoUrl": "string",
        "tenantId": "string",
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {},
            "foreignKey": null,
            "userTenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "locale": "string",
              "status": 12,
              "userId": "string",
              "tenantId": "string",
              "roleId": "string",
              "user": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "2019-08-24T14:15:22Z",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "defaultTenant": {},
                "foreignKey": null,
                "credentials": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "authProvider": "string",
                  "authId": "string",
                  "authToken": "string",
                  "secretKey": "string",
                  "password": "string",
                  "userId": "string",
                  "user": {},
                  "foreignKey": null
                },
                "userTenants": [
                  {}
                ]
              },
              "foreignKey": null,
              "tenant": {},
              "role": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              },
              "userLevelPermissions": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "permission": "string",
                  "allowed": true,
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ],
              "userGroups": [
                {}
              ],
              "userInvitations": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "expiresOn": "2019-08-24T14:15:22Z",
                  "token": "string",
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ]
            }
          }
        ]
      }
    ]
  }
]
```

<h3 id="tenantcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Tenant model instances|Inline|

<h3 id="tenantcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TenantWithRelations](#schematenantwithrelations)]|false|none|[signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })]|
|» TenantWithRelations|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» name|string|true|none|none|
|»» status|number¦null|true|none|Tenant status - Active or Inactive|
|»» key|string|false|none|none|
|»» website|string|false|none|none|
|»» address|string|false|none|none|
|»» city|string|false|none|none|
|»» state|string|false|none|none|
|»» zip|string|false|none|none|
|»» country|string|false|none|none|
|»» tenantConfigs|[[TenantConfigWithRelations](#schematenantconfigwithrelations)]|false|none|(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })|
|»»» TenantConfigWithRelations|[TenantConfigWithRelations](#schematenantconfigwithrelations)|false|none|(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» configKey|string|true|none|none|
|»»»» configValue|object|false|none|none|
|»»»» tenantId|string|true|none|none|
|»»»» tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» foreignKey|any|false|none|none|
|»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» locale|string|false|none|none|
|»»»» status|number|false|none|none|
|»»»» userId|string|true|none|none|
|»»»» tenantId|string|true|none|none|
|»»»» roleId|string|true|none|none|
|»»»» user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» firstName|string|true|none|none|
|»»»»» lastName|string|false|none|none|
|»»»»» middleName|string|false|none|none|
|»»»»» username|string|true|none|none|
|»»»»» email|string|true|none|none|
|»»»»» designation|string|false|none|none|
|»»»»» phone|string|false|none|none|
|»»»»» authClientIds|string|false|none|none|
|»»»»» lastLogin|string(date-time)|false|none|none|
|»»»»» photoUrl|string|false|none|none|
|»»»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»»»» dob|string(date-time)|false|none|none|
|»»»»» defaultTenantId|string|false|none|none|
|»»»»» defaultTenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» foreignKey|any|false|none|none|
|»»»»» credentials|[UserCredentialsWithRelations](#schemausercredentialswithrelations)|false|none|(tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» authProvider|string|true|none|none|
|»»»»»» authId|string|false|none|none|
|»»»»»» authToken|string|false|none|none|
|»»»»»» secretKey|string|false|none|Secret for Authenticator app|
|»»»»»» password|string|false|none|none|
|»»»»»» userId|string|true|none|none|
|»»»»»» user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» foreignKey|any|false|none|none|
|»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» foreignKey|any|false|none|none|
|»»»» tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» role|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» name|string|true|none|none|
|»»»»» roleType|number|false|none|none|
|»»»»» description|string|false|none|none|
|»»»»» permissions|[string]|false|none|none|
|»»»»» allowedClients|[string]|false|none|none|
|»»»»» tenantId|string|true|none|none|
|»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» createdByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» firstName|string|true|none|none|
|»»»»»» lastName|string|false|none|none|
|»»»»»» middleName|string|false|none|none|
|»»»»»» username|string|true|none|none|
|»»»»»» email|string|true|none|none|
|»»»»»» designation|string|false|none|none|
|»»»»»» phone|string|false|none|none|
|»»»»»» authClientIds|string|false|none|none|
|»»»»»» lastLogin|string|false|none|none|
|»»»»»» photoUrl|string|false|none|none|
|»»»»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»»»»» dob|string(date-time)¦null|false|none|none|
|»»»»»» defaultTenantId|string|true|none|none|
|»»»»»» status|number|false|none|none|
|»»»»»» tenantId|string|true|none|none|
|»»»»»» roleId|string|true|none|none|
|»»»»»» tenantName|string|true|none|none|
|»»»»»» tenantKey|string|false|none|none|
|»»»»»» roleName|string|false|none|none|
|»»»»»» userTenantId|string|true|none|none|
|»»»»» foreignKey|any|false|none|none|
|»»»»» modifiedByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
|»»»» userLevelPermissions|[[UserLevelPermissionWithRelations](#schemauserlevelpermissionwithrelations)]|false|none|(tsType: UserLevelPermissionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» UserLevelPermissionWithRelations|[UserLevelPermissionWithRelations](#schemauserlevelpermissionwithrelations)|false|none|(tsType: UserLevelPermissionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» permission|string|true|none|none|
|»»»»»» allowed|boolean|true|none|none|
|»»»»»» userTenantId|string|true|none|none|
|»»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» foreignKey|any|false|none|none|
|»»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» groupId|string|true|none|none|
|»»»»»» userTenantId|string|true|none|none|
|»»»»»» group|[GroupWithRelations](#schemagroupwithrelations)|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» name|string|false|none|none|
|»»»»»»» description|string|false|none|none|
|»»»»»»» photoUrl|string|false|none|none|
|»»»»»»» tenantId|string|true|none|none|
|»»»»»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» foreignKey|any|false|none|none|
|»»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» userInvitations|[[UserInvitationWithRelations](#schemauserinvitationwithrelations)]|false|none|(tsType: UserInvitationWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» UserInvitationWithRelations|[UserInvitationWithRelations](#schemauserinvitationwithrelations)|false|none|(tsType: UserInvitationWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» expiresOn|string(date-time)|false|none|none|
|»»»»»» token|string|false|none|none|
|»»»»»» userTenantId|string|true|none|none|
|»»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» foreignKey|any|false|none|none|
|»» users|[[UserWithRelations](#schemauserwithrelations)]|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»» UserWithRelations|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»» roles|[[RoleWithRelations](#schemarolewithrelations)]|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»»» RoleWithRelations|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»» groups|[[GroupWithRelations](#schemagroupwithrelations)]|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|»»» GroupWithRelations|[GroupWithRelations](#schemagroupwithrelations)|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|
|gender|M|
|gender|F|
|gender|O|
|gender|M|
|gender|F|
|gender|O|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-tenantgroupcontroller">TenantGroupController</h1>

## TenantGroupController.delete

<a id="opIdTenantGroupController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/groups/{groupId}',
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

fetch('/tenants/{id}/groups/{groupId}',
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

`DELETE /tenants/{id}/groups/{groupId}`

| Permissions |
| ------- |
| DeleteGroup   |
| 35   |

<h3 id="tenantgroupcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|groupId|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 204 Response

```json
{
  "count": 0
}
```

<h3 id="tenantgroupcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant.Group DELETE|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantGroupController.create

<a id="opIdTenantGroupController.create"></a>

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
  "name": "string",
  "description": "string",
  "photoUrl": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/groups',
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
  "name": "string",
  "description": "string",
  "photoUrl": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/groups',
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

`POST /tenants/{id}/groups`

| Permissions |
| ------- |
| CreateGroup   |
| 32   |

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
  "name": "string",
  "description": "string",
  "photoUrl": "string"
}
```

<h3 id="tenantgroupcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewGroupInTenant](#schemanewgroupintenant)|false|none|

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
  "name": "string",
  "description": "string",
  "photoUrl": "string",
  "tenantId": "string"
}
```

<h3 id="tenantgroupcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Group model instance|[Group](#schemagroup)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantGroupController.patch

<a id="opIdTenantGroupController.patch"></a>

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
  "name": "string",
  "description": "string",
  "photoUrl": "string",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/groups',
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
  "name": "string",
  "description": "string",
  "photoUrl": "string",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/groups',
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

`PATCH /tenants/{id}/groups`

| Permissions |
| ------- |
| UpdateGroup   |
| 34   |

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
  "name": "string",
  "description": "string",
  "photoUrl": "string",
  "tenantId": "string"
}
```

<h3 id="tenantgroupcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[GroupPartial](#schemagrouppartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tenantgroupcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant.Group PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantGroupController.find

<a id="opIdTenantGroupController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/groups',
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

fetch('/tenants/{id}/groups',
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

`GET /tenants/{id}/groups`

| Permissions |
| ------- |
| ViewGroupList   |

<h3 id="tenantgroupcontroller.find-parameters">Parameters</h3>

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
    "name": "string",
    "description": "string",
    "photoUrl": "string",
    "tenantId": "string"
  }
]
```

<h3 id="tenantgroupcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Groups of Tenant|Inline|

<h3 id="tenantgroupcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Group](#schemagroup)]|false|none|none|
|» Group|[Group](#schemagroup)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» name|string|false|none|none|
|»» description|string|false|none|none|
|»» photoUrl|string|false|none|none|
|»» tenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-tenantrolecontroller">TenantRoleController</h1>

## TenantRoleController.delete

<a id="opIdTenantRoleController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/roles/{roleId}',
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

fetch('/tenants/{id}/roles/{roleId}',
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

`DELETE /tenants/{id}/roles/{roleId}`

| Permissions |
| ------- |
| DeleteRoles   |
| 10   |

<h3 id="tenantrolecontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|roleId|path|string|true|none|
|where|query|object|false|none|

> Example responses

> 204 Response

```json
{
  "count": 0
}
```

<h3 id="tenantrolecontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant.Role DELETE success|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantRoleController.create

<a id="opIdTenantRoleController.create"></a>

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
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/roles',
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
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/roles',
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

`POST /tenants/{id}/roles`

| Permissions |
| ------- |
| CreateRoles   |
| 8   |

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
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}
```

<h3 id="tenantrolecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewRoleInTenant](#schemanewroleintenant)|false|none|

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
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ],
  "tenantId": "string"
}
```

<h3 id="tenantrolecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role model instance|[Role](#schemarole)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantRoleController.patch

<a id="opIdTenantRoleController.patch"></a>

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
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/roles',
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
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/roles',
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

`PATCH /tenants/{id}/roles`

| Permissions |
| ------- |
| UpdateRoles   |
| 9   |

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
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}
```

<h3 id="tenantrolecontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[RolePartialExcluding_id-tenantId_](#schemarolepartialexcluding_id-tenantid_)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tenantrolecontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant.Role PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantRoleController.find

<a id="opIdTenantRoleController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/roles',
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

fetch('/tenants/{id}/roles',
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

`GET /tenants/{id}/roles`

| Permissions |
| ------- |
| ViewRoles   |
| 6   |

<h3 id="tenantrolecontroller.find-parameters">Parameters</h3>

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
    "name": "string",
    "roleType": 15,
    "description": "string",
    "permissions": [
      "string"
    ],
    "allowedClients": [
      "string"
    ],
    "tenantId": "string"
  }
]
```

<h3 id="tenantrolecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Roles of Tenant|Inline|

<h3 id="tenantrolecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Role](#schemarole)]|false|none|none|
|» Role|[Role](#schemarole)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» name|string|true|none|none|
|»» roleType|number|false|none|none|
|»» description|string|false|none|none|
|»» permissions|[string]|false|none|none|
|»» allowedClients|[string]|false|none|none|
|»» tenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-tenanttenantconfigcontroller">TenantTenantConfigController</h1>

## TenantTenantConfigController.create

<a id="opIdTenantTenantConfigController.create"></a>

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
  "configKey": "string",
  "configValue": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/tenant-configs',
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
  "configKey": "string",
  "configValue": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/tenant-configs',
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

`POST /tenants/{id}/tenant-configs`

| Permissions |
| ------- |
| CreateTenant   |
| 16   |

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
  "configKey": "string",
  "configValue": {}
}
```

<h3 id="tenanttenantconfigcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewTenantConfigInTenant](#schemanewtenantconfigintenant)|false|none|

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
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenanttenantconfigcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|TenantConfig model instance|[TenantConfig](#schematenantconfig)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantTenantConfigController.patch

<a id="opIdTenantTenantConfigController.patch"></a>

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
  "configKey": "string",
  "configValue": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/tenant-configs',
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
  "configKey": "string",
  "configValue": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/tenant-configs',
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

`PATCH /tenants/{id}/tenant-configs`

| Permissions |
| ------- |
| UpdateTenant   |
| 18   |

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
  "configKey": "string",
  "configValue": {}
}
```

<h3 id="tenanttenantconfigcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[NewTenantConfigInTenant](#schemanewtenantconfigintenant)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tenanttenantconfigcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant.TenantConfig PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantTenantConfigController.find

<a id="opIdTenantTenantConfigController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/tenant-configs',
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

fetch('/tenants/{id}/tenant-configs',
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

`GET /tenants/{id}/tenant-configs`

| Permissions |
| ------- |
| ViewTenant   |
| 17   |

<h3 id="tenanttenantconfigcontroller.find-parameters">Parameters</h3>

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
    "configKey": "string",
    "configValue": {},
    "tenantId": "string"
  }
]
```

<h3 id="tenanttenantconfigcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of TenantConfigs of Tenant|Inline|

<h3 id="tenanttenantconfigcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TenantConfig](#schematenantconfig)]|false|none|none|
|» TenantConfig|[TenantConfig](#schematenantconfig)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» configKey|string|true|none|none|
|»» configValue|object|false|none|none|
|»» tenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantTenantConfigController.delete

<a id="opIdTenantTenantConfigController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/tenant-configs',
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

fetch('/tenants/{id}/tenant-configs',
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

`DELETE /tenants/{id}/tenant-configs`

| Permissions |
| ------- |
| DeleteTenant   |
| DeleteTenantUser   |

<h3 id="tenanttenantconfigcontroller.delete-parameters">Parameters</h3>

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

<h3 id="tenanttenantconfigcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant.TenantConfig DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-tenantusercontroller">TenantUserController</h1>

## TenantUserController.patch

<a id="opIdTenantUserController.patch"></a>

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string",
  "status": 11,
  "roleId": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/tenants/{id}/users/{userId}',
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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string",
  "status": 11,
  "roleId": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/tenants/{id}/users/{userId}',
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

`PATCH /tenants/{id}/users/{userId}`

| Permissions |
| ------- |
| UpdateTenantUser   |
| 14   |

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string",
  "status": 11,
  "roleId": "string"
}
```

<h3 id="tenantusercontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|userId|path|string|true|none|
|where|query|object|false|none|
|body|body|[UserViewPartialExcluding_id-authClientIds-lastLogin-tenantId-tenantName-tenantKey-roleName-userTenantId_](#schemauserviewpartialexcluding_id-authclientids-lastlogin-tenantid-tenantname-tenantkey-rolename-usertenantid_)|false|none|

<h3 id="tenantusercontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant.User PATCH|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantUserController.delete

<a id="opIdTenantUserController.delete"></a>

> Code samples

```javascript

fetch('/tenants/{id}/users/{userId}',
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

fetch('/tenants/{id}/users/{userId}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /tenants/{id}/users/{userId}`

| Permissions |
| ------- |
| DeleteTenantUser   |
| 15   |

<h3 id="tenantusercontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|userId|path|string|true|none|
|where|query|object|false|none|

<h3 id="tenantusercontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant.User DELETE|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantUserController.create

<a id="opIdTenantUserController.create"></a>

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "roleId": "string",
  "locale": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/users',
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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "roleId": "string",
  "locale": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tenants/{id}/users',
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

`POST /tenants/{id}/users`

| Permissions |
| ------- |
| CreateTenantUser   |
| 13   |

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "roleId": "string",
  "locale": "string"
}
```

<h3 id="tenantusercontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewUserInTenant](#schemanewuserintenant)|false|none|

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string"
}
```

<h3 id="tenantusercontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User model instance|[User](#schemauser)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantUserController.find

<a id="opIdTenantUserController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/users',
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

fetch('/tenants/{id}/users',
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

`GET /tenants/{id}/users`

| Permissions |
| ------- |
| ViewTenantUser   |
| 12   |

<h3 id="tenantusercontroller.find-parameters">Parameters</h3>

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
    "firstName": "string",
    "lastName": "string",
    "middleName": "string",
    "username": "string",
    "email": "string",
    "designation": "string",
    "phone": "string",
    "authClientIds": "string",
    "lastLogin": "2019-08-24T14:15:22Z",
    "photoUrl": "string",
    "gender": "M",
    "dob": "2019-08-24T14:15:22Z",
    "defaultTenantId": "string"
  }
]
```

<h3 id="tenantusercontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Users of Tenant|Inline|

<h3 id="tenantusercontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[User](#schemauser)]|false|none|[This is signature for user model.]|
|» User|[User](#schemauser)|false|none|This is signature for user model.|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» firstName|string|true|none|none|
|»» lastName|string|false|none|none|
|»» middleName|string|false|none|none|
|»» username|string|true|none|none|
|»» email|string|true|none|none|
|»» designation|string|false|none|none|
|»» phone|string|false|none|none|
|»» authClientIds|string|false|none|none|
|»» lastLogin|string(date-time)|false|none|none|
|»» photoUrl|string|false|none|none|
|»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»» dob|string(date-time)|false|none|none|
|»» defaultTenantId|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-usertenantcontroller">UserTenantController</h1>

## UserTenantController.find

<a id="opIdUserTenantController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user/{id}/tenants',
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

fetch('/user/{id}/tenants',
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

`GET /user/{id}/tenants`

| Permissions |
| ------- |
| ViewAllTenantOfSelf   |

<h3 id="usertenantcontroller.find-parameters">Parameters</h3>

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
    "name": "string",
    "status": 1,
    "key": "string",
    "website": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
]
```

<h3 id="usertenantcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Tenants to Which the User Belongs|Inline|

<h3 id="usertenantcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Tenant](#schematenant)]|false|none|[signature for all tenants]|
|» Tenant|[Tenant](#schematenant)|false|none|signature for all tenants|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» name|string|true|none|none|
|»» status|number¦null|true|none|Tenant status - Active or Inactive|
|»» key|string|false|none|none|
|»» website|string|false|none|none|
|»» address|string|false|none|none|
|»» city|string|false|none|none|
|»» state|string|false|none|none|
|»» zip|string|false|none|none|
|»» country|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-userwebhookcontroller">UserWebhookController</h1>

## UserWebhookController.callback

<a id="opIdUserWebhookController.callback"></a>

> Code samples

```javascript
const inputBody = '{
  "email": "string",
  "phone": "string",
  "tenantName": "string",
  "tenantKey": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "cognitoAuthId": "string",
  "authClient": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "clientId": "string",
    "clientSecret": "string",
    "redirectUrl": "string",
    "secret": "string",
    "accessTokenExpiration": 0,
    "refreshTokenExpiration": 0,
    "authCodeExpiration": 0
  },
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
}';
const headers = {
  'Content-Type':'application/json',
  'x-signature':'string',
  'x-timestamp':'string'
};

fetch('/user-callback',
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
  "email": "string",
  "phone": "string",
  "tenantName": "string",
  "tenantKey": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "cognitoAuthId": "string",
  "authClient": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "clientId": "string",
    "clientSecret": "string",
    "redirectUrl": "string",
    "secret": "string",
    "accessTokenExpiration": 0,
    "refreshTokenExpiration": 0,
    "authCodeExpiration": 0
  },
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
};
const headers = {
  'Content-Type':'application/json',
  'x-signature':'string',
  'x-timestamp':'string'
};

fetch('/user-callback',
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

`POST /user-callback`

> Body parameter

```json
{
  "email": "string",
  "phone": "string",
  "tenantName": "string",
  "tenantKey": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "cognitoAuthId": "string",
  "authClient": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "clientId": "string",
    "clientSecret": "string",
    "redirectUrl": "string",
    "secret": "string",
    "accessTokenExpiration": 0,
    "refreshTokenExpiration": 0,
    "authCodeExpiration": 0
  },
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
}
```

<h3 id="userwebhookcontroller.callback-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|x-signature|header|string|false|none|
|x-timestamp|header|string|false|none|
|body|body|[UserWebhookDTO](#schemauserwebhookdto)|false|none|

<h3 id="userwebhookcontroller.callback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Webhook success|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-user-tenant-service-usertenantprefscontroller">UserTenantPrefsController</h1>

## UserTenantPrefsController.count

<a id="opIdUserTenantPrefsController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-tenant-prefs/count',
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

fetch('/user-tenant-prefs/count',
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

`GET /user-tenant-prefs/count`

| Permissions |
| ------- |
| ViewUserTenantPreference   |
| 25   |

<h3 id="usertenantprefscontroller.count-parameters">Parameters</h3>

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

<h3 id="usertenantprefscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserTenantPrefs model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserTenantPrefsController.deleteById

<a id="opIdUserTenantPrefsController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-tenant-prefs/{id}',
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

fetch('/user-tenant-prefs/{id}',
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

`DELETE /user-tenant-prefs/{id}`

| Permissions |
| ------- |
| DeleteUserTenantPreference   |
| 30   |

<h3 id="usertenantprefscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="usertenantprefscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="usertenantprefscontroller.deletebyid-responseschema">Response Schema</h3>

Status Code **204**

*UserTenantPrefs DELETE success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserTenantPrefsController.create

<a id="opIdUserTenantPrefsController.create"></a>

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
  "configKey": "string",
  "configValue": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-tenant-prefs',
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
  "configKey": "string",
  "configValue": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-tenant-prefs',
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

`POST /user-tenant-prefs`

| Permissions |
| ------- |
| CreateUserTenantPreference   |
| 29   |

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
  "configKey": "string",
  "configValue": {}
}
```

<h3 id="usertenantprefscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewUserTenantPrefs](#schemanewusertenantprefs)|false|none|

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
  "configKey": "string",
  "configValue": {},
  "userTenantId": "string"
}
```

<h3 id="usertenantprefscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserTenantPrefs model instance|[UserTenantPrefs](#schemausertenantprefs)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserTenantPrefsController.find

<a id="opIdUserTenantPrefsController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-tenant-prefs',
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

fetch('/user-tenant-prefs',
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

`GET /user-tenant-prefs`

| Permissions |
| ------- |
| ViewUserTenantPreference   |
| 25   |

<h3 id="usertenantprefscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[user_tenant_prefs.Filter](#schemauser_tenant_prefs.filter)|false|none|

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
    "configKey": "string",
    "configValue": {},
    "userTenantId": "string",
    "userTenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "locale": "string",
      "status": 12,
      "userId": "string",
      "tenantId": "string",
      "roleId": "string",
      "user": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {}
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {}
        ]
      },
      "foreignKey": null,
      "tenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {}
        ],
        "users": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {},
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {}
            ]
          }
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "role": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {}
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      },
      "userLevelPermissions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "permission": "string",
          "allowed": true,
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ],
      "userGroups": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "groupId": "string",
          "userTenantId": "string",
          "group": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {}
            ]
          },
          "foreignKey": null,
          "userTenant": {}
        }
      ],
      "userInvitations": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "expiresOn": "2019-08-24T14:15:22Z",
          "token": "string",
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ]
    },
    "foreignKey": null
  }
]
```

<h3 id="usertenantprefscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of UserTenantPrefs model instances|Inline|

<h3 id="usertenantprefscontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserTenantPrefsWithRelations](#schemausertenantprefswithrelations)]|false|none|[(tsType: UserTenantPrefsWithRelations, schemaOptions: { includeRelations: true })]|
|» UserTenantPrefsWithRelations|[UserTenantPrefsWithRelations](#schemausertenantprefswithrelations)|false|none|(tsType: UserTenantPrefsWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» configKey|string|true|none|none|
|»» configValue|object|true|none|none|
|»» userTenantId|string|false|none|none|
|»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» locale|string|false|none|none|
|»»» status|number|false|none|none|
|»»» userId|string|true|none|none|
|»»» tenantId|string|true|none|none|
|»»» roleId|string|true|none|none|
|»»» user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» firstName|string|true|none|none|
|»»»» lastName|string|false|none|none|
|»»»» middleName|string|false|none|none|
|»»»» username|string|true|none|none|
|»»»» email|string|true|none|none|
|»»»» designation|string|false|none|none|
|»»»» phone|string|false|none|none|
|»»»» authClientIds|string|false|none|none|
|»»»» lastLogin|string(date-time)|false|none|none|
|»»»» photoUrl|string|false|none|none|
|»»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»»» dob|string(date-time)|false|none|none|
|»»»» defaultTenantId|string|false|none|none|
|»»»» defaultTenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» name|string|true|none|none|
|»»»»» status|number¦null|true|none|Tenant status - Active or Inactive|
|»»»»» key|string|false|none|none|
|»»»»» website|string|false|none|none|
|»»»»» address|string|false|none|none|
|»»»»» city|string|false|none|none|
|»»»»» state|string|false|none|none|
|»»»»» zip|string|false|none|none|
|»»»»» country|string|false|none|none|
|»»»»» tenantConfigs|[[TenantConfigWithRelations](#schematenantconfigwithrelations)]|false|none|(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» TenantConfigWithRelations|[TenantConfigWithRelations](#schematenantconfigwithrelations)|false|none|(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» configKey|string|true|none|none|
|»»»»»»» configValue|object|false|none|none|
|»»»»»»» tenantId|string|true|none|none|
|»»»»»»» tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» foreignKey|any|false|none|none|
|»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» users|[[UserWithRelations](#schemauserwithrelations)]|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» UserWithRelations|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» roles|[[RoleWithRelations](#schemarolewithrelations)]|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» RoleWithRelations|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» name|string|true|none|none|
|»»»»»»» roleType|number|false|none|none|
|»»»»»»» description|string|false|none|none|
|»»»»»»» permissions|[string]|false|none|none|
|»»»»»»» allowedClients|[string]|false|none|none|
|»»»»»»» tenantId|string|true|none|none|
|»»»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» createdByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»» deleted|boolean|false|none|none|
|»»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»»» createdBy|string|false|none|none|
|»»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»»» id|string|false|none|none|
|»»»»»»»» firstName|string|true|none|none|
|»»»»»»»» lastName|string|false|none|none|
|»»»»»»»» middleName|string|false|none|none|
|»»»»»»»» username|string|true|none|none|
|»»»»»»»» email|string|true|none|none|
|»»»»»»»» designation|string|false|none|none|
|»»»»»»»» phone|string|false|none|none|
|»»»»»»»» authClientIds|string|false|none|none|
|»»»»»»»» lastLogin|string|false|none|none|
|»»»»»»»» photoUrl|string|false|none|none|
|»»»»»»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»»»»»»» dob|string(date-time)¦null|false|none|none|
|»»»»»»»» defaultTenantId|string|true|none|none|
|»»»»»»»» status|number|false|none|none|
|»»»»»»»» tenantId|string|true|none|none|
|»»»»»»»» roleId|string|true|none|none|
|»»»»»»»» tenantName|string|true|none|none|
|»»»»»»»» tenantKey|string|false|none|none|
|»»»»»»»» roleName|string|false|none|none|
|»»»»»»»» userTenantId|string|true|none|none|
|»»»»»»» foreignKey|any|false|none|none|
|»»»»»»» modifiedByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» groups|[[GroupWithRelations](#schemagroupwithrelations)]|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» GroupWithRelations|[GroupWithRelations](#schemagroupwithrelations)|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» deleted|boolean|false|none|none|
|»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»» createdBy|string|false|none|none|
|»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»» id|string|false|none|none|
|»»»»»»» name|string|false|none|none|
|»»»»»»» description|string|false|none|none|
|»»»»»»» photoUrl|string|false|none|none|
|»»»»»»» tenantId|string|true|none|none|
|»»»»»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»»» deleted|boolean|false|none|none|
|»»»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»»»» createdBy|string|false|none|none|
|»»»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»»»» id|string|false|none|none|
|»»»»»»»»» groupId|string|true|none|none|
|»»»»»»»»» userTenantId|string|true|none|none|
|»»»»»»»»» group|[GroupWithRelations](#schemagroupwithrelations)|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»»» foreignKey|any|false|none|none|
|»»»»»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» foreignKey|any|false|none|none|
|»»»» credentials|[UserCredentialsWithRelations](#schemausercredentialswithrelations)|false|none|(tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» authProvider|string|true|none|none|
|»»»»» authId|string|false|none|none|
|»»»»» authToken|string|false|none|none|
|»»»»» secretKey|string|false|none|Secret for Authenticator app|
|»»»»» password|string|false|none|none|
|»»»»» userId|string|true|none|none|
|»»»»» user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» foreignKey|any|false|none|none|
|»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» foreignKey|any|false|none|none|
|»»» tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» role|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»»» userLevelPermissions|[[UserLevelPermissionWithRelations](#schemauserlevelpermissionwithrelations)]|false|none|(tsType: UserLevelPermissionWithRelations, schemaOptions: { includeRelations: true })|
|»»»» UserLevelPermissionWithRelations|[UserLevelPermissionWithRelations](#schemauserlevelpermissionwithrelations)|false|none|(tsType: UserLevelPermissionWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» permission|string|true|none|none|
|»»»»» allowed|boolean|true|none|none|
|»»»»» userTenantId|string|true|none|none|
|»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» foreignKey|any|false|none|none|
|»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»» userInvitations|[[UserInvitationWithRelations](#schemauserinvitationwithrelations)]|false|none|(tsType: UserInvitationWithRelations, schemaOptions: { includeRelations: true })|
|»»»» UserInvitationWithRelations|[UserInvitationWithRelations](#schemauserinvitationwithrelations)|false|none|(tsType: UserInvitationWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» expiresOn|string(date-time)|false|none|none|
|»»»»» token|string|false|none|none|
|»»»»» userTenantId|string|true|none|none|
|»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» foreignKey|any|false|none|none|
|»» foreignKey|any|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|
|status|1|
|status|0|
|gender|M|
|gender|F|
|gender|O|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-usertenantusergroupcontroller">UserTenantUserGroupController</h1>

## UserTenantUserGroupController.find

<a id="opIdUserTenantUserGroupController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-tenants/{id}/user-groups',
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

fetch('/user-tenants/{id}/user-groups',
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

`GET /user-tenants/{id}/user-groups`

| Permissions |
| ------- |
| ViewUserTenant   |

<h3 id="usertenantusergroupcontroller.find-parameters">Parameters</h3>

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
    "groupId": "string",
    "userTenantId": "string"
  }
]
```

<h3 id="usertenantusergroupcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of UserGroups of UserTenant|Inline|

<h3 id="usertenantusergroupcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserGroup](#schemausergroup)]|false|none|none|
|» UserGroup|[UserGroup](#schemausergroup)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» groupId|string|true|none|none|
|»» userTenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-usertenantuserlevelpermissioncontroller">UserTenantUserLevelPermissionController</h1>

## UserTenantUserLevelPermissionController.create

<a id="opIdUserTenantUserLevelPermissionController.create"></a>

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-tenants/{id}/user-level-permissions',
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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-tenants/{id}/user-level-permissions',
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

`POST /user-tenants/{id}/user-level-permissions`

| Permissions |
| ------- |
| CreateUserTenant   |
| CreateUserPermissions   |

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}
```

<h3 id="usertenantuserlevelpermissioncontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewUserLevelPermissionInUserTenant](#schemanewuserlevelpermissioninusertenant)|false|none|

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}
```

<h3 id="usertenantuserlevelpermissioncontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserLevelPermission model instance|[UserLevelPermission](#schemauserlevelpermission)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserTenantUserLevelPermissionController.patch

<a id="opIdUserTenantUserLevelPermissionController.patch"></a>

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-tenants/{id}/user-level-permissions',
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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user-tenants/{id}/user-level-permissions',
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

`PATCH /user-tenants/{id}/user-level-permissions`

| Permissions |
| ------- |
| UpdateUserTenant   |
| UpdateUserPermissions   |

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}
```

<h3 id="usertenantuserlevelpermissioncontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[UserLevelPermissionPartial](#schemauserlevelpermissionpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="usertenantuserlevelpermissioncontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserTenant.UserLevelPermission PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserTenantUserLevelPermissionController.find

<a id="opIdUserTenantUserLevelPermissionController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-tenants/{id}/user-level-permissions',
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

fetch('/user-tenants/{id}/user-level-permissions',
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

`GET /user-tenants/{id}/user-level-permissions`

| Permissions |
| ------- |
| ViewUserTenant   |

<h3 id="usertenantuserlevelpermissioncontroller.find-parameters">Parameters</h3>

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
    "permission": "string",
    "allowed": true,
    "userTenantId": "string"
  }
]
```

<h3 id="usertenantuserlevelpermissioncontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of UserLevelPermissions of UserTenant|Inline|

<h3 id="usertenantuserlevelpermissioncontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserLevelPermission](#schemauserlevelpermission)]|false|none|none|
|» UserLevelPermission|[UserLevelPermission](#schemauserlevelpermission)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» permission|string|true|none|none|
|»» allowed|boolean|true|none|none|
|»» userTenantId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserTenantUserLevelPermissionController.delete

<a id="opIdUserTenantUserLevelPermissionController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-tenants/{id}/user-level-permissions',
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

fetch('/user-tenants/{id}/user-level-permissions',
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

`DELETE /user-tenants/{id}/user-level-permissions`

| Permissions |
| ------- |
| DeleteUserTenant   |

<h3 id="usertenantuserlevelpermissioncontroller.delete-parameters">Parameters</h3>

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

<h3 id="usertenantuserlevelpermissioncontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserTenant.UserLevelPermission DELETE success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

# Schemas

<h2 id="tocS_Role">Role</h2>
<!-- backwards compatibility -->
<a id="schemarole"></a>
<a id="schema_Role"></a>
<a id="tocSrole"></a>
<a id="tocsrole"></a>

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
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ],
  "tenantId": "string"
}

```

Role

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
|roleType|number|false|none|none|
|description|string|false|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|
|tenantId|string|true|none|none|

<h2 id="tocS_NewRoleInTenant">NewRoleInTenant</h2>
<!-- backwards compatibility -->
<a id="schemanewroleintenant"></a>
<a id="schema_NewRoleInTenant"></a>
<a id="tocSnewroleintenant"></a>
<a id="tocsnewroleintenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}

```

NewRoleInTenant

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
|name|string|true|none|none|
|roleType|number|false|none|none|
|description|string|false|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|

<h2 id="tocS_RolePartialExcluding_id-tenantId_">RolePartialExcluding_id-tenantId_</h2>
<!-- backwards compatibility -->
<a id="schemarolepartialexcluding_id-tenantid_"></a>
<a id="schema_RolePartialExcluding_id-tenantId_"></a>
<a id="tocSrolepartialexcluding_id-tenantid_"></a>
<a id="tocsrolepartialexcluding_id-tenantid_"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "name": "string",
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}

```

RolePartialExcluding_id-tenantId_

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
|name|string|false|none|none|
|roleType|number|false|none|none|
|description|string|false|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|

<h2 id="tocS_Tenant">Tenant</h2>
<!-- backwards compatibility -->
<a id="schematenant"></a>
<a id="schema_Tenant"></a>
<a id="tocStenant"></a>
<a id="tocstenant"></a>

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
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}

```

Tenant

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
|status|number¦null|true|none|Tenant status - Active or Inactive|
|key|string|false|none|none|
|website|string|false|none|none|
|address|string|false|none|none|
|city|string|false|none|none|
|state|string|false|none|none|
|zip|string|false|none|none|
|country|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|

<h2 id="tocS_NewTenant">NewTenant</h2>
<!-- backwards compatibility -->
<a id="schemanewtenant"></a>
<a id="schema_NewTenant"></a>
<a id="tocSnewtenant"></a>
<a id="tocsnewtenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "name": "string",
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}

```

NewTenant

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
|name|string|true|none|none|
|status|number¦null|true|none|Tenant status - Active or Inactive|
|key|string|false|none|none|
|website|string|false|none|none|
|address|string|false|none|none|
|city|string|false|none|none|
|state|string|false|none|none|
|zip|string|false|none|none|
|country|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|

<h2 id="tocS_GroupWithRelations">GroupWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemagroupwithrelations"></a>
<a id="schema_GroupWithRelations"></a>
<a id="tocSgroupwithrelations"></a>
<a id="tocsgroupwithrelations"></a>

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
  "description": "string",
  "photoUrl": "string",
  "tenantId": "string",
  "userGroups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "groupId": "string",
      "userTenantId": "string",
      "group": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "description": "string",
        "photoUrl": "string",
        "tenantId": "string",
        "userGroups": []
      },
      "foreignKey": null,
      "userTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {}
            ],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": []
              }
            ]
          },
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            }
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": []
            }
          ]
        },
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {}
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    }
  ]
}

```

GroupWithRelations

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
|description|string|false|none|none|
|photoUrl|string|false|none|none|
|tenantId|string|true|none|none|
|userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|[(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })]|

<h2 id="tocS_TenantConfigWithRelations">TenantConfigWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematenantconfigwithrelations"></a>
<a id="schema_TenantConfigWithRelations"></a>
<a id="tocStenantconfigwithrelations"></a>
<a id="tocstenantconfigwithrelations"></a>

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
  "configKey": "string",
  "configValue": {},
  "tenantId": "string",
  "tenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 1,
    "key": "string",
    "website": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string",
    "tenantConfigs": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "configKey": "string",
        "configValue": {},
        "tenantId": "string",
        "tenant": {},
        "foreignKey": null
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {},
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    ],
    "users": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {},
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ]
      }
    ],
    "roles": [
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
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {},
            "role": {},
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      }
    ],
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
        "name": "string",
        "description": "string",
        "photoUrl": "string",
        "tenantId": "string",
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {},
            "foreignKey": null,
            "userTenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "locale": "string",
              "status": 12,
              "userId": "string",
              "tenantId": "string",
              "roleId": "string",
              "user": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "2019-08-24T14:15:22Z",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "defaultTenant": {},
                "foreignKey": null,
                "credentials": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "authProvider": "string",
                  "authId": "string",
                  "authToken": "string",
                  "secretKey": "string",
                  "password": "string",
                  "userId": "string",
                  "user": {},
                  "foreignKey": null
                },
                "userTenants": [
                  {}
                ]
              },
              "foreignKey": null,
              "tenant": {},
              "role": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              },
              "userLevelPermissions": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "permission": "string",
                  "allowed": true,
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ],
              "userGroups": [
                {}
              ],
              "userInvitations": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "expiresOn": "2019-08-24T14:15:22Z",
                  "token": "string",
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "foreignKey": null
}

```

TenantConfigWithRelations

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
|configKey|string|true|none|none|
|configValue|object|false|none|none|
|tenantId|string|true|none|none|
|tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|

<h2 id="tocS_UserCredentialsWithRelations">UserCredentialsWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemausercredentialswithrelations"></a>
<a id="schema_UserCredentialsWithRelations"></a>
<a id="tocSusercredentialswithrelations"></a>
<a id="tocsusercredentialswithrelations"></a>

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
  "authProvider": "string",
  "authId": "string",
  "authToken": "string",
  "secretKey": "string",
  "password": "string",
  "userId": "string",
  "user": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string",
    "username": "string",
    "email": "string",
    "designation": "string",
    "phone": "string",
    "authClientIds": "string",
    "lastLogin": "2019-08-24T14:15:22Z",
    "photoUrl": "string",
    "gender": "M",
    "dob": "2019-08-24T14:15:22Z",
    "defaultTenantId": "string",
    "defaultTenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 1,
      "key": "string",
      "website": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "tenantConfigs": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "configKey": "string",
          "configValue": {},
          "tenantId": "string",
          "tenant": {},
          "foreignKey": null
        }
      ],
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
          "foreignKey": null,
          "tenant": {},
          "role": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          },
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              },
              "foreignKey": null,
              "userTenant": {}
            }
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      ],
      "users": [
        {}
      ],
      "roles": [
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
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "locale": "string",
              "status": 12,
              "userId": "string",
              "tenantId": "string",
              "roleId": "string",
              "user": {},
              "foreignKey": null,
              "tenant": {},
              "role": {},
              "userLevelPermissions": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "permission": "string",
                  "allowed": true,
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ],
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "name": "string",
                    "description": "string",
                    "photoUrl": "string",
                    "tenantId": "string",
                    "userGroups": []
                  },
                  "foreignKey": null,
                  "userTenant": {}
                }
              ],
              "userInvitations": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "expiresOn": "2019-08-24T14:15:22Z",
                  "token": "string",
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ]
            }
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        }
      ],
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
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {},
              "foreignKey": null,
              "userTenant": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {},
                "foreignKey": null,
                "tenant": {},
                "role": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "roleType": 15,
                  "description": "string",
                  "permissions": [
                    "string"
                  ],
                  "allowedClients": [
                    "string"
                  ],
                  "tenantId": "string",
                  "userTenants": [
                    {}
                  ],
                  "createdByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  },
                  "foreignKey": null,
                  "modifiedByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  }
                },
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {}
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    "foreignKey": null,
    "credentials": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "authProvider": "string",
      "authId": "string",
      "authToken": "string",
      "secretKey": "string",
      "password": "string",
      "userId": "string",
      "user": {},
      "foreignKey": null
    },
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {},
        "foreignKey": null,
        "tenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {}
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    ]
  },
  "foreignKey": null
}

```

UserCredentialsWithRelations

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
|authProvider|string|true|none|none|
|authId|string|false|none|none|
|authToken|string|false|none|none|
|secretKey|string|false|none|Secret for Authenticator app|
|password|string|false|none|none|
|userId|string|true|none|none|
|user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|

<h2 id="tocS_UserWithRelations">UserWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemauserwithrelations"></a>
<a id="schema_UserWithRelations"></a>
<a id="tocSuserwithrelations"></a>
<a id="tocsuserwithrelations"></a>

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string",
  "defaultTenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 1,
    "key": "string",
    "website": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string",
    "tenantConfigs": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "configKey": "string",
        "configValue": {},
        "tenantId": "string",
        "tenant": {},
        "foreignKey": null
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {},
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    ],
    "users": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {},
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ]
      }
    ],
    "roles": [
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
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {},
            "role": {},
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      }
    ],
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
        "name": "string",
        "description": "string",
        "photoUrl": "string",
        "tenantId": "string",
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {},
            "foreignKey": null,
            "userTenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "locale": "string",
              "status": 12,
              "userId": "string",
              "tenantId": "string",
              "roleId": "string",
              "user": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "2019-08-24T14:15:22Z",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "defaultTenant": {},
                "foreignKey": null,
                "credentials": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "authProvider": "string",
                  "authId": "string",
                  "authToken": "string",
                  "secretKey": "string",
                  "password": "string",
                  "userId": "string",
                  "user": {},
                  "foreignKey": null
                },
                "userTenants": [
                  {}
                ]
              },
              "foreignKey": null,
              "tenant": {},
              "role": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              },
              "userLevelPermissions": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "permission": "string",
                  "allowed": true,
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ],
              "userGroups": [
                {}
              ],
              "userInvitations": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "expiresOn": "2019-08-24T14:15:22Z",
                  "token": "string",
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "foreignKey": null,
  "credentials": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "authProvider": "string",
    "authId": "string",
    "authToken": "string",
    "secretKey": "string",
    "password": "string",
    "userId": "string",
    "user": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "2019-08-24T14:15:22Z",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "defaultTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "users": [
          {}
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {},
                "foreignKey": null,
                "tenant": {},
                "role": {},
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "locale": "string",
                  "status": 12,
                  "userId": "string",
                  "tenantId": "string",
                  "roleId": "string",
                  "user": {},
                  "foreignKey": null,
                  "tenant": {},
                  "role": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "name": "string",
                    "roleType": 15,
                    "description": "string",
                    "permissions": [],
                    "allowedClients": [],
                    "tenantId": "string",
                    "userTenants": [],
                    "createdByUser": {},
                    "foreignKey": null,
                    "modifiedByUser": {}
                  },
                  "userLevelPermissions": [
                    {}
                  ],
                  "userGroups": [
                    {}
                  ],
                  "userInvitations": [
                    {}
                  ]
                }
              }
            ]
          }
        ]
      },
      "foreignKey": null,
      "credentials": {},
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
          "foreignKey": null,
          "tenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {}
            ],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "role": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          },
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              },
              "foreignKey": null,
              "userTenant": {}
            }
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      ]
    },
    "foreignKey": null
  },
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "locale": "string",
      "status": 12,
      "userId": "string",
      "tenantId": "string",
      "roleId": "string",
      "user": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {}
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": []
      },
      "foreignKey": null,
      "tenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {}
        ],
        "users": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {},
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": []
          }
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "role": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {}
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      },
      "userLevelPermissions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "permission": "string",
          "allowed": true,
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ],
      "userGroups": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "groupId": "string",
          "userTenantId": "string",
          "group": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {}
            ]
          },
          "foreignKey": null,
          "userTenant": {}
        }
      ],
      "userInvitations": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "expiresOn": "2019-08-24T14:15:22Z",
          "token": "string",
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ]
    }
  ]
}

```

UserWithRelations

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
|firstName|string|true|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|username|string|true|none|none|
|email|string|true|none|none|
|designation|string|false|none|none|
|phone|string|false|none|none|
|authClientIds|string|false|none|none|
|lastLogin|string(date-time)|false|none|none|
|photoUrl|string|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|dob|string(date-time)|false|none|none|
|defaultTenantId|string|false|none|none|
|defaultTenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|
|credentials|[UserCredentialsWithRelations](#schemausercredentialswithrelations)|false|none|(tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })|
|userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|[(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })]|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<h2 id="tocS_UserViewWithRelations">UserViewWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemauserviewwithrelations"></a>
<a id="schema_UserViewWithRelations"></a>
<a id="tocSuserviewwithrelations"></a>
<a id="tocsuserviewwithrelations"></a>

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "string",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string",
  "status": 11,
  "tenantId": "string",
  "roleId": "string",
  "tenantName": "string",
  "tenantKey": "string",
  "roleName": "string",
  "userTenantId": "string"
}

```

UserViewWithRelations

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
|firstName|string|true|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|username|string|true|none|none|
|email|string|true|none|none|
|designation|string|false|none|none|
|phone|string|false|none|none|
|authClientIds|string|false|none|none|
|lastLogin|string|false|none|none|
|photoUrl|string|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|dob|string(date-time)¦null|false|none|none|
|defaultTenantId|string|true|none|none|
|status|number|false|none|none|
|tenantId|string|true|none|none|
|roleId|string|true|none|none|
|tenantName|string|true|none|none|
|tenantKey|string|false|none|none|
|roleName|string|false|none|none|
|userTenantId|string|true|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<h2 id="tocS_RoleWithRelations">RoleWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemarolewithrelations"></a>
<a id="schema_RoleWithRelations"></a>
<a id="tocSrolewithrelations"></a>
<a id="tocsrolewithrelations"></a>

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
  "roleType": 15,
  "description": "string",
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ],
  "tenantId": "string",
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "locale": "string",
      "status": 12,
      "userId": "string",
      "tenantId": "string",
      "roleId": "string",
      "user": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {}
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {}
        ]
      },
      "foreignKey": null,
      "tenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {}
        ],
        "users": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {},
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {}
            ]
          }
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "role": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      },
      "userLevelPermissions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "permission": "string",
          "allowed": true,
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ],
      "userGroups": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "groupId": "string",
          "userTenantId": "string",
          "group": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {}
            ]
          },
          "foreignKey": null,
          "userTenant": {}
        }
      ],
      "userInvitations": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "expiresOn": "2019-08-24T14:15:22Z",
          "token": "string",
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ]
    }
  ],
  "createdByUser": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string",
    "username": "string",
    "email": "string",
    "designation": "string",
    "phone": "string",
    "authClientIds": "string",
    "lastLogin": "string",
    "photoUrl": "string",
    "gender": "M",
    "dob": "2019-08-24T14:15:22Z",
    "defaultTenantId": "string",
    "status": 11,
    "tenantId": "string",
    "roleId": "string",
    "tenantName": "string",
    "tenantKey": "string",
    "roleName": "string",
    "userTenantId": "string"
  },
  "foreignKey": null,
  "modifiedByUser": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string",
    "username": "string",
    "email": "string",
    "designation": "string",
    "phone": "string",
    "authClientIds": "string",
    "lastLogin": "string",
    "photoUrl": "string",
    "gender": "M",
    "dob": "2019-08-24T14:15:22Z",
    "defaultTenantId": "string",
    "status": 11,
    "tenantId": "string",
    "roleId": "string",
    "tenantName": "string",
    "tenantKey": "string",
    "roleName": "string",
    "userTenantId": "string"
  }
}

```

RoleWithRelations

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
|roleType|number|false|none|none|
|description|string|false|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|
|tenantId|string|true|none|none|
|userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|[(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })]|
|createdByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|
|modifiedByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|

<h2 id="tocS_UserLevelPermissionWithRelations">UserLevelPermissionWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemauserlevelpermissionwithrelations"></a>
<a id="schema_UserLevelPermissionWithRelations"></a>
<a id="tocSuserlevelpermissionwithrelations"></a>
<a id="tocsuserlevelpermissionwithrelations"></a>

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string",
  "userTenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "locale": "string",
    "status": 12,
    "userId": "string",
    "tenantId": "string",
    "roleId": "string",
    "user": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "2019-08-24T14:15:22Z",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "defaultTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {}
        ],
        "users": [
          {}
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "foreignKey": null,
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {},
        "foreignKey": null
      },
      "userTenants": [
        {}
      ]
    },
    "foreignKey": null,
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 1,
      "key": "string",
      "website": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "tenantConfigs": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "configKey": "string",
          "configValue": {},
          "tenantId": "string",
          "tenant": {},
          "foreignKey": null
        }
      ],
      "userTenants": [
        {}
      ],
      "users": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        }
      ],
      "roles": [
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
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        }
      ],
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
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {},
              "foreignKey": null,
              "userTenant": {}
            }
          ]
        }
      ]
    },
    "role": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "roleType": 15,
      "description": "string",
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
      "tenantId": "string",
      "userTenants": [
        {}
      ],
      "createdByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      },
      "foreignKey": null,
      "modifiedByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      }
    },
    "userLevelPermissions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "permission": "string",
        "allowed": true,
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ],
    "userGroups": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "groupId": "string",
        "userTenantId": "string",
        "group": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {}
          ]
        },
        "foreignKey": null,
        "userTenant": {}
      }
    ],
    "userInvitations": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "expiresOn": "2019-08-24T14:15:22Z",
        "token": "string",
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ]
  },
  "foreignKey": null
}

```

UserLevelPermissionWithRelations

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
|permission|string|true|none|none|
|allowed|boolean|true|none|none|
|userTenantId|string|true|none|none|
|userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|

<h2 id="tocS_UserGroupWithRelations">UserGroupWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemausergroupwithrelations"></a>
<a id="schema_UserGroupWithRelations"></a>
<a id="tocSusergroupwithrelations"></a>
<a id="tocsusergroupwithrelations"></a>

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
  "groupId": "string",
  "userTenantId": "string",
  "group": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "description": "string",
    "photoUrl": "string",
    "tenantId": "string",
    "userGroups": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "groupId": "string",
        "userTenantId": "string",
        "group": {},
        "foreignKey": null,
        "userTenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "status": 1,
              "key": "string",
              "website": "string",
              "address": "string",
              "city": "string",
              "state": "string",
              "zip": "string",
              "country": "string",
              "tenantConfigs": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "configKey": "string",
                  "configValue": {},
                  "tenantId": "string",
                  "tenant": {},
                  "foreignKey": null
                }
              ],
              "userTenants": [
                {}
              ],
              "users": [
                {}
              ],
              "roles": [
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
                  "roleType": 15,
                  "description": "string",
                  "permissions": [
                    "string"
                  ],
                  "allowedClients": [
                    "string"
                  ],
                  "tenantId": "string",
                  "userTenants": [
                    {}
                  ],
                  "createdByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  },
                  "foreignKey": null,
                  "modifiedByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  }
                }
              ],
              "groups": [
                {}
              ]
            },
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {}
            ]
          },
          "foreignKey": null,
          "tenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "2019-08-24T14:15:22Z",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "defaultTenant": {},
                "foreignKey": null,
                "credentials": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "authProvider": "string",
                  "authId": "string",
                  "authToken": "string",
                  "secretKey": "string",
                  "password": "string",
                  "userId": "string",
                  "user": {},
                  "foreignKey": null
                },
                "userTenants": [
                  {}
                ]
              }
            ],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
            "groups": [
              {}
            ]
          },
          "role": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          },
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {}
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      }
    ]
  },
  "foreignKey": null,
  "userTenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "locale": "string",
    "status": 12,
    "userId": "string",
    "tenantId": "string",
    "roleId": "string",
    "user": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "2019-08-24T14:15:22Z",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "defaultTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {}
        ],
        "users": [
          {}
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "foreignKey": null,
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {},
        "foreignKey": null
      },
      "userTenants": [
        {}
      ]
    },
    "foreignKey": null,
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 1,
      "key": "string",
      "website": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "tenantConfigs": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "configKey": "string",
          "configValue": {},
          "tenantId": "string",
          "tenant": {},
          "foreignKey": null
        }
      ],
      "userTenants": [
        {}
      ],
      "users": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        }
      ],
      "roles": [
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
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        }
      ],
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
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {},
              "foreignKey": null,
              "userTenant": {}
            }
          ]
        }
      ]
    },
    "role": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "roleType": 15,
      "description": "string",
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
      "tenantId": "string",
      "userTenants": [
        {}
      ],
      "createdByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      },
      "foreignKey": null,
      "modifiedByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      }
    },
    "userLevelPermissions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "permission": "string",
        "allowed": true,
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ],
    "userGroups": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "groupId": "string",
        "userTenantId": "string",
        "group": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {}
          ]
        },
        "foreignKey": null,
        "userTenant": {}
      }
    ],
    "userInvitations": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "expiresOn": "2019-08-24T14:15:22Z",
        "token": "string",
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ]
  }
}

```

UserGroupWithRelations

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
|groupId|string|true|none|none|
|userTenantId|string|true|none|none|
|group|[GroupWithRelations](#schemagroupwithrelations)|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|
|userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|

<h2 id="tocS_UserInvitationWithRelations">UserInvitationWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemauserinvitationwithrelations"></a>
<a id="schema_UserInvitationWithRelations"></a>
<a id="tocSuserinvitationwithrelations"></a>
<a id="tocsuserinvitationwithrelations"></a>

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
  "expiresOn": "2019-08-24T14:15:22Z",
  "token": "string",
  "userTenantId": "string",
  "userTenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "locale": "string",
    "status": 12,
    "userId": "string",
    "tenantId": "string",
    "roleId": "string",
    "user": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "2019-08-24T14:15:22Z",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "defaultTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {}
        ],
        "users": [
          {}
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "foreignKey": null,
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {},
        "foreignKey": null
      },
      "userTenants": [
        {}
      ]
    },
    "foreignKey": null,
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 1,
      "key": "string",
      "website": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "tenantConfigs": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "configKey": "string",
          "configValue": {},
          "tenantId": "string",
          "tenant": {},
          "foreignKey": null
        }
      ],
      "userTenants": [
        {}
      ],
      "users": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        }
      ],
      "roles": [
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
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        }
      ],
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
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {},
              "foreignKey": null,
              "userTenant": {}
            }
          ]
        }
      ]
    },
    "role": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "roleType": 15,
      "description": "string",
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
      "tenantId": "string",
      "userTenants": [
        {}
      ],
      "createdByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      },
      "foreignKey": null,
      "modifiedByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      }
    },
    "userLevelPermissions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "permission": "string",
        "allowed": true,
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ],
    "userGroups": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "groupId": "string",
        "userTenantId": "string",
        "group": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {}
          ]
        },
        "foreignKey": null,
        "userTenant": {}
      }
    ],
    "userInvitations": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "expiresOn": "2019-08-24T14:15:22Z",
        "token": "string",
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ]
  },
  "foreignKey": null
}

```

UserInvitationWithRelations

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
|expiresOn|string(date-time)|false|none|none|
|token|string|false|none|none|
|userTenantId|string|true|none|none|
|userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|

<h2 id="tocS_UserTenantWithRelations">UserTenantWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemausertenantwithrelations"></a>
<a id="schema_UserTenantWithRelations"></a>
<a id="tocSusertenantwithrelations"></a>
<a id="tocsusertenantwithrelations"></a>

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
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string",
  "user": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "middleName": "string",
    "username": "string",
    "email": "string",
    "designation": "string",
    "phone": "string",
    "authClientIds": "string",
    "lastLogin": "2019-08-24T14:15:22Z",
    "photoUrl": "string",
    "gender": "M",
    "dob": "2019-08-24T14:15:22Z",
    "defaultTenantId": "string",
    "defaultTenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 1,
      "key": "string",
      "website": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "tenantConfigs": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "configKey": "string",
          "configValue": {},
          "tenantId": "string",
          "tenant": {},
          "foreignKey": null
        }
      ],
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
          "foreignKey": null,
          "tenant": {},
          "role": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          },
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              },
              "foreignKey": null,
              "userTenant": {}
            }
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      ],
      "users": [
        {}
      ],
      "roles": [
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
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "locale": "string",
              "status": 12,
              "userId": "string",
              "tenantId": "string",
              "roleId": "string",
              "user": {},
              "foreignKey": null,
              "tenant": {},
              "role": {},
              "userLevelPermissions": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "permission": "string",
                  "allowed": true,
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ],
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "name": "string",
                    "description": "string",
                    "photoUrl": "string",
                    "tenantId": "string",
                    "userGroups": []
                  },
                  "foreignKey": null,
                  "userTenant": {}
                }
              ],
              "userInvitations": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "expiresOn": "2019-08-24T14:15:22Z",
                  "token": "string",
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ]
            }
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        }
      ],
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
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {},
              "foreignKey": null,
              "userTenant": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {},
                "foreignKey": null,
                "tenant": {},
                "role": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "roleType": 15,
                  "description": "string",
                  "permissions": [
                    "string"
                  ],
                  "allowedClients": [
                    "string"
                  ],
                  "tenantId": "string",
                  "userTenants": [
                    {}
                  ],
                  "createdByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  },
                  "foreignKey": null,
                  "modifiedByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  }
                },
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {}
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    "foreignKey": null,
    "credentials": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "authProvider": "string",
      "authId": "string",
      "authToken": "string",
      "secretKey": "string",
      "password": "string",
      "userId": "string",
      "user": {},
      "foreignKey": null
    },
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {},
        "foreignKey": null,
        "tenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {}
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    ]
  },
  "foreignKey": null,
  "tenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 1,
    "key": "string",
    "website": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string",
    "tenantConfigs": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "configKey": "string",
        "configValue": {},
        "tenantId": "string",
        "tenant": {},
        "foreignKey": null
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {},
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    ],
    "users": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {},
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ]
      }
    ],
    "roles": [
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
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {},
            "role": {},
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      }
    ],
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
        "name": "string",
        "description": "string",
        "photoUrl": "string",
        "tenantId": "string",
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {},
            "foreignKey": null,
            "userTenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "locale": "string",
              "status": 12,
              "userId": "string",
              "tenantId": "string",
              "roleId": "string",
              "user": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "2019-08-24T14:15:22Z",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "defaultTenant": {},
                "foreignKey": null,
                "credentials": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "authProvider": "string",
                  "authId": "string",
                  "authToken": "string",
                  "secretKey": "string",
                  "password": "string",
                  "userId": "string",
                  "user": {},
                  "foreignKey": null
                },
                "userTenants": [
                  {}
                ]
              },
              "foreignKey": null,
              "tenant": {},
              "role": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              },
              "userLevelPermissions": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "permission": "string",
                  "allowed": true,
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ],
              "userGroups": [
                {}
              ],
              "userInvitations": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "expiresOn": "2019-08-24T14:15:22Z",
                  "token": "string",
                  "userTenantId": "string",
                  "userTenant": {},
                  "foreignKey": null
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "role": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "roleType": 15,
    "description": "string",
    "permissions": [
      "string"
    ],
    "allowedClients": [
      "string"
    ],
    "tenantId": "string",
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {}
            ],
            "roles": [
              {}
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            }
          ],
          "roles": [
            {}
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "role": {},
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    ],
    "createdByUser": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "string",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "status": 11,
      "tenantId": "string",
      "roleId": "string",
      "tenantName": "string",
      "tenantKey": "string",
      "roleName": "string",
      "userTenantId": "string"
    },
    "foreignKey": null,
    "modifiedByUser": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "string",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "status": 11,
      "tenantId": "string",
      "roleId": "string",
      "tenantName": "string",
      "tenantKey": "string",
      "roleName": "string",
      "userTenantId": "string"
    }
  },
  "userLevelPermissions": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "permission": "string",
      "allowed": true,
      "userTenantId": "string",
      "userTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {}
            ],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            }
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      },
      "foreignKey": null
    }
  ],
  "userGroups": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "groupId": "string",
      "userTenantId": "string",
      "group": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "description": "string",
        "photoUrl": "string",
        "tenantId": "string",
        "userGroups": [
          {}
        ]
      },
      "foreignKey": null,
      "userTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {}
            ],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              }
            ]
          },
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            }
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            }
          ]
        },
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [],
        "userInvitations": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "expiresOn": "2019-08-24T14:15:22Z",
            "token": "string",
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ]
      }
    }
  ],
  "userInvitations": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "expiresOn": "2019-08-24T14:15:22Z",
      "token": "string",
      "userTenantId": "string",
      "userTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {}
            ],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        },
        "foreignKey": null,
        "tenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [
            {}
          ],
          "users": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            }
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "role": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        },
        "userLevelPermissions": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "permission": "string",
            "allowed": true,
            "userTenantId": "string",
            "userTenant": {},
            "foreignKey": null
          }
        ],
        "userGroups": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "groupId": "string",
            "userTenantId": "string",
            "group": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {}
              ]
            },
            "foreignKey": null,
            "userTenant": {}
          }
        ],
        "userInvitations": []
      },
      "foreignKey": null
    }
  ]
}

```

UserTenantWithRelations

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
|locale|string|false|none|none|
|status|number|false|none|none|
|userId|string|true|none|none|
|tenantId|string|true|none|none|
|roleId|string|true|none|none|
|user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|
|tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|role|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|userLevelPermissions|[[UserLevelPermissionWithRelations](#schemauserlevelpermissionwithrelations)]|false|none|[(tsType: UserLevelPermissionWithRelations, schemaOptions: { includeRelations: true })]|
|userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|[(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })]|
|userInvitations|[[UserInvitationWithRelations](#schemauserinvitationwithrelations)]|false|none|[(tsType: UserInvitationWithRelations, schemaOptions: { includeRelations: true })]|

<h2 id="tocS_TenantWithRelations">TenantWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematenantwithrelations"></a>
<a id="schema_TenantWithRelations"></a>
<a id="tocStenantwithrelations"></a>
<a id="tocstenantwithrelations"></a>

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
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "tenantConfigs": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "configKey": "string",
      "configValue": {},
      "tenantId": "string",
      "tenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {},
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "users": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {},
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {},
                "foreignKey": null,
                "tenant": {},
                "role": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "roleType": 15,
                  "description": "string",
                  "permissions": [
                    "string"
                  ],
                  "allowedClients": [
                    "string"
                  ],
                  "tenantId": "string",
                  "userTenants": [
                    {}
                  ],
                  "createdByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  },
                  "foreignKey": null,
                  "modifiedByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  }
                },
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            ]
          }
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "2019-08-24T14:15:22Z",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "defaultTenant": {},
                  "foreignKey": null,
                  "credentials": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "authProvider": "string",
                    "authId": "string",
                    "authToken": "string",
                    "secretKey": "string",
                    "password": "string",
                    "userId": "string",
                    "user": {},
                    "foreignKey": null
                  },
                  "userTenants": [
                    {}
                  ]
                },
                "foreignKey": null,
                "tenant": {},
                "role": {},
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "locale": "string",
                  "status": 12,
                  "userId": "string",
                  "tenantId": "string",
                  "roleId": "string",
                  "user": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "2019-08-24T14:15:22Z",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "defaultTenant": {},
                    "foreignKey": null,
                    "credentials": {},
                    "userTenants": []
                  },
                  "foreignKey": null,
                  "tenant": {},
                  "role": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "name": "string",
                    "roleType": 15,
                    "description": "string",
                    "permissions": [],
                    "allowedClients": [],
                    "tenantId": "string",
                    "userTenants": [],
                    "createdByUser": {},
                    "foreignKey": null,
                    "modifiedByUser": {}
                  },
                  "userLevelPermissions": [
                    {}
                  ],
                  "userGroups": [
                    {}
                  ],
                  "userInvitations": [
                    {}
                  ]
                }
              }
            ]
          }
        ]
      },
      "foreignKey": null
    }
  ],
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "locale": "string",
      "status": 12,
      "userId": "string",
      "tenantId": "string",
      "roleId": "string",
      "user": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "2019-08-24T14:15:22Z",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "defaultTenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "status": 1,
          "key": "string",
          "website": "string",
          "address": "string",
          "city": "string",
          "state": "string",
          "zip": "string",
          "country": "string",
          "tenantConfigs": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "configKey": "string",
              "configValue": {},
              "tenantId": "string",
              "tenant": {},
              "foreignKey": null
            }
          ],
          "userTenants": [],
          "users": [
            {}
          ],
          "roles": [
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
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            }
          ],
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
              "name": "string",
              "description": "string",
              "photoUrl": "string",
              "tenantId": "string",
              "userGroups": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "groupId": "string",
                  "userTenantId": "string",
                  "group": {},
                  "foreignKey": null,
                  "userTenant": {}
                }
              ]
            }
          ]
        },
        "foreignKey": null,
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {},
          "foreignKey": null
        },
        "userTenants": [
          {}
        ]
      },
      "foreignKey": null,
      "tenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [],
        "users": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {},
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {}
            ]
          }
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "role": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "roleType": 15,
        "description": "string",
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
        "tenantId": "string",
        "userTenants": [
          {}
        ],
        "createdByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        },
        "foreignKey": null,
        "modifiedByUser": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "string",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "status": 11,
          "tenantId": "string",
          "roleId": "string",
          "tenantName": "string",
          "tenantKey": "string",
          "roleName": "string",
          "userTenantId": "string"
        }
      },
      "userLevelPermissions": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "permission": "string",
          "allowed": true,
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ],
      "userGroups": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "groupId": "string",
          "userTenantId": "string",
          "group": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {}
            ]
          },
          "foreignKey": null,
          "userTenant": {}
        }
      ],
      "userInvitations": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "expiresOn": "2019-08-24T14:15:22Z",
          "token": "string",
          "userTenantId": "string",
          "userTenant": {},
          "foreignKey": null
        }
      ]
    }
  ],
  "users": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "2019-08-24T14:15:22Z",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "defaultTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
            "foreignKey": null,
            "tenant": {},
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                },
                "foreignKey": null,
                "userTenant": {}
              }
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        ],
        "users": [],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "locale": "string",
                "status": 12,
                "userId": "string",
                "tenantId": "string",
                "roleId": "string",
                "user": {},
                "foreignKey": null,
                "tenant": {},
                "role": {},
                "userLevelPermissions": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "permission": "string",
                    "allowed": true,
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ],
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ],
                "userInvitations": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "expiresOn": "2019-08-24T14:15:22Z",
                    "token": "string",
                    "userTenantId": "string",
                    "userTenant": {},
                    "foreignKey": null
                  }
                ]
              }
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "locale": "string",
                  "status": 12,
                  "userId": "string",
                  "tenantId": "string",
                  "roleId": "string",
                  "user": {},
                  "foreignKey": null,
                  "tenant": {},
                  "role": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "name": "string",
                    "roleType": 15,
                    "description": "string",
                    "permissions": [],
                    "allowedClients": [],
                    "tenantId": "string",
                    "userTenants": [],
                    "createdByUser": {},
                    "foreignKey": null,
                    "modifiedByUser": {}
                  },
                  "userLevelPermissions": [
                    {}
                  ],
                  "userGroups": [
                    {}
                  ],
                  "userInvitations": [
                    {}
                  ]
                }
              }
            ]
          }
        ]
      },
      "foreignKey": null,
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {},
        "foreignKey": null
      },
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
          "foreignKey": null,
          "tenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [],
            "roles": [
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
                "roleType": 15,
                "description": "string",
                "permissions": [
                  "string"
                ],
                "allowedClients": [
                  "string"
                ],
                "tenantId": "string",
                "userTenants": [
                  {}
                ],
                "createdByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                },
                "foreignKey": null,
                "modifiedByUser": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "string",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "status": 11,
                  "tenantId": "string",
                  "roleId": "string",
                  "tenantName": "string",
                  "tenantKey": "string",
                  "roleName": "string",
                  "userTenantId": "string"
                }
              }
            ],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "role": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          },
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              },
              "foreignKey": null,
              "userTenant": {}
            }
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      ]
    }
  ],
  "roles": [
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
      "roleType": 15,
      "description": "string",
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
      "tenantId": "string",
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "2019-08-24T14:15:22Z",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "defaultTenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "status": 1,
              "key": "string",
              "website": "string",
              "address": "string",
              "city": "string",
              "state": "string",
              "zip": "string",
              "country": "string",
              "tenantConfigs": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "configKey": "string",
                  "configValue": {},
                  "tenantId": "string",
                  "tenant": {},
                  "foreignKey": null
                }
              ],
              "userTenants": [
                {}
              ],
              "users": [
                {}
              ],
              "roles": [],
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
                  "name": "string",
                  "description": "string",
                  "photoUrl": "string",
                  "tenantId": "string",
                  "userGroups": [
                    {}
                  ]
                }
              ]
            },
            "foreignKey": null,
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {},
              "foreignKey": null
            },
            "userTenants": [
              {}
            ]
          },
          "foreignKey": null,
          "tenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "name": "string",
            "status": 1,
            "key": "string",
            "website": "string",
            "address": "string",
            "city": "string",
            "state": "string",
            "zip": "string",
            "country": "string",
            "tenantConfigs": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "configKey": "string",
                "configValue": {},
                "tenantId": "string",
                "tenant": {},
                "foreignKey": null
              }
            ],
            "userTenants": [
              {}
            ],
            "users": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "2019-08-24T14:15:22Z",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "defaultTenant": {},
                "foreignKey": null,
                "credentials": {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "authProvider": "string",
                  "authId": "string",
                  "authToken": "string",
                  "secretKey": "string",
                  "password": "string",
                  "userId": "string",
                  "user": {},
                  "foreignKey": null
                },
                "userTenants": [
                  {}
                ]
              }
            ],
            "roles": [],
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
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "groupId": "string",
                    "userTenantId": "string",
                    "group": {},
                    "foreignKey": null,
                    "userTenant": {}
                  }
                ]
              }
            ]
          },
          "role": {},
          "userLevelPermissions": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "permission": "string",
              "allowed": true,
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ],
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "description": "string",
                "photoUrl": "string",
                "tenantId": "string",
                "userGroups": [
                  {}
                ]
              },
              "foreignKey": null,
              "userTenant": {}
            }
          ],
          "userInvitations": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "expiresOn": "2019-08-24T14:15:22Z",
              "token": "string",
              "userTenantId": "string",
              "userTenant": {},
              "foreignKey": null
            }
          ]
        }
      ],
      "createdByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      },
      "foreignKey": null,
      "modifiedByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      }
    }
  ],
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
      "name": "string",
      "description": "string",
      "photoUrl": "string",
      "tenantId": "string",
      "userGroups": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "groupId": "string",
          "userTenantId": "string",
          "group": {},
          "foreignKey": null,
          "userTenant": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "2019-08-24T14:15:22Z",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "defaultTenant": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "name": "string",
                "status": 1,
                "key": "string",
                "website": "string",
                "address": "string",
                "city": "string",
                "state": "string",
                "zip": "string",
                "country": "string",
                "tenantConfigs": [
                  {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "configKey": "string",
                    "configValue": {},
                    "tenantId": "string",
                    "tenant": {},
                    "foreignKey": null
                  }
                ],
                "userTenants": [
                  {}
                ],
                "users": [
                  {}
                ],
                "roles": [
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
                    "roleType": 15,
                    "description": "string",
                    "permissions": [],
                    "allowedClients": [],
                    "tenantId": "string",
                    "userTenants": [],
                    "createdByUser": {},
                    "foreignKey": null,
                    "modifiedByUser": {}
                  }
                ],
                "groups": []
              },
              "foreignKey": null,
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {},
                "foreignKey": null
              },
              "userTenants": [
                {}
              ]
            },
            "foreignKey": null,
            "tenant": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "status": 1,
              "key": "string",
              "website": "string",
              "address": "string",
              "city": "string",
              "state": "string",
              "zip": "string",
              "country": "string",
              "tenantConfigs": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "configKey": "string",
                  "configValue": {},
                  "tenantId": "string",
                  "tenant": {},
                  "foreignKey": null
                }
              ],
              "userTenants": [
                {}
              ],
              "users": [
                {
                  "deleted": true,
                  "deletedOn": "2019-08-24T14:15:22Z",
                  "deletedBy": "string",
                  "createdOn": "2019-08-24T14:15:22Z",
                  "modifiedOn": "2019-08-24T14:15:22Z",
                  "createdBy": "string",
                  "modifiedBy": "string",
                  "id": "string",
                  "firstName": "string",
                  "lastName": "string",
                  "middleName": "string",
                  "username": "string",
                  "email": "string",
                  "designation": "string",
                  "phone": "string",
                  "authClientIds": "string",
                  "lastLogin": "2019-08-24T14:15:22Z",
                  "photoUrl": "string",
                  "gender": "M",
                  "dob": "2019-08-24T14:15:22Z",
                  "defaultTenantId": "string",
                  "defaultTenant": {},
                  "foreignKey": null,
                  "credentials": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "authProvider": "string",
                    "authId": "string",
                    "authToken": "string",
                    "secretKey": "string",
                    "password": "string",
                    "userId": "string",
                    "user": {},
                    "foreignKey": null
                  },
                  "userTenants": [
                    {}
                  ]
                }
              ],
              "roles": [
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
                  "roleType": 15,
                  "description": "string",
                  "permissions": [
                    "string"
                  ],
                  "allowedClients": [
                    "string"
                  ],
                  "tenantId": "string",
                  "userTenants": [
                    {}
                  ],
                  "createdByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  },
                  "foreignKey": null,
                  "modifiedByUser": {
                    "deleted": true,
                    "deletedOn": "2019-08-24T14:15:22Z",
                    "deletedBy": "string",
                    "createdOn": "2019-08-24T14:15:22Z",
                    "modifiedOn": "2019-08-24T14:15:22Z",
                    "createdBy": "string",
                    "modifiedBy": "string",
                    "id": "string",
                    "firstName": "string",
                    "lastName": "string",
                    "middleName": "string",
                    "username": "string",
                    "email": "string",
                    "designation": "string",
                    "phone": "string",
                    "authClientIds": "string",
                    "lastLogin": "string",
                    "photoUrl": "string",
                    "gender": "M",
                    "dob": "2019-08-24T14:15:22Z",
                    "defaultTenantId": "string",
                    "status": 11,
                    "tenantId": "string",
                    "roleId": "string",
                    "tenantName": "string",
                    "tenantKey": "string",
                    "roleName": "string",
                    "userTenantId": "string"
                  }
                }
              ],
              "groups": []
            },
            "role": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "name": "string",
              "roleType": 15,
              "description": "string",
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
              "tenantId": "string",
              "userTenants": [
                {}
              ],
              "createdByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              },
              "foreignKey": null,
              "modifiedByUser": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "firstName": "string",
                "lastName": "string",
                "middleName": "string",
                "username": "string",
                "email": "string",
                "designation": "string",
                "phone": "string",
                "authClientIds": "string",
                "lastLogin": "string",
                "photoUrl": "string",
                "gender": "M",
                "dob": "2019-08-24T14:15:22Z",
                "defaultTenantId": "string",
                "status": 11,
                "tenantId": "string",
                "roleId": "string",
                "tenantName": "string",
                "tenantKey": "string",
                "roleName": "string",
                "userTenantId": "string"
              }
            },
            "userLevelPermissions": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "permission": "string",
                "allowed": true,
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ],
            "userGroups": [
              {}
            ],
            "userInvitations": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "expiresOn": "2019-08-24T14:15:22Z",
                "token": "string",
                "userTenantId": "string",
                "userTenant": {},
                "foreignKey": null
              }
            ]
          }
        }
      ]
    }
  ]
}

```

TenantWithRelations

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
|status|number¦null|true|none|Tenant status - Active or Inactive|
|key|string|false|none|none|
|website|string|false|none|none|
|address|string|false|none|none|
|city|string|false|none|none|
|state|string|false|none|none|
|zip|string|false|none|none|
|country|string|false|none|none|
|tenantConfigs|[[TenantConfigWithRelations](#schematenantconfigwithrelations)]|false|none|[(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })]|
|userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|[(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })]|
|users|[[UserWithRelations](#schemauserwithrelations)]|false|none|[This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })]|
|roles|[[RoleWithRelations](#schemarolewithrelations)]|false|none|[(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })]|
|groups|[[GroupWithRelations](#schemagroupwithrelations)]|false|none|[(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })]|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|

<h2 id="tocS_TenantPartial">TenantPartial</h2>
<!-- backwards compatibility -->
<a id="schematenantpartial"></a>
<a id="schema_TenantPartial"></a>
<a id="tocStenantpartial"></a>
<a id="tocstenantpartial"></a>

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
  "status": 1,
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}

```

TenantPartial

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
|status|number¦null|false|none|Tenant status - Active or Inactive|
|key|string|false|none|none|
|website|string|false|none|none|
|address|string|false|none|none|
|city|string|false|none|none|
|state|string|false|none|none|
|zip|string|false|none|none|
|country|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|

<h2 id="tocS_UserGroup">UserGroup</h2>
<!-- backwards compatibility -->
<a id="schemausergroup"></a>
<a id="schema_UserGroup"></a>
<a id="tocSusergroup"></a>
<a id="tocsusergroup"></a>

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
  "groupId": "string",
  "userTenantId": "string"
}

```

UserGroup

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
|groupId|string|true|none|none|
|userTenantId|string|true|none|none|

<h2 id="tocS_NewUserGroupInGroup">NewUserGroupInGroup</h2>
<!-- backwards compatibility -->
<a id="schemanewusergroupingroup"></a>
<a id="schema_NewUserGroupInGroup"></a>
<a id="tocSnewusergroupingroup"></a>
<a id="tocsnewusergroupingroup"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "userTenantId": "string"
}

```

NewUserGroupInGroup

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
|userTenantId|string|true|none|none|

<h2 id="tocS_TenantConfig">TenantConfig</h2>
<!-- backwards compatibility -->
<a id="schematenantconfig"></a>
<a id="schema_TenantConfig"></a>
<a id="tocStenantconfig"></a>
<a id="tocstenantconfig"></a>

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
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}

```

TenantConfig

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
|configKey|string|true|none|none|
|configValue|object|false|none|none|
|tenantId|string|true|none|none|

<h2 id="tocS_NewTenantConfigInTenant">NewTenantConfigInTenant</h2>
<!-- backwards compatibility -->
<a id="schemanewtenantconfigintenant"></a>
<a id="schema_NewTenantConfigInTenant"></a>
<a id="tocSnewtenantconfigintenant"></a>
<a id="tocsnewtenantconfigintenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "configKey": "string",
  "configValue": {}
}

```

NewTenantConfigInTenant

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
|configKey|string|true|none|none|
|configValue|object|false|none|none|

<h2 id="tocS_Group">Group</h2>
<!-- backwards compatibility -->
<a id="schemagroup"></a>
<a id="schema_Group"></a>
<a id="tocSgroup"></a>
<a id="tocsgroup"></a>

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
  "description": "string",
  "photoUrl": "string",
  "tenantId": "string"
}

```

Group

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
|description|string|false|none|none|
|photoUrl|string|false|none|none|
|tenantId|string|true|none|none|

<h2 id="tocS_NewGroupInTenant">NewGroupInTenant</h2>
<!-- backwards compatibility -->
<a id="schemanewgroupintenant"></a>
<a id="schema_NewGroupInTenant"></a>
<a id="tocSnewgroupintenant"></a>
<a id="tocsnewgroupintenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "name": "string",
  "description": "string",
  "photoUrl": "string"
}

```

NewGroupInTenant

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
|name|string|false|none|none|
|description|string|false|none|none|
|photoUrl|string|false|none|none|

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
  "name": "string",
  "description": "string",
  "photoUrl": "string",
  "tenantId": "string"
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
|name|string|false|none|none|
|description|string|false|none|none|
|photoUrl|string|false|none|none|
|tenantId|string|false|none|none|

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string"
}

```

User

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
|firstName|string|true|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|username|string|true|none|none|
|email|string|true|none|none|
|designation|string|false|none|none|
|phone|string|false|none|none|
|authClientIds|string|false|none|none|
|lastLogin|string(date-time)|false|none|none|
|photoUrl|string|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|dob|string(date-time)|false|none|none|
|defaultTenantId|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<h2 id="tocS_NewUserInTenant">NewUserInTenant</h2>
<!-- backwards compatibility -->
<a id="schemanewuserintenant"></a>
<a id="schema_NewUserInTenant"></a>
<a id="tocSnewuserintenant"></a>
<a id="tocsnewuserintenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "roleId": "string",
  "locale": "string"
}

```

NewUserInTenant

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
|firstName|string|true|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|username|string|true|none|none|
|email|string|true|none|none|
|designation|string|false|none|none|
|phone|string|false|none|none|
|authClientIds|string|false|none|none|
|lastLogin|string(date-time)|false|none|none|
|photoUrl|string|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|dob|string(date-time)|false|none|none|
|roleId|string|true|none|none|
|locale|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<h2 id="tocS_UserDto">UserDto</h2>
<!-- backwards compatibility -->
<a id="schemauserdto"></a>
<a id="schema_UserDto"></a>
<a id="tocSuserdto"></a>
<a id="tocsuserdto"></a>

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
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string",
  "roleId": "string",
  "locale": "string"
}

```

UserDto

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
|firstName|string|true|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|username|string|true|none|none|
|email|string|true|none|none|
|designation|string|false|none|none|
|phone|string|false|none|none|
|authClientIds|string|false|none|none|
|lastLogin|string(date-time)|false|none|none|
|photoUrl|string|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|dob|string(date-time)|false|none|none|
|defaultTenantId|string|false|none|none|
|roleId|string|true|none|none|
|locale|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<h2 id="tocS_UserViewPartialExcluding_id-authClientIds-lastLogin-tenantId-tenantName-tenantKey-roleName-userTenantId_">UserViewPartialExcluding_id-authClientIds-lastLogin-tenantId-tenantName-tenantKey-roleName-userTenantId_</h2>
<!-- backwards compatibility -->
<a id="schemauserviewpartialexcluding_id-authclientids-lastlogin-tenantid-tenantname-tenantkey-rolename-usertenantid_"></a>
<a id="schema_UserViewPartialExcluding_id-authClientIds-lastLogin-tenantId-tenantName-tenantKey-roleName-userTenantId_"></a>
<a id="tocSuserviewpartialexcluding_id-authclientids-lastlogin-tenantid-tenantname-tenantkey-rolename-usertenantid_"></a>
<a id="tocsuserviewpartialexcluding_id-authclientids-lastlogin-tenantid-tenantname-tenantkey-rolename-usertenantid_"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "username": "string",
  "email": "string",
  "designation": "string",
  "phone": "string",
  "photoUrl": "string",
  "gender": "M",
  "dob": "2019-08-24T14:15:22Z",
  "defaultTenantId": "string",
  "status": 11,
  "roleId": "string"
}

```

UserViewPartialExcluding_id-authClientIds-lastLogin-tenantId-tenantName-tenantKey-roleName-userTenantId_

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
|firstName|string|false|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|username|string|false|none|none|
|email|string|false|none|none|
|designation|string|false|none|none|
|phone|string|false|none|none|
|photoUrl|string|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|dob|string(date-time)¦null|false|none|none|
|defaultTenantId|string|false|none|none|
|status|number|false|none|none|
|roleId|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<h2 id="tocS_UserTenantPrefs">UserTenantPrefs</h2>
<!-- backwards compatibility -->
<a id="schemausertenantprefs"></a>
<a id="schema_UserTenantPrefs"></a>
<a id="tocSusertenantprefs"></a>
<a id="tocsusertenantprefs"></a>

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
  "configKey": "string",
  "configValue": {},
  "userTenantId": "string"
}

```

UserTenantPrefs

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
|configKey|string|true|none|none|
|configValue|object|true|none|none|
|userTenantId|string|false|none|none|

<h2 id="tocS_NewUserTenantPrefs">NewUserTenantPrefs</h2>
<!-- backwards compatibility -->
<a id="schemanewusertenantprefs"></a>
<a id="schema_NewUserTenantPrefs"></a>
<a id="tocSnewusertenantprefs"></a>
<a id="tocsnewusertenantprefs"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "configKey": "string",
  "configValue": {}
}

```

NewUserTenantPrefs

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
|configKey|string|true|none|none|
|configValue|object|true|none|none|

<h2 id="tocS_UserTenantPrefsWithRelations">UserTenantPrefsWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemausertenantprefswithrelations"></a>
<a id="schema_UserTenantPrefsWithRelations"></a>
<a id="tocSusertenantprefswithrelations"></a>
<a id="tocsusertenantprefswithrelations"></a>

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
  "configKey": "string",
  "configValue": {},
  "userTenantId": "string",
  "userTenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "locale": "string",
    "status": 12,
    "userId": "string",
    "tenantId": "string",
    "roleId": "string",
    "user": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "username": "string",
      "email": "string",
      "designation": "string",
      "phone": "string",
      "authClientIds": "string",
      "lastLogin": "2019-08-24T14:15:22Z",
      "photoUrl": "string",
      "gender": "M",
      "dob": "2019-08-24T14:15:22Z",
      "defaultTenantId": "string",
      "defaultTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "name": "string",
        "status": 1,
        "key": "string",
        "website": "string",
        "address": "string",
        "city": "string",
        "state": "string",
        "zip": "string",
        "country": "string",
        "tenantConfigs": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "configKey": "string",
            "configValue": {},
            "tenantId": "string",
            "tenant": {},
            "foreignKey": null
          }
        ],
        "userTenants": [
          {}
        ],
        "users": [
          {}
        ],
        "roles": [
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
            "roleType": 15,
            "description": "string",
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
            "tenantId": "string",
            "userTenants": [
              {}
            ],
            "createdByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            },
            "foreignKey": null,
            "modifiedByUser": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "firstName": "string",
              "lastName": "string",
              "middleName": "string",
              "username": "string",
              "email": "string",
              "designation": "string",
              "phone": "string",
              "authClientIds": "string",
              "lastLogin": "string",
              "photoUrl": "string",
              "gender": "M",
              "dob": "2019-08-24T14:15:22Z",
              "defaultTenantId": "string",
              "status": 11,
              "tenantId": "string",
              "roleId": "string",
              "tenantName": "string",
              "tenantKey": "string",
              "roleName": "string",
              "userTenantId": "string"
            }
          }
        ],
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
            "name": "string",
            "description": "string",
            "photoUrl": "string",
            "tenantId": "string",
            "userGroups": [
              {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "createdBy": "string",
                "modifiedBy": "string",
                "id": "string",
                "groupId": "string",
                "userTenantId": "string",
                "group": {},
                "foreignKey": null,
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "foreignKey": null,
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {},
        "foreignKey": null
      },
      "userTenants": [
        {}
      ]
    },
    "foreignKey": null,
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 1,
      "key": "string",
      "website": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "tenantConfigs": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "configKey": "string",
          "configValue": {},
          "tenantId": "string",
          "tenant": {},
          "foreignKey": null
        }
      ],
      "userTenants": [
        {}
      ],
      "users": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "middleName": "string",
          "username": "string",
          "email": "string",
          "designation": "string",
          "phone": "string",
          "authClientIds": "string",
          "lastLogin": "2019-08-24T14:15:22Z",
          "photoUrl": "string",
          "gender": "M",
          "dob": "2019-08-24T14:15:22Z",
          "defaultTenantId": "string",
          "defaultTenant": {},
          "foreignKey": null,
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {},
            "foreignKey": null
          },
          "userTenants": [
            {}
          ]
        }
      ],
      "roles": [
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
          "roleType": 15,
          "description": "string",
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
          "tenantId": "string",
          "userTenants": [
            {}
          ],
          "createdByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          },
          "foreignKey": null,
          "modifiedByUser": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "createdBy": "string",
            "modifiedBy": "string",
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "username": "string",
            "email": "string",
            "designation": "string",
            "phone": "string",
            "authClientIds": "string",
            "lastLogin": "string",
            "photoUrl": "string",
            "gender": "M",
            "dob": "2019-08-24T14:15:22Z",
            "defaultTenantId": "string",
            "status": 11,
            "tenantId": "string",
            "roleId": "string",
            "tenantName": "string",
            "tenantKey": "string",
            "roleName": "string",
            "userTenantId": "string"
          }
        }
      ],
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
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "createdBy": "string",
              "modifiedBy": "string",
              "id": "string",
              "groupId": "string",
              "userTenantId": "string",
              "group": {},
              "foreignKey": null,
              "userTenant": {}
            }
          ]
        }
      ]
    },
    "role": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "roleType": 15,
      "description": "string",
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
      "tenantId": "string",
      "userTenants": [
        {}
      ],
      "createdByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      },
      "foreignKey": null,
      "modifiedByUser": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "username": "string",
        "email": "string",
        "designation": "string",
        "phone": "string",
        "authClientIds": "string",
        "lastLogin": "string",
        "photoUrl": "string",
        "gender": "M",
        "dob": "2019-08-24T14:15:22Z",
        "defaultTenantId": "string",
        "status": 11,
        "tenantId": "string",
        "roleId": "string",
        "tenantName": "string",
        "tenantKey": "string",
        "roleName": "string",
        "userTenantId": "string"
      }
    },
    "userLevelPermissions": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "permission": "string",
        "allowed": true,
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ],
    "userGroups": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "groupId": "string",
        "userTenantId": "string",
        "group": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "createdBy": "string",
          "modifiedBy": "string",
          "id": "string",
          "name": "string",
          "description": "string",
          "photoUrl": "string",
          "tenantId": "string",
          "userGroups": [
            {}
          ]
        },
        "foreignKey": null,
        "userTenant": {}
      }
    ],
    "userInvitations": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "expiresOn": "2019-08-24T14:15:22Z",
        "token": "string",
        "userTenantId": "string",
        "userTenant": {},
        "foreignKey": null
      }
    ]
  },
  "foreignKey": null
}

```

UserTenantPrefsWithRelations

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
|configKey|string|true|none|none|
|configValue|object|true|none|none|
|userTenantId|string|false|none|none|
|userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|foreignKey|any|false|none|none|

<h2 id="tocS_UserLevelPermission">UserLevelPermission</h2>
<!-- backwards compatibility -->
<a id="schemauserlevelpermission"></a>
<a id="schema_UserLevelPermission"></a>
<a id="tocSuserlevelpermission"></a>
<a id="tocsuserlevelpermission"></a>

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}

```

UserLevelPermission

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
|permission|string|true|none|none|
|allowed|boolean|true|none|none|
|userTenantId|string|true|none|none|

<h2 id="tocS_NewUserLevelPermissionInUserTenant">NewUserLevelPermissionInUserTenant</h2>
<!-- backwards compatibility -->
<a id="schemanewuserlevelpermissioninusertenant"></a>
<a id="schema_NewUserLevelPermissionInUserTenant"></a>
<a id="tocSnewuserlevelpermissioninusertenant"></a>
<a id="tocsnewuserlevelpermissioninusertenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}

```

NewUserLevelPermissionInUserTenant

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
|permission|string|true|none|none|
|allowed|boolean|true|none|none|
|userTenantId|string|false|none|none|

<h2 id="tocS_UserLevelPermissionPartial">UserLevelPermissionPartial</h2>
<!-- backwards compatibility -->
<a id="schemauserlevelpermissionpartial"></a>
<a id="schema_UserLevelPermissionPartial"></a>
<a id="tocSuserlevelpermissionpartial"></a>
<a id="tocsuserlevelpermissionpartial"></a>

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
  "permission": "string",
  "allowed": true,
  "userTenantId": "string"
}

```

UserLevelPermissionPartial

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
|permission|string|false|none|none|
|allowed|boolean|false|none|none|
|userTenantId|string|false|none|none|

<h2 id="tocS_UserWebhookDTO">UserWebhookDTO</h2>
<!-- backwards compatibility -->
<a id="schemauserwebhookdto"></a>
<a id="schema_UserWebhookDTO"></a>
<a id="tocSuserwebhookdto"></a>
<a id="tocsuserwebhookdto"></a>

```json
{
  "email": "string",
  "phone": "string",
  "tenantName": "string",
  "tenantKey": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "cognitoAuthId": "string",
  "authClient": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "clientId": "string",
    "clientSecret": "string",
    "redirectUrl": "string",
    "secret": "string",
    "accessTokenExpiration": 0,
    "refreshTokenExpiration": 0,
    "authCodeExpiration": 0
  },
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
}

```

UserWebhookDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|phone|string|false|none|none|
|tenantName|string|true|none|none|
|tenantKey|string|true|none|none|
|firstName|string|true|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|cognitoAuthId|string|false|none|none|
|authClient|object|false|none|(tsType: Omit<AuthClient, 'id'>, schemaOptions: { exclude: [ 'id' ] })|
|» deleted|boolean|false|none|none|
|» deletedOn|string(date-time)¦null|false|none|none|
|» deletedBy|string¦null|false|none|none|
|» createdOn|string(date-time)|false|none|none|
|» modifiedOn|string(date-time)|false|none|none|
|» clientId|string|true|none|none|
|» clientSecret|string|false|none|none|
|» redirectUrl|string|false|none|none|
|» secret|string|true|none|none|
|» accessTokenExpiration|number|true|none|none|
|» refreshTokenExpiration|number|true|none|none|
|» authCodeExpiration|number|true|none|none|
|address|object|false|none|this model represents the address of a company (tsType: Omit<AddressDTO, 'id'>, schemaOptions: { exclude: [ 'id' ] })|
|» deleted|boolean|false|none|none|
|» deletedOn|string(date-time)¦null|false|none|none|
|» deletedBy|string¦null|false|none|none|
|» createdOn|string(date-time)|false|none|none|
|» modifiedOn|string(date-time)|false|none|none|
|» createdBy|string|false|none|none|
|» modifiedBy|string|false|none|none|
|» address|string|false|none|address of the company|
|» city|string|false|none|city of the company|
|» state|string|false|none|state of the company|
|» zip|string|false|none|zip code of the company|
|» country|string|false|none|country of the company|

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

<h2 id="tocS_tenants.ScopeFilter">tenants.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schematenants.scopefilter"></a>
<a id="schema_tenants.ScopeFilter"></a>
<a id="tocStenants.scopefilter"></a>
<a id="tocstenants.scopefilter"></a>

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

tenants.ScopeFilter

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

<h2 id="tocS_tenants.IncludeFilter.Items">tenants.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schematenants.includefilter.items"></a>
<a id="schema_tenants.IncludeFilter.Items"></a>
<a id="tocStenants.includefilter.items"></a>
<a id="tocstenants.includefilter.items"></a>

```json
{
  "relation": "tenantConfigs",
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

tenants.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[tenants.ScopeFilter](#schematenants.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|tenantConfigs|
|relation|userTenants|
|relation|users|
|relation|roles|
|relation|groups|

<h2 id="tocS_tenants.Filter">tenants.Filter</h2>
<!-- backwards compatibility -->
<a id="schematenants.filter"></a>
<a id="schema_tenants.Filter"></a>
<a id="tocStenants.filter"></a>
<a id="tocstenants.filter"></a>

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
    "name": true,
    "status": true,
    "key": true,
    "website": true,
    "address": true,
    "city": true,
    "state": true,
    "zip": true,
    "country": true
  },
  "include": [
    {
      "relation": "tenantConfigs",
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

tenants.Filter

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
|»» name|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» key|boolean|false|none|none|
|»» website|boolean|false|none|none|
|»» address|boolean|false|none|none|
|»» city|boolean|false|none|none|
|»» state|boolean|false|none|none|
|»» zip|boolean|false|none|none|
|»» country|boolean|false|none|none|

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
|» *anonymous*|[tenants.IncludeFilter.Items](#schematenants.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_tenants.Filter1">tenants.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematenants.filter1"></a>
<a id="schema_tenants.Filter1"></a>
<a id="tocStenants.filter1"></a>
<a id="tocstenants.filter1"></a>

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
    "name": true,
    "status": true,
    "key": true,
    "website": true,
    "address": true,
    "city": true,
    "state": true,
    "zip": true,
    "country": true
  },
  "include": [
    {
      "relation": "tenantConfigs",
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

tenants.Filter

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
|»» name|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» key|boolean|false|none|none|
|»» website|boolean|false|none|none|
|»» address|boolean|false|none|none|
|»» city|boolean|false|none|none|
|»» state|boolean|false|none|none|
|»» zip|boolean|false|none|none|
|»» country|boolean|false|none|none|

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
|» *anonymous*|[tenants.IncludeFilter.Items](#schematenants.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_user_tenant_prefs.ScopeFilter">user_tenant_prefs.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemauser_tenant_prefs.scopefilter"></a>
<a id="schema_user_tenant_prefs.ScopeFilter"></a>
<a id="tocSuser_tenant_prefs.scopefilter"></a>
<a id="tocsuser_tenant_prefs.scopefilter"></a>

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

user_tenant_prefs.ScopeFilter

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

<h2 id="tocS_user_tenant_prefs.IncludeFilter.Items">user_tenant_prefs.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemauser_tenant_prefs.includefilter.items"></a>
<a id="schema_user_tenant_prefs.IncludeFilter.Items"></a>
<a id="tocSuser_tenant_prefs.includefilter.items"></a>
<a id="tocsuser_tenant_prefs.includefilter.items"></a>

```json
{
  "relation": "userTenant",
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

user_tenant_prefs.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[user_tenant_prefs.ScopeFilter](#schemauser_tenant_prefs.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|userTenant|

<h2 id="tocS_user_tenant_prefs.Filter">user_tenant_prefs.Filter</h2>
<!-- backwards compatibility -->
<a id="schemauser_tenant_prefs.filter"></a>
<a id="schema_user_tenant_prefs.Filter"></a>
<a id="tocSuser_tenant_prefs.filter"></a>
<a id="tocsuser_tenant_prefs.filter"></a>

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
    "configKey": true,
    "configValue": true,
    "userTenantId": true
  },
  "include": [
    {
      "relation": "userTenant",
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

user_tenant_prefs.Filter

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
|»» configKey|boolean|false|none|none|
|»» configValue|boolean|false|none|none|
|»» userTenantId|boolean|false|none|none|

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
|» *anonymous*|[user_tenant_prefs.IncludeFilter.Items](#schemauser_tenant_prefs.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

