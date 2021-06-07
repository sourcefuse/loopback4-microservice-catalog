---
title: Authentication Service v1.0.0
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

<h1 id="authentication-service">Authentication Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

This is a sample application for sandbox testing of auth microservice components.

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="authentication-service-logincontroller">LoginController</h1>

## LoginController.resetPassword

<a id="opIdLoginController.resetPassword"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "refreshToken": "string",
  "username": "string",
  "password": "string",
  "oldPassword": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'string'
};

fetch('http://localhost:3000/auth/change-password',
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

`PATCH /auth/change-password`

> Body parameter

```json
{
  "refreshToken": "string",
  "username": "string",
  "password": "string",
  "oldPassword": "string"
}
```

<h3 id="logincontroller.resetpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|false|none|
|body|body|[ResetPasswordPartial](#schemaresetpasswordpartial)|false|none|

<h3 id="logincontroller.resetpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|If User password successfully changed.|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LoginController.postLoginViaGoogle

<a id="opIdLoginController.postLoginViaGoogle"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/google',
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

`POST /auth/google`

> Body parameter

```yaml
client_id: string
client_secret: string

```

<h3 id="logincontroller.postloginviagoogle-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ClientAuthRequest](#schemaclientauthrequest)|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.postloginviagoogle-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|POST Call for Google based login|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.loginViaGoogle

<a id="opIdLoginController.loginViaGoogle"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/google',
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

`GET /auth/google`

<h3 id="logincontroller.loginviagoogle-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|client_id|query|string|false|none|
|client_secret|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.loginviagoogle-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Google Token Response (Deprecated: Possible security issue if secret is passed via query params, please use the post endpoint)|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.googleCallback

<a id="opIdLoginController.googleCallback"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/google-auth-redirect',
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

`GET /auth/google-auth-redirect`

<h3 id="logincontroller.googlecallback-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|code|query|string|false|none|
|state|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.googlecallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Google Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.postLoginViaInstagram

<a id="opIdLoginController.postLoginViaInstagram"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/instagram',
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

`POST /auth/instagram`

> Body parameter

```yaml
client_id: string
client_secret: string

```

<h3 id="logincontroller.postloginviainstagram-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ClientAuthRequest](#schemaclientauthrequest)|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.postloginviainstagram-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|POST Call for Instagram based login|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.instagramCallback

<a id="opIdLoginController.instagramCallback"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/instagram-auth-redirect',
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

`GET /auth/instagram-auth-redirect`

<h3 id="logincontroller.instagramcallback-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|code|query|string|false|none|
|state|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.instagramcallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Instagram Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.postLoginViaKeycloak

<a id="opIdLoginController.postLoginViaKeycloak"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/keycloak',
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

`POST /auth/keycloak`

POST Call for keycloak based login

> Body parameter

```yaml
client_id: string
client_secret: string

```

<h3 id="logincontroller.postloginviakeycloak-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ClientAuthRequest](#schemaclientauthrequest)|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.postloginviakeycloak-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Keycloak Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.loginViaKeycloak

<a id="opIdLoginController.loginViaKeycloak"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/keycloak',
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

`GET /auth/keycloak`

<h3 id="logincontroller.loginviakeycloak-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|client_id|query|string|false|none|
|client_secret|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.loginviakeycloak-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Keycloak Token Response (Deprecated: Possible security issue if secret is passed via query params, please use the post endpoint)|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.keycloakCallback

<a id="opIdLoginController.keycloakCallback"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/keycloak-auth-redirect',
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

`GET /auth/keycloak-auth-redirect`

<h3 id="logincontroller.keycloakcallback-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|code|query|string|false|none|
|state|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.keycloakcallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Keycloak Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.login

<a id="opIdLoginController.login"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/auth/login',
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

`POST /auth/login`

Gets you the code that will be used for getting token (webapps)

> Body parameter

```json
{
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
}
```

<h3 id="logincontroller.login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LoginRequest](#schemaloginrequest)|false|none|

> Example responses

<h3 id="logincontroller.login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Auth Code|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<h3 id="logincontroller.login-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.loginWithClientUser

<a id="opIdLoginController.loginWithClientUser"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string'
};

fetch('http://localhost:3000/auth/login-token',
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

`POST /auth/login-token`

Gets you refresh token and access token in one hit. (mobile app)

> Body parameter

```json
{
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
}
```

<h3 id="logincontroller.loginwithclientuser-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|device_id|header|string|false|none|
|body|body|[LoginRequest](#schemaloginrequest)|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.loginwithclientuser-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Token Response Model|[TokenResponse](#schematokenresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.me

<a id="opIdLoginController.me"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth/me',
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

`GET /auth/me`

To get the user details

> Example responses

<h3 id="logincontroller.me-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User Object|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<h3 id="logincontroller.me-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LoginController.getToken

<a id="opIdLoginController.getToken"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "code": "string",
  "clientId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string'
};

fetch('http://localhost:3000/auth/token',
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

`POST /auth/token`

 Send the code received from the above api and this api will send you refresh token and access token (webapps)

> Body parameter

```json
{
  "code": "string",
  "clientId": "string"
}
```

<h3 id="logincontroller.gettoken-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|device_id|header|string|false|none|
|body|body|[AuthTokenRequest](#schemaauthtokenrequest)|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.gettoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Token Response|[TokenResponse](#schematokenresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

## LoginController.exchangeToken

<a id="opIdLoginController.exchangeToken"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "refreshToken": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string'
};

fetch('http://localhost:3000/auth/token-refresh',
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

`POST /auth/token-refresh`

 Gets you a new access and refresh token once your access token is expired. (both mobile and web)

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="logincontroller.exchangetoken-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|device_id|header|string|false|none|
|body|body|[AuthRefreshTokenRequest](#schemaauthrefreshtokenrequest)|false|none|

> Example responses

> 200 Response

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}
```

<h3 id="logincontroller.exchangetoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|New Token Response|[TokenResponse](#schematokenresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-forgetpasswordcontroller">ForgetPasswordController</h1>

## ForgetPasswordController.forgetPassword

<a id="opIdForgetPasswordController.forgetPassword"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "username": "string",
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/forget-password',
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

`POST /auth/forget-password`

> Body parameter

```json
{
  "username": "string",
  "client_id": "string",
  "client_secret": "string"
}
```

<h3 id="forgetpasswordcontroller.forgetpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ForgetPasswordDto](#schemaforgetpassworddto)|false|none|

> Example responses

> 200 Response

```json
{
  "code": "string",
  "expiry": 0,
  "email": "string",
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
    "phone": "string",
    "authClientIds": "string",
    "lastLogin": "2019-08-24T14:15:22Z",
    "dob": "2019-08-24T14:15:22Z",
    "gender": "M",
    "defaultTenantId": "string"
  }
}
```

<h3 id="forgetpasswordcontroller.forgetpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success Response.|[ForgetPasswordResponseDto](#schemaforgetpasswordresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

## ForgetPasswordController.resetPassword

<a id="opIdForgetPasswordController.resetPassword"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "token": "string",
  "password": "string",
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/auth/reset-password',
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

`PATCH /auth/reset-password`

> Body parameter

```json
{
  "token": "string",
  "password": "string",
  "client_id": "string",
  "client_secret": "string"
}
```

<h3 id="forgetpasswordcontroller.resetpassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ResetPasswordWithClient](#schemaresetpasswordwithclient)|false|none|

<h3 id="forgetpasswordcontroller.resetpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|If User password successfully changed.|None|

<aside class="success">
This operation does not require authentication
</aside>

## ForgetPasswordController.verifyResetPasswordLink

<a id="opIdForgetPasswordController.verifyResetPasswordLink"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/auth/verify-reset-password-link?token=string',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /auth/verify-reset-password-link`

<h3 id="forgetpasswordcontroller.verifyresetpasswordlink-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|token|query|string|true|none|

<h3 id="forgetpasswordcontroller.verifyresetpasswordlink-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Check if Token Is Valid and not Expired.|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-signuprequestcontroller">SignupRequestController</h1>

## SignupRequestController.requestSignup

<a id="opIdSignupRequestController.requestSignup"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "email": "string",
  "data": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/sign-up/create-token',
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

`POST /auth/sign-up/create-token`

> Body parameter

```json
{
  "email": "string",
  "data": {}
}
```

<h3 id="signuprequestcontroller.requestsignup-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[SignupRequestDto](#schemasignuprequestdto)|false|none|

> Example responses

> 200 Response

```json
{
  "code": "string",
  "expiry": 0,
  "email": "string"
}
```

<h3 id="signuprequestcontroller.requestsignup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sucess Response.|[SignupRequestResponseDto](#schemasignuprequestresponsedto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

## SignupRequestController.signupWithToken

<a id="opIdSignupRequestController.signupWithToken"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "email": "string",
  "password": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/auth/sign-up/create-user',
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

`POST /auth/sign-up/create-user`

> Body parameter

```json
{
  "email": "string",
  "password": "string"
}
```

<h3 id="signuprequestcontroller.signupwithtoken-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LocalUserProfileDto](#schemalocaluserprofiledto)|false|none|

> Example responses

> 200 Response

```json
{
  "email": "string",
  "password": "string"
}
```

<h3 id="signuprequestcontroller.signupwithtoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sucess Response.|[LocalUserProfileDto](#schemalocaluserprofiledto)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

## SignupRequestController.verifyInviteToken

<a id="opIdSignupRequestController.verifyInviteToken"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/auth/sign-up/verify-token',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /auth/sign-up/verify-token`

<h3 id="signuprequestcontroller.verifyinvitetoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sucess Response.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-authclientcontroller">AuthClientController</h1>

## AuthClientController.count

<a id="opIdAuthClientController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients/count',
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

`GET /auth-clients/count`

<h3 id="authclientcontroller.count-parameters">Parameters</h3>

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

<h3 id="authclientcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AuthClient model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuthClientController.replaceById

<a id="opIdAuthClientController.replaceById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients/{id}',
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

`PUT /auth-clients/{id}`

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}
```

<h3 id="authclientcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|number|true|none|
|body|body|[AuthClient](#schemaauthclient)|false|none|

<h3 id="authclientcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|AuthClient PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuthClientController.updateById

<a id="opIdAuthClientController.updateById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients/{id}',
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

`PATCH /auth-clients/{id}`

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}
```

<h3 id="authclientcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|number|true|none|
|body|body|[AuthClientPartial](#schemaauthclientpartial)|false|none|

<h3 id="authclientcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|AuthClient PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuthClientController.findById

<a id="opIdAuthClientController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients/{id}',
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

`GET /auth-clients/{id}`

<h3 id="authclientcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|number|true|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}
```

<h3 id="authclientcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AuthClient model instance|[AuthClient](#schemaauthclient)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuthClientController.deleteById

<a id="opIdAuthClientController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients/{id}',
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

`DELETE /auth-clients/{id}`

<h3 id="authclientcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|number|true|none|

<h3 id="authclientcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|AuthClient DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuthClientController.create

<a id="opIdAuthClientController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients',
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

`POST /auth-clients`

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}
```

<h3 id="authclientcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthClientExcluding_id_](#schemaauthclientexcluding_id_)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}
```

<h3 id="authclientcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AuthClient model instance|[AuthClient](#schemaauthclient)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuthClientController.updateAll

<a id="opIdAuthClientController.updateAll"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients',
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

`PATCH /auth-clients`

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}
```

<h3 id="authclientcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[AuthClientPartial](#schemaauthclientpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="authclientcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|AuthClient PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## AuthClientController.find

<a id="opIdAuthClientController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('http://localhost:3000/auth-clients',
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

`GET /auth-clients`

<h3 id="authclientcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[auth_clients.Filter](#schemaauth_clients.filter)|false|none|

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
    "id": 0,
    "clientId": "string",
    "clientSecret": "string",
    "secret": "string",
    "redirectUrl": "string",
    "accessTokenExpiration": 0,
    "refreshTokenExpiration": 0,
    "authCodeExpiration": 0
  }
]
```

<h3 id="authclientcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of AuthClient model instances|Inline|

<h3 id="authclientcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[AuthClient](#schemaauthclient)]|false|none|none|
|» AuthClient|[AuthClient](#schemaauthclient)|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» id|number|false|none|none|
|»» clientId|string|true|none|none|
|»» clientSecret|string|true|none|none|
|»» secret|string|true|none|none|
|»» redirectUrl|string|false|none|none|
|»» accessTokenExpiration|number|true|none|none|
|»» refreshTokenExpiration|number|true|none|none|
|»» authCodeExpiration|number|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="authentication-service-logoutcontroller">LogoutController</h1>

## LogoutController.keycloakLogout

<a id="opIdLogoutController.keycloakLogout"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "refreshToken": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string'
};

fetch('http://localhost:3000/keycloak/logout',
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

`POST /keycloak/logout`

This API will log out the user from application as well as keycloak

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="logoutcontroller.keycloaklogout-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|false|This is the access token which is required to authenticate user.|
|body|body|[RefreshTokenRequestPartial](#schemarefreshtokenrequestpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "success": true
}
```

<h3 id="logoutcontroller.keycloaklogout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success Response|[SuccessResponse](#schemasuccessresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LogoutController.logout

<a id="opIdLogoutController.logout"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "refreshToken": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string'
};

