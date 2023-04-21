---
title: "@sourceloop/user-tenant-service v0.6.13"
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

<h1 id="-sourceloop-user-tenant-service">@sourceloop/user-tenant-service v0.6.13</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Sourceloop User Tenant Service.

Base URLs:

* <a href="/">/</a>

<h1 id="-sourceloop-user-tenant-service-usersignupcontroller">UserSignupController</h1>

## UserSignupController.checkUserSignup

<a id="opIdUserSignupController.checkUserSignup"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/check-signup/{email}',
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

fetch('/check-signup/{email}',
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

`GET /check-signup/{email}`

| Permissions |
| ------- |
| ViewAnyUser   |
| ViewTenantUser   |
| 11   |
| 12   |

<h3 id="usersignupcontroller.checkusersignup-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|email|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "isSignedUp": true
}
```

<h3 id="usersignupcontroller.checkusersignup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success Response.|[UserSignupCheckDto](#schemausersignupcheckdto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-user-tenant-service-groupcontroller">GroupController</h1>

## GroupController.count

<a id="opIdGroupController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/groups/count',
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

fetch('/groups/count',
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

`GET /groups/count`

| Permissions |
| ------- |
| ViewUserGroupList   |
| 2   |

<h3 id="groupcontroller.count-parameters">Parameters</h3>

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

<h3 id="groupcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Group model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupController.updateById

<a id="opIdGroupController.updateById"></a>

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
  "groupType": "Tenant"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/groups/{id}',
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
  "groupType": "Tenant"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/groups/{id}',
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

`PATCH /groups/{id}`

| Permissions |
| ------- |
| UpdateUserGroup   |
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
  "name": "string",
  "description": "string",
  "photoUrl": "string",
  "groupType": "Tenant"
}
```

<h3 id="groupcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[GroupPartial](#schemagrouppartial)|false|none|

<h3 id="groupcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Group PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupController.findById

<a id="opIdGroupController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/groups/{id}',
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

fetch('/groups/{id}',
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

`GET /groups/{id}`

| Permissions |
| ------- |
| ViewUserGroupList   |
| ViewUserGroupList   |

<h3 id="groupcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[groups.Filter](#schemagroups.filter)|false|none|

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
  "groupType": "Tenant"
}
```

<h3 id="groupcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Group model instance|[Group](#schemagroup)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupController.deleteById

<a id="opIdGroupController.deleteById"></a>

> Code samples

```javascript

fetch('/groups/{id}',
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

fetch('/groups/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /groups/{id}`

| Permissions |
| ------- |
| DeleteUserGroup   |
| 4   |

<h3 id="groupcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="groupcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Group DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupController.create

<a id="opIdGroupController.create"></a>

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
  "photoUrl": "string",
  "groupType": "Tenant"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups',
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
  "photoUrl": "string",
  "groupType": "Tenant"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups',
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

`POST /groups`

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
  "name": "string",
  "description": "string",
  "photoUrl": "string",
  "groupType": "Tenant"
}
```

<h3 id="groupcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTeam](#schemanewteam)|false|none|

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
  "groupType": "Tenant"
}
```

<h3 id="groupcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Group model instance|[Group](#schemagroup)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## GroupController.find

<a id="opIdGroupController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/groups',
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

fetch('/groups',
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

`GET /groups`

| Permissions |
| ------- |
| ViewUserGroupList   |
| 2   |

<h3 id="groupcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[groups.Filter](#schemagroups.filter)|false|none|

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
    "groupType": "Tenant"
  }
]
```

<h3 id="groupcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Group model instances|Inline|

<h3 id="groupcontroller.find-responseschema">Response Schema</h3>

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
|»» groupType|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|groupType|Tenant|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-usergroupcontroller">UserGroupController</h1>

## UserGroupController.count

<a id="opIdUserGroupController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/groups/{id}/user-groups/count',
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

fetch('/groups/{id}/user-groups/count',
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

`GET /groups/{id}/user-groups/count`

| Permissions |
| ------- |
| ViewUserGroupList   |
| 2   |

<h3 id="usergroupcontroller.count-parameters">Parameters</h3>

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

<h3 id="usergroupcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User Group model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserGroupController.patch

<a id="opIdUserGroupController.patch"></a>

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
  "groupId": "string",
  "userTenantId": "string",
  "isOwner": true
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/groups/{id}/user-groups/{userGroupId}',
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
  "groupId": "string",
  "userTenantId": "string",
  "isOwner": true
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/groups/{id}/user-groups/{userGroupId}',
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

`PATCH /groups/{id}/user-groups/{userGroupId}`

| Permissions |
| ------- |
| UpdateMemberInUserGroup   |
| 33   |

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
  "groupId": "string",
  "userTenantId": "string",
  "isOwner": true
}
```

<h3 id="usergroupcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|userGroupId|path|string|true|none|
|id|path|string|true|none|
|body|body|[UserGroupPartial](#schemausergrouppartial)|false|none|

<h3 id="usergroupcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Group.UserGroup PATCH success count|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserGroupController.delete

<a id="opIdUserGroupController.delete"></a>

> Code samples

```javascript

fetch('/groups/{id}/user-groups/{userGroupId}',
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

fetch('/groups/{id}/user-groups/{userGroupId}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /groups/{id}/user-groups/{userGroupId}`

| Permissions |
| ------- |
| RemoveMemberFromUserGroup   |
| LeaveUserGroup   |
| 34   |
| 35   |

<h3 id="usergroupcontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|userGroupId|path|string|true|none|

<h3 id="usergroupcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Group.UserGroup DELETE success count|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserGroupController.create

<a id="opIdUserGroupController.create"></a>

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
  "groupId": "string",
  "userTenantId": "string",
  "isOwner": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups/{id}/user-groups',
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
  "groupId": "string",
  "userTenantId": "string",
  "isOwner": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/groups/{id}/user-groups',
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

`POST /groups/{id}/user-groups`

| Permissions |
| ------- |
| AddMemberToUserGroup   |
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
  "groupId": "string",
  "userTenantId": "string",
  "isOwner": true
}
```

<h3 id="usergroupcontroller.create-parameters">Parameters</h3>

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
  "userTenantId": "string",
  "isOwner": true
}
```

<h3 id="usergroupcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Group model instance|[UserGroup](#schemausergroup)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserGroupController.find

<a id="opIdUserGroupController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/groups/{id}/user-groups',
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

fetch('/groups/{id}/user-groups',
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

`GET /groups/{id}/user-groups`

| Permissions |
| ------- |
| ViewUserGroupList   |
| 2   |

<h3 id="usergroupcontroller.find-parameters">Parameters</h3>

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
    "userTenantId": "string",
    "isOwner": true
  }
]
```

<h3 id="usergroupcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Group has many UserGroup|Inline|

<h3 id="usergroupcontroller.find-responseschema">Response Schema</h3>

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
|»» isOwner|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-pingcontroller">PingController</h1>

## PingController.ping

<a id="opIdPingController.ping"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ping',
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

fetch('/ping',
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
  "date": "string"
}
```

<h3 id="pingcontroller.ping-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Ping Response|[PingResponse](#schemapingresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-user-tenant-service-rolecontroller">RoleController</h1>

## RoleController.count

<a id="opIdRoleController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles/count',
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

fetch('/roles/count',
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

`GET /roles/count`

| Permissions |
| ------- |
| ViewRoles   |
| 6   |

<h3 id="rolecontroller.count-parameters">Parameters</h3>

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

<h3 id="rolecontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleController.replaceById

<a id="opIdRoleController.replaceById"></a>

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
  "roleType": 15,
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/roles/{id}',
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
  "roleType": 15,
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/roles/{id}',
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

`PUT /roles/{id}`

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
  "id": "string",
  "name": "string",
  "roleType": 15,
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}
```

<h3 id="rolecontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Role](#schemarole)|false|none|

<h3 id="rolecontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Role PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleController.updateById

<a id="opIdRoleController.updateById"></a>

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
  "roleType": 15,
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/roles/{id}',
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
  "roleType": 15,
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/roles/{id}',
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

`PATCH /roles/{id}`

| Permissions |
| ------- |
| UpdateRoles   |
| UpdateRoles   |

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
  "roleType": 15,
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}
```

