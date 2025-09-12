---
title: "@sourceloop/reporting-service v7.0.0"
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

<h1 id="-sourceloop-reporting-service">@sourceloop/reporting-service v7.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

reporting-service.

Base URLs:

* <a href="/">/</a>

Email: <a href="mailto:sourav.bhargava@sourcefuse.com">Sourav Bhargava</a> 

<h1 id="-sourceloop-reporting-service-dashboardcontroller">DashboardController</h1>

## DashboardController.count

<a id="opIdDashboardController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/dashboards/count',
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

fetch('/dashboards/count',
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

`GET /dashboards/count`

| Permissions |
| ------- |
| ViewDashboardList   |

<h3 id="dashboardcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[dashboards.Filter](#schemadashboards.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="dashboardcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Count Dashboard|Inline|

<h3 id="dashboardcontroller.count-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## DashboardController.updateById

<a id="opIdDashboardController.updateById"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/dashboards/{id}',
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
const inputBody = {};
const headers = {
  'Content-Type':'application/json'
};

fetch('/dashboards/{id}',
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

`PATCH /dashboards/{id}`

| Permissions |
| ------- |
| UpdateDashboard   |

> Body parameter

```json
{}
```

<h3 id="dashboardcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|false|none|

<h3 id="dashboardcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Dashboard PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## DashboardController.findById

<a id="opIdDashboardController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/dashboards/{id}',
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

fetch('/dashboards/{id}',
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

`GET /dashboards/{id}`

| Permissions |
| ------- |
| ViewDashboard   |

<h3 id="dashboardcontroller.findbyid-parameters">Parameters</h3>

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
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "description": "string",
  "layout": {},
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="dashboardcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Dashboard model instance|[Dashboard](#schemadashboard)|

<aside class="success">
This operation does not require authentication
</aside>

## DashboardController.deleteById

<a id="opIdDashboardController.deleteById"></a>

> Code samples

```javascript

fetch('/dashboards/{id}',
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

fetch('/dashboards/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /dashboards/{id}`

| Permissions |
| ------- |
| DeleteDashboard   |

<h3 id="dashboardcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="dashboardcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Dashboard DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## DashboardController.create

<a id="opIdDashboardController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "name": "string",
  "description": "string",
  "layout": {},
  "widgetIds": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/dashboards',
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
  "name": "string",
  "description": "string",
  "layout": {},
  "widgetIds": [
    "string"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/dashboards',
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

`POST /dashboards`

| Permissions |
| ------- |
| CreateDashboard   |

> Body parameter

```json
{
  "name": "string",
  "description": "string",
  "layout": {},
  "widgetIds": [
    "string"
  ]
}
```

<h3 id="dashboardcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewDashboard](#schemanewdashboard)|false|none|

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
  "layout": {},
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="dashboardcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Dashboard model instance|[Dashboard](#schemadashboard)|

<aside class="success">
This operation does not require authentication
</aside>

## DashboardController.find

<a id="opIdDashboardController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/dashboards',
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

fetch('/dashboards',
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

`GET /dashboards`

| Permissions |
| ------- |
| ViewDashboardList   |

<h3 id="dashboardcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[dashboards.Filter](#schemadashboards.filter)|false|none|

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
  "layout": {},
  "extId": "string",
  "extMetadata": {},
  "widgets": [
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
      "datasetId": "string",
      "visualizationType": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ]
}
```

<h3 id="dashboardcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Dashboard model instances|[DashboardWithRelations](#schemadashboardwithrelations)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-reporting-service-datasetscontroller">DataSetsController</h1>

## DataSetsController.count

<a id="opIdDataSetsController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sets/count',
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

fetch('/data-sets/count',
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

`GET /data-sets/count`

| Permissions |
| ------- |
| ViewDataSetsList   |

<h3 id="datasetscontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[data_sets.Filter](#schemadata_sets.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="datasetscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|API to get the count of DataSets|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## DataSetsController.fetchDataByIdCount

<a id="opIdDataSetsController.fetchDataByIdCount"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sets/{id}/fetch-data/count',
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

fetch('/data-sets/{id}/fetch-data/count',
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

`GET /data-sets/{id}/fetch-data/count`

| Permissions |
| ------- |
| FetchDataFromDataSet   |

<h3 id="datasetscontroller.fetchdatabyidcount-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="datasetscontroller.fetchdatabyidcount-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|API to fetch count of data from a data set based on ID|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## DataSetsController.fetchDataById

<a id="opIdDataSetsController.fetchDataById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sets/{id}/fetch-data',
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

fetch('/data-sets/{id}/fetch-data',
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

`GET /data-sets/{id}/fetch-data`

| Permissions |
| ------- |
| FetchDataFromDataSet   |

<h3 id="datasetscontroller.fetchdatabyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|object|false|none|

> Example responses

<h3 id="datasetscontroller.fetchdatabyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|API to fetch data from a data set based on ID|None|

<h3 id="datasetscontroller.fetchdatabyid-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## DataSetsController.updateById

<a id="opIdDataSetsController.updateById"></a>

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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/data-sets/{id}',
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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/data-sets/{id}',
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

`PATCH /data-sets/{id}`

| Permissions |
| ------- |
| UpdateDataSets   |

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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="datasetscontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[updateDataSet](#schemaupdatedataset)|false|none|

> Example responses

<h3 id="datasetscontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|API to update Data Set based on ID|None|

<h3 id="datasetscontroller.updatebyid-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## DataSetsController.findById

<a id="opIdDataSetsController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sets/{id}',
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

fetch('/data-sets/{id}',
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

`GET /data-sets/{id}`

| Permissions |
| ------- |
| ViewDataSets   |

<h3 id="datasetscontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

<h3 id="datasetscontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|API to fetch info for a particular data set based on ID|None|

<h3 id="datasetscontroller.findbyid-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## DataSetsController.deleteById

<a id="opIdDataSetsController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sets/{id}',
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

fetch('/data-sets/{id}',
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

`DELETE /data-sets/{id}`

| Permissions |
| ------- |
| DeleteDataSets   |

<h3 id="datasetscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

<h3 id="datasetscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Delete a given Data Set based on ID|None|

<h3 id="datasetscontroller.deletebyid-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## DataSetsController.create

<a id="opIdDataSetsController.create"></a>

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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/data-sets',
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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/data-sets',
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

`POST /data-sets`

| Permissions |
| ------- |
| CreateDataSets   |

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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="datasetscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewDataSet](#schemanewdataset)|false|none|

> Example responses

<h3 id="datasetscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|API to create a new DataSet|None|

<h3 id="datasetscontroller.create-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## DataSetsController.getDataSets

<a id="opIdDataSetsController.getDataSets"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sets',
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

fetch('/data-sets',
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

`GET /data-sets`

| Permissions |
| ------- |
| ViewDataSetsList   |

<h3 id="datasetscontroller.getdatasets-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[data_sets.Filter](#schemadata_sets.filter)|false|none|

> Example responses

<h3 id="datasetscontroller.getdatasets-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|API to get list of all data sets|None|

<h3 id="datasetscontroller.getdatasets-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-reporting-service-datasourcescontroller">DataSourcesController</h1>

## DataSourcesController.count

<a id="opIdDataSourcesController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sources/count',
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

fetch('/data-sources/count',
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

`GET /data-sources/count`

| Permissions |
| ------- |
| ViewDataSources   |

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="datasourcescontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|data sources model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## DataSourcesController.findBydataSourceName

<a id="opIdDataSourcesController.findBydataSourceName"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sources/{dataSource}/columns',
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

fetch('/data-sources/{dataSource}/columns',
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

`GET /data-sources/{dataSource}/columns`

| Permissions |
| ------- |
| ViewDataSourcesColumns   |

<h3 id="datasourcescontroller.findbydatasourcename-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dataSource|path|string|true|none|

> Example responses

> 200 Response

```json
[
  {
    "columnName": "string",
    "dataSourceName": "string",
    "displayName": "string",
    "originalDataType": "string",
    "dataType": "String"
  }
]
```

<h3 id="datasourcescontroller.findbydatasourcename-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of columns for the specified data source|Inline|

<h3 id="datasourcescontroller.findbydatasourcename-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[ColumnForDataSourceModel](#schemacolumnfordatasourcemodel)]|false|none|[Schema for ColumnForDataSource]|
|» ColumnForDataSourceModel|[ColumnForDataSourceModel](#schemacolumnfordatasourcemodel)|false|none|Schema for ColumnForDataSource|
|»» columnName|string|false|none|The name of the column|
|»» dataSourceName|string|false|none|Name of the data source|
|»» displayName|string|false|none|Display name of the column|
|»» originalDataType|string|false|none|Original data type of the column|
|»» dataType|string|false|none|Data type of the column|

#### Enumerated Values

|Property|Value|
|---|---|
|dataType|String|
|dataType|Number|
|dataType|Boolean|
|dataType|Array|
|dataType|Object|
|dataType|Json|
|dataType|Date|
|dataType|Unknown|

<aside class="success">
This operation does not require authentication
</aside>

## DataSourcesController.find

<a id="opIdDataSourcesController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/data-sources',
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

fetch('/data-sources',
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

`GET /data-sources`

| Permissions |
| ------- |
| ViewDataSources   |

> Example responses

> 200 Response

```json
[
  {
    "dataSourceName": "string",
    "displayName": "string"
  }
]
```

<h3 id="datasourcescontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of data-sources|Inline|

<h3 id="datasourcescontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» dataSourceName|string|false|none|none|
|» displayName|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-reporting-service-ingestionmappingscontroller">IngestionMappingsController</h1>

## IngestionMappingsController.count

<a id="opIdIngestionMappingsController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ingestion-mapping/count',
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

fetch('/ingestion-mapping/count',
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

`GET /ingestion-mapping/count`

| Permissions |
| ------- |
| ViewIngestionMappings   |

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="ingestionmappingscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Ingestion mapping model count|[loopback.Count](#schemaloopback.count)|

<aside class="success">
This operation does not require authentication
</aside>

## IngestionMappingsController.update

<a id="opIdIngestionMappingsController.update"></a>

> Code samples

```javascript
const inputBody = '{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/ingestion-mapping/{dataSource}',
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
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/ingestion-mapping/{dataSource}',
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

`PATCH /ingestion-mapping/{dataSource}`

| Permissions |
| ------- |
| UpdateIngestionMappings   |

> Body parameter

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}
```

<h3 id="ingestionmappingscontroller.update-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dataSource|path|string|true|none|
|body|body|[IngestionMappingPartial](#schemaingestionmappingpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}
```

<h3 id="ingestionmappingscontroller.update-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Update a mapping for data ingestion|[IngestionMapping](#schemaingestionmapping)|

<aside class="success">
This operation does not require authentication
</aside>

## IngestionMappingsController.get

<a id="opIdIngestionMappingsController.get"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ingestion-mapping/{dataSource}',
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

fetch('/ingestion-mapping/{dataSource}',
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

`GET /ingestion-mapping/{dataSource}`

| Permissions |
| ------- |
| ViewIngestionMapping   |

<h3 id="ingestionmappingscontroller.get-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dataSource|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}
```

<h3 id="ingestionmappingscontroller.get-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Get a mapping for data ingestion|[IngestionMapping](#schemaingestionmapping)|

<aside class="success">
This operation does not require authentication
</aside>

## IngestionMappingsController.delete

<a id="opIdIngestionMappingsController.delete"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ingestion-mapping/{dataSource}',
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

fetch('/ingestion-mapping/{dataSource}',
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

`DELETE /ingestion-mapping/{dataSource}`

| Permissions |
| ------- |
| DeleteIngestionMappings   |

<h3 id="ingestionmappingscontroller.delete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|dataSource|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}
```

<h3 id="ingestionmappingscontroller.delete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Delete a mapping for data ingestion|[IngestionMapping](#schemaingestionmapping)|

<aside class="success">
This operation does not require authentication
</aside>

## IngestionMappingsController.create

<a id="opIdIngestionMappingsController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/ingestion-mapping',
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
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/ingestion-mapping',
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

`POST /ingestion-mapping`

| Permissions |
| ------- |
| CreateIngestionMappings   |

> Body parameter

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}
```

<h3 id="ingestionmappingscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[IngestionMapping](#schemaingestionmapping)|false|none|

> Example responses

> 200 Response

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}
```

<h3 id="ingestionmappingscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Create a new mapping for data ingestion|[IngestionMapping](#schemaingestionmapping)|

<aside class="success">
This operation does not require authentication
</aside>

## IngestionMappingsController.getAll

<a id="opIdIngestionMappingsController.getAll"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ingestion-mapping',
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

fetch('/ingestion-mapping',
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

`GET /ingestion-mapping`

| Permissions |
| ------- |
| ViewIngestionMappings   |

> Example responses

> 200 Response

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}
```

<h3 id="ingestionmappingscontroller.getall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Get a list of mapping for data ingestion|[IngestionMapping](#schemaingestionmapping)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-reporting-service-statetrackingcontroller">StateTrackingController</h1>

## StateTrackingController.findAllRecords

<a id="opIdStateTrackingController.findAllRecords"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/state-tracking/all/{recordType}',
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

fetch('/state-tracking/all/{recordType}',
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

`GET /state-tracking/all/{recordType}`

| Permissions |
| ------- |
| DeleteIngestionMappings   |

<h3 id="statetrackingcontroller.findallrecords-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|recordType|path|string|true|none|
|skip|query|number|false|none|
|limit|query|number|false|none|
|recordId|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "state": "string",
  "payload": "string",
  "recordType": "string",
  "timestamp": "2019-08-24T14:15:22Z",
  "error": "string",
  "recordId": "string"
}
```

<h3 id="statetrackingcontroller.findallrecords-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Find all StateTracking by recordType|[StateTracking](#schemastatetracking)|

<aside class="success">
This operation does not require authentication
</aside>

## StateTrackingController.countRecords

<a id="opIdStateTrackingController.countRecords"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/state-tracking/count/{recordType}',
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

fetch('/state-tracking/count/{recordType}',
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

`GET /state-tracking/count/{recordType}`

| Permissions |
| ------- |
| DeleteIngestionMappings   |

<h3 id="statetrackingcontroller.countrecords-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|recordType|path|string|true|none|
|recordId|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="statetrackingcontroller.countrecords-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Count StateTracking by recordType|Inline|

<h3 id="statetrackingcontroller.countrecords-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## StateTrackingController.findLatestRecord

<a id="opIdStateTrackingController.findLatestRecord"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/state-tracking/latest/{recordType}',
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

fetch('/state-tracking/latest/{recordType}',
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

`GET /state-tracking/latest/{recordType}`

| Permissions |
| ------- |
| DeleteIngestionMappings   |

<h3 id="statetrackingcontroller.findlatestrecord-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|recordType|path|string|true|none|
|recordId|query|string|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "state": "string",
  "payload": "string",
  "recordType": "string",
  "timestamp": "2019-08-24T14:15:22Z",
  "error": "string",
  "recordId": "string"
}
```

<h3 id="statetrackingcontroller.findlatestrecord-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Find latest StateTracking by recordType|[StateTracking](#schemastatetracking)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-reporting-service-widgetcontroller">WidgetController</h1>

## WidgetController.count

<a id="opIdWidgetController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/widgets/count',
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

fetch('/widgets/count',
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

`GET /widgets/count`

| Permissions |
| ------- |
| ViewWidgetList   |

<h3 id="widgetcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[widgets.Filter](#schemawidgets.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="widgetcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Count Widgets|Inline|

<h3 id="widgetcontroller.count-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» count|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## WidgetController.updateById

<a id="opIdWidgetController.updateById"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/widgets/{id}',
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
const inputBody = {};
const headers = {
  'Content-Type':'application/json'
};

fetch('/widgets/{id}',
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

`PATCH /widgets/{id}`

| Permissions |
| ------- |
| UpdateWidget   |

> Body parameter

```json
{}
```

<h3 id="widgetcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|false|none|

<h3 id="widgetcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Widget PATCH success|None|

<aside class="success">
This operation does not require authentication
</aside>

## WidgetController.findById

<a id="opIdWidgetController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/widgets/{id}',
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

fetch('/widgets/{id}',
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

`GET /widgets/{id}`

| Permissions |
| ------- |
| ViewWidget   |

<h3 id="widgetcontroller.findbyid-parameters">Parameters</h3>

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
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="widgetcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Widget model instance|[Widget](#schemawidget)|

<aside class="success">
This operation does not require authentication
</aside>

## WidgetController.deleteById

<a id="opIdWidgetController.deleteById"></a>

> Code samples

```javascript

fetch('/widgets/{id}',
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

fetch('/widgets/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /widgets/{id}`

| Permissions |
| ------- |
| DeleteWidget   |

<h3 id="widgetcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="widgetcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Widget DELETE success|None|

<aside class="success">
This operation does not require authentication
</aside>

## WidgetController.create

<a id="opIdWidgetController.create"></a>

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
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/widgets',
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
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/widgets',
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

`POST /widgets`

| Permissions |
| ------- |
| CreateWidget   |

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
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="widgetcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[new Widget](#schemanew widget)|false|none|

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
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
}
```

<h3 id="widgetcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Widget model instance|[Widget](#schemawidget)|

<aside class="success">
This operation does not require authentication
</aside>

## WidgetController.find

<a id="opIdWidgetController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/widgets',
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

fetch('/widgets',
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

`GET /widgets`

| Permissions |
| ------- |
| ViewWidgetList   |

<h3 id="widgetcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[widgets.Filter](#schemawidgets.filter)|false|none|

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
    "datasetId": "string",
    "visualizationType": "string",
    "extId": "string",
    "extMetadata": {}
  }
]
```

<h3 id="widgetcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Widget model instances|Inline|

<h3 id="widgetcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Widget](#schemawidget)]|false|none|[This model represents a widget]|
|» Widget|[Widget](#schemawidget)|false|none|This model represents a widget|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|The unique identifier for a widget|
|»» name|string|false|none|The name of the widget|
|»» datasetId|string|true|none|The id of the dataset that is to be used for the widget|
|»» visualizationType|string|false|none|The type of visualization to be used for the widget|
|»» extId|string|false|none|The external id of the widget|
|»» extMetadata|object|false|none|The external metadata of the widget|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_NewDataSet">NewDataSet</h2>
<!-- backwards compatibility -->
<a id="schemanewdataset"></a>
<a id="schema_NewDataSet"></a>
<a id="tocSnewdataset"></a>
<a id="tocsnewdataset"></a>

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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
}

```

NewDataSet

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
|name|string|true|none|The name of the data set|
|dataSetQuery|object|false|none|The query for the data set refer to StructuredQueryInterface|
|dataSetQuerySQL|string|false|none|The query for the data set refer to standard SQL|
|dataSetQueryHash|string|false|none|The hash of the query for the data set|
|extId|string|false|none|The external id of the data set|
|extMetadata|object|false|none|The external metadata of the data set|

<h2 id="tocS_updateDataSet">updateDataSet</h2>
<!-- backwards compatibility -->
<a id="schemaupdatedataset"></a>
<a id="schema_updateDataSet"></a>
<a id="tocSupdatedataset"></a>
<a id="tocsupdatedataset"></a>

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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
}

```

updateDataSet

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
|id|string|false|none|The unique identifier for a data set|
|name|string|false|none|The name of the data set|
|dataSetQuery|object|false|none|The query for the data set refer to StructuredQueryInterface|
|dataSetQuerySQL|string|false|none|The query for the data set refer to standard SQL|
|dataSetQueryHash|string|false|none|The hash of the query for the data set|
|extId|string|false|none|The external id of the data set|
|extMetadata|object|false|none|The external metadata of the data set|

<h2 id="tocS_DataSet">DataSet</h2>
<!-- backwards compatibility -->
<a id="schemadataset"></a>
<a id="schema_DataSet"></a>
<a id="tocSdataset"></a>
<a id="tocsdataset"></a>

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
  "dataSetQuery": {},
  "dataSetQuerySQL": "string",
  "dataSetQueryHash": "string",
  "extId": "string",
  "extMetadata": {}
}

```

DataSet

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
|id|string|false|none|The unique identifier for a data set|
|name|string|true|none|The name of the data set|
|dataSetQuery|object|false|none|The query for the data set refer to StructuredQueryInterface|
|dataSetQuerySQL|string|false|none|The query for the data set refer to standard SQL|
|dataSetQueryHash|string|false|none|The hash of the query for the data set|
|extId|string|false|none|The external id of the data set|
|extMetadata|object|false|none|The external metadata of the data set|

<h2 id="tocS_IngestionMapping">IngestionMapping</h2>
<!-- backwards compatibility -->
<a id="schemaingestionmapping"></a>
<a id="schema_IngestionMapping"></a>
<a id="tocSingestionmapping"></a>
<a id="tocsingestionmapping"></a>

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}

```

IngestionMapping

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|dataSourceName|string|true|none|The datasource name for the ingestion mapping|
|recordType|string|true|none|The record type for the ingestion mapping|
|primaryColumn|string|true|none|The primary column for the ingestion mapping|
|columnTransformations|object|false|none|The column transformations for the ingestion mapping, refer to ColumnMappings interface|
|» **additionalProperties**|object|false|none|none|
|»» typeConversion|object|false|none|none|
|»»» expectedType|string|false|none|none|
|»»» dataStoreKey|string|false|none|none|
|»»» customHandler|string|false|none|none|
|»»» ConversionOptions|object|false|none|none|
|»» dataStoreKey|string|false|none|none|
|»» skip|boolean|false|none|none|
|permissions|object|false|none|The permissions for the ingestion mapping|

<h2 id="tocS_IngestionMappingPartial">IngestionMappingPartial</h2>
<!-- backwards compatibility -->
<a id="schemaingestionmappingpartial"></a>
<a id="schema_IngestionMappingPartial"></a>
<a id="tocSingestionmappingpartial"></a>
<a id="tocsingestionmappingpartial"></a>

```json
{
  "dataSourceName": "string",
  "recordType": "string",
  "primaryColumn": "string",
  "columnTransformations": {
    "property1": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    },
    "property2": {
      "typeConversion": {
        "expectedType": "string",
        "dataStoreKey": "string",
        "customHandler": "string",
        "ConversionOptions": {}
      },
      "dataStoreKey": "string",
      "skip": true
    }
  },
  "permissions": {}
}

```

IngestionMappingPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|dataSourceName|string|false|none|The datasource name for the ingestion mapping|
|recordType|string|false|none|The record type for the ingestion mapping|
|primaryColumn|string|false|none|The primary column for the ingestion mapping|
|columnTransformations|object|false|none|The column transformations for the ingestion mapping, refer to ColumnMappings interface|
|» **additionalProperties**|object|false|none|none|
|»» typeConversion|object|false|none|none|
|»»» expectedType|string|false|none|none|
|»»» dataStoreKey|string|false|none|none|
|»»» customHandler|string|false|none|none|
|»»» ConversionOptions|object|false|none|none|
|»» dataStoreKey|string|false|none|none|
|»» skip|boolean|false|none|none|
|permissions|object|false|none|The permissions for the ingestion mapping|

<h2 id="tocS_ColumnForDataSourceModel">ColumnForDataSourceModel</h2>
<!-- backwards compatibility -->
<a id="schemacolumnfordatasourcemodel"></a>
<a id="schema_ColumnForDataSourceModel"></a>
<a id="tocScolumnfordatasourcemodel"></a>
<a id="tocscolumnfordatasourcemodel"></a>

```json
{
  "columnName": "string",
  "dataSourceName": "string",
  "displayName": "string",
  "originalDataType": "string",
  "dataType": "String"
}

```

ColumnForDataSourceModel

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|columnName|string|false|none|The name of the column|
|dataSourceName|string|false|none|Name of the data source|
|displayName|string|false|none|Display name of the column|
|originalDataType|string|false|none|Original data type of the column|
|dataType|string|false|none|Data type of the column|

#### Enumerated Values

|Property|Value|
|---|---|
|dataType|String|
|dataType|Number|
|dataType|Boolean|
|dataType|Array|
|dataType|Object|
|dataType|Json|
|dataType|Date|
|dataType|Unknown|

<h2 id="tocS_StateTracking">StateTracking</h2>
<!-- backwards compatibility -->
<a id="schemastatetracking"></a>
<a id="schema_StateTracking"></a>
<a id="tocSstatetracking"></a>
<a id="tocsstatetracking"></a>

```json
{
  "id": "string",
  "state": "string",
  "payload": "string",
  "recordType": "string",
  "timestamp": "2019-08-24T14:15:22Z",
  "error": "string",
  "recordId": "string"
}

```

StateTracking

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|The unique identifier for a state tracking|
|state|string|true|none|The state of the ingested data|
|payload|string|false|none|The payload of the ingested data|
|recordType|string|true|none|The type of the ingested data|
|timestamp|string(date-time)|true|none|The timestamp of the ingested data|
|error|string|false|none|The error of the ingested data if any|
|recordId|string|true|none|The id of the ingested data|

<h2 id="tocS_Widget">Widget</h2>
<!-- backwards compatibility -->
<a id="schemawidget"></a>
<a id="schema_Widget"></a>
<a id="tocSwidget"></a>
<a id="tocswidget"></a>

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
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
}

```

Widget

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
|id|string|false|none|The unique identifier for a widget|
|name|string|false|none|The name of the widget|
|datasetId|string|true|none|The id of the dataset that is to be used for the widget|
|visualizationType|string|false|none|The type of visualization to be used for the widget|
|extId|string|false|none|The external id of the widget|
|extMetadata|object|false|none|The external metadata of the widget|

<h2 id="tocS_new Widget">new Widget</h2>
<!-- backwards compatibility -->
<a id="schemanew widget"></a>
<a id="schema_new Widget"></a>
<a id="tocSnew widget"></a>
<a id="tocsnew widget"></a>

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
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
}

```

new Widget

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
|name|string|false|none|The name of the widget|
|datasetId|string|true|none|The id of the dataset that is to be used for the widget|
|visualizationType|string|false|none|The type of visualization to be used for the widget|
|extId|string|false|none|The external id of the widget|
|extMetadata|object|false|none|The external metadata of the widget|

<h2 id="tocS_Dashboard">Dashboard</h2>
<!-- backwards compatibility -->
<a id="schemadashboard"></a>
<a id="schema_Dashboard"></a>
<a id="tocSdashboard"></a>
<a id="tocsdashboard"></a>

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
  "layout": {},
  "extId": "string",
  "extMetadata": {}
}

```

Dashboard

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
|id|string|false|none|The unique identifier for a dashboard|
|name|string|true|none|The name of the dashboard|
|description|string|false|none|The description of the dashboard|
|layout|object|false|none|The layout of the dashboard|
|extId|string|false|none|The external id of the dashboard|
|extMetadata|object|false|none|The external metadata of the dashboard|

<h2 id="tocS_NewDashboard">NewDashboard</h2>
<!-- backwards compatibility -->
<a id="schemanewdashboard"></a>
<a id="schema_NewDashboard"></a>
<a id="tocSnewdashboard"></a>
<a id="tocsnewdashboard"></a>

```json
{
  "name": "string",
  "description": "string",
  "layout": {},
  "widgetIds": [
    "string"
  ]
}

```

NewDashboard

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|The name of the dashboard|
|description|string|false|none|The description of the dashboard|
|layout|object|false|none|The layout of the dashboard|
|widgetIds|[string]|false|none|none|

<h2 id="tocS_CreateDashboardDto">CreateDashboardDto</h2>
<!-- backwards compatibility -->
<a id="schemacreatedashboarddto"></a>
<a id="schema_CreateDashboardDto"></a>
<a id="tocScreatedashboarddto"></a>
<a id="tocscreatedashboarddto"></a>

```json
{
  "name": "string",
  "description": "string",
  "layout": {},
  "widgetIds": [
    "string"
  ]
}

```

CreateDashboardDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|true|none|The name of the dashboard|
|description|string|false|none|The description of the dashboard|
|layout|object|false|none|The layout of the dashboard|
|widgetIds|[string]|false|none|none|

<h2 id="tocS_WidgetWithRelations">WidgetWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemawidgetwithrelations"></a>
<a id="schema_WidgetWithRelations"></a>
<a id="tocSwidgetwithrelations"></a>
<a id="tocswidgetwithrelations"></a>

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
  "datasetId": "string",
  "visualizationType": "string",
  "extId": "string",
  "extMetadata": {}
}

```

WidgetWithRelations

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
|id|string|false|none|The unique identifier for a widget|
|name|string|false|none|The name of the widget|
|datasetId|string|true|none|The id of the dataset that is to be used for the widget|
|visualizationType|string|false|none|The type of visualization to be used for the widget|
|extId|string|false|none|The external id of the widget|
|extMetadata|object|false|none|The external metadata of the widget|

<h2 id="tocS_DashboardWithRelations">DashboardWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemadashboardwithrelations"></a>
<a id="schema_DashboardWithRelations"></a>
<a id="tocSdashboardwithrelations"></a>
<a id="tocsdashboardwithrelations"></a>

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
  "layout": {},
  "extId": "string",
  "extMetadata": {},
  "widgets": [
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
      "datasetId": "string",
      "visualizationType": "string",
      "extId": "string",
      "extMetadata": {}
    }
  ]
}