fetch('http://localhost:3000/logout',
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

`POST /logout`

To logout

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="logoutcontroller.logout-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|false|This is the access token which is required to authenticate user.|
|body|body|[RefreshTokenRequestPartial](#schemarefreshtokenrequestpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "success": true
}
```

<h3 id="logoutcontroller.logout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success Response|[SuccessResponse](#schemasuccessresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="authentication-service-otpcontroller">OtpController</h1>

## OtpController.findById

<a id="opIdOtpController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/otp-caches/{id}',
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

`GET /otp-caches/{id}`

<h3 id="otpcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "otp": "string",
  "username": "string"
}
```

<h3 id="otpcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Otp model instance|[Otp](#schemaotp)|

<aside class="success">
This operation does not require authentication
</aside>

## OtpController.deleteById

<a id="opIdOtpController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/otp-caches/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /otp-caches/{id}`

<h3 id="otpcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="otpcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Otp DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## OtpController.create

<a id="opIdOtpController.create"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "otp": "string",
  "username": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/otp-caches',
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

`POST /otp-caches`

> Body parameter

```json
{
  "otp": "string",
  "username": "string"
}
```

<h3 id="otpcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Otp](#schemaotp)|false|none|

> Example responses

> 200 Response

```json
{
  "otp": "string",
  "username": "string"
}
```

<h3 id="otpcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Otp model instance|[Otp](#schemaotp)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-pingcontroller">PingController</h1>

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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Ping Response|Inline|

<h3 id="pingcontroller.ping-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» greeting|string|false|none|none|
|» date|string|false|none|none|
|» url|string|false|none|none|
|» headers|object|false|none|none|
|»» Content-Type|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-todocontroller">TodoController</h1>

## TodoController.count

<a id="opIdTodoController.count"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/todos/count',
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

`GET /todos/count`

<h3 id="todocontroller.count-parameters">Parameters</h3>

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

<h3 id="todocontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ToDo model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## TodoController.updateById

<a id="opIdTodoController.updateById"></a>

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json'
};

