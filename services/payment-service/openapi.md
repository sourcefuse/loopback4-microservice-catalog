---
title: "@sourceloop/payment-service v13.0.1"
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

<h1 id="-sourceloop-payment-service">@sourceloop/payment-service v13.0.1</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

payment microservice

Base URLs:

* <a href="/">/</a>

<h1 id="-sourceloop-payment-service-subscriptiontransactionscontroller">SubscriptionTransactionsController</h1>

## SubscriptionTransactionsController.subscriptionandtransactionscreate

<a id="opIdSubscriptionTransactionsController.subscriptionandtransactionscreate"></a>

> Code samples

```javascript
const inputBody = '{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/html'
};

fetch('/create-subscription-and-pay',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/html'
};

fetch('/create-subscription-and-pay',
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

`POST /create-subscription-and-pay`

| Permissions |
| ------- |
| CreateSubscription   |
| 2   |

> Body parameter

```json
{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}
```

<h3 id="subscriptiontransactionscontroller.subscriptionandtransactionscreate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewSubscriptions](#schemanewsubscriptions)|false|none|

> Example responses

<h3 id="subscriptiontransactionscontroller.subscriptionandtransactionscreate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Subscription model instance|None|

<h3 id="subscriptiontransactionscontroller.subscriptionandtransactionscreate-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionTransactionsController.subscriptionTransactionscharge

<a id="opIdSubscriptionTransactionsController.subscriptionTransactionscharge"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/subscription/transaction/charge',
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
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/subscription/transaction/charge',
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

`POST /subscription/transaction/charge`

| Permissions |
| ------- |
| UpdateTransaction   |
| 20   |

> Body parameter

```yaml
{}

```

<h3 id="subscriptiontransactionscontroller.subscriptiontransactionscharge-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

<h3 id="subscriptiontransactionscontroller.subscriptiontransactionscharge-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription model instance|None|

<h3 id="subscriptiontransactionscontroller.subscriptiontransactionscharge-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-payment-service-orderscontroller">OrdersController</h1>

## OrdersController.count

<a id="opIdOrdersController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/orders/count',
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

fetch('/orders/count',
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

`GET /orders/count`

| Permissions |
| ------- |
| ViewOrder   |
| 7   |

<h3 id="orderscontroller.count-parameters">Parameters</h3>

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

<h3 id="orderscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Orders model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## OrdersController.replaceById

<a id="opIdOrdersController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/orders/{id}',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/orders/{id}',
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

`PUT /orders/{id}`

| Permissions |
| ------- |
| UpdateOrder   |
| 8   |

> Body parameter

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}
```

<h3 id="orderscontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Orders](#schemaorders)|false|none|

<h3 id="orderscontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Orders PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## OrdersController.updateById

<a id="opIdOrdersController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/orders/{id}',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/orders/{id}',
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

`PATCH /orders/{id}`

| Permissions |
| ------- |
| UpdateOrder   |
| 8   |

> Body parameter

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}
```

<h3 id="orderscontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[OrdersPartial](#schemaorderspartial)|false|none|

<h3 id="orderscontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Orders PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## OrdersController.findById

<a id="opIdOrdersController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/orders/{id}',
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

fetch('/orders/{id}',
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

`GET /orders/{id}`

| Permissions |
| ------- |
| ViewOrder   |
| 7   |

<h3 id="orderscontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[orders.Filter](#schemaorders.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}
```

<h3 id="orderscontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Orders model instance|[OrdersWithRelations](#schemaorderswithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## OrdersController.deleteById

<a id="opIdOrdersController.deleteById"></a>

> Code samples

```javascript

fetch('/orders/{id}',
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

fetch('/orders/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /orders/{id}`

| Permissions |
| ------- |
| DeleteOrder   |
| 9   |

<h3 id="orderscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="orderscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Orders DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## OrdersController.create

<a id="opIdOrdersController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/orders',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/orders',
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

`POST /orders`

| Permissions |
| ------- |
| CreateOrder   |
| 6   |

> Body parameter

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}
```

<h3 id="orderscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewOrders](#schemaneworders)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}
```

<h3 id="orderscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Orders model instance|[Orders](#schemaorders)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## OrdersController.updateAll

<a id="opIdOrdersController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/orders',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/orders',
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

`PATCH /orders`

| Permissions |
| ------- |
| UpdateOrder   |
| 8   |

> Body parameter

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}
```

<h3 id="orderscontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[OrdersPartial](#schemaorderspartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="orderscontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Orders PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## OrdersController.find

<a id="opIdOrdersController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/orders',
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

fetch('/orders',
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

`GET /orders`

| Permissions |
| ------- |
| ViewOrder   |
| 7   |

<h3 id="orderscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[orders.Filter1](#schemaorders.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "totalAmount": 0,
    "currency": "string",
    "status": "string",
    "paymentGatewayId": "string",
    "paymentmethod": "string",
    "metaData": {}
  }
]
```

<h3 id="orderscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Orders model instances|Inline|

