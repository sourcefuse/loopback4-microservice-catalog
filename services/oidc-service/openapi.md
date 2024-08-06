---
title: Oidc Service v1.0.0
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

<h1 id="oidc-service">Oidc Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Oidc microservice.

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="oidc-service-oidccontroller">OidcController</h1>

## OidcController.confirm

<a id="opIdOidcController.confirm"></a>

> Code samples

```javascript

fetch('/interaction/{uid}/confirm',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/interaction/{uid}/confirm',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /interaction/{uid}/confirm`

<h3 id="oidccontroller.confirm-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of OidcController.confirm|None|

<aside class="success">
This operation does not require authentication
</aside>

## OidcController.login

<a id="opIdOidcController.login"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded'
};

fetch('/interaction/{uid}/login',
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
  'Content-Type':'application/x-www-form-urlencoded'
};

fetch('/interaction/{uid}/login',
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

`POST /interaction/{uid}/login`

> Body parameter

```yaml
{}

```

<h3 id="oidccontroller.login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

<h3 id="oidccontroller.login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of OidcController.login|None|

<aside class="success">
This operation does not require authentication
</aside>

## OidcController.interaction

<a id="opIdOidcController.interaction"></a>

> Code samples

```javascript

const headers = {
  'Accept':'type'
};

fetch('/interaction/{uid}',
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
  'Accept':'type'
};

fetch('/interaction/{uid}',
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

`GET /interaction/{uid}`

> Example responses

<h3 id="oidccontroller.interaction-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|login page|None|

<h3 id="oidccontroller.interaction-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