fetch('http://localhost:3000/todos/{id}',
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

`PATCH /todos/{id}`

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ToDoPartial](#schematodopartial)|false|none|

<h3 id="todocontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|ToDo PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TodoController.findById

<a id="opIdTodoController.findById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/todos/{id}',
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

`GET /todos/{id}`

<h3 id="todocontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[todos.Filter](#schematodos.filter)|false|none|

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ToDo model instance|[ToDoWithRelations](#schematodowithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

## TodoController.deleteById

<a id="opIdTodoController.deleteById"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

fetch('http://localhost:3000/todos/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /todos/{id}`

<h3 id="todocontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="todocontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|ToDo DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## TodoController.create

<a id="opIdTodoController.create"></a>

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('http://localhost:3000/todos',
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

`POST /todos`

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewToDo](#schemanewtodo)|false|none|

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}
```

<h3 id="todocontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ToDo model instance|[ToDo](#schematodo)|

<aside class="success">
This operation does not require authentication
</aside>

## TodoController.find

<a id="opIdTodoController.find"></a>

> Code samples

```'javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('http://localhost:3000/todos',
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

`GET /todos`

<h3 id="todocontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[todos.Filter1](#schematodos.filter1)|false|none|

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
    "title": "string",
    "description": "string",
    "items": [
      "string"
    ]
  }
]
```

<h3 id="todocontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of ToDo model instances|Inline|

<h3 id="todocontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[ToDoWithRelations](#schematodowithrelations)]|false|none|[(tsType: ToDoWithRelations, schemaOptions: { includeRelations: true })]|
|» ToDoWithRelations|[ToDoWithRelations](#schematodowithrelations)|false|none|(tsType: ToDoWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» title|string|true|none|none|
|»» description|string|true|none|none|
|»» items|[string]|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-homepagecontroller">HomePageController</h1>

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

<h2 id="tocS_LoginRequest">LoginRequest</h2>
<!-- backwards compatibility -->
<a id="schemaloginrequest"></a>
<a id="schema_LoginRequest"></a>
<a id="tocSloginrequest"></a>
<a id="tocsloginrequest"></a>

```json
{
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
}

```

LoginRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|client_id|string|true|none|This property is supposed to be a string and is a required field|
|client_secret|string|true|none|This property is supposed to be a string and is a required field|
|username|string|true|none|This property is supposed to be a string and is a required field|
|password|string|true|none|This property is supposed to be a string and is a required field|

<h2 id="tocS_TokenResponse">TokenResponse</h2>
<!-- backwards compatibility -->
<a id="schematokenresponse"></a>
<a id="schema_TokenResponse"></a>
<a id="tocStokenresponse"></a>
<a id="tocstokenresponse"></a>

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expires": 0,
  "pubnubToken": "string"
}

```

TokenResponse

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|accessToken|string|true|none|This property is supposed to be a string and is a required field|
|refreshToken|string|true|none|This property is supposed to be a string and is a required field|
|expires|number|true|none|none|
|pubnubToken|string|false|none|none|

<h2 id="tocS_AuthTokenRequest">AuthTokenRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthtokenrequest"></a>
<a id="schema_AuthTokenRequest"></a>
<a id="tocSauthtokenrequest"></a>
<a id="tocsauthtokenrequest"></a>

```json
{
  "code": "string",
  "clientId": "string"
}

```

AuthTokenRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|code|string|true|none|none|
|clientId|string|true|none|none|

<h2 id="tocS_Function">Function</h2>
<!-- backwards compatibility -->
<a id="schemafunction"></a>
<a id="schema_Function"></a>
<a id="tocSfunction"></a>
<a id="tocsfunction"></a>

```json
null

```

### Properties

*None*

<h2 id="tocS_AuthRefreshTokenRequest">AuthRefreshTokenRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthrefreshtokenrequest"></a>
<a id="schema_AuthRefreshTokenRequest"></a>
<a id="tocSauthrefreshtokenrequest"></a>
<a id="tocsauthrefreshtokenrequest"></a>

```json
{
  "refreshToken": "string"
}

```

AuthRefreshTokenRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|true|none|none|

<h2 id="tocS_ClientAuthRequest">ClientAuthRequest</h2>
<!-- backwards compatibility -->
<a id="schemaclientauthrequest"></a>
<a id="schema_ClientAuthRequest"></a>
<a id="tocSclientauthrequest"></a>
<a id="tocsclientauthrequest"></a>

```json
{
  "client_id": "string",
  "client_secret": "string"
}

```

ClientAuthRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|client_id|string|true|none|This property is supposed to be a string and is a required field|
|client_secret|string|true|none|This property is supposed to be a string and is a required field|

<h2 id="tocS_ResetPasswordPartial">ResetPasswordPartial</h2>
<!-- backwards compatibility -->
<a id="schemaresetpasswordpartial"></a>
<a id="schema_ResetPasswordPartial"></a>
<a id="tocSresetpasswordpartial"></a>
<a id="tocsresetpasswordpartial"></a>

```json
{
  "refreshToken": "string",
  "username": "string",
  "password": "string",
  "oldPassword": "string"
}

```

ResetPasswordPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|false|none|none|
|username|string|false|none|This property is supposed to be a string and is a required field|
|password|string|false|none|This property is supposed to be a string and is a required field|
|oldPassword|string|false|none|This property is supposed to be a string and is a required field|

<h2 id="tocS_ResetPassword">ResetPassword</h2>
<!-- backwards compatibility -->
<a id="schemaresetpassword"></a>
<a id="schema_ResetPassword"></a>
<a id="tocSresetpassword"></a>
<a id="tocsresetpassword"></a>

```json
{
  "refreshToken": "string",
  "username": "string",
  "password": "string",
  "oldPassword": "string"
}

```

ResetPassword

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|true|none|none|
|username|string|true|none|This property is supposed to be a string and is a required field|
|password|string|true|none|This property is supposed to be a string and is a required field|
|oldPassword|string|false|none|This property is supposed to be a string and is a required field|

<h2 id="tocS_SuccessResponse">SuccessResponse</h2>
<!-- backwards compatibility -->
<a id="schemasuccessresponse"></a>
<a id="schema_SuccessResponse"></a>
<a id="tocSsuccessresponse"></a>
<a id="tocssuccessresponse"></a>

```json
{
  "success": true
}

```

SuccessResponse

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|success|boolean|false|none|none|

<h2 id="tocS_RefreshTokenRequestPartial">RefreshTokenRequestPartial</h2>
<!-- backwards compatibility -->
<a id="schemarefreshtokenrequestpartial"></a>
<a id="schema_RefreshTokenRequestPartial"></a>
<a id="tocSrefreshtokenrequestpartial"></a>
<a id="tocsrefreshtokenrequestpartial"></a>

```json
{
  "refreshToken": "string"
}

```

RefreshTokenRequestPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|false|none|none|

<h2 id="tocS_RefreshTokenRequest">RefreshTokenRequest</h2>
<!-- backwards compatibility -->
<a id="schemarefreshtokenrequest"></a>
<a id="schema_RefreshTokenRequest"></a>
<a id="tocSrefreshtokenrequest"></a>
<a id="tocsrefreshtokenrequest"></a>

```json
{
  "refreshToken": "string"
}

```

RefreshTokenRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|true|none|none|

<h2 id="tocS_Otp">Otp</h2>
<!-- backwards compatibility -->
<a id="schemaotp"></a>
<a id="schema_Otp"></a>
<a id="tocSotp"></a>
<a id="tocsotp"></a>

```json
{
  "otp": "string",
  "username": "string"
}

```

Otp

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|otp|string|true|none|none|
|username|string|true|none|none|

<h2 id="tocS_AuthClient">AuthClient</h2>
<!-- backwards compatibility -->
<a id="schemaauthclient"></a>
<a id="schema_AuthClient"></a>
<a id="tocSauthclient"></a>
<a id="tocsauthclient"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}