<h3 id="orderscontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[OrdersWithRelations](#schemaorderswithrelations)]|false|none|[(tsType: OrdersWithRelations, schemaOptions: { includeRelations: true })]|
|» OrdersWithRelations|[OrdersWithRelations](#schemaorderswithrelations)|false|none|(tsType: OrdersWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|false|none|none|
|»» totalAmount|number|true|none|none|
|»» currency|string|true|none|none|
|»» status|string|true|none|none|
|»» paymentGatewayId|string|true|none|none|
|»» paymentmethod|string|false|none|none|
|»» metaData|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-payment-service-paymentgatewayscontroller">PaymentGatewaysController</h1>

## PaymentGatewaysController.count

<a id="opIdPaymentGatewaysController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/payment-gateways/count',
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

fetch('/payment-gateways/count',
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

`GET /payment-gateways/count`

| Permissions |
| ------- |
| ViewGateway   |
| 12   |

<h3 id="paymentgatewayscontroller.count-parameters">Parameters</h3>

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

<h3 id="paymentgatewayscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|PaymentGateways model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## PaymentGatewaysController.replaceById

<a id="opIdPaymentGatewaysController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/payment-gateways/{id}',
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
  "name": "string",
  "gatewayType": "string",
  "enabled": true
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/payment-gateways/{id}',
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

`PUT /payment-gateways/{id}`

| Permissions |
| ------- |
| UpdateGateway   |
| 11   |

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}
```

<h3 id="paymentgatewayscontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[PaymentGateways](#schemapaymentgateways)|false|none|

<h3 id="paymentgatewayscontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|PaymentGateways PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## PaymentGatewaysController.updateById

<a id="opIdPaymentGatewaysController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/payment-gateways/{id}',
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
  "name": "string",
  "gatewayType": "string",
  "enabled": true
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/payment-gateways/{id}',
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

`PATCH /payment-gateways/{id}`

| Permissions |
| ------- |
| UpdateGateway   |
| 11   |

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}
```

<h3 id="paymentgatewayscontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[PaymentGatewaysPartial](#schemapaymentgatewayspartial)|false|none|

<h3 id="paymentgatewayscontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|PaymentGateways PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## PaymentGatewaysController.findById

<a id="opIdPaymentGatewaysController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/payment-gateways/{id}',
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

fetch('/payment-gateways/{id}',
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

`GET /payment-gateways/{id}`

| Permissions |
| ------- |
| ViewGateway   |
| 12   |

<h3 id="paymentgatewayscontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[paymentgateways.Filter](#schemapaymentgateways.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}
```

<h3 id="paymentgatewayscontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|PaymentGateways model instance|[PaymentGatewaysWithRelations](#schemapaymentgatewayswithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## PaymentGatewaysController.deleteById

<a id="opIdPaymentGatewaysController.deleteById"></a>

> Code samples

```javascript

fetch('/payment-gateways/{id}',
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

fetch('/payment-gateways/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /payment-gateways/{id}`

| Permissions |
| ------- |
| DeleteGateway   |
| 13   |

<h3 id="paymentgatewayscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="paymentgatewayscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|PaymentGateways DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## PaymentGatewaysController.create

<a id="opIdPaymentGatewaysController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/payment-gateways',
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
  "name": "string",
  "gatewayType": "string",
  "enabled": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/payment-gateways',
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

`POST /payment-gateways`

| Permissions |
| ------- |
| CreateGateway   |
| 10   |

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}
```

<h3 id="paymentgatewayscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewPaymentGateways](#schemanewpaymentgateways)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}
```

<h3 id="paymentgatewayscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|PaymentGateways model instance|[PaymentGateways](#schemapaymentgateways)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## PaymentGatewaysController.updateAll

<a id="opIdPaymentGatewaysController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/payment-gateways',
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
  "name": "string",
  "gatewayType": "string",
  "enabled": true
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/payment-gateways',
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

`PATCH /payment-gateways`

| Permissions |
| ------- |
| UpdateGateway   |
| 11   |

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}
```

<h3 id="paymentgatewayscontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[PaymentGatewaysPartial](#schemapaymentgatewayspartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="paymentgatewayscontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|PaymentGateways PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## PaymentGatewaysController.find

<a id="opIdPaymentGatewaysController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/payment-gateways',
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

fetch('/payment-gateways',
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

`GET /payment-gateways`

| Permissions |
| ------- |
| ViewGateway   |
| 12   |

<h3 id="paymentgatewayscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[paymentgateways.Filter1](#schemapaymentgateways.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "gatewayType": "string",
    "enabled": true
  }
]
```

<h3 id="paymentgatewayscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of PaymentGateways model instances|Inline|

<h3 id="paymentgatewayscontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[PaymentGatewaysWithRelations](#schemapaymentgatewayswithrelations)]|false|none|[(tsType: PaymentGatewaysWithRelations, schemaOptions: { includeRelations: true })]|
|» PaymentGatewaysWithRelations|[PaymentGatewaysWithRelations](#schemapaymentgatewayswithrelations)|false|none|(tsType: PaymentGatewaysWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|true|none|none|
|»» name|string|true|none|none|
|»» gatewayType|string|true|none|none|
|»» enabled|boolean|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-payment-service-pingcontroller">PingController</h1>

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

<h1 id="-sourceloop-payment-service-transactionscontroller">TransactionsController</h1>

## TransactionsController.orderandtransactionscreate

<a id="opIdTransactionsController.orderandtransactionscreate"></a>

> Code samples

```javascript
const inputBody = '{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/html'
};

fetch('/place-order-and-pay',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'text/html'
};

fetch('/place-order-and-pay',
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

`POST /place-order-and-pay`

| Permissions |
| ------- |
| CreateOrder   |
| 6   |

> Body parameter

```json
{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}
```

<h3 id="transactionscontroller.orderandtransactionscreate-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewOrder](#schemaneworder)|false|none|

> Example responses

<h3 id="transactionscontroller.orderandtransactionscreate-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Order model instance|None|

<h3 id="transactionscontroller.orderandtransactionscreate-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.transactionscharge

<a id="opIdTransactionsController.transactionscharge"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/transactions/charge',
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
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json'
};

fetch('/transactions/charge',
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

`POST /transactions/charge`

| Permissions |
| ------- |
| CreateTransaction   |
| 18   |

> Body parameter

```yaml
{}

```

<h3 id="transactionscontroller.transactionscharge-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

<h3 id="transactionscontroller.transactionscharge-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Transacttion Gateway Request|None|

<h3 id="transactionscontroller.transactionscharge-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.count

<a id="opIdTransactionsController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/transactions/count',
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

fetch('/transactions/count',
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

`GET /transactions/count`

| Permissions |
| ------- |
| ViewTransaction   |
| 19   |

<h3 id="transactionscontroller.count-parameters">Parameters</h3>

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

<h3 id="transactionscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Transactions model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.transactionsPay

<a id="opIdTransactionsController.transactionsPay"></a>

> Code samples

```javascript

const headers = {
  'Accept':'text/html'
};

fetch('/transactions/orderid/{id}',
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
  'Accept':'text/html'
};

fetch('/transactions/orderid/{id}',
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

`GET /transactions/orderid/{id}`

| Permissions |
| ------- |
| CreateOrder   |
| 6   |

<h3 id="transactionscontroller.transactionspay-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```
{}
```

<h3 id="transactionscontroller.transactionspay-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|HTML response for payment gateway interface.|Inline|

<h3 id="transactionscontroller.transactionspay-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.transactionsRefundParse

<a id="opIdTransactionsController.transactionsRefundParse"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/transactions/refund/parse/{id}',
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

fetch('/transactions/refund/parse/{id}',
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

`GET /transactions/refund/parse/{id}`

| Permissions |
| ------- |
| CreateRefund   |
| CreateRefundNum   |

<h3 id="transactionscontroller.transactionsrefundparse-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

<h3 id="transactionscontroller.transactionsrefundparse-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Refund Object from payment gateway|None|

<h3 id="transactionscontroller.transactionsrefundparse-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.transactionsRefund

<a id="opIdTransactionsController.transactionsRefund"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/transactions/refund/{id}',
{
  method: 'POST',

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

fetch('/transactions/refund/{id}',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /transactions/refund/{id}`

| Permissions |
| ------- |
| CreateRefund   |
| CreateRefundNum   |

<h3 id="transactionscontroller.transactionsrefund-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

<h3 id="transactionscontroller.transactionsrefund-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Refund Object from payment gateway|None|

<h3 id="transactionscontroller.transactionsrefund-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.subscriptionWebHook

<a id="opIdTransactionsController.subscriptionWebHook"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/transactions/webhook',
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

fetch('/transactions/webhook',
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

`POST /transactions/webhook`

> Body parameter

```json
{}
```

<h3 id="transactionscontroller.subscriptionwebhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|false|none|

> Example responses

<h3 id="transactionscontroller.subscriptionwebhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscription Gateway Request|None|

<h3 id="transactionscontroller.subscriptionwebhook-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## TransactionsController.replaceById

<a id="opIdTransactionsController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/transactions/{id}',
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
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/transactions/{id}',
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

`PUT /transactions/{id}`

| Permissions |
| ------- |
| UpdateTransaction   |
| 20   |

> Body parameter

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}
```

<h3 id="transactionscontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Transactions](#schematransactions)|false|none|

<h3 id="transactionscontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Transactions PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.updateById

<a id="opIdTransactionsController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/transactions/{id}',
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
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/transactions/{id}',
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

`PATCH /transactions/{id}`

| Permissions |
| ------- |
| UpdateTransaction   |
| 20   |

> Body parameter

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}
```

<h3 id="transactionscontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TransactionsPartial](#schematransactionspartial)|false|none|

<h3 id="transactionscontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Transactions PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.findById

<a id="opIdTransactionsController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/transactions/{id}',
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

fetch('/transactions/{id}',
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

`GET /transactions/{id}`

| Permissions |
| ------- |
| ViewTransaction   |
| 19   |

<h3 id="transactionscontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[transactions.Filter](#schematransactions.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}
```

<h3 id="transactionscontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Transactions model instance|[TransactionsWithRelations](#schematransactionswithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.deleteById

<a id="opIdTransactionsController.deleteById"></a>

> Code samples

```javascript

fetch('/transactions/{id}',
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

fetch('/transactions/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /transactions/{id}`

| Permissions |
| ------- |
| DeleteTransaction   |
| 21   |

<h3 id="transactionscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="transactionscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Transactions DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.create

<a id="opIdTransactionsController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/transactions',
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
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/transactions',
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

`POST /transactions`

| Permissions |
| ------- |
| CreateTransaction   |
| 18   |

> Body parameter

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}
```

<h3 id="transactionscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTransactions](#schemanewtransactions)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}
```

<h3 id="transactionscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Transactions model instance|[Transactions](#schematransactions)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.updateAll

<a id="opIdTransactionsController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/transactions',
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
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/transactions',
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

`PATCH /transactions`

| Permissions |
| ------- |
| UpdateTransaction   |
| 20   |

> Body parameter

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}
```

<h3 id="transactionscontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TransactionsPartial](#schematransactionspartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="transactionscontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Transactions PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TransactionsController.find

<a id="opIdTransactionsController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/transactions',
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

fetch('/transactions',
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

`GET /transactions`

| Permissions |
| ------- |
| ViewTransaction   |
| 19   |

<h3 id="transactionscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[transactions.Filter1](#schematransactions.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "amountPaid": 0,
    "currency": "string",
    "status": "string",
    "paidDate": "2019-08-24T14:15:22Z",
    "paymentGatewayId": "string",
    "orderId": "string",
    "res": {}
  }
]
```

<h3 id="transactionscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Transactions model instances|Inline|

<h3 id="transactionscontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TransactionsWithRelations](#schematransactionswithrelations)]|false|none|[(tsType: TransactionsWithRelations, schemaOptions: { includeRelations: true })]|
|» TransactionsWithRelations|[TransactionsWithRelations](#schematransactionswithrelations)|false|none|(tsType: TransactionsWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|true|none|none|
|»» amountPaid|number|true|none|none|
|»» currency|string|true|none|none|
|»» status|string|true|none|none|
|»» paidDate|string(date-time)|false|none|none|
|»» paymentGatewayId|string|false|none|none|
|»» orderId|string|false|none|none|
|»» res|object|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-payment-service-subscriptionscontroller">SubscriptionsController</h1>

## SubscriptionsController.count

<a id="opIdSubscriptionsController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/subscriptions/count',
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

fetch('/subscriptions/count',
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

`GET /subscriptions/count`

| Permissions |
| ------- |
| GetSubscriptionCount   |
| 1   |

<h3 id="subscriptionscontroller.count-parameters">Parameters</h3>

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

<h3 id="subscriptionscontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscriptions model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionsController.replaceById

<a id="opIdSubscriptionsController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/subscriptions/{id}',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/subscriptions/{id}',
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

`PUT /subscriptions/{id}`

| Permissions |
| ------- |
| UpdateSubscriptions   |
| 4   |

> Body parameter

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}
```

<h3 id="subscriptionscontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Subscriptions](#schemasubscriptions)|false|none|

<h3 id="subscriptionscontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Subscriptions PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionsController.updateById

<a id="opIdSubscriptionsController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/subscriptions/{id}',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/subscriptions/{id}',
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

`PATCH /subscriptions/{id}`

| Permissions |
| ------- |
| UpdateSubscriptions   |
| 4   |

> Body parameter

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}
```

<h3 id="subscriptionscontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[SubscriptionsPartial](#schemasubscriptionspartial)|false|none|

<h3 id="subscriptionscontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Subscriptions PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionsController.findById

<a id="opIdSubscriptionsController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/subscriptions/{id}',
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

fetch('/subscriptions/{id}',
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

`GET /subscriptions/{id}`

| Permissions |
| ------- |
| GetSubscriptions   |
| 3   |

<h3 id="subscriptionscontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[subscriptions.Filter](#schemasubscriptions.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}
```

<h3 id="subscriptionscontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscriptions model instance|[SubscriptionsWithRelations](#schemasubscriptionswithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionsController.deleteById

<a id="opIdSubscriptionsController.deleteById"></a>

> Code samples

```javascript

fetch('/subscriptions/{id}',
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

fetch('/subscriptions/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /subscriptions/{id}`

| Permissions |
| ------- |
| DeleteSubscriptions   |
| 5   |

<h3 id="subscriptionscontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="subscriptionscontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Subscriptions DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionsController.create

<a id="opIdSubscriptionsController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/subscriptions',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/subscriptions',
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

`POST /subscriptions`

| Permissions |
| ------- |
| CreateSubscription   |
| 2   |

> Body parameter

```json
{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}
```

<h3 id="subscriptionscontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewSubscriptions](#schemanewsubscriptions)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}
```

<h3 id="subscriptionscontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscriptions model instance|[Subscriptions](#schemasubscriptions)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionsController.updateAll

<a id="opIdSubscriptionsController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/subscriptions',
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
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/subscriptions',
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

`PATCH /subscriptions`

| Permissions |
| ------- |
| UpdateSubscriptions   |
| 4   |

> Body parameter

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}
```

<h3 id="subscriptionscontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[SubscriptionsPartial](#schemasubscriptionspartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="subscriptionscontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Subscriptions PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## SubscriptionsController.find

<a id="opIdSubscriptionsController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/subscriptions',
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

fetch('/subscriptions',
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

`GET /subscriptions`

| Permissions |
| ------- |
| GetSubscriptions   |
| 3   |

<h3 id="subscriptionscontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[subscriptions.Filter1](#schemasubscriptions.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "totalAmount": 0,
    "currency": "string",
    "status": "string",
    "paymentGatewayId": "string",
    "paymentMethod": "string",
    "metaData": {},
    "startDate": "2019-08-24T14:15:22Z",
    "endDate": "2019-08-24T14:15:22Z",
    "gatewaySubscriptionId": "string",
    "planId": "string"
  }
]
```

<h3 id="subscriptionscontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Subscriptions model instances|Inline|

<h3 id="subscriptionscontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[SubscriptionsWithRelations](#schemasubscriptionswithrelations)]|false|none|[(tsType: SubscriptionsWithRelations, schemaOptions: { includeRelations: true })]|
|» SubscriptionsWithRelations|[SubscriptionsWithRelations](#schemasubscriptionswithrelations)|false|none|(tsType: SubscriptionsWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|true|none|none|
|»» totalAmount|number|true|none|none|
|»» currency|string|false|none|none|
|»» status|string|true|none|none|
|»» paymentGatewayId|string|false|none|none|
|»» paymentMethod|string|false|none|none|
|»» metaData|object|false|none|none|
|»» startDate|string(date-time)|false|none|none|
|»» endDate|string(date-time)|false|none|none|
|»» gatewaySubscriptionId|string|false|none|none|
|»» planId|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-payment-service-templatescontroller">TemplatesController</h1>

## TemplatesController.count

<a id="opIdTemplatesController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/templates/count',
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

fetch('/templates/count',
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

`GET /templates/count`

| Permissions |
| ------- |
| ViewTemplate   |
| 16   |

<h3 id="templatescontroller.count-parameters">Parameters</h3>

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

<h3 id="templatescontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Templates model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TemplatesController.replaceById

<a id="opIdTemplatesController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/templates/{id}',
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
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/templates/{id}',
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

`PUT /templates/{id}`

| Permissions |
| ------- |
| UpdateTemplate   |
| 15   |

> Body parameter

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}
```

<h3 id="templatescontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Templates](#schematemplates)|false|none|

<h3 id="templatescontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Templates PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TemplatesController.updateById

<a id="opIdTemplatesController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/templates/{id}',
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
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
};
const headers = {
  'Content-Type':'application/json'
};

fetch('/templates/{id}',
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

`PATCH /templates/{id}`

| Permissions |
| ------- |
| UpdateTemplate   |
| 15   |

> Body parameter

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}
```

<h3 id="templatescontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TemplatesPartial](#schematemplatespartial)|false|none|

<h3 id="templatescontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Templates PATCH success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TemplatesController.findById

<a id="opIdTemplatesController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/templates/{id}',
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

fetch('/templates/{id}',
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

`GET /templates/{id}`

| Permissions |
| ------- |
| ViewTemplate   |
| 16   |

<h3 id="templatescontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[templates.Filter](#schematemplates.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}
```

<h3 id="templatescontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Templates model instance|[TemplatesWithRelations](#schematemplateswithrelations)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TemplatesController.deleteById

<a id="opIdTemplatesController.deleteById"></a>

> Code samples

```javascript

fetch('/templates/{id}',
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

fetch('/templates/{id}',
{
  method: 'DELETE'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /templates/{id}`

| Permissions |
| ------- |
| DeleteTemplate   |
| 17   |

<h3 id="templatescontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="templatescontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Templates DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TemplatesController.create

<a id="opIdTemplatesController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/templates',
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
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/templates',
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

`POST /templates`

| Permissions |
| ------- |
| CreateTemplate   |
| 14   |

> Body parameter

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}
```

<h3 id="templatescontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTemplates](#schemanewtemplates)|false|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}
```

<h3 id="templatescontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Templates model instance|[Templates](#schematemplates)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TemplatesController.updateAll

<a id="opIdTemplatesController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/templates',
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
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/templates',
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

`PATCH /templates`

| Permissions |
| ------- |
| UpdateTemplate   |
| 15   |

> Body parameter

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}
```

<h3 id="templatescontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TemplatesPartial](#schematemplatespartial)|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="templatescontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Templates PATCH success count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

## TemplatesController.find

<a id="opIdTemplatesController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/templates',
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

fetch('/templates',
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

`GET /templates`

| Permissions |
| ------- |
| ViewTemplate   |
| 16   |

<h3 id="templatescontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[templates.Filter1](#schematemplates.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "paymentGatewayId": "string",
    "name": "string",
    "template": "string",
    "type": "string"
  }
]
```

<h3 id="templatescontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Templates model instances|Inline|

<h3 id="templatescontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TemplatesWithRelations](#schematemplateswithrelations)]|false|none|[(tsType: TemplatesWithRelations, schemaOptions: { includeRelations: true })]|
|» TemplatesWithRelations|[TemplatesWithRelations](#schematemplateswithrelations)|false|none|(tsType: TemplatesWithRelations, schemaOptions: { includeRelations: true })|
|»» id|string|true|none|none|
|»» paymentGatewayId|string|true|none|none|
|»» name|string|true|none|none|
|»» template|string|true|none|none|
|»» type|string|true|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

<h1 id="-sourceloop-payment-service-transactionsubscriptionscontroller">TransactionSubscriptionsController</h1>

## TransactionSubscriptionsController.subscriptionTransactionsPay

<a id="opIdTransactionSubscriptionsController.subscriptionTransactionsPay"></a>

> Code samples

```javascript

const headers = {
  'Accept':'text/html'
};

fetch('/transactions/subscription/{id}',
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
  'Accept':'text/html'
};

fetch('/transactions/subscription/{id}',
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

`GET /transactions/subscription/{id}`

| Permissions |
| ------- |
| UpdateSubscriptions   |
| 4   |

<h3 id="transactionsubscriptionscontroller.subscriptiontransactionspay-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 302 Response

```
{}
```

<h3 id="transactionsubscriptionscontroller.subscriptiontransactionspay-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|302|[Found](https://tools.ietf.org/html/rfc7231#section-6.4.3)|Array of Transactions model instances|Inline|

<h3 id="transactionsubscriptionscontroller.subscriptiontransactionspay-responseschema">Response Schema</h3>

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
None
</aside>

# Schemas

<h2 id="tocS_Orders">Orders</h2>
<!-- backwards compatibility -->
<a id="schemaorders"></a>
<a id="schema_Orders"></a>
<a id="tocSorders"></a>
<a id="tocsorders"></a>

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}

```

Orders

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|totalAmount|number|true|none|none|
|currency|string|true|none|none|
|status|string|true|none|none|
|paymentGatewayId|string|true|none|none|
|paymentmethod|string|false|none|none|
|metaData|object|false|none|none|

<h2 id="tocS_NewOrders">NewOrders</h2>
<!-- backwards compatibility -->
<a id="schemaneworders"></a>
<a id="schema_NewOrders"></a>
<a id="tocSneworders"></a>
<a id="tocsneworders"></a>

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}

```

NewOrders

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|totalAmount|number|true|none|none|
|currency|string|true|none|none|
|status|string|true|none|none|
|paymentGatewayId|string|true|none|none|
|paymentmethod|string|false|none|none|
|metaData|object|false|none|none|

<h2 id="tocS_OrdersWithRelations">OrdersWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaorderswithrelations"></a>
<a id="schema_OrdersWithRelations"></a>
<a id="tocSorderswithrelations"></a>
<a id="tocsorderswithrelations"></a>

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}

```

OrdersWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|totalAmount|number|true|none|none|
|currency|string|true|none|none|
|status|string|true|none|none|
|paymentGatewayId|string|true|none|none|
|paymentmethod|string|false|none|none|
|metaData|object|false|none|none|

<h2 id="tocS_OrdersPartial">OrdersPartial</h2>
<!-- backwards compatibility -->
<a id="schemaorderspartial"></a>
<a id="schema_OrdersPartial"></a>
<a id="tocSorderspartial"></a>
<a id="tocsorderspartial"></a>

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}

```

OrdersPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|totalAmount|number|false|none|none|
|currency|string|false|none|none|
|status|string|false|none|none|
|paymentGatewayId|string|false|none|none|
|paymentmethod|string|false|none|none|
|metaData|object|false|none|none|

<h2 id="tocS_Transactions">Transactions</h2>
<!-- backwards compatibility -->
<a id="schematransactions"></a>
<a id="schema_Transactions"></a>
<a id="tocStransactions"></a>
<a id="tocstransactions"></a>

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}

```

Transactions

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|amountPaid|number|true|none|none|
|currency|string|true|none|none|
|status|string|true|none|none|
|paidDate|string(date-time)|false|none|none|
|paymentGatewayId|string|false|none|none|
|orderId|string|false|none|none|
|res|object|false|none|none|

<h2 id="tocS_NewTransactions">NewTransactions</h2>
<!-- backwards compatibility -->
<a id="schemanewtransactions"></a>
<a id="schema_NewTransactions"></a>
<a id="tocSnewtransactions"></a>
<a id="tocsnewtransactions"></a>

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}

```

NewTransactions

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|amountPaid|number|true|none|none|
|currency|string|true|none|none|
|status|string|true|none|none|
|paidDate|string(date-time)|false|none|none|
|paymentGatewayId|string|false|none|none|
|orderId|string|false|none|none|
|res|object|false|none|none|

<h2 id="tocS_TransactionsWithRelations">TransactionsWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematransactionswithrelations"></a>
<a id="schema_TransactionsWithRelations"></a>
<a id="tocStransactionswithrelations"></a>
<a id="tocstransactionswithrelations"></a>

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}

```

TransactionsWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|amountPaid|number|true|none|none|
|currency|string|true|none|none|
|status|string|true|none|none|
|paidDate|string(date-time)|false|none|none|
|paymentGatewayId|string|false|none|none|
|orderId|string|false|none|none|
|res|object|false|none|none|

<h2 id="tocS_TransactionsPartial">TransactionsPartial</h2>
<!-- backwards compatibility -->
<a id="schematransactionspartial"></a>
<a id="schema_TransactionsPartial"></a>
<a id="tocStransactionspartial"></a>
<a id="tocstransactionspartial"></a>

```json
{
  "id": "string",
  "amountPaid": 0,
  "currency": "string",
  "status": "string",
  "paidDate": "2019-08-24T14:15:22Z",
  "paymentGatewayId": "string",
  "orderId": "string",
  "res": {}
}

```

TransactionsPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|amountPaid|number|false|none|none|
|currency|string|false|none|none|
|status|string|false|none|none|
|paidDate|string(date-time)|false|none|none|
|paymentGatewayId|string|false|none|none|
|orderId|string|false|none|none|
|res|object|false|none|none|

<h2 id="tocS_NewOrder">NewOrder</h2>
<!-- backwards compatibility -->
<a id="schemaneworder"></a>
<a id="schema_NewOrder"></a>
<a id="tocSneworder"></a>
<a id="tocsneworder"></a>

```json
{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentmethod": "string",
  "metaData": {}
}

```

NewOrder

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|totalAmount|number|true|none|none|
|currency|string|true|none|none|
|status|string|true|none|none|
|paymentGatewayId|string|true|none|none|
|paymentmethod|string|false|none|none|
|metaData|object|false|none|none|

<h2 id="tocS_PaymentGateways">PaymentGateways</h2>
<!-- backwards compatibility -->
<a id="schemapaymentgateways"></a>
<a id="schema_PaymentGateways"></a>
<a id="tocSpaymentgateways"></a>
<a id="tocspaymentgateways"></a>

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}

```

PaymentGateways

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|name|string|true|none|none|
|gatewayType|string|true|none|none|
|enabled|boolean|true|none|none|

<h2 id="tocS_NewPaymentGateways">NewPaymentGateways</h2>
<!-- backwards compatibility -->
<a id="schemanewpaymentgateways"></a>
<a id="schema_NewPaymentGateways"></a>
<a id="tocSnewpaymentgateways"></a>
<a id="tocsnewpaymentgateways"></a>

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}

```

NewPaymentGateways

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|name|string|true|none|none|
|gatewayType|string|true|none|none|
|enabled|boolean|true|none|none|

<h2 id="tocS_PaymentGatewaysWithRelations">PaymentGatewaysWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemapaymentgatewayswithrelations"></a>
<a id="schema_PaymentGatewaysWithRelations"></a>
<a id="tocSpaymentgatewayswithrelations"></a>
<a id="tocspaymentgatewayswithrelations"></a>

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}

```

PaymentGatewaysWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|name|string|true|none|none|
|gatewayType|string|true|none|none|
|enabled|boolean|true|none|none|

<h2 id="tocS_PaymentGatewaysPartial">PaymentGatewaysPartial</h2>
<!-- backwards compatibility -->
<a id="schemapaymentgatewayspartial"></a>
<a id="schema_PaymentGatewaysPartial"></a>
<a id="tocSpaymentgatewayspartial"></a>
<a id="tocspaymentgatewayspartial"></a>

```json
{
  "id": "string",
  "name": "string",
  "gatewayType": "string",
  "enabled": true
}

```

PaymentGatewaysPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|name|string|false|none|none|
|gatewayType|string|false|none|none|
|enabled|boolean|false|none|none|

<h2 id="tocS_Templates">Templates</h2>
<!-- backwards compatibility -->
<a id="schematemplates"></a>
<a id="schema_Templates"></a>
<a id="tocStemplates"></a>
<a id="tocstemplates"></a>

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}

```

Templates

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|paymentGatewayId|string|true|none|none|
|name|string|true|none|none|
|template|string|true|none|none|
|type|string|true|none|none|

<h2 id="tocS_NewTemplates">NewTemplates</h2>
<!-- backwards compatibility -->
<a id="schemanewtemplates"></a>
<a id="schema_NewTemplates"></a>
<a id="tocSnewtemplates"></a>
<a id="tocsnewtemplates"></a>

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}

