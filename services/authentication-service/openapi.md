---
title: Authentication Service v1.0.0
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

<h1 id="authentication-service">Authentication Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

services

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="authentication-service-applelogincontroller">AppleLoginController</h1>

## AppleLoginController.appleCallback

<a id="opIdAppleLoginController.appleCallback"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/apple-oauth-redirect',
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

fetch('/auth/apple-oauth-redirect',
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

`GET /auth/apple-oauth-redirect`

<h3 id="applelogincontroller.applecallback-parameters">Parameters</h3>

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

<h3 id="applelogincontroller.applecallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Apple Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## AppleLoginController.postLoginViaApple

<a id="opIdAppleLoginController.postLoginViaApple"></a>

> Code samples

```javascript
const inputBody = '{
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded'
};

fetch('/auth/oauth-apple',
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
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded'
};

fetch('/auth/oauth-apple',
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

`POST /auth/oauth-apple`

> Body parameter

```yaml
client_id: string
client_secret: string

```

<h3 id="applelogincontroller.postloginviaapple-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[ClientAuthRequest](#schemaclientauthrequest)|false|none|

> Example responses

<h3 id="applelogincontroller.postloginviaapple-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|POST Call for Apple based login|None|

<h3 id="applelogincontroller.postloginviaapple-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-logincontroller">LoginController</h1>

## LoginController.resetPassword

<a id="opIdLoginController.resetPassword"></a>

> Code samples

```javascript
const inputBody = '{
  "refreshToken": "string",
  "username": "string",
  "password": "string",
  "oldPassword": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'string'
};

fetch('/auth/change-password',
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
  "refreshToken": "string",
  "username": "string",
  "password": "string",
  "oldPassword": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'string'
};

fetch('/auth/change-password',
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

## LoginController.login

<a id="opIdLoginController.login"></a>

> Code samples

```javascript
const inputBody = '{
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/login',
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
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/login',
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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Auth Code that you can use to generate access and refresh tokens using the POST /auth/token API|None|
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

```javascript
const inputBody = '{
  "client_id": "string",
  "client_secret": "string",
  "username": "string",
  "password": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string'
};