```

AuthClient

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|number|false|none|none|
|clientId|string|true|none|none|
|clientSecret|string|true|none|none|
|secret|string|true|none|none|
|redirectUrl|string|false|none|none|
|accessTokenExpiration|number|true|none|none|
|refreshTokenExpiration|number|true|none|none|
|authCodeExpiration|number|true|none|none|

<h2 id="tocS_AuthClientExcluding_id_">AuthClientExcluding_id_</h2>
<!-- backwards compatibility -->
<a id="schemaauthclientexcluding_id_"></a>
<a id="schema_AuthClientExcluding_id_"></a>
<a id="tocSauthclientexcluding_id_"></a>
<a id="tocsauthclientexcluding_id_"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}

```

AuthClientExcluding_id_

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|clientId|string|true|none|none|
|clientSecret|string|true|none|none|
|secret|string|true|none|none|
|redirectUrl|string|false|none|none|
|accessTokenExpiration|number|true|none|none|
|refreshTokenExpiration|number|true|none|none|
|authCodeExpiration|number|true|none|none|

<h2 id="tocS_AuthClientPartial">AuthClientPartial</h2>
<!-- backwards compatibility -->
<a id="schemaauthclientpartial"></a>
<a id="schema_AuthClientPartial"></a>
<a id="tocSauthclientpartial"></a>
<a id="tocsauthclientpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "id": 0,
  "clientId": "string",
  "clientSecret": "string",
  "secret": "string",
  "redirectUrl": "string",
  "accessTokenExpiration": 0,
  "refreshTokenExpiration": 0,
  "authCodeExpiration": 0
}