```

NewTemplates

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|paymentGatewayId|string|true|none|none|
|name|string|true|none|none|
|template|string|true|none|none|
|type|string|true|none|none|

<h2 id="tocS_TemplatesWithRelations">TemplatesWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematemplateswithrelations"></a>
<a id="schema_TemplatesWithRelations"></a>
<a id="tocStemplateswithrelations"></a>
<a id="tocstemplateswithrelations"></a>

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}

```

TemplatesWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|paymentGatewayId|string|true|none|none|
|name|string|true|none|none|
|template|string|true|none|none|
|type|string|true|none|none|

<h2 id="tocS_TemplatesPartial">TemplatesPartial</h2>
<!-- backwards compatibility -->
<a id="schematemplatespartial"></a>
<a id="schema_TemplatesPartial"></a>
<a id="tocStemplatespartial"></a>
<a id="tocstemplatespartial"></a>

```json
{
  "id": "string",
  "paymentGatewayId": "string",
  "name": "string",
  "template": "string",
  "type": "string"
}

```

TemplatesPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|paymentGatewayId|string|false|none|none|
|name|string|false|none|none|
|template|string|false|none|none|
|type|string|false|none|none|

<h2 id="tocS_Subscriptions">Subscriptions</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptions"></a>
<a id="schema_Subscriptions"></a>
<a id="tocSsubscriptions"></a>
<a id="tocssubscriptions"></a>

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}

