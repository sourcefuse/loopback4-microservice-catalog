---
title: Ocr S3 Service v1.0.0
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

<h1 id="ocr-s3-service">Ocr S3 Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

services

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="ocr-s3-service-ocrobjectcontroller">OcrObjectController</h1>

## OcrObjectController.getImgFiles

<a id="opIdOcrObjectController.getImgFiles"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/contract-images/{contract_name}',
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

fetch('/contract-images/{contract_name}',
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

`GET /contract-images/{contract_name}`

<h3 id="ocrobjectcontroller.getimgfiles-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrobjectcontroller.getimgfiles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrobjectcontroller.getimgfiles-responseschema">Response Schema</h3>

Status Code **200**

*User model instance*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrObjectController.getHocrFiles

<a id="opIdOcrObjectController.getHocrFiles"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/get-contract-hocr/{contract_name}',
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

fetch('/get-contract-hocr/{contract_name}',
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

`GET /get-contract-hocr/{contract_name}`

<h3 id="ocrobjectcontroller.gethocrfiles-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrobjectcontroller.gethocrfiles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrobjectcontroller.gethocrfiles-responseschema">Response Schema</h3>

Status Code **200**

*User model instance*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