```

AuthClientPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|id|number|false|none|none|
|clientId|string|false|none|none|
|clientSecret|string|false|none|none|
|secret|string|false|none|none|
|redirectUrl|string|false|none|none|
|accessTokenExpiration|number|false|none|none|
|refreshTokenExpiration|number|false|none|none|
|authCodeExpiration|number|false|none|none|

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
  "phone": "string",
  "authClientIds": "string",
  "lastLogin": "2019-08-24T14:15:22Z",
  "dob": "2019-08-24T14:15:22Z",
  "gender": "M",
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
|email|string|false|none|none|
|phone|string|false|none|none|
|authClientIds|string|false|none|none|
|lastLogin|string(date-time)|false|none|none|
|dob|string(date-time)|false|none|none|
|gender|string|false|none|This field takes a single character as input in database.<br>    'M' for male and 'F' for female.|
|defaultTenantId|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|gender|M|
|gender|F|
|gender|O|

<h2 id="tocS_ForgetPasswordResponseDto">ForgetPasswordResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaforgetpasswordresponsedto"></a>
<a id="schema_ForgetPasswordResponseDto"></a>
<a id="tocSforgetpasswordresponsedto"></a>
<a id="tocsforgetpasswordresponsedto"></a>

```json
{
  "code": "string",
  "expiry": 0,
  "email": "string",
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
    "phone": "string",
    "authClientIds": "string",
    "lastLogin": "2019-08-24T14:15:22Z",
    "dob": "2019-08-24T14:15:22Z",
    "gender": "M",
    "defaultTenantId": "string"
  }
}