<h3 id="rolecontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[RolePartial](#schemarolepartial)|false|none|

<h3 id="rolecontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Role PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleController.findById

<a id="opIdRoleController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles/{id}',
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

fetch('/roles/{id}',
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

`GET /roles/{id}`

| Permissions |
| ------- |
| ViewRoles   |
| 6   |

<h3 id="rolecontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[roles.Filter](#schemaroles.filter)|false|none|

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
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ],
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
            {}
          ]
        },
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {}
        },
        "userTenants": [
          {}
        ]
      },
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
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
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
        },
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
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
          "userTenant": {}
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
          "isOwner": true,
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
            "groupType": "Tenant",
            "userGroups": [
              {}
            ]
          },
          "userTenant": {}
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
    "roleType": 0,
    "userTenantId": "string",
    "expiresOn": "2019-08-24T14:15:22Z"
  },
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
    "roleType": 0,
    "userTenantId": "string",
    "expiresOn": "2019-08-24T14:15:22Z"
  }
}
```

<h3 id="rolecontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role model instance|[RoleWithRelations](#schemarolewithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleController.deleteById

<a id="opIdRoleController.deleteById"></a>

> Code samples

```javascript

fetch('/roles/{id}',
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

fetch('/roles/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /roles/{id}`

| Permissions |
| ------- |
| DeleteRoles   |
| 10   |

<h3 id="rolecontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="rolecontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Role DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleController.create

<a id="opIdRoleController.create"></a>

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

fetch('/roles',
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

fetch('/roles',
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

`POST /roles`

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
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}
```

<h3 id="rolecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewRole](#schemanewrole)|false|none|

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
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}
```

<h3 id="rolecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role model instance|[Role](#schemarole)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleController.updateAll

<a id="opIdRoleController.updateAll"></a>

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
  "roleType": 15,
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

fetch('/roles',
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
  "roleType": 15,
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

fetch('/roles',
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

`PATCH /roles`

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
  "id": "string",
  "name": "string",
  "roleType": 15,
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}
```

<h3 id="rolecontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[RolePartial](#schemarolepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="rolecontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleController.find

<a id="opIdRoleController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles',
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

fetch('/roles',
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

`GET /roles`

| Permissions |
| ------- |
| ViewRoles   |
| 6   |

<h3 id="rolecontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[roles.Filter](#schemaroles.filter)|false|none|

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
    "permissions": [
      "string"
    ],
    "allowedClients": [
      "string"
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
            "primaryContactEmail": "string",
            "allowedDomain": "string",
            "tenantType": "string",
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
                "tenant": {}
              }
            ],
            "userTenants": [
              {}
            ]
          },
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
            {}
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
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
      "roleType": 0,
      "userTenantId": "string",
      "expiresOn": "2019-08-24T14:15:22Z"
    },
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
      "roleType": 0,
      "userTenantId": "string",
      "expiresOn": "2019-08-24T14:15:22Z"
    }
  }
]
```

<h3 id="rolecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Role model instances|Inline|

<h3 id="rolecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[RoleWithRelations](#schemarolewithrelations)]|false|none|[(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })]|
|» RoleWithRelations|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» name|string|true|none|none|
|»» roleType|number|true|none|none|
|»» permissions|[string]|false|none|none|
|»» allowedClients|[string]|false|none|none|
|»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
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
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» name|string|true|none|none|
|»»»»»» status|number¦null|true|none|Tenant status - Active or Inactive|
|»»»»»» key|string|false|none|none|
|»»»»»» website|string|false|none|none|
|»»»»»» address|string|false|none|none|
|»»»»»» city|string|false|none|none|
|»»»»»» state|string|false|none|none|
|»»»»»» zip|string|false|none|none|
|»»»»»» country|string|false|none|none|
|»»»»»» primaryContactEmail|string|false|none|none|
|»»»»»» allowedDomain|string|false|none|none|
|»»»»»» tenantType|string|false|none|none|
|»»»»»» tenantConfigs|[[TenantConfigWithRelations](#schematenantconfigwithrelations)]|false|none|(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» TenantConfigWithRelations|[TenantConfigWithRelations](#schematenantconfigwithrelations)|false|none|(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»» deleted|boolean|false|none|none|
|»»»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»»»» createdBy|string|false|none|none|
|»»»»»»»» modifiedBy|string|false|none|none|
|»»»»»»»» id|string|false|none|none|
|»»»»»»»» configKey|string|true|none|none|
|»»»»»»»» configValue|object|false|none|none|
|»»»»»»»» tenantId|string|true|none|none|
|»»»»»»»» tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» credentials|[UserCredentialsWithRelations](#schemausercredentialswithrelations)|false|none|(tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» authProvider|string|true|none|none|
|»»»»»» authId|string|false|none|none|
|»»»»»» authToken|string|false|none|none|
|»»»»»» secretKey|string|false|none|Secret for Authenticator app|
|»»»»»» password|string|false|none|none|
|»»»»»» userId|string|true|none|none|
|»»»»»» user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» role|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
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
|»»»»»» isOwner|boolean|false|none|none|
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
|»»»»»»» groupType|string|false|none|none|
|»»»»»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»» createdByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» firstName|string|true|none|none|
|»»» lastName|string|false|none|none|
|»»» middleName|string|false|none|none|
|»»» username|string|true|none|none|
|»»» email|string|true|none|none|
|»»» designation|string|false|none|none|
|»»» phone|string|false|none|none|
|»»» authClientIds|string|false|none|none|
|»»» lastLogin|string|false|none|none|
|»»» photoUrl|string|false|none|none|
|»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»» dob|string(date-time)¦null|false|none|none|
|»»» defaultTenantId|string|true|none|none|
|»»» status|number|false|none|none|
|»»» tenantId|string|true|none|none|
|»»» roleId|string|true|none|none|
|»»» tenantName|string|true|none|none|
|»»» tenantKey|string|false|none|none|
|»»» roleName|string|false|none|none|
|»»» roleType|number|false|none|none|
|»»» userTenantId|string|true|none|none|
|»»» expiresOn|string(date-time)|false|none|none|
|»» modifiedByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|
|status|1|
|status|0|
|groupType|Tenant|
|gender|M|
|gender|F|
|gender|O|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-roleusertenantcontroller">RoleUserTenantController</h1>

## RoleUserTenantController.count

<a id="opIdRoleUserTenantController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles/{id}/user-tenants/count',
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

fetch('/roles/{id}/user-tenants/count',
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

`GET /roles/{id}/user-tenants/count`

| Permissions |
| ------- |
| ViewRoles   |
| 6   |

<h3 id="roleusertenantcontroller.count-parameters">Parameters</h3>

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

<h3 id="roleusertenantcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User tenant count for specified role id|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleUserTenantController.create

<a id="opIdRoleUserTenantController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/roles/{id}/user-tenants',
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
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/roles/{id}/user-tenants',
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

`POST /roles/{id}/user-tenants`

| Permissions |
| ------- |
| NotAllowed   |
| 7   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}
```

<h3 id="roleusertenantcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewUserTenantInRole](#schemanewusertenantinrole)|false|none|

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
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}
```

<h3 id="roleusertenantcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role model instance|[UserTenant](#schemausertenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleUserTenantController.patch

<a id="opIdRoleUserTenantController.patch"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/roles/{id}/user-tenants',
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
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/roles/{id}/user-tenants',
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

`PATCH /roles/{id}/user-tenants`

| Permissions |
| ------- |
| NotAllowed   |
| 7   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}
```

<h3 id="roleusertenantcontroller.patch-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|where|query|object|false|none|
|body|body|[UserTenantPartial](#schemausertenantpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="roleusertenantcontroller.patch-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role.UserTenant PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleUserTenantController.find

<a id="opIdRoleUserTenantController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles/{id}/user-tenants',
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

fetch('/roles/{id}/user-tenants',
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

`GET /roles/{id}/user-tenants`

| Permissions |
| ------- |
| ViewRoles   |
| 6   |

<h3 id="roleusertenantcontroller.find-parameters">Parameters</h3>

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
    "locale": "string",
    "status": 12,
    "userId": "string",
    "tenantId": "string",
    "roleId": "string"
  }
]
```

<h3 id="roleusertenantcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Role has many UserTenant|Inline|

<h3 id="roleusertenantcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserTenant](#schemausertenant)]|false|none|none|
|» UserTenant|[UserTenant](#schemausertenant)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» id|string|false|none|none|
|»» locale|string|false|none|none|
|»» status|number|false|none|none|
|»» userId|string|true|none|none|
|»» tenantId|string|true|none|none|
|»» roleId|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## RoleUserTenantController.delete

<a id="opIdRoleUserTenantController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles/{id}/user-tenants',
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

fetch('/roles/{id}/user-tenants',
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

`DELETE /roles/{id}/user-tenants`

| Permissions |
| ------- |
| NotAllowed   |
| 7   |

<h3 id="roleusertenantcontroller.delete-parameters">Parameters</h3>

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

<h3 id="roleusertenantcontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Role.UserTenant DELETE success count|[loopback.Count](#schemaloopback.count)|

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
| 27   |

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

## TenantController.getTenantConfig

<a id="opIdTenantController.getTenantConfig"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/config',
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

fetch('/tenants/{id}/config',
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

`GET /tenants/{id}/config`

| Permissions |
| ------- |
| ViewTenant   |
| 27   |
| 29   |
| ViewOwnTenant   |

<h3 id="tenantcontroller.gettenantconfig-parameters">Parameters</h3>

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
    "configKey": "string",
    "configValue": {},
    "tenantId": "string"
  }
]
```

<h3 id="tenantcontroller.gettenantconfig-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant config instances|Inline|

<h3 id="tenantcontroller.gettenantconfig-responseschema">Response Schema</h3>

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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
| 28   |
| 30   |
| UpdateOwnTenant   |

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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
| 27   |
| 29   |
| ViewOwnTenant   |

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
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string",
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
        "tenantConfigs": [],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
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
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {}
              },
              "userTenants": [
                {}
              ]
            },
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
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
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
                "roleType": 0,
                "userTenantId": "string",
                "expiresOn": "2019-08-24T14:15:22Z"
              },
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
                "roleType": 0,
                "userTenantId": "string",
                "expiresOn": "2019-08-24T14:15:22Z"
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
                "userTenant": {}
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
                "isOwner": true,
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
                  "groupType": "Tenant",
                  "userGroups": [
                    {}
                  ]
                },
                "userTenant": {}
              }
            ]
          }
        ]
      }
    }
  ],
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": []
        },
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {}
        },
        "userTenants": [
          {}
        ]
      },
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": []
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
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
        },
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
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
          "userTenant": {}
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
          "isOwner": true,
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
            "groupType": "Tenant",
            "userGroups": [
              {}
            ]
          },
          "userTenant": {}
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
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
| 26   |

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
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
| 28   |

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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
| 27   |

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
    "primaryContactEmail": "string",
    "allowedDomain": "string",
    "tenantType": "string",
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
        "tenant": {}
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
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
|»» primaryContactEmail|string|false|none|none|
|»» allowedDomain|string|false|none|none|
|»» tenantType|string|false|none|none|
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
|»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
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
|»»»»» credentials|[UserCredentialsWithRelations](#schemausercredentialswithrelations)|false|none|(tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» authProvider|string|true|none|none|
|»»»»»» authId|string|false|none|none|
|»»»»»» authToken|string|false|none|none|
|»»»»»» secretKey|string|false|none|Secret for Authenticator app|
|»»»»»» password|string|false|none|none|
|»»»»»» userId|string|true|none|none|
|»»»»»» user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
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
|»»»»» roleType|number|true|none|none|
|»»»»» permissions|[string]|false|none|none|
|»»»»» allowedClients|[string]|false|none|none|
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
|»»»»»» roleType|number|false|none|none|
|»»»»»» userTenantId|string|true|none|none|
|»»»»»» expiresOn|string(date-time)|false|none|none|
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
|»»»»»» isOwner|boolean|false|none|none|
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
|»»»»»»» groupType|string|false|none|none|
|»»»»»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|

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
|groupType|Tenant|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-tenantusercontroller">TenantUserController</h1>

## TenantUserController.count

<a id="opIdTenantUserController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/users/count',
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

fetch('/tenants/{id}/users/count',
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

`GET /tenants/{id}/users/count`

| Permissions |
| ------- |
| ViewAnyUser   |
| ViewTenantUser   |
| ViewTenantUserRestricted   |
| 11   |
| 12   |
| 13   |

<h3 id="tenantusercontroller.count-parameters">Parameters</h3>

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

<h3 id="tenantusercontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantUserController.findAllUsers

<a id="opIdTenantUserController.findAllUsers"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/users/view-all',
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

fetch('/tenants/{id}/users/view-all',
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

`GET /tenants/{id}/users/view-all`

| Permissions |
| ------- |
| ViewAllUser   |
| 14   |

<h3 id="tenantusercontroller.findallusers-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[v_users.Filter](#schemav_users.filter)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "roleId": "string",
    "tenantId": "string",
    "status": 0,
    "authProvider": "string",
    "authId": "string",
    "userTenantId": "string",
    "userDetails": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
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
  }
]
```

<h3 id="tenantusercontroller.findallusers-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Tenant has many Users|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<h3 id="tenantusercontroller.findallusers-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserDto](#schemauserdto)]|false|none|none|
|» UserDto|[UserDto](#schemauserdto)|false|none|none|
|»» roleId|string|true|none|none|
|»» tenantId|string|true|none|none|
|»» status|number|false|none|none|
|»» authProvider|string|false|none|none|
|»» authId|string|false|none|none|
|»» userTenantId|string|false|none|none|
|»» userDetails|[User](#schemauser)|false|none|This is signature for user model.|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» firstName|string|true|none|none|
|»»» lastName|string|false|none|none|
|»»» middleName|string|false|none|none|
|»»» username|string|true|none|none|
|»»» email|string|true|none|none|
|»»» designation|string|false|none|none|
|»»» phone|string|false|none|none|
|»»» authClientIds|string|false|none|none|
|»»» lastLogin|string(date-time)|false|none|none|
|»»» photoUrl|string|false|none|none|
|»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»» dob|string(date-time)|false|none|none|
|»»» defaultTenantId|string|false|none|none|

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

## TenantUserController.updateById

<a id="opIdTenantUserController.updateById"></a>

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
  "roleType": 0,
  "userTenantId": "string",
  "expiresOn": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'string'
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
  "roleType": 0,
  "userTenantId": "string",
  "expiresOn": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'string'
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
| UpdateAnyUser   |
| UpdateOwnUser   |
| UpdateTenantUser   |
| UpdateTenantUserRestricted   |
| 19   |
| 20   |
| 21   |
| 22   |

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
  "roleType": 0,
  "userTenantId": "string",
  "expiresOn": "2019-08-24T14:15:22Z"
}
```

<h3 id="tenantusercontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|false|none|
|id|path|string|true|none|
|userId|path|string|true|none|
|body|body|[UserViewPartial](#schemauserviewpartial)|false|none|

<h3 id="tenantusercontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|User PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantUserController.deleteById

<a id="opIdTenantUserController.deleteById"></a>

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
| DeleteAnyUser   |
| DeleteTenantUser   |
| DeleteTenantUserRestricted   |
| 23   |
| 24   |
| 25   |

<h3 id="tenantusercontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|userId|path|string|true|none|

<h3 id="tenantusercontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|User DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantUserController.findById

<a id="opIdTenantUserController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tenants/{id}/users/{userid}',
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

fetch('/tenants/{id}/users/{userid}',
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

`GET /tenants/{id}/users/{userid}`

| Permissions |
| ------- |
| ViewAnyUser   |
| ViewTenantUser   |
| ViewTenantUserRestricted   |
| ViewOwnUser   |
| 11   |
| 12   |
| 13   |
| 15   |

<h3 id="tenantusercontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|userid|path|string|true|none|
|filter|query|[v_users.Filter](#schemav_users.filter)|false|none|

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
  "roleType": 0,
  "userTenantId": "string",
  "expiresOn": "2019-08-24T14:15:22Z"
}
```

<h3 id="tenantusercontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User model instance|[UserViewWithRelations](#schemauserviewwithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TenantUserController.create

<a id="opIdTenantUserController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "roleId": "string",
  "tenantId": "string",
  "status": 0,
  "authProvider": "string",
  "authId": "string",
  "userTenantId": "string",
  "userDetails": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
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
  "roleId": "string",
  "tenantId": "string",
  "status": 0,
  "authProvider": "string",
  "authId": "string",
  "userTenantId": "string",
  "userDetails": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
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
| CreateAnyUser   |
| CreateTenantUser   |
| CreateTenantUserRestricted   |
| 16   |
| 17   |
| 18   |

> Body parameter

```json
{
  "roleId": "string",
  "tenantId": "string",
  "status": 0,
  "authProvider": "string",
  "authId": "string",
  "userTenantId": "string",
  "userDetails": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
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
}
```

<h3 id="tenantusercontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[NewUser](#schemanewuser)|false|none|

> Example responses

> 200 Response

```json
{
  "roleId": "string",
  "tenantId": "string",
  "status": 0,
  "authProvider": "string",
  "authId": "string",
  "userTenantId": "string",
  "userDetails": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
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
}
```

<h3 id="tenantusercontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model instance|[UserDto](#schemauserdto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

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
| ViewAnyUser   |
| ViewTenantUser   |
| ViewTenantUserRestricted   |
| 11   |
| 12   |
| 13   |

<h3 id="tenantusercontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[v_users.Filter](#schemav_users.filter)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "roleId": "string",
    "tenantId": "string",
    "status": 0,
    "authProvider": "string",
    "authId": "string",
    "userTenantId": "string",
    "userDetails": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
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
  }
]
```

<h3 id="tenantusercontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Tenant has many Users|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<h3 id="tenantusercontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[UserDto](#schemauserdto)]|false|none|none|
|» UserDto|[UserDto](#schemauserdto)|false|none|none|
|»» roleId|string|true|none|none|
|»» tenantId|string|true|none|none|
|»» status|number|false|none|none|
|»» authProvider|string|false|none|none|
|»» authId|string|false|none|none|
|»» userTenantId|string|false|none|none|
|»» userDetails|[User](#schemauser)|false|none|This is signature for user model.|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» firstName|string|true|none|none|
|»»» lastName|string|false|none|none|
|»»» middleName|string|false|none|none|
|»»» username|string|true|none|none|
|»»» email|string|true|none|none|
|»»» designation|string|false|none|none|
|»»» phone|string|false|none|none|
|»»» authClientIds|string|false|none|none|
|»»» lastLogin|string(date-time)|false|none|none|
|»»» photoUrl|string|false|none|none|
|»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»» dob|string(date-time)|false|none|none|
|»»» defaultTenantId|string|false|none|none|

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

<h1 id="-sourceloop-user-tenant-service-usergroupscontroller">UserGroupsController</h1>

## UserGroupsController.getCount

<a id="opIdUserGroupsController.getCount"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-groups/count',
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

fetch('/user-groups/count',
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

`GET /user-groups/count`

| Permissions |
| ------- |
| ViewUserGroupList   |
| 2   |

<h3 id="usergroupscontroller.getcount-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

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
    "userTenantId": "string",
    "isOwner": true
  }
]
```

<h3 id="usergroupscontroller.getcount-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Count of UserGroup|Inline|

<h3 id="usergroupscontroller.getcount-responseschema">Response Schema</h3>

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
|»» isOwner|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## UserGroupsController.find

<a id="opIdUserGroupsController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-groups',
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

fetch('/user-groups',
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

`GET /user-groups`

| Permissions |
| ------- |
| ViewUserGroupList   |
| 2   |

<h3 id="usergroupscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
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
    "userTenantId": "string",
    "isOwner": true
  }
]
```

<h3 id="usergroupscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of UserGroup|Inline|

<h3 id="usergroupscontroller.find-responseschema">Response Schema</h3>

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
|»» isOwner|boolean|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-user-tenant-service-usertenantprefscontroller">UserTenantPrefsController</h1>

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
  "configValue": {},
  "userTenantId": "string"
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
  "configValue": {},
  "userTenantId": "string"
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
| UpdateUserTenantPreference   |
| 36   |

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
  "configValue": {},
  "userTenantId": "string"
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

<aside class="success">
This operation does not require authentication
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
| 37   |

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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
            {}
          ]
        },
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {}
        },
        "userTenants": [
          {}
        ]
      },
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
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
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
        },
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
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
          "userTenant": {}
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
          "isOwner": true,
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
            "groupType": "Tenant",
            "userGroups": [
              {}
            ]
          },
          "userTenant": {}
        }
      ]
    }
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
|»»»»» primaryContactEmail|string|false|none|none|
|»»»»» allowedDomain|string|false|none|none|
|»»»»» tenantType|string|false|none|none|
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
|»»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» credentials|[UserCredentialsWithRelations](#schemausercredentialswithrelations)|false|none|(tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» authProvider|string|true|none|none|
|»»»»» authId|string|false|none|none|
|»»»»» authToken|string|false|none|none|
|»»»»» secretKey|string|false|none|Secret for Authenticator app|
|»»»»» password|string|false|none|none|
|»»»»» userId|string|true|none|none|
|»»»»» user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»»» role|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» name|string|true|none|none|
|»»»» roleType|number|true|none|none|
|»»»» permissions|[string]|false|none|none|
|»»»» allowedClients|[string]|false|none|none|
|»»»» userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» UserTenantWithRelations|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|
|»»»» createdByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
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
|»»»»» lastLogin|string|false|none|none|
|»»»»» photoUrl|string|false|none|none|
|»»»»» gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|»»»»» dob|string(date-time)¦null|false|none|none|
|»»»»» defaultTenantId|string|true|none|none|
|»»»»» status|number|false|none|none|
|»»»»» tenantId|string|true|none|none|
|»»»»» roleId|string|true|none|none|
|»»»»» tenantName|string|true|none|none|
|»»»»» tenantKey|string|false|none|none|
|»»»»» roleName|string|false|none|none|
|»»»»» roleType|number|false|none|none|
|»»»»» userTenantId|string|true|none|none|
|»»»»» expiresOn|string(date-time)|false|none|none|
|»»»» modifiedByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
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
|»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» deleted|boolean|false|none|none|
|»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»» deletedBy|string¦null|false|none|none|
|»»»»» createdOn|string(date-time)|false|none|none|
|»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»» createdBy|string|false|none|none|
|»»»»» modifiedBy|string|false|none|none|
|»»»»» id|string|false|none|none|
|»»»»» groupId|string|true|none|none|
|»»»»» userTenantId|string|true|none|none|
|»»»»» isOwner|boolean|false|none|none|
|»»»»» group|[GroupWithRelations](#schemagroupwithrelations)|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»» deleted|boolean|false|none|none|
|»»»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»»»» deletedBy|string¦null|false|none|none|
|»»»»»» createdOn|string(date-time)|false|none|none|
|»»»»»» modifiedOn|string(date-time)|false|none|none|
|»»»»»» createdBy|string|false|none|none|
|»»»»»» modifiedBy|string|false|none|none|
|»»»»»» id|string|false|none|none|
|»»»»»» name|string|false|none|none|
|»»»»»» description|string|false|none|none|
|»»»»»» photoUrl|string|false|none|none|
|»»»»»» groupType|string|false|none|none|
|»»»»»» userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»»»» UserGroupWithRelations|[UserGroupWithRelations](#schemausergroupwithrelations)|false|none|(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })|
|»»»»» userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|

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
|groupType|Tenant|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-user-tenant-service-usertenantcontroller">UserTenantController</h1>

## UserTenantController.findById

<a id="opIdUserTenantController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/user-tenants/{id}',
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

fetch('/user-tenants/{id}',
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

`GET /user-tenants/{id}`

| Permissions |
| ------- |
| ViewAnyUser   |
| ViewOwnUser   |
| ViewTenantUser   |
| ViewTenantUserRestricted   |
| 11   |
| 15   |
| 12   |
| 13   |

<h3 id="usertenantcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[v_users.Filter1](#schemav_users.filter1)|false|none|

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
  "roleType": 0,
  "userTenantId": "string",
  "expiresOn": "2019-08-24T14:15:22Z"
}
```

<h3 id="usertenantcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|UserView model instance|[UserViewWithRelations](#schemauserviewwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

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
  "groupType": "Tenant"
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
|groupType|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|groupType|Tenant|

<h2 id="tocS_NewTeam">NewTeam</h2>
<!-- backwards compatibility -->
<a id="schemanewteam"></a>
<a id="schema_NewTeam"></a>
<a id="tocSnewteam"></a>
<a id="tocsnewteam"></a>

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
  "photoUrl": "string",
  "groupType": "Tenant"
}

```

NewTeam

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
|groupType|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|groupType|Tenant|

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
  "groupType": "Tenant"
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
|groupType|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|groupType|Tenant|

<h2 id="tocS_UserTenant">UserTenant</h2>
<!-- backwards compatibility -->
<a id="schemausertenant"></a>
<a id="schema_UserTenant"></a>
<a id="tocSusertenant"></a>
<a id="tocsusertenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}

```

UserTenant

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|string|false|none|none|
|locale|string|false|none|none|
|status|number|false|none|none|
|userId|string|true|none|none|
|tenantId|string|true|none|none|
|roleId|string|true|none|none|

<h2 id="tocS_NewUserTenantInRole">NewUserTenantInRole</h2>
<!-- backwards compatibility -->
<a id="schemanewusertenantinrole"></a>
<a id="schema_NewUserTenantInRole"></a>
<a id="tocSnewusertenantinrole"></a>
<a id="tocsnewusertenantinrole"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}

```

NewUserTenantInRole

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|locale|string|false|none|none|
|status|number|false|none|none|
|userId|string|true|none|none|
|tenantId|string|true|none|none|
|roleId|string|false|none|none|

<h2 id="tocS_UserTenantPartial">UserTenantPartial</h2>
<!-- backwards compatibility -->
<a id="schemausertenantpartial"></a>
<a id="schema_UserTenantPartial"></a>
<a id="tocSusertenantpartial"></a>
<a id="tocsusertenantpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": "string",
  "locale": "string",
  "status": 12,
  "userId": "string",
  "tenantId": "string",
  "roleId": "string"
}

```

UserTenantPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|string|false|none|none|
|locale|string|false|none|none|
|status|number|false|none|none|
|userId|string|false|none|none|
|tenantId|string|false|none|none|
|roleId|string|false|none|none|

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
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
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
|roleType|number|true|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|

<h2 id="tocS_NewRole">NewRole</h2>
<!-- backwards compatibility -->
<a id="schemanewrole"></a>
<a id="schema_NewRole"></a>
<a id="tocSnewrole"></a>
<a id="tocsnewrole"></a>

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
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}

```

NewRole

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
|roleType|number|true|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|

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
  "groupType": "Tenant",
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
      "isOwner": true,
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
        "groupType": "Tenant",
        "userGroups": []
      },
      "userTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
            "primaryContactEmail": "string",
            "allowedDomain": "string",
            "tenantType": "string",
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
                "tenant": {}
              }
            ],
            "userTenants": [
              {}
            ]
          },
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
          }
        ],
        "userGroups": [
          {}
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
|groupType|string|false|none|none|
|userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|[(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })]|

#### Enumerated Values

|Property|Value|
|---|---|
|groupType|Tenant|

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
    "primaryContactEmail": "string",
    "allowedDomain": "string",
    "tenantType": "string",
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
        "tenant": {}
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
          }
        ]
      }
    ]
  }
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
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string",
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
        "tenantConfigs": [],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
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
              "credentials": {
                "deleted": true,
                "deletedOn": "2019-08-24T14:15:22Z",
                "deletedBy": "string",
                "createdOn": "2019-08-24T14:15:22Z",
                "modifiedOn": "2019-08-24T14:15:22Z",
                "id": "string",
                "authProvider": "string",
                "authId": "string",
                "authToken": "string",
                "secretKey": "string",
                "password": "string",
                "userId": "string",
                "user": {}
              },
              "userTenants": [
                {}
              ]
            },
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
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
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
                "roleType": 0,
                "userTenantId": "string",
                "expiresOn": "2019-08-24T14:15:22Z"
              },
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
                "roleType": 0,
                "userTenantId": "string",
                "expiresOn": "2019-08-24T14:15:22Z"
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
                "userTenant": {}
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
                "isOwner": true,
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
                  "groupType": "Tenant",
                  "userGroups": [
                    {}
                  ]
                },
                "userTenant": {}
              }
            ]
          }
        ]
      }
    }
  ],
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": []
        },
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {}
        },
        "userTenants": [
          {}
        ]
      },
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": []
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
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
        },
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
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
          "userTenant": {}
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
          "isOwner": true,
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
            "groupType": "Tenant",
            "userGroups": [
              {}
            ]
          },
          "userTenant": {}
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
|primaryContactEmail|string|false|none|none|
|allowedDomain|string|false|none|none|
|tenantType|string|false|none|none|
|tenantConfigs|[[TenantConfigWithRelations](#schematenantconfigwithrelations)]|false|none|[(tsType: TenantConfigWithRelations, schemaOptions: { includeRelations: true })]|
|userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|[(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })]|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|

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
      "primaryContactEmail": "string",
      "allowedDomain": "string",
      "tenantType": "string",
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
          "tenant": {}
        }
      ],
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
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
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
            },
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
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
              "userTenant": {}
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
              "isOwner": true,
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
                "groupType": "Tenant",
                "userGroups": [
                  {}
                ]
              },
              "userTenant": {}
            }
          ]
        }
      ]
    },
    "credentials": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "id": "string",
      "authProvider": "string",
      "authId": "string",
      "authToken": "string",
      "secretKey": "string",
      "password": "string",
      "userId": "string",
      "user": {}
    },
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {},
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
          }
        ]
      }
    ]
  }
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
|id|string|false|none|none|
|authProvider|string|true|none|none|
|authId|string|false|none|none|
|authToken|string|false|none|none|
|secretKey|string|false|none|Secret for Authenticator app|
|password|string|false|none|none|
|userId|string|true|none|none|
|user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|

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
    "primaryContactEmail": "string",
    "allowedDomain": "string",
    "tenantType": "string",
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
        "tenant": {}
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
          }
        ]
      }
    ]
  },
  "credentials": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
          {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "locale": "string",
            "status": 12,
            "userId": "string",
            "tenantId": "string",
            "roleId": "string",
            "user": {},
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
              "permissions": [
                "string"
              ],
              "allowedClients": [
                "string"
              ],
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
                "roleType": 0,
                "userTenantId": "string",
                "expiresOn": "2019-08-24T14:15:22Z"
              },
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
                "roleType": 0,
                "userTenantId": "string",
                "expiresOn": "2019-08-24T14:15:22Z"
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
                "userTenant": {}
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
                "isOwner": true,
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
                  "groupType": "Tenant",
                  "userGroups": [
                    {}
                  ]
                },
                "userTenant": {}
              }
            ]
          }
        ]
      },
      "credentials": {},
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
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
            "primaryContactEmail": "string",
            "allowedDomain": "string",
            "tenantType": "string",
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
                "tenant": {}
              }
            ],
            "userTenants": [
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
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
            },
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
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
              "userTenant": {}
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
              "isOwner": true,
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
                "groupType": "Tenant",
                "userGroups": [
                  {}
                ]
              },
              "userTenant": {}
            }
          ]
        }
      ]
    }
  },
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
            {}
          ]
        },
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {}
        },
        "userTenants": []
      },
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
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
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
        },
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
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
          "userTenant": {}
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
          "isOwner": true,
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
            "groupType": "Tenant",
            "userGroups": [
              {}
            ]
          },
          "userTenant": {}
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
|credentials|[UserCredentialsWithRelations](#schemausercredentialswithrelations)|false|none|(tsType: UserCredentialsWithRelations, schemaOptions: { includeRelations: true })|
|userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|[(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })]|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
          {}
        ]
      },
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {}
      },
      "userTenants": [
        {}
      ]
    },
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
      "primaryContactEmail": "string",
      "allowedDomain": "string",
      "tenantType": "string",
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
          "tenant": {}
        }
      ],
      "userTenants": [
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
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
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
        "roleType": 0,
        "userTenantId": "string",
        "expiresOn": "2019-08-24T14:15:22Z"
      },
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
        "roleType": 0,
        "userTenantId": "string",
        "expiresOn": "2019-08-24T14:15:22Z"
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
        "userTenant": {}
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
        "isOwner": true,
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
          "groupType": "Tenant",
          "userGroups": [
            {}
          ]
        },
        "userTenant": {}
      }
    ]
  }
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
  "isOwner": true,
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
    "groupType": "Tenant",
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
        "isOwner": true,
        "group": {},
        "userTenant": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
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
              "primaryContactEmail": "string",
              "allowedDomain": "string",
              "tenantType": "string",
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
                  "tenant": {}
                }
              ],
              "userTenants": [
                {}
              ]
            },
            "credentials": {
              "deleted": true,
              "deletedOn": "2019-08-24T14:15:22Z",
              "deletedBy": "string",
              "createdOn": "2019-08-24T14:15:22Z",
              "modifiedOn": "2019-08-24T14:15:22Z",
              "id": "string",
              "authProvider": "string",
              "authId": "string",
              "authToken": "string",
              "secretKey": "string",
              "password": "string",
              "userId": "string",
              "user": {}
            },
            "userTenants": [
              {}
            ]
          },
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
            "primaryContactEmail": "string",
            "allowedDomain": "string",
            "tenantType": "string",
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
                "tenant": {}
              }
            ],
            "userTenants": [
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
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
            },
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
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
              "userTenant": {}
            }
          ],
          "userGroups": [
            {}
          ]
        }
      }
    ]
  },
  "userTenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
          {}
        ]
      },
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {}
      },
      "userTenants": [
        {}
      ]
    },
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
      "primaryContactEmail": "string",
      "allowedDomain": "string",
      "tenantType": "string",
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
          "tenant": {}
        }
      ],
      "userTenants": [
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
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
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
        "roleType": 0,
        "userTenantId": "string",
        "expiresOn": "2019-08-24T14:15:22Z"
      },
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
        "roleType": 0,
        "userTenantId": "string",
        "expiresOn": "2019-08-24T14:15:22Z"
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
        "userTenant": {}
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
        "isOwner": true,
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
          "groupType": "Tenant",
          "userGroups": [
            {}
          ]
        },
        "userTenant": {}
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
|isOwner|boolean|false|none|none|
|group|[GroupWithRelations](#schemagroupwithrelations)|false|none|(tsType: GroupWithRelations, schemaOptions: { includeRelations: true })|
|userTenant|[UserTenantWithRelations](#schemausertenantwithrelations)|false|none|(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })|

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
      "primaryContactEmail": "string",
      "allowedDomain": "string",
      "tenantType": "string",
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
          "tenant": {}
        }
      ],
      "userTenants": [
        {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "locale": "string",
          "status": 12,
          "userId": "string",
          "tenantId": "string",
          "roleId": "string",
          "user": {},
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
            "permissions": [
              "string"
            ],
            "allowedClients": [
              "string"
            ],
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
            },
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
              "roleType": 0,
              "userTenantId": "string",
              "expiresOn": "2019-08-24T14:15:22Z"
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
              "userTenant": {}
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
              "isOwner": true,
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
                "groupType": "Tenant",
                "userGroups": [
                  {}
                ]
              },
              "userTenant": {}
            }
          ]
        }
      ]
    },
    "credentials": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "id": "string",
      "authProvider": "string",
      "authId": "string",
      "authToken": "string",
      "secretKey": "string",
      "password": "string",
      "userId": "string",
      "user": {}
    },
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "id": "string",
        "locale": "string",
        "status": 12,
        "userId": "string",
        "tenantId": "string",
        "roleId": "string",
        "user": {},
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
          }
        ]
      }
    ]
  },
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
    "primaryContactEmail": "string",
    "allowedDomain": "string",
    "tenantType": "string",
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
        "tenant": {}
      }
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
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
    "permissions": [
      "string"
    ],
    "allowedClients": [
      "string"
    ],
    "userTenants": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
            "primaryContactEmail": "string",
            "allowedDomain": "string",
            "tenantType": "string",
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
                "tenant": {}
              }
            ],
            "userTenants": [
              {}
            ]
          },
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
            {}
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
            "userTenant": {}
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
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
      "roleType": 0,
      "userTenantId": "string",
      "expiresOn": "2019-08-24T14:15:22Z"
    },
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
      "roleType": 0,
      "userTenantId": "string",
      "expiresOn": "2019-08-24T14:15:22Z"
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
            "primaryContactEmail": "string",
            "allowedDomain": "string",
            "tenantType": "string",
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
                "tenant": {}
              }
            ],
            "userTenants": [
              {}
            ]
          },
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "isOwner": true,
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
              "groupType": "Tenant",
              "userGroups": [
                {}
              ]
            },
            "userTenant": {}
          }
        ]
      }
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
      "isOwner": true,
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
        "groupType": "Tenant",
        "userGroups": [
          {}
        ]
      },
      "userTenant": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
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
            "primaryContactEmail": "string",
            "allowedDomain": "string",
            "tenantType": "string",
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
                "tenant": {}
              }
            ],
            "userTenants": [
              {}
            ]
          },
          "credentials": {
            "deleted": true,
            "deletedOn": "2019-08-24T14:15:22Z",
            "deletedBy": "string",
            "createdOn": "2019-08-24T14:15:22Z",
            "modifiedOn": "2019-08-24T14:15:22Z",
            "id": "string",
            "authProvider": "string",
            "authId": "string",
            "authToken": "string",
            "secretKey": "string",
            "password": "string",
            "userId": "string",
            "user": {}
          },
          "userTenants": [
            {}
          ]
        },
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
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
          "permissions": [
            "string"
          ],
          "allowedClients": [
            "string"
          ],
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
          },
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
            "roleType": 0,
            "userTenantId": "string",
            "expiresOn": "2019-08-24T14:15:22Z"
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
            "userTenant": {}
          }
        ],
        "userGroups": []
      }
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
|id|string|false|none|none|
|locale|string|false|none|none|
|status|number|false|none|none|
|userId|string|true|none|none|
|tenantId|string|true|none|none|
|roleId|string|true|none|none|
|user|[UserWithRelations](#schemauserwithrelations)|false|none|This is signature for user model. (tsType: UserWithRelations, schemaOptions: { includeRelations: true })|
|tenant|[TenantWithRelations](#schematenantwithrelations)|false|none|signature for all tenants (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|role|[RoleWithRelations](#schemarolewithrelations)|false|none|(tsType: RoleWithRelations, schemaOptions: { includeRelations: true })|
|userLevelPermissions|[[UserLevelPermissionWithRelations](#schemauserlevelpermissionwithrelations)]|false|none|[(tsType: UserLevelPermissionWithRelations, schemaOptions: { includeRelations: true })]|
|userGroups|[[UserGroupWithRelations](#schemausergroupwithrelations)]|false|none|[(tsType: UserGroupWithRelations, schemaOptions: { includeRelations: true })]|

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
  "roleType": 0,
  "userTenantId": "string",
  "expiresOn": "2019-08-24T14:15:22Z"
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
|roleType|number|false|none|none|
|userTenantId|string|true|none|none|
|expiresOn|string(date-time)|false|none|none|

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
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ],
  "userTenants": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
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
          "primaryContactEmail": "string",
          "allowedDomain": "string",
          "tenantType": "string",
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
              "tenant": {}
            }
          ],
          "userTenants": [
            {}
          ]
        },
        "credentials": {
          "deleted": true,
          "deletedOn": "2019-08-24T14:15:22Z",
          "deletedBy": "string",
          "createdOn": "2019-08-24T14:15:22Z",
          "modifiedOn": "2019-08-24T14:15:22Z",
          "id": "string",
          "authProvider": "string",
          "authId": "string",
          "authToken": "string",
          "secretKey": "string",
          "password": "string",
          "userId": "string",
          "user": {}
        },
        "userTenants": [
          {}
        ]
      },
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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
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
        "permissions": [
          "string"
        ],
        "allowedClients": [
          "string"
        ],
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
        },
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
          "roleType": 0,
          "userTenantId": "string",
          "expiresOn": "2019-08-24T14:15:22Z"
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
          "userTenant": {}
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
          "isOwner": true,
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
            "groupType": "Tenant",
            "userGroups": [
              {}
            ]
          },
          "userTenant": {}
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
    "roleType": 0,
    "userTenantId": "string",
    "expiresOn": "2019-08-24T14:15:22Z"
  },
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
    "roleType": 0,
    "userTenantId": "string",
    "expiresOn": "2019-08-24T14:15:22Z"
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
|roleType|number|true|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|
|userTenants|[[UserTenantWithRelations](#schemausertenantwithrelations)]|false|none|[(tsType: UserTenantWithRelations, schemaOptions: { includeRelations: true })]|
|createdByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|
|modifiedByUser|[UserViewWithRelations](#schemauserviewwithrelations)|false|none|User details view in DB (tsType: UserViewWithRelations, schemaOptions: { includeRelations: true })|

<h2 id="tocS_RolePartial">RolePartial</h2>
<!-- backwards compatibility -->
<a id="schemarolepartial"></a>
<a id="schema_RolePartial"></a>
<a id="tocSrolepartial"></a>
<a id="tocsrolepartial"></a>

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
  "permissions": [
    "string"
  ],
  "allowedClients": [
    "string"
  ]
}

```

RolePartial

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
|roleType|number|false|none|none|
|permissions|[string]|false|none|none|
|allowedClients|[string]|false|none|none|

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

<h2 id="tocS_UserDto">UserDto</h2>
<!-- backwards compatibility -->
<a id="schemauserdto"></a>
<a id="schema_UserDto"></a>
<a id="tocSuserdto"></a>
<a id="tocsuserdto"></a>

```json
{
  "roleId": "string",
  "tenantId": "string",
  "status": 0,
  "authProvider": "string",
  "authId": "string",
  "userTenantId": "string",
  "userDetails": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
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
}

```

UserDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|roleId|string|true|none|none|
|tenantId|string|true|none|none|
|status|number|false|none|none|
|authProvider|string|false|none|none|
|authId|string|false|none|none|
|userTenantId|string|false|none|none|
|userDetails|[User](#schemauser)|false|none|This is signature for user model.|

<h2 id="tocS_UserOptional_tenantId_">UserOptional_tenantId_</h2>
<!-- backwards compatibility -->
<a id="schemauseroptional_tenantid_"></a>
<a id="schema_UserOptional_tenantId_"></a>
<a id="tocSuseroptional_tenantid_"></a>
<a id="tocsuseroptional_tenantid_"></a>

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

UserOptional_tenantId_

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

<h2 id="tocS_NewUser">NewUser</h2>
<!-- backwards compatibility -->
<a id="schemanewuser"></a>
<a id="schema_NewUser"></a>
<a id="tocSnewuser"></a>
<a id="tocsnewuser"></a>

```json
{
  "roleId": "string",
  "tenantId": "string",
  "status": 0,
  "authProvider": "string",
  "authId": "string",
  "userTenantId": "string",
  "userDetails": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
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
}

```

NewUser

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|roleId|string|true|none|none|
|tenantId|string|false|none|none|
|status|number|false|none|none|
|authProvider|string|false|none|none|
|authId|string|false|none|none|
|userTenantId|string|false|none|none|
|userDetails|[UserOptional_tenantId_](#schemauseroptional_tenantid_)|false|none|This is signature for user model. (tsType: @loopback/repository-json-schema#Optional<User, 'tenantId'>, schemaOptions: { optional: [ 'tenantId' ] })|

<h2 id="tocS_UserViewPartial">UserViewPartial</h2>
<!-- backwards compatibility -->
<a id="schemauserviewpartial"></a>
<a id="schema_UserViewPartial"></a>
<a id="tocSuserviewpartial"></a>
<a id="tocsuserviewpartial"></a>

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
  "roleType": 0,
  "userTenantId": "string",
  "expiresOn": "2019-08-24T14:15:22Z"
}

```

UserViewPartial

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
|firstName|string|false|none|none|
|lastName|string|false|none|none|
|middleName|string|false|none|none|
|username|string|false|none|none|
|email|string|false|none|none|
|designation|string|false|none|none|
|phone|string|false|none|none|
|authClientIds|string|false|none|none|
|lastLogin|string|false|none|none|
|photoUrl|string|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|dob|string(date-time)¦null|false|none|none|
|defaultTenantId|string|false|none|none|
|status|number|false|none|none|
|tenantId|string|false|none|none|
|roleId|string|false|none|none|
|tenantName|string|false|none|none|
|tenantKey|string|false|none|none|
|roleName|string|false|none|none|
|roleType|number|false|none|none|
|userTenantId|string|false|none|none|
|expiresOn|string(date-time)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
|primaryContactEmail|string|false|none|none|
|allowedDomain|string|false|none|none|
|tenantType|string|false|none|none|

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
  "key": "string",
  "website": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
|key|string|false|none|none|
|website|string|false|none|none|
|address|string|false|none|none|
|city|string|false|none|none|
|state|string|false|none|none|
|zip|string|false|none|none|
|country|string|false|none|none|
|primaryContactEmail|string|false|none|none|
|allowedDomain|string|false|none|none|
|tenantType|string|false|none|none|

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
  "country": "string",
  "primaryContactEmail": "string",
  "allowedDomain": "string",
  "tenantType": "string"
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
|primaryContactEmail|string|false|none|none|
|allowedDomain|string|false|none|none|
|tenantType|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|1|
|status|0|

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
  "userTenantId": "string",
  "isOwner": true
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
|isOwner|boolean|false|none|none|

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
  "groupId": "string",
  "userTenantId": "string",
  "isOwner": true
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
|groupId|string|false|none|none|
|userTenantId|string|true|none|none|
|isOwner|boolean|false|none|none|

<h2 id="tocS_UserGroupPartial">UserGroupPartial</h2>
<!-- backwards compatibility -->
<a id="schemausergrouppartial"></a>
<a id="schema_UserGroupPartial"></a>
<a id="tocSusergrouppartial"></a>
<a id="tocsusergrouppartial"></a>

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
  "isOwner": true
}

```

UserGroupPartial

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
|groupId|string|false|none|none|
|userTenantId|string|false|none|none|
|isOwner|boolean|false|none|none|

<h2 id="tocS_UserSignupCheckDto">UserSignupCheckDto</h2>
<!-- backwards compatibility -->
<a id="schemausersignupcheckdto"></a>
<a id="schema_UserSignupCheckDto"></a>
<a id="tocSusersignupcheckdto"></a>
<a id="tocsusersignupcheckdto"></a>

```json
{
  "isSignedUp": true
}

```

UserSignupCheckDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|isSignedUp|boolean|true|none|none|

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
  "configValue": {},
  "userTenantId": "string"
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
|userTenantId|string|false|none|none|

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
        "primaryContactEmail": "string",
        "allowedDomain": "string",
        "tenantType": "string",
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
            "tenant": {}
          }
        ],
        "userTenants": [
          {}
        ]
      },
      "credentials": {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "id": "string",
        "authProvider": "string",
        "authId": "string",
        "authToken": "string",
        "secretKey": "string",
        "password": "string",
        "userId": "string",
        "user": {}
      },
      "userTenants": [
        {}
      ]
    },
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
      "primaryContactEmail": "string",
      "allowedDomain": "string",
      "tenantType": "string",
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
          "tenant": {}
        }
      ],
      "userTenants": [
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
      "permissions": [
        "string"
      ],
      "allowedClients": [
        "string"
      ],
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
        "roleType": 0,
        "userTenantId": "string",
        "expiresOn": "2019-08-24T14:15:22Z"
      },
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
        "roleType": 0,
        "userTenantId": "string",
        "expiresOn": "2019-08-24T14:15:22Z"
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
        "userTenant": {}
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
        "isOwner": true,
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
          "groupType": "Tenant",
          "userGroups": [
            {}
          ]
        },
        "userTenant": {}
      }
    ]
  }
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