```

Subscriptions

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|totalAmount|number|true|none|none|
|currency|string|false|none|none|
|status|string|true|none|none|
|paymentGatewayId|string|false|none|none|
|paymentMethod|string|false|none|none|
|metaData|object|false|none|none|
|startDate|string(date-time)|false|none|none|
|endDate|string(date-time)|false|none|none|
|gatewaySubscriptionId|string|false|none|none|
|planId|string|false|none|none|

<h2 id="tocS_NewSubscriptions">NewSubscriptions</h2>
<!-- backwards compatibility -->
<a id="schemanewsubscriptions"></a>
<a id="schema_NewSubscriptions"></a>
<a id="tocSnewsubscriptions"></a>
<a id="tocsnewsubscriptions"></a>

```json
{
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}

```

NewSubscriptions

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|totalAmount|number|true|none|none|
|currency|string|false|none|none|
|status|string|true|none|none|
|paymentGatewayId|string|false|none|none|
|paymentMethod|string|false|none|none|
|metaData|object|false|none|none|
|startDate|string(date-time)|false|none|none|
|endDate|string(date-time)|false|none|none|
|gatewaySubscriptionId|string|false|none|none|
|planId|string|false|none|none|

<h2 id="tocS_SubscriptionsWithRelations">SubscriptionsWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptionswithrelations"></a>
<a id="schema_SubscriptionsWithRelations"></a>
<a id="tocSsubscriptionswithrelations"></a>
<a id="tocssubscriptionswithrelations"></a>

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}

```

SubscriptionsWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|totalAmount|number|true|none|none|
|currency|string|false|none|none|
|status|string|true|none|none|
|paymentGatewayId|string|false|none|none|
|paymentMethod|string|false|none|none|
|metaData|object|false|none|none|
|startDate|string(date-time)|false|none|none|
|endDate|string(date-time)|false|none|none|
|gatewaySubscriptionId|string|false|none|none|
|planId|string|false|none|none|

<h2 id="tocS_SubscriptionsPartial">SubscriptionsPartial</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptionspartial"></a>
<a id="schema_SubscriptionsPartial"></a>
<a id="tocSsubscriptionspartial"></a>
<a id="tocssubscriptionspartial"></a>

```json
{
  "id": "string",
  "totalAmount": 0,
  "currency": "string",
  "status": "string",
  "paymentGatewayId": "string",
  "paymentMethod": "string",
  "metaData": {},
  "startDate": "2019-08-24T14:15:22Z",
  "endDate": "2019-08-24T14:15:22Z",
  "gatewaySubscriptionId": "string",
  "planId": "string"
}

```

SubscriptionsPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|false|none|none|
|totalAmount|number|false|none|none|
|currency|string|false|none|none|
|status|string|false|none|none|
|paymentGatewayId|string|false|none|none|
|paymentMethod|string|false|none|none|
|metaData|object|false|none|none|
|startDate|string(date-time)|false|none|none|
|endDate|string(date-time)|false|none|none|
|gatewaySubscriptionId|string|false|none|none|
|planId|string|false|none|none|

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

