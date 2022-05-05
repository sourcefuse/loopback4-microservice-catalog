---
title: ocr-service-clm-service v0.0.1
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

<h1 id="ocr-service-clm-service">ocr-service-clm-service v0.0.1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

clm-service

Base URLs:

* <a href="/">/</a>

Email: <a href="mailto:kundan.kumar@sourcefuse.com">kundan-sf</a> 

<h1 id="ocr-service-clm-service-ocrcontroller">OcrController</h1>

## OcrController.getContractAssignment

<a id="opIdOcrController.getContractAssignment"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/assignment/{contract_name}',
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

fetch('/assignment/{contract_name}',
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

`GET /assignment/{contract_name}`

<h3 id="ocrcontroller.getcontractassignment-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractassignment-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractassignment-responseschema">Response Schema</h3>

Status Code **200**

*Get contract assignment*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractAutoRenewal

<a id="opIdOcrController.getContractAutoRenewal"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/auto-renewal/{contract_name}',
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

fetch('/auto-renewal/{contract_name}',
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

`GET /auto-renewal/{contract_name}`

<h3 id="ocrcontroller.getcontractautorenewal-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractautorenewal-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractautorenewal-responseschema">Response Schema</h3>

Status Code **200**

*Get contract auto renewal*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.replaceClauseById

<a id="opIdOcrController.replaceClauseById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/clauses/{id}',
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
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/clauses/{id}',
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

`PUT /clauses/{id}`

> Body parameter

```json
{
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}
```

<h3 id="ocrcontroller.replaceclausebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[OcrResults](#schemaocrresults)|false|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="ocrcontroller.replaceclausebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="ocrcontroller.replaceclausebyid-responseschema">Response Schema</h3>

Status Code **204**

*Clauses PUT success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.updateClauseById

<a id="opIdOcrController.updateClauseById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/clauses/{id}',
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
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/clauses/{id}',
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

`PATCH /clauses/{id}`

> Body parameter

```json
{
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}
```

<h3 id="ocrcontroller.updateclausebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[OcrResultsPartial](#schemaocrresultspartial)|false|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="ocrcontroller.updateclausebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="ocrcontroller.updateclausebyid-responseschema">Response Schema</h3>

Status Code **204**

*Clauses PATCH success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.deleteClauseById

<a id="opIdOcrController.deleteClauseById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/clauses/{id}',
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

fetch('/clauses/{id}',
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

`DELETE /clauses/{id}`

<h3 id="ocrcontroller.deleteclausebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 204 Response

```json
null
```

<h3 id="ocrcontroller.deleteclausebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|No Content|Inline|

<h3 id="ocrcontroller.deleteclausebyid-responseschema">Response Schema</h3>

Status Code **204**

*Clauses DELETE success*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractClauses

<a id="opIdOcrController.getContractClauses"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/clauses/{contract_name}',
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

fetch('/clauses/{contract_name}',
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

`GET /clauses/{contract_name}`

<h3 id="ocrcontroller.getcontractclauses-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractclauses-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractclauses-responseschema">Response Schema</h3>

Status Code **200**

*Get all contract clauses*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.updateAll

<a id="opIdOcrController.updateAll"></a>

> Code samples

```javascript
const inputBody = '[
  {
    "id": "string",
    "contract_name": "string",
    "clause_type": "string",
    "page_number": 0,
    "text": "string",
    "supported_text": "string",
    "coordinates": "string",
    "confidence_level": 0,
    "created_by": "string",
    "modified_by": "string",
    "created_on": "2019-08-24T14:15:22Z",
    "modified_on": "2019-08-24T14:15:22Z",
    "deleted": true,
    "deleted_by": "string",
    "deleted_on": "2019-08-24T14:15:22Z"
  }
]';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/clauses',
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
const inputBody = [
  {
    "id": "string",
    "contract_name": "string",
    "clause_type": "string",
    "page_number": 0,
    "text": "string",
    "supported_text": "string",
    "coordinates": "string",
    "confidence_level": 0,
    "created_by": "string",
    "modified_by": "string",
    "created_on": "2019-08-24T14:15:22Z",
    "modified_on": "2019-08-24T14:15:22Z",
    "deleted": true,
    "deleted_by": "string",
    "deleted_on": "2019-08-24T14:15:22Z"
  }
];
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/clauses',
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

`PATCH /clauses`

> Body parameter

```json
[
  {
    "id": "string",
    "contract_name": "string",
    "clause_type": "string",
    "page_number": 0,
    "text": "string",
    "supported_text": "string",
    "coordinates": "string",
    "confidence_level": 0,
    "created_by": "string",
    "modified_by": "string",
    "created_on": "2019-08-24T14:15:22Z",
    "modified_on": "2019-08-24T14:15:22Z",
    "deleted": true,
    "deleted_by": "string",
    "deleted_on": "2019-08-24T14:15:22Z"
  }
]
```

<h3 id="ocrcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Clauses](#schemaclauses)|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.updateall-responseschema">Response Schema</h3>

Status Code **200**

*Clauses PATCH success count*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractContractAmount

<a id="opIdOcrController.getContractContractAmount"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/contract-amount/{contract_name}',
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

fetch('/contract-amount/{contract_name}',
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

`GET /contract-amount/{contract_name}`

<h3 id="ocrcontroller.getcontractcontractamount-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractcontractamount-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractcontractamount-responseschema">Response Schema</h3>

Status Code **200**

*Get contract contract_amount*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractCurrency

<a id="opIdOcrController.getContractCurrency"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/currency/{contract_name}',
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

fetch('/currency/{contract_name}',
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

`GET /currency/{contract_name}`

<h3 id="ocrcontroller.getcontractcurrency-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractcurrency-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractcurrency-responseschema">Response Schema</h3>

Status Code **200**

*Get contract currency*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractDocumentType

<a id="opIdOcrController.getContractDocumentType"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/document-type/{contract_name}',
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

fetch('/document-type/{contract_name}',
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

`GET /document-type/{contract_name}`

<h3 id="ocrcontroller.getcontractdocumenttype-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractdocumenttype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractdocumenttype-responseschema">Response Schema</h3>

Status Code **200**

*Get contract document type*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractForceMajeure

<a id="opIdOcrController.getContractForceMajeure"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/force-majeure/{contract_name}',
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

fetch('/force-majeure/{contract_name}',
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

`GET /force-majeure/{contract_name}`

<h3 id="ocrcontroller.getcontractforcemajeure-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractforcemajeure-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractforcemajeure-responseschema">Response Schema</h3>

Status Code **200**

*Get contract force majeure*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractGoverningLaw

<a id="opIdOcrController.getContractGoverningLaw"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/governing-law/{contract_name}',
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

fetch('/governing-law/{contract_name}',
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

`GET /governing-law/{contract_name}`

<h3 id="ocrcontroller.getcontractgoverninglaw-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractgoverninglaw-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractgoverninglaw-responseschema">Response Schema</h3>

Status Code **200**

*Get contract governing law*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractIndemnityClause

<a id="opIdOcrController.getContractIndemnityClause"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/indemnity-clause/{contract_name}',
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

fetch('/indemnity-clause/{contract_name}',
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

`GET /indemnity-clause/{contract_name}`

<h3 id="ocrcontroller.getcontractindemnityclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractindemnityclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractindemnityclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract indemnity clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractIprOwnershipClause

<a id="opIdOcrController.getContractIprOwnershipClause"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ipr-ownership-clause/{contract_name}',
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

fetch('/ipr-ownership-clause/{contract_name}',
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

`GET /ipr-ownership-clause/{contract_name}`

<h3 id="ocrcontroller.getcontractiprownershipclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractiprownershipclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractiprownershipclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract ipr ownership clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractLegalId

<a id="opIdOcrController.getContractLegalId"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/legal-id/{contract_name}',
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

fetch('/legal-id/{contract_name}',
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

`GET /legal-id/{contract_name}`

<h3 id="ocrcontroller.getcontractlegalid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractlegalid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractlegalid-responseschema">Response Schema</h3>

Status Code **200**

*Get contract legal id*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractLimitedLiability

<a id="opIdOcrController.getContractLimitedLiability"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/limited-liability/{contract_name}',
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

fetch('/limited-liability/{contract_name}',
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

`GET /limited-liability/{contract_name}`

<h3 id="ocrcontroller.getcontractlimitedliability-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractlimitedliability-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractlimitedliability-responseschema">Response Schema</h3>

Status Code **200**

*Get contract limited liability*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractLiquidityDamages

<a id="opIdOcrController.getContractLiquidityDamages"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/liquidity-damages/{contract_name}',
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

fetch('/liquidity-damages/{contract_name}',
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

`GET /liquidity-damages/{contract_name}`

<h3 id="ocrcontroller.getcontractliquiditydamages-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractliquiditydamages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractliquiditydamages-responseschema">Response Schema</h3>

Status Code **200**

*Get contract liquidity damages*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractPaymentTerms

<a id="opIdOcrController.getContractPaymentTerms"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/payment-terms/{contract_name}',
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

fetch('/payment-terms/{contract_name}',
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

`GET /payment-terms/{contract_name}`

<h3 id="ocrcontroller.getcontractpaymentterms-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractpaymentterms-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractpaymentterms-responseschema">Response Schema</h3>

Status Code **200**

*Get contract payment terms*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractPublicAnnouncement

<a id="opIdOcrController.getContractPublicAnnouncement"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/public-announcement/{contract_name}',
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

fetch('/public-announcement/{contract_name}',
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

`GET /public-announcement/{contract_name}`

<h3 id="ocrcontroller.getcontractpublicannouncement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractpublicannouncement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractpublicannouncement-responseschema">Response Schema</h3>

Status Code **200**

*Get contract public announcement*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractSignatoryDetails

<a id="opIdOcrController.getContractSignatoryDetails"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/signatory-details/{contract_name}',
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

fetch('/signatory-details/{contract_name}',
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

`GET /signatory-details/{contract_name}`

<h3 id="ocrcontroller.getcontractsignatorydetails-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractsignatorydetails-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractsignatorydetails-responseschema">Response Schema</h3>

Status Code **200**

*Get contract signatory details*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractSlaClause

<a id="opIdOcrController.getContractSlaClause"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/sla-clause/{contract_name}',
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

fetch('/sla-clause/{contract_name}',
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

`GET /sla-clause/{contract_name}`

<h3 id="ocrcontroller.getcontractslaclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractslaclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractslaclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract sla clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractSlaDashboard

<a id="opIdOcrController.getContractSlaDashboard"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/sla-dashboard/{contract_name}',
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

fetch('/sla-dashboard/{contract_name}',
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

`GET /sla-dashboard/{contract_name}`

<h3 id="ocrcontroller.getcontractsladashboard-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractsladashboard-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractsladashboard-responseschema">Response Schema</h3>

Status Code **200**

*Get contract sla dashboard*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractSupport

<a id="opIdOcrController.getContractSupport"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/support/{contract_name}',
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

fetch('/support/{contract_name}',
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

`GET /support/{contract_name}`

<h3 id="ocrcontroller.getcontractsupport-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractsupport-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractsupport-responseschema">Response Schema</h3>

Status Code **200**

*Get contract support*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractTerminationClause

<a id="opIdOcrController.getContractTerminationClause"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/termination-clause/{contract_name}',
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

fetch('/termination-clause/{contract_name}',
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

`GET /termination-clause/{contract_name}`

<h3 id="ocrcontroller.getcontractterminationclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractterminationclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractterminationclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract termination clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractThirdPartyBeneficiary

<a id="opIdOcrController.getContractThirdPartyBeneficiary"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/third-party-beneficiary/{contract_name}',
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

fetch('/third-party-beneficiary/{contract_name}',
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

`GET /third-party-beneficiary/{contract_name}`

<h3 id="ocrcontroller.getcontractthirdpartybeneficiary-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractthirdpartybeneficiary-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractthirdpartybeneficiary-responseschema">Response Schema</h3>

Status Code **200**

*Get contract third party beneficiary*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractValidityTerms

<a id="opIdOcrController.getContractValidityTerms"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/validity-terms/{contract_name}',
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

fetch('/validity-terms/{contract_name}',
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

`GET /validity-terms/{contract_name}`

<h3 id="ocrcontroller.getcontractvalidityterms-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractvalidityterms-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractvalidityterms-responseschema">Response Schema</h3>

Status Code **200**

*Get contract validity terms*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractVendor

<a id="opIdOcrController.getContractVendor"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/vendor/{contract_name}',
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

fetch('/vendor/{contract_name}',
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

`GET /vendor/{contract_name}`

<h3 id="ocrcontroller.getcontractvendor-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractvendor-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractvendor-responseschema">Response Schema</h3>

Status Code **200**

*Get contract vendor info*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrController.getContractWarrantyClause

<a id="opIdOcrController.getContractWarrantyClause"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/warranty-clause/{contract_name}',
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

fetch('/warranty-clause/{contract_name}',
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

`GET /warranty-clause/{contract_name}`

<h3 id="ocrcontroller.getcontractwarrantyclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrcontroller.getcontractwarrantyclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrcontroller.getcontractwarrantyclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract warranty clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ocr-service-clm-service-contractcontroller">ContractController</h1>

## ContractController.uploadContract

<a id="opIdContractController.uploadContract"></a>

> Code samples

```javascript
const inputBody = '{
  "file": "string"
}';
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/contract-file',
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
  "file": "string"
};
const headers = {
  'Content-Type':'multipart/form-data',
  'Accept':'application/json'
};

fetch('/contract-file',
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

`POST /contract-file`

> Body parameter

```yaml
file: string

```

<h3 id="contractcontroller.uploadcontract-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Request body for multipart/form-data based file upload|
|» file|body|string(binary)|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="contractcontroller.uploadcontract-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="contractcontroller.uploadcontract-responseschema">Response Schema</h3>

Status Code **200**

*contract file upload*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ContractController.getAllContracts

<a id="opIdContractController.getAllContracts"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/contracts',
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

fetch('/contracts',
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

`GET /contracts`

<h3 id="contractcontroller.getallcontracts-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[Contracts.Filter](#schemacontracts.filter)|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="contractcontroller.getallcontracts-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="contractcontroller.getallcontracts-responseschema">Response Schema</h3>

Status Code **200**

*all contract files*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ContractController.getContractHOCR

<a id="opIdContractController.getContractHOCR"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/hocr-convert/{contract_name}',
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

fetch('/hocr-convert/{contract_name}',
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

`GET /hocr-convert/{contract_name}`

<h3 id="contractcontroller.getcontracthocr-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="contractcontroller.getcontracthocr-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="contractcontroller.getcontracthocr-responseschema">Response Schema</h3>

Status Code **200**

*hcr file converter*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ContractController.getAllHOCRByContractName

<a id="opIdContractController.getAllHOCRByContractName"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/hocr-file/{contract_name}',
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

fetch('/hocr-file/{contract_name}',
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

`GET /hocr-file/{contract_name}`

<h3 id="contractcontroller.getallhocrbycontractname-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="contractcontroller.getallhocrbycontractname-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="contractcontroller.getallhocrbycontractname-responseschema">Response Schema</h3>

Status Code **200**

*hcr file converter*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ContractController.convertContractImg

<a id="opIdContractController.convertContractImg"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/img-convert/{contract_name}',
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

fetch('/img-convert/{contract_name}',
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

`GET /img-convert/{contract_name}`

<h3 id="contractcontroller.convertcontractimg-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="contractcontroller.convertcontractimg-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="contractcontroller.convertcontractimg-responseschema">Response Schema</h3>

Status Code **200**

*image file converter*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## ContractController.convertContractOcr

<a id="opIdContractController.convertContractOcr"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ocr-convert/{contract_name}',
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

fetch('/ocr-convert/{contract_name}',
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

`GET /ocr-convert/{contract_name}`

<h3 id="contractcontroller.convertcontractocr-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|contract_name|path|string|true|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="contractcontroller.convertcontractocr-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="contractcontroller.convertcontractocr-responseschema">Response Schema</h3>

Status Code **200**

*ocr file converter*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ocr-service-clm-service-ocrhookscontroller">OcrHooksController</h1>

## OcrHooksController.getContractAssignment

<a id="opIdOcrHooksController.getContractAssignment"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/assignment',
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
  'Accept':'application/json'
};

fetch('/webhook/assignment',
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

`POST /webhook/assignment`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractassignment-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractassignment-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractassignment-responseschema">Response Schema</h3>

Status Code **200**

*Get contract assignment*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractAutoRenewal

<a id="opIdOcrHooksController.getContractAutoRenewal"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/auto-renewal',
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
  'Accept':'application/json'
};

fetch('/webhook/auto-renewal',
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

`POST /webhook/auto-renewal`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractautorenewal-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractautorenewal-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractautorenewal-responseschema">Response Schema</h3>

Status Code **200**

*Get contract auto renewal*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractContractAmount

<a id="opIdOcrHooksController.getContractContractAmount"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/contract-amount',
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
  'Accept':'application/json'
};

fetch('/webhook/contract-amount',
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

`POST /webhook/contract-amount`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractcontractamount-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractcontractamount-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractcontractamount-responseschema">Response Schema</h3>

Status Code **200**

*Get contract contract_amount*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.uploadContractFile

<a id="opIdOcrHooksController.uploadContractFile"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/contract-upload',
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
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/contract-upload',
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

`POST /webhook/contract-upload`

> Body parameter

```json
{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}
```

<h3 id="ocrhookscontroller.uploadcontractfile-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Contracts](#schemacontracts)|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.uploadcontractfile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.uploadcontractfile-responseschema">Response Schema</h3>

Status Code **200**

*Upload contract document*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractCurrency

<a id="opIdOcrHooksController.getContractCurrency"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/currency',
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
  'Accept':'application/json'
};

fetch('/webhook/currency',
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

`POST /webhook/currency`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractcurrency-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractcurrency-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractcurrency-responseschema">Response Schema</h3>

Status Code **200**

*Get contract currency*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractDocumentType

<a id="opIdOcrHooksController.getContractDocumentType"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/document-type',
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
  'Accept':'application/json'
};

fetch('/webhook/document-type',
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

`POST /webhook/document-type`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractdocumenttype-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractdocumenttype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractdocumenttype-responseschema">Response Schema</h3>

Status Code **200**

*Get contract document type*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractForceMajeure

<a id="opIdOcrHooksController.getContractForceMajeure"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/force-majeure',
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
  'Accept':'application/json'
};

fetch('/webhook/force-majeure',
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

`POST /webhook/force-majeure`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractforcemajeure-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractforcemajeure-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractforcemajeure-responseschema">Response Schema</h3>

Status Code **200**

*Get contract force majeure*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractGoverningLaw

<a id="opIdOcrHooksController.getContractGoverningLaw"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/governing-law',
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
  'Accept':'application/json'
};

fetch('/webhook/governing-law',
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

`POST /webhook/governing-law`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractgoverninglaw-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractgoverninglaw-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractgoverninglaw-responseschema">Response Schema</h3>

Status Code **200**

*Get contract governing law*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.convertContractHocr

<a id="opIdOcrHooksController.convertContractHocr"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/hocr-convert',
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
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/hocr-convert',
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

`POST /webhook/hocr-convert`

> Body parameter

```json
{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}
```

<h3 id="ocrhookscontroller.convertcontracthocr-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Contracts](#schemacontracts)|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.convertcontracthocr-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.convertcontracthocr-responseschema">Response Schema</h3>

Status Code **200**

*Convert contract hocr*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.convertContractImages

<a id="opIdOcrHooksController.convertContractImages"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/img-convert',
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
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/img-convert',
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

`POST /webhook/img-convert`

> Body parameter

```json
{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}
```

<h3 id="ocrhookscontroller.convertcontractimages-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Contracts](#schemacontracts)|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.convertcontractimages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.convertcontractimages-responseschema">Response Schema</h3>

Status Code **200**

*Convert contract document to image*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractIndemnityClause

<a id="opIdOcrHooksController.getContractIndemnityClause"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/indemnity-clause',
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
  'Accept':'application/json'
};

fetch('/webhook/indemnity-clause',
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

`POST /webhook/indemnity-clause`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractindemnityclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractindemnityclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractindemnityclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract indemnity clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractIprOwnershipClause

<a id="opIdOcrHooksController.getContractIprOwnershipClause"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/ipr-ownership-clause',
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
  'Accept':'application/json'
};

fetch('/webhook/ipr-ownership-clause',
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

`POST /webhook/ipr-ownership-clause`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractiprownershipclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractiprownershipclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractiprownershipclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract ipr ownership clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractLegalId

<a id="opIdOcrHooksController.getContractLegalId"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/legal-id',
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
  'Accept':'application/json'
};

fetch('/webhook/legal-id',
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

`POST /webhook/legal-id`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractlegalid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractlegalid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractlegalid-responseschema">Response Schema</h3>

Status Code **200**

*Get contract legal id*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractLimitedLiability

<a id="opIdOcrHooksController.getContractLimitedLiability"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/limited-liability',
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
  'Accept':'application/json'
};

fetch('/webhook/limited-liability',
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

`POST /webhook/limited-liability`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractlimitedliability-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractlimitedliability-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractlimitedliability-responseschema">Response Schema</h3>

Status Code **200**

*Get contract limited liability*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractLiquidityDamages

<a id="opIdOcrHooksController.getContractLiquidityDamages"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/liquidity-damages',
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
  'Accept':'application/json'
};

fetch('/webhook/liquidity-damages',
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

`POST /webhook/liquidity-damages`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractliquiditydamages-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractliquiditydamages-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractliquiditydamages-responseschema">Response Schema</h3>

Status Code **200**

*Get contract liquidity damages*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.convertContractOcr

<a id="opIdOcrHooksController.convertContractOcr"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/ocr-convert',
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
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/ocr-convert',
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

`POST /webhook/ocr-convert`

> Body parameter

```json
{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}
```

<h3 id="ocrhookscontroller.convertcontractocr-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Contracts](#schemacontracts)|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.convertcontractocr-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.convertcontractocr-responseschema">Response Schema</h3>

Status Code **200**

*Convert contract ocr*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractPaymentTerms

<a id="opIdOcrHooksController.getContractPaymentTerms"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/payment-terms',
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
  'Accept':'application/json'
};

fetch('/webhook/payment-terms',
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

`POST /webhook/payment-terms`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractpaymentterms-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractpaymentterms-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractpaymentterms-responseschema">Response Schema</h3>

Status Code **200**

*Get contract payment terms*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractPublicAnnouncement

<a id="opIdOcrHooksController.getContractPublicAnnouncement"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/public-announcement',
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
  'Accept':'application/json'
};

fetch('/webhook/public-announcement',
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

`POST /webhook/public-announcement`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractpublicannouncement-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractpublicannouncement-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractpublicannouncement-responseschema">Response Schema</h3>

Status Code **200**

*Get contract public announcement*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractSignatoryDetails

<a id="opIdOcrHooksController.getContractSignatoryDetails"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/signatory-details',
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
  'Accept':'application/json'
};

fetch('/webhook/signatory-details',
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

`POST /webhook/signatory-details`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractsignatorydetails-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractsignatorydetails-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractsignatorydetails-responseschema">Response Schema</h3>

Status Code **200**

*Get contract signatory details*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractSlaClause

<a id="opIdOcrHooksController.getContractSlaClause"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/sla-clause',
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
  'Accept':'application/json'
};

fetch('/webhook/sla-clause',
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

`POST /webhook/sla-clause`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractslaclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractslaclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractslaclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract sla clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractSlaDashboard

<a id="opIdOcrHooksController.getContractSlaDashboard"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/sla-dashboard',
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
  'Accept':'application/json'
};

fetch('/webhook/sla-dashboard',
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

`POST /webhook/sla-dashboard`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractsladashboard-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractsladashboard-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractsladashboard-responseschema">Response Schema</h3>

Status Code **200**

*Get contract sla dashboard*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractSupport

<a id="opIdOcrHooksController.getContractSupport"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/support',
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
  'Accept':'application/json'
};

fetch('/webhook/support',
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

`POST /webhook/support`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractsupport-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractsupport-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractsupport-responseschema">Response Schema</h3>

Status Code **200**

*Get contract support*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractTerminationClause

<a id="opIdOcrHooksController.getContractTerminationClause"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/termination-clause',
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
  'Accept':'application/json'
};

fetch('/webhook/termination-clause',
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

`POST /webhook/termination-clause`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractterminationclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractterminationclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractterminationclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract termination clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractThirdPartyBeneficiary

<a id="opIdOcrHooksController.getContractThirdPartyBeneficiary"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/third-party-beneficiary',
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
  'Accept':'application/json'
};

fetch('/webhook/third-party-beneficiary',
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

`POST /webhook/third-party-beneficiary`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractthirdpartybeneficiary-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractthirdpartybeneficiary-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractthirdpartybeneficiary-responseschema">Response Schema</h3>

Status Code **200**

*Get contract third party beneficiary*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractValidityTerms

<a id="opIdOcrHooksController.getContractValidityTerms"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/validity-terms',
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
  'Accept':'application/json'
};

fetch('/webhook/validity-terms',
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

`POST /webhook/validity-terms`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractvalidityterms-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractvalidityterms-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractvalidityterms-responseschema">Response Schema</h3>

Status Code **200**

*Get contract validity terms*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractVendor

<a id="opIdOcrHooksController.getContractVendor"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/vendor',
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
  'Accept':'application/json'
};

fetch('/webhook/vendor',
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

`POST /webhook/vendor`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractvendor-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractvendor-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractvendor-responseschema">Response Schema</h3>

Status Code **200**

*Get contract vendor info*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## OcrHooksController.getContractWarrantyClause

<a id="opIdOcrHooksController.getContractWarrantyClause"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/webhook/warranty-clause',
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
  'Accept':'application/json'
};

fetch('/webhook/warranty-clause',
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

`POST /webhook/warranty-clause`

> Body parameter

```json
{}
```

<h3 id="ocrhookscontroller.getcontractwarrantyclause-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

> 200 Response

```json
null
```

<h3 id="ocrhookscontroller.getcontractwarrantyclause-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="ocrhookscontroller.getcontractwarrantyclause-responseschema">Response Schema</h3>

Status Code **200**

*Get contract warranty clause*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Contracts">Contracts</h2>
<!-- backwards compatibility -->
<a id="schemacontracts"></a>
<a id="schema_Contracts"></a>
<a id="tocScontracts"></a>
<a id="tocscontracts"></a>

```json
{
  "id": "string",
  "contract_name": "string",
  "contract_uploaded": true,
  "image_converted": true,
  "ocr_converted": true,
  "hocr_converted": true,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}

```

Contracts

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|contract_name|string|true|none|none|
|contract_uploaded|boolean|false|none|none|
|image_converted|boolean|false|none|none|
|ocr_converted|boolean|false|none|none|
|hocr_converted|boolean|false|none|none|
|created_by|string|true|none|none|
|modified_by|string|true|none|none|
|created_on|string(date-time)|false|none|none|
|modified_on|string(date-time)|false|none|none|
|deleted|boolean|false|none|none|
|deleted_by|string|false|none|none|
|deleted_on|string(date-time)|false|none|none|

<h2 id="tocS_Clauses">Clauses</h2>
<!-- backwards compatibility -->
<a id="schemaclauses"></a>
<a id="schema_Clauses"></a>
<a id="tocSclauses"></a>
<a id="tocsclauses"></a>

```json
{
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}

```

Clauses

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|contract_name|string|true|none|none|
|clause_type|string|false|none|none|
|page_number|number|false|none|none|
|text|string|false|none|none|
|supported_text|string|false|none|none|
|coordinates|string|false|none|none|
|confidence_level|number|false|none|none|
|created_by|string|false|none|none|
|modified_by|string|false|none|none|
|created_on|string(date-time)|false|none|none|
|modified_on|string(date-time)|false|none|none|
|deleted|boolean|false|none|none|
|deleted_by|string|false|none|none|
|deleted_on|string(date-time)|false|none|none|

<h2 id="tocS_OcrResultsPartial">OcrResultsPartial</h2>
<!-- backwards compatibility -->
<a id="schemaocrresultspartial"></a>
<a id="schema_OcrResultsPartial"></a>
<a id="tocSocrresultspartial"></a>
<a id="tocsocrresultspartial"></a>

```json
{
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}

```

OcrResultsPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|contract_name|string|false|none|none|
|clause_type|string|false|none|none|
|page_number|number|false|none|none|
|text|string|false|none|none|
|supported_text|string|false|none|none|
|coordinates|string|false|none|none|
|confidence_level|number|false|none|none|
|created_by|string|false|none|none|
|modified_by|string|false|none|none|
|created_on|string(date-time)|false|none|none|
|modified_on|string(date-time)|false|none|none|
|deleted|boolean|false|none|none|
|deleted_by|string|false|none|none|
|deleted_on|string(date-time)|false|none|none|

<h2 id="tocS_OcrResults">OcrResults</h2>
<!-- backwards compatibility -->
<a id="schemaocrresults"></a>
<a id="schema_OcrResults"></a>
<a id="tocSocrresults"></a>
<a id="tocsocrresults"></a>

```json
{
  "id": "string",
  "contract_name": "string",
  "clause_type": "string",
  "page_number": 0,
  "text": "string",
  "supported_text": "string",
  "coordinates": "string",
  "confidence_level": 0,
  "created_by": "string",
  "modified_by": "string",
  "created_on": "2019-08-24T14:15:22Z",
  "modified_on": "2019-08-24T14:15:22Z",
  "deleted": true,
  "deleted_by": "string",
  "deleted_on": "2019-08-24T14:15:22Z"
}

```

OcrResults

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|contract_name|string|true|none|none|
|clause_type|string|false|none|none|
|page_number|number|false|none|none|
|text|string|false|none|none|
|supported_text|string|false|none|none|
|coordinates|string|false|none|none|
|confidence_level|number|false|none|none|
|created_by|string|false|none|none|
|modified_by|string|false|none|none|
|created_on|string(date-time)|false|none|none|
|modified_on|string(date-time)|false|none|none|
|deleted|boolean|false|none|none|
|deleted_by|string|false|none|none|
|deleted_on|string(date-time)|false|none|none|

<h2 id="tocS_Contracts.Filter">Contracts.Filter</h2>
<!-- backwards compatibility -->
<a id="schemacontracts.filter"></a>
<a id="schema_Contracts.Filter"></a>
<a id="tocScontracts.filter"></a>
<a id="tocscontracts.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "contract_name": true,
    "contract_uploaded": true,
    "image_converted": true,
    "ocr_converted": true,
    "hocr_converted": true,
    "created_by": true,
    "modified_by": true,
    "created_on": true,
    "modified_on": true,
    "deleted": true,
    "deleted_by": true,
    "deleted_on": true
  }
}

```

Contracts.Filter

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
|»» contract_name|boolean|false|none|none|
|»» contract_uploaded|boolean|false|none|none|
|»» image_converted|boolean|false|none|none|
|»» ocr_converted|boolean|false|none|none|
|»» hocr_converted|boolean|false|none|none|
|»» created_by|boolean|false|none|none|
|»» modified_by|boolean|false|none|none|
|»» created_on|boolean|false|none|none|
|»» modified_on|boolean|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deleted_by|boolean|false|none|none|
|»» deleted_on|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