<h2 id="tocS_groups.ScopeFilter">groups.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemagroups.scopefilter"></a>
<a id="schema_groups.ScopeFilter"></a>
<a id="tocSgroups.scopefilter"></a>
<a id="tocsgroups.scopefilter"></a>

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

groups.ScopeFilter

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

<h2 id="tocS_groups.IncludeFilter.Items">groups.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemagroups.includefilter.items"></a>
<a id="schema_groups.IncludeFilter.Items"></a>
<a id="tocSgroups.includefilter.items"></a>
<a id="tocsgroups.includefilter.items"></a>

```json
{
  "relation": "userGroups",
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

groups.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[groups.ScopeFilter](#schemagroups.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|userGroups|

<h2 id="tocS_groups.Filter">groups.Filter</h2>
<!-- backwards compatibility -->
<a id="schemagroups.filter"></a>
<a id="schema_groups.Filter"></a>
<a id="tocSgroups.filter"></a>
<a id="tocsgroups.filter"></a>

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
    "description": true,
    "photoUrl": true,
    "groupType": true
  },
  "include": [
    {
      "relation": "userGroups",
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

groups.Filter

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
|»» description|boolean|false|none|none|
|»» photoUrl|boolean|false|none|none|
|»» groupType|boolean|false|none|none|

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
|» *anonymous*|[groups.IncludeFilter.Items](#schemagroups.includefilter.items)|false|none|none|

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
  "date": "string"
}

```