<h2 id="tocS_orders.Filter">orders.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaorders.filter"></a>
<a id="schema_orders.Filter"></a>
<a id="tocSorders.filter"></a>
<a id="tocsorders.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "totalAmount": true,
    "currency": true,
    "status": true,
    "paymentGatewayId": true,
    "paymentmethod": true,
    "metaData": true
  }
}

```

orders.Filter

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
|»» id|boolean|false|none|none|
|»» totalAmount|boolean|false|none|none|
|»» currency|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» paymentGatewayId|boolean|false|none|none|
|»» paymentmethod|boolean|false|none|none|
|»» metaData|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_orders.Filter1">orders.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemaorders.filter1"></a>
<a id="schema_orders.Filter1"></a>
<a id="tocSorders.filter1"></a>
<a id="tocsorders.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "totalAmount": true,
    "currency": true,
    "status": true,
    "paymentGatewayId": true,
    "paymentmethod": true,
    "metaData": true
  }
}

```

orders.Filter

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
|»» totalAmount|boolean|false|none|none|
|»» currency|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» paymentGatewayId|boolean|false|none|none|
|»» paymentmethod|boolean|false|none|none|
|»» metaData|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_paymentgateways.Filter">paymentgateways.Filter</h2>
<!-- backwards compatibility -->
<a id="schemapaymentgateways.filter"></a>
<a id="schema_paymentgateways.Filter"></a>
<a id="tocSpaymentgateways.filter"></a>
<a id="tocspaymentgateways.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "name": true,
    "gatewayType": true,
    "enabled": true
  }
}