```

DashboardWithRelations

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
|id|string|false|none|The unique identifier for a dashboard|
|name|string|true|none|The name of the dashboard|
|description|string|false|none|The description of the dashboard|
|layout|object|false|none|The layout of the dashboard|
|extId|string|false|none|The external id of the dashboard|
|extMetadata|object|false|none|The external metadata of the dashboard|
|widgets|[[WidgetWithRelations](#schemawidgetwithrelations)]|false|none|[This model represents a widget (tsType: WidgetWithRelations, schemaOptions: { includeRelations: true })]|

<h2 id="tocS_dashboards.ScopeFilter">dashboards.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemadashboards.scopefilter"></a>
<a id="schema_dashboards.ScopeFilter"></a>
<a id="tocSdashboards.scopefilter"></a>
<a id="tocsdashboards.scopefilter"></a>

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

dashboards.ScopeFilter

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

<h2 id="tocS_dashboards.IncludeFilter.Items">dashboards.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemadashboards.includefilter.items"></a>
<a id="schema_dashboards.IncludeFilter.Items"></a>
<a id="tocSdashboards.includefilter.items"></a>
<a id="tocsdashboards.includefilter.items"></a>

```json
{
  "relation": "widgets",
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

dashboards.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[dashboards.ScopeFilter](#schemadashboards.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|widgets|

<h2 id="tocS_dashboards.Filter">dashboards.Filter</h2>
<!-- backwards compatibility -->
<a id="schemadashboards.filter"></a>
<a id="schema_dashboards.Filter"></a>
<a id="tocSdashboards.filter"></a>
<a id="tocsdashboards.filter"></a>

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
    "layout": true,
    "extId": true,
    "extMetadata": true
  },
  "include": [
    {
      "relation": "widgets",
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

dashboards.Filter

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
|»» layout|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

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
|» *anonymous*|[dashboards.IncludeFilter.Items](#schemadashboards.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

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

<h2 id="tocS_data_sets.Filter">data_sets.Filter</h2>
<!-- backwards compatibility -->
<a id="schemadata_sets.filter"></a>
<a id="schema_data_sets.Filter"></a>
<a id="tocSdata_sets.filter"></a>
<a id="tocsdata_sets.filter"></a>

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
    "dataSetQuery": true,
    "dataSetQuerySQL": true,
    "dataSetQueryHash": true,
    "extId": true,
    "extMetadata": true
  }
}

```

data_sets.Filter

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
|»» dataSetQuery|boolean|false|none|none|
|»» dataSetQuerySQL|boolean|false|none|none|
|»» dataSetQueryHash|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_widgets.Filter">widgets.Filter</h2>
<!-- backwards compatibility -->
<a id="schemawidgets.filter"></a>
<a id="schema_widgets.Filter"></a>
<a id="tocSwidgets.filter"></a>
<a id="tocswidgets.filter"></a>

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
    "datasetId": true,
    "visualizationType": true,
    "extId": true,
    "extMetadata": true
  }
}

```

widgets.Filter

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
|»» datasetId|boolean|false|none|none|
|»» visualizationType|boolean|false|none|none|
|»» extId|boolean|false|none|none|
|»» extMetadata|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