PingResponse

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|greeting|string|false|none|none|
|date|string|false|none|none|

<h2 id="tocS_roles.ScopeFilter">roles.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaroles.scopefilter"></a>
<a id="schema_roles.ScopeFilter"></a>
<a id="tocSroles.scopefilter"></a>
<a id="tocsroles.scopefilter"></a>

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

roles.ScopeFilter

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

<h2 id="tocS_roles.IncludeFilter.Items">roles.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaroles.includefilter.items"></a>
<a id="schema_roles.IncludeFilter.Items"></a>
<a id="tocSroles.includefilter.items"></a>
<a id="tocsroles.includefilter.items"></a>

```json
{
  "relation": "userTenants",
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

roles.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[roles.ScopeFilter](#schemaroles.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|userTenants|
|relation|createdByUser|
|relation|modifiedByUser|

<h2 id="tocS_roles.Filter">roles.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaroles.filter"></a>
<a id="schema_roles.Filter"></a>
<a id="tocSroles.filter"></a>
<a id="tocsroles.filter"></a>

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
    "roleType": true,
    "permissions": true,
    "allowedClients": true
  },
  "include": [
    {
      "relation": "userTenants",
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

roles.Filter

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
|»» roleType|boolean|false|none|none|
|»» permissions|boolean|false|none|none|
|»» allowedClients|boolean|false|none|none|

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
|» *anonymous*|[roles.IncludeFilter.Items](#schemaroles.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_v_users.Filter">v_users.Filter</h2>
<!-- backwards compatibility -->
<a id="schemav_users.filter"></a>
<a id="schema_v_users.Filter"></a>
<a id="tocSv_users.filter"></a>
<a id="tocsv_users.filter"></a>

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
    "firstName": true,
    "lastName": true,
    "middleName": true,
    "username": true,
    "email": true,
    "designation": true,
    "phone": true,
    "authClientIds": true,
    "lastLogin": true,
    "photoUrl": true,
    "gender": true,
    "dob": true,
    "defaultTenantId": true,
    "status": true,
    "tenantId": true,
    "roleId": true,
    "tenantName": true,
    "tenantKey": true,
    "roleName": true,
    "roleType": true,
    "userTenantId": true,
    "expiresOn": true
  }
}

```