```

ForgetPasswordResponseDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|code|string|true|none|none|
|expiry|number|true|none|none|
|email|string|true|none|none|
|user|[User](#schemauser)|false|none|This is signature for user model.|

<h2 id="tocS_ForgetPasswordDto">ForgetPasswordDto</h2>
<!-- backwards compatibility -->
<a id="schemaforgetpassworddto"></a>
<a id="schema_ForgetPasswordDto"></a>
<a id="tocSforgetpassworddto"></a>
<a id="tocsforgetpassworddto"></a>

```json
{
  "username": "string",
  "client_id": "string",
  "client_secret": "string"
}

```

ForgetPasswordDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|true|none|none|
|client_id|string|true|none|none|
|client_secret|string|true|none|none|

<h2 id="tocS_ResetPasswordWithClient">ResetPasswordWithClient</h2>
<!-- backwards compatibility -->
<a id="schemaresetpasswordwithclient"></a>
<a id="schema_ResetPasswordWithClient"></a>
<a id="tocSresetpasswordwithclient"></a>
<a id="tocsresetpasswordwithclient"></a>

```json
{
  "token": "string",
  "password": "string",
  "client_id": "string",
  "client_secret": "string"
}

```

ResetPasswordWithClient

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|token|string|true|none|none|
|password|string|true|none|none|
|client_id|string|true|none|none|
|client_secret|string|true|none|none|

<h2 id="tocS_SignupRequestResponseDto">SignupRequestResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemasignuprequestresponsedto"></a>
<a id="schema_SignupRequestResponseDto"></a>
<a id="tocSsignuprequestresponsedto"></a>
<a id="tocssignuprequestresponsedto"></a>

```json
{
  "code": "string",
  "expiry": 0,
  "email": "string"
}