```

paymentgateways.Filter

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
|»» id|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» gatewayType|boolean|false|none|none|
|»» enabled|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_paymentgateways.Filter1">paymentgateways.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemapaymentgateways.filter1"></a>
<a id="schema_paymentgateways.Filter1"></a>
<a id="tocSpaymentgateways.filter1"></a>
<a id="tocspaymentgateways.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "name": true,
    "gatewayType": true,
    "enabled": true
  }
}

```

paymentgateways.Filter

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
|»» name|boolean|false|none|none|
|»» gatewayType|boolean|false|none|none|
|»» enabled|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

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

<h2 id="tocS_subscriptions.Filter">subscriptions.Filter</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptions.filter"></a>
<a id="schema_subscriptions.Filter"></a>
<a id="tocSsubscriptions.filter"></a>
<a id="tocssubscriptions.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "totalAmount": true,
    "currency": true,
    "status": true,
    "paymentGatewayId": true,
    "paymentMethod": true,
    "metaData": true,
    "startDate": true,
    "endDate": true,
    "gatewaySubscriptionId": true,
    "planId": true
  }
}

```

subscriptions.Filter

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
|»» id|boolean|false|none|none|
|»» totalAmount|boolean|false|none|none|
|»» currency|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» paymentGatewayId|boolean|false|none|none|
|»» paymentMethod|boolean|false|none|none|
|»» metaData|boolean|false|none|none|
|»» startDate|boolean|false|none|none|
|»» endDate|boolean|false|none|none|
|»» gatewaySubscriptionId|boolean|false|none|none|
|»» planId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_subscriptions.Filter1">subscriptions.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptions.filter1"></a>
<a id="schema_subscriptions.Filter1"></a>
<a id="tocSsubscriptions.filter1"></a>
<a id="tocssubscriptions.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "totalAmount": true,
    "currency": true,
    "status": true,
    "paymentGatewayId": true,
    "paymentMethod": true,
    "metaData": true,
    "startDate": true,
    "endDate": true,
    "gatewaySubscriptionId": true,
    "planId": true
  }
}

```