v_users.Filter

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
|»» firstName|boolean|false|none|none|
|»» lastName|boolean|false|none|none|
|»» middleName|boolean|false|none|none|
|»» username|boolean|false|none|none|
|»» email|boolean|false|none|none|
|»» designation|boolean|false|none|none|
|»» phone|boolean|false|none|none|
|»» authClientIds|boolean|false|none|none|
|»» lastLogin|boolean|false|none|none|
|»» photoUrl|boolean|false|none|none|
|»» gender|boolean|false|none|none|
|»» dob|boolean|false|none|none|
|»» defaultTenantId|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|
|»» roleId|boolean|false|none|none|
|»» tenantName|boolean|false|none|none|
|»» tenantKey|boolean|false|none|none|
|»» roleName|boolean|false|none|none|
|»» roleType|boolean|false|none|none|
|»» userTenantId|boolean|false|none|none|
|»» expiresOn|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

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
    "country": true,
    "primaryContactEmail": true,
    "allowedDomain": true,
    "tenantType": true
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
|»» primaryContactEmail|boolean|false|none|none|
|»» allowedDomain|boolean|false|none|none|
|»» tenantType|boolean|false|none|none|

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
    "country": true,
    "primaryContactEmail": true,
    "allowedDomain": true,
    "tenantType": true
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
|»» primaryContactEmail|boolean|false|none|none|
|»» allowedDomain|boolean|false|none|none|
|»» tenantType|boolean|false|none|none|

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