```

SignupRequestResponseDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|code|string|true|none|none|
|expiry|number|true|none|none|
|email|string|true|none|none|

<h2 id="tocS_SignupRequestDto">SignupRequestDto</h2>
<!-- backwards compatibility -->
<a id="schemasignuprequestdto"></a>
<a id="schema_SignupRequestDto"></a>
<a id="tocSsignuprequestdto"></a>
<a id="tocssignuprequestdto"></a>

```json
{
  "email": "string",
  "data": {}
}

```

SignupRequestDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|data|object|false|none|none|

<h2 id="tocS_LocalUserProfileDto">LocalUserProfileDto</h2>
<!-- backwards compatibility -->
<a id="schemalocaluserprofiledto"></a>
<a id="schema_LocalUserProfileDto"></a>
<a id="tocSlocaluserprofiledto"></a>
<a id="tocslocaluserprofiledto"></a>

```json
{
  "email": "string",
  "password": "string"
}

```

LocalUserProfileDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|password|string|true|none|none|

<h2 id="tocS_SignupRequest">SignupRequest</h2>
<!-- backwards compatibility -->
<a id="schemasignuprequest"></a>
<a id="schema_SignupRequest"></a>
<a id="tocSsignuprequest"></a>
<a id="tocssignuprequest"></a>

```json
{
  "email": "string",
  "expiry": "string"
}