subscriptions.Filter

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
|»» totalAmount|boolean|false|none|none|
|»» currency|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» paymentGatewayId|boolean|false|none|none|
|»» paymentMethod|boolean|false|none|none|
|»» metaData|boolean|false|none|none|
|»» startDate|boolean|false|none|none|
|»» endDate|boolean|false|none|none|
|»» gatewaySubscriptionId|boolean|false|none|none|
|»» planId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_templates.Filter">templates.Filter</h2>
<!-- backwards compatibility -->
<a id="schematemplates.filter"></a>
<a id="schema_templates.Filter"></a>
<a id="tocStemplates.filter"></a>
<a id="tocstemplates.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "paymentGatewayId": true,
    "name": true,
    "template": true,
    "type": true
  }
}

```

templates.Filter

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
|»» id|boolean|false|none|none|
|»» paymentGatewayId|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» template|boolean|false|none|none|
|»» type|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_templates.Filter1">templates.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematemplates.filter1"></a>
<a id="schema_templates.Filter1"></a>
<a id="tocStemplates.filter1"></a>
<a id="tocstemplates.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "paymentGatewayId": true,
    "name": true,
    "template": true,
    "type": true
  }
}

```

templates.Filter

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
|»» paymentGatewayId|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» template|boolean|false|none|none|
|»» type|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_transactions.Filter">transactions.Filter</h2>
<!-- backwards compatibility -->
<a id="schematransactions.filter"></a>
<a id="schema_transactions.Filter"></a>
<a id="tocStransactions.filter"></a>
<a id="tocstransactions.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "id": true,
    "amountPaid": true,
    "currency": true,
    "status": true,
    "paidDate": true,
    "paymentGatewayId": true,
    "orderId": true,
    "res": true
  }
}

```

transactions.Filter

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
|»» id|boolean|false|none|none|
|»» amountPaid|boolean|false|none|none|
|»» currency|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» paidDate|boolean|false|none|none|
|»» paymentGatewayId|boolean|false|none|none|
|»» orderId|boolean|false|none|none|
|»» res|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

<h2 id="tocS_transactions.Filter1">transactions.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematransactions.filter1"></a>
<a id="schema_transactions.Filter1"></a>
<a id="tocStransactions.filter1"></a>
<a id="tocstransactions.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "id": true,
    "amountPaid": true,
    "currency": true,
    "status": true,
    "paidDate": true,
    "paymentGatewayId": true,
    "orderId": true,
    "res": true
  }
}

```

transactions.Filter

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
|»» amountPaid|boolean|false|none|none|
|»» currency|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» paidDate|boolean|false|none|none|
|»» paymentGatewayId|boolean|false|none|none|
|»» orderId|boolean|false|none|none|
|»» res|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