fetch('/auth/login-token',
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

fetch('/auth/login-token',
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

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/me',
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
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/me',
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

```javascript
const inputBody = '{
  "code": "string",
  "clientId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string'
};

fetch('/auth/token',
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
  "code": "string",
  "clientId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string'
};

fetch('/auth/token',
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

Send the code received from the POST /auth/login api and get refresh token and access token (webapps)

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

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string',
  'Authorization':'string'
};

fetch('/auth/token-refresh',
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
  "refreshToken": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'device_id':'string',
  'Authorization':'string'
};

fetch('/auth/token-refresh',
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
|Authorization|header|string|false|none|
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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="authentication-service-facebooklogincontroller">FacebookLoginController</h1>

## FacebookLoginController.postLoginViaFacebook

<a id="opIdFacebookLoginController.postLoginViaFacebook"></a>

> Code samples

```javascript
const inputBody = '{
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/facebook',
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
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/facebook',
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

`POST /auth/facebook`

> Body parameter

```yaml
client_id: string
client_secret: string

```

<h3 id="facebooklogincontroller.postloginviafacebook-parameters">Parameters</h3>

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

<h3 id="facebooklogincontroller.postloginviafacebook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|POST Call for Facebook based login|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## FacebookLoginController.facebookCallback

<a id="opIdFacebookLoginController.facebookCallback"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/facebook-auth-redirect',
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

fetch('/auth/facebook-auth-redirect',
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

`GET /auth/facebook-auth-redirect`

<h3 id="facebooklogincontroller.facebookcallback-parameters">Parameters</h3>

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

<h3 id="facebooklogincontroller.facebookcallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Facebook Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-forgetpasswordcontroller">ForgetPasswordController</h1>

## ForgetPasswordController.forgetPassword

<a id="opIdForgetPasswordController.forgetPassword"></a>

> Code samples

```javascript
const inputBody = '{
  "username": "string",
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/forget-password',
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
  "username": "string",
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/forget-password',
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

<h3 id="forgetpasswordcontroller.forgetpassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Success Response.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ForgetPasswordController.resetPassword

<a id="opIdForgetPasswordController.resetPassword"></a>

> Code samples

```javascript
const inputBody = '{
  "token": "string",
  "password": "string",
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/reset-password',
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
  "token": "string",
  "password": "string",
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/reset-password',
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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ForgetPasswordController.verifyResetPasswordLink

<a id="opIdForgetPasswordController.verifyResetPasswordLink"></a>

> Code samples

```javascript

fetch('/auth/verify-reset-password-link?token=string',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/auth/verify-reset-password-link?token=string',
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

<h1 id="authentication-service-googlelogincontroller">GoogleLoginController</h1>

## GoogleLoginController.postLoginViaGoogle

<a id="opIdGoogleLoginController.postLoginViaGoogle"></a>

> Code samples

```javascript
const inputBody = '{
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/google',
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
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/google',
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

<h3 id="googlelogincontroller.postloginviagoogle-parameters">Parameters</h3>

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

<h3 id="googlelogincontroller.postloginviagoogle-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|POST Call for Google based login|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## GoogleLoginController.loginViaGoogle

<a id="opIdGoogleLoginController.loginViaGoogle"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/google',
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

fetch('/auth/google',
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

<h3 id="googlelogincontroller.loginviagoogle-parameters">Parameters</h3>

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

<h3 id="googlelogincontroller.loginviagoogle-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Google Token Response (Deprecated: Possible security issue if secret is passed via query params, please use the post endpoint)|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## GoogleLoginController.googleCallback

<a id="opIdGoogleLoginController.googleCallback"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/google-auth-redirect',
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

fetch('/auth/google-auth-redirect',
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

<h3 id="googlelogincontroller.googlecallback-parameters">Parameters</h3>

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

<h3 id="googlelogincontroller.googlecallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Google Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-instagramlogincontroller">InstagramLoginController</h1>

## InstagramLoginController.postLoginViaInstagram

<a id="opIdInstagramLoginController.postLoginViaInstagram"></a>

> Code samples

```javascript
const inputBody = '{
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/instagram',
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
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/instagram',
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

<h3 id="instagramlogincontroller.postloginviainstagram-parameters">Parameters</h3>

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

<h3 id="instagramlogincontroller.postloginviainstagram-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|POST Call for Instagram based login|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## InstagramLoginController.instagramCallback

<a id="opIdInstagramLoginController.instagramCallback"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/instagram-auth-redirect',
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

fetch('/auth/instagram-auth-redirect',
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

<h3 id="instagramlogincontroller.instagramcallback-parameters">Parameters</h3>

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

<h3 id="instagramlogincontroller.instagramcallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Instagram Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-keycloaklogincontroller">KeycloakLoginController</h1>

## KeycloakLoginController.postLoginViaKeycloak

<a id="opIdKeycloakLoginController.postLoginViaKeycloak"></a>

> Code samples

```javascript
const inputBody = '{
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/keycloak',
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
  "client_id": "string",
  "client_secret": "string"
};
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/auth/keycloak',
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

<h3 id="keycloaklogincontroller.postloginviakeycloak-parameters">Parameters</h3>

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

<h3 id="keycloaklogincontroller.postloginviakeycloak-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Keycloak Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## KeycloakLoginController.loginViaKeycloak

<a id="opIdKeycloakLoginController.loginViaKeycloak"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/keycloak',
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

fetch('/auth/keycloak',
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

<h3 id="keycloaklogincontroller.loginviakeycloak-parameters">Parameters</h3>

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

<h3 id="keycloaklogincontroller.loginviakeycloak-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Keycloak Token Response (Deprecated: Possible security issue if secret is passed via query params, please use the post endpoint)|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## KeycloakLoginController.keycloakCallback

<a id="opIdKeycloakLoginController.keycloakCallback"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auth/keycloak-auth-redirect',
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

fetch('/auth/keycloak-auth-redirect',
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

<h3 id="keycloaklogincontroller.keycloakcallback-parameters">Parameters</h3>

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

<h3 id="keycloaklogincontroller.keycloakcallback-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Keycloak Redirect Token Response|[TokenResponse](#schematokenresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="authentication-service-signuprequestcontroller">SignupRequestController</h1>

## SignupRequestController.requestSignup

<a id="opIdSignupRequestController.requestSignup"></a>

> Code samples

```javascript
const inputBody = '{
  "email": "string",
  "data": {}
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/sign-up/create-token',
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
  "data": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/sign-up/create-token',
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

<h3 id="signuprequestcontroller.requestsignup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Sucess Response.|None|
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

```javascript
const inputBody = '{
  "email": "string",
  "password": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/sign-up/create-user',
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
  "password": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/sign-up/create-user',
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

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## SignupRequestController.verifyInviteToken

<a id="opIdSignupRequestController.verifyInviteToken"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/sign-up/verify-token',
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
  'Authorization':'Bearer {access-token}'
};

fetch('/auth/sign-up/verify-token',
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

`GET /auth/sign-up/verify-token`

<h3 id="signuprequestcontroller.verifyinvitetoken-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Sucess Response.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|The syntax of the request entity is incorrect.|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid Credentials.|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|The entity requested does not exist.|None|
|422|[Unprocessable Entity](https://tools.ietf.org/html/rfc2518#section-10.3)|The syntax of the request entity is incorrect|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="authentication-service-logoutcontroller">LogoutController</h1>

## LogoutController.keycloakLogout

<a id="opIdLogoutController.keycloakLogout"></a>

> Code samples

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string'
};

fetch('/keycloak/logout',
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
  "refreshToken": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string'
};

fetch('/keycloak/logout',
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

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string'
};

fetch('/logout',
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
  "refreshToken": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'string'
};

fetch('/logout',
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

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/otp-caches/{id}',
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

fetch('/otp-caches/{id}',
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

```javascript

fetch('/otp-caches/{id}',
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

fetch('/otp-caches/{id}',
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

```javascript
const inputBody = '{
  "otp": "string",
  "username": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/otp-caches',
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
  "otp": "string",
  "username": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/otp-caches',
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