```

SignupRequest

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|expiry|string|false|none|none|

<h2 id="tocS_ToDo">ToDo</h2>
<!-- backwards compatibility -->
<a id="schematodo"></a>
<a id="schema_ToDo"></a>
<a id="tocStodo"></a>
<a id="tocstodo"></a>

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

ToDo

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
|title|string|true|none|none|
|description|string|true|none|none|
|items|[string]|false|none|none|

<h2 id="tocS_NewToDo">NewToDo</h2>
<!-- backwards compatibility -->
<a id="schemanewtodo"></a>
<a id="schema_NewToDo"></a>
<a id="tocSnewtodo"></a>
<a id="tocsnewtodo"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

NewToDo

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
|title|string|true|none|none|
|description|string|true|none|none|
|items|[string]|false|none|none|

<h2 id="tocS_ToDoWithRelations">ToDoWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematodowithrelations"></a>
<a id="schema_ToDoWithRelations"></a>
<a id="tocStodowithrelations"></a>
<a id="tocstodowithrelations"></a>

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

ToDoWithRelations

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
|title|string|true|none|none|
|description|string|true|none|none|
|items|[string]|false|none|none|

<h2 id="tocS_ToDoPartial">ToDoPartial</h2>
<!-- backwards compatibility -->
<a id="schematodopartial"></a>
<a id="schema_ToDoPartial"></a>
<a id="tocStodopartial"></a>
<a id="tocstodopartial"></a>

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
  "title": "string",
  "description": "string",
  "items": [
    "string"
  ]
}

```

ToDoPartial

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
|title|string|false|none|none|
|description|string|false|none|none|
|items|[string]|false|none|none|

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

<h2 id="tocS_auth_clients.Filter">auth_clients.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaauth_clients.filter"></a>
<a id="schema_auth_clients.Filter"></a>
<a id="tocSauth_clients.filter"></a>
<a id="tocsauth_clients.filter"></a>

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
    "clientId": true,
    "clientSecret": true,
    "secret": true,
    "redirectUrl": true,
    "accessTokenExpiration": true,
    "refreshTokenExpiration": true,
    "authCodeExpiration": true
  }
}

```

auth_clients.Filter

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
|»» clientId|boolean|false|none|none|
|»» clientSecret|boolean|false|none|none|
|»» secret|boolean|false|none|none|
|»» redirectUrl|boolean|false|none|none|
|»» accessTokenExpiration|boolean|false|none|none|
|»» refreshTokenExpiration|boolean|false|none|none|
|»» authCodeExpiration|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_todos.Filter">todos.Filter</h2>
<!-- backwards compatibility -->
<a id="schematodos.filter"></a>
<a id="schema_todos.Filter"></a>
<a id="tocStodos.filter"></a>
<a id="tocstodos.filter"></a>

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
    "title": true,
    "description": true,
    "items": true
  }
}

```

todos.Filter

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
|»» title|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» items|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_todos.Filter1">todos.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematodos.filter1"></a>
<a id="schema_todos.Filter1"></a>
<a id="tocStodos.filter1"></a>
<a id="tocstodos.filter1"></a>

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
    "title": true,
    "description": true,
    "items": true
  }
}

```

todos.Filter

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
|»» title|boolean|false|none|none|
|»» description|boolean|false|none|none|
|»» items|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