<h2 id="tocS_v_users.Filter1">v_users.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemav_users.filter1"></a>
<a id="schema_v_users.Filter1"></a>
<a id="tocSv_users.filter1"></a>
<a id="tocsv_users.filter1"></a>

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
    "firstName": true,
    "lastName": true,
    "middleName": true,
    "username": true,
    "email": true,
    "designation": true,
    "phone": true,
    "authClientIds": true,
    "lastLogin": true,
    "photoUrl": true,
    "gender": true,
    "dob": true,
    "defaultTenantId": true,
    "status": true,
    "tenantId": true,
    "roleId": true,
    "tenantName": true,
    "tenantKey": true,
    "roleName": true,
    "roleType": true,
    "userTenantId": true,
    "expiresOn": true
  }
}

```

v_users.Filter

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
|»» firstName|boolean|false|none|none|
|»» lastName|boolean|false|none|none|
|»» middleName|boolean|false|none|none|
|»» username|boolean|false|none|none|
|»» email|boolean|false|none|none|
|»» designation|boolean|false|none|none|
|»» phone|boolean|false|none|none|
|»» authClientIds|boolean|false|none|none|
|»» lastLogin|boolean|false|none|none|
|»» photoUrl|boolean|false|none|none|
|»» gender|boolean|false|none|none|
|»» dob|boolean|false|none|none|
|»» defaultTenantId|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|
|»» roleId|boolean|false|none|none|
|»» tenantName|boolean|false|none|none|
|»» tenantKey|boolean|false|none|none|
|»» roleName|boolean|false|none|none|
|»» roleType|boolean|false|none|none|
|»» userTenantId|boolean|false|none|none|
|»» expiresOn|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

