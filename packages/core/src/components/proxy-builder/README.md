# ProxyBuilder Component

## Overview

A Loopback Component that makes it easier to connect to other REST based services by automatically building and binding datasources and services using [loopback-connector-rest](https://github.com/loopbackio/loopback-connector-rest). The proxy service generated has the following structure by default -

```ts
export type ModifiedRestService<T extends Entity> = {
  create: (data: DataObject<T>, token?: string) => Promise<T>;
  findById: (
    id: string,
    filter?: FilterExcludingWhere<T>,
    token?: string,
  ) => Promise<T>;
  find: (
    filter?: Filter<T>,
    token?: string,
    inclusionConfig?: RestRelationConfig,
  ) => Promise<T[]>;
  count: (where?: Where<T>, token?: string) => Promise<Count>;
  updateById: (
    id: string,
    data: DataObject<T>,
    token?: string,
  ) => Promise<void>;
  replaceById: (
    id: string,
    data: DataObject<T>,
    token?: string,
  ) => Promise<void>;
  deleteById: (id: string, token?: string) => Promise<void>;
  update: (
    data: DataObject<T>,
    where?: Where<T>,
    token?: string,
  ) => Promise<Count>;
  delete: (where?: Where<T>, token?: string) => Promise<void>;
};
```

### Usage

- Create a new Loopback4 Application (If you don't have one already)
  ```sh
  lb4 testapp
  ```
- Install the sourceloop core using:
  ```sh
  npm i @sourceloop/core
  ```
- Bind a config to the `ProxyBuilderBindings.CONFIG` key -

```ts
this.bind(ProxyBuilderBindings.CONFIG).to([
  {
    baseUrl: `http://localhost:3000`,
    configs: [
      // Config with both Model class and other Configs
      {
        model: Parent,
        basePath: '/rest-parents',
        relations: [
          {
            name: 'children',
            serviceKey: `services.ChildProxy`,
          },
          {
            name: 'config',
            serviceKey: `services.ParentConfigProxy`,
          },
        ],
      },
      // Config with just Model Class
      ParentConfig,
    ],
  },
]);
```

- Bind the component -

```ts
this.component(ProxyBuilderComponent);
```

- Inject the rest service in your controller -

```ts
  constructor(
    @restService(Parent)
    public parentProxy: ModifiedRestService<Parent>,
  ) {}
```

- Start the application
  ```sh
  npm start`
  ```

### Configuration

- the configuration takes an Array of type `ProxyBuilderConfig` -

```ts
type ProxyBuilderConfig = Array<{
  configs: (EntityRestConfig | ModelConstructor<Entity>)[];
  baseUrl: string;
}>;
```

- `configs` property accepts an array of either -

  - `ModelConstructor<Entity>` - classes extending the Loopback `Entity` class that have the same name as the `basePath` of target rest API.
    for example -
    if you have an API with path `parents` then the model should defined as ->

  ```ts
  @model({
    name: 'parents',
  })
  export class Parent extends Entity {}
  ```

  if you gave an API with path like `rest-parents` but your model name is different, then one way to override the `basePath` would be -

  ```ts
  @model({
    name: 'parents',
    settings: {
      rest: {
        basePath: `/rest-parents`,
      },
    },
  })
  export class Parent extends Entity {}
  ```

  - `EntityRestConfig` - another way to use a custom `basePath` or other configurations in the generated proxy. It accepts the following configurations -
    - `model` - the entity class of REST api
    - `basePath`(optional) - base path of the REST endpoints, default value is picked from the model class according to rules mentioned in the 1st method.
    - `relations`(optional) - array of rest relation config following the type `RestRelationConfig`. Refer Refer [this](#rest-relations) for more information.
    - `restOperations`(optional) - array of rest templates for any custom end points following the interface - `RestOperationTemplate`. Refer [this](#custom-operations) for more information.

### Custom Operations

If you have an operation that is not provided by the default proxy service, you can provide your own rest template.They follow the same interface as the one used by [loopback-connector-rest](https://github.com/loopbackio/loopback-connector-rest) -

```ts
export type RestOperationTemplate = {
  template: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: {
      Authorization?: '{token}' | string;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'content-type'?: 'application/json' | string;
      [key: string]: string | undefined;
    };
    path?: AnyObject;
    query?: AnyObject;
    options?: AnyObject & {
      maxRedirects?: number;
    };
    body?: string | AnyObject;
    fullResponse?: boolean;
    responsePath?: string;
  };
  functions: {
    [key: string]: string[];
  };
};
```

You provide a template while defining your proxy -

```ts
  const config = {
    model: Parent,
    basePath: '/rest-parents',
    restOperations: [{
      template: {
        method: 'GET',
        path: '/custom',
      }
      function: {
        customFunction: ['token']
      }
    }]
  }
```

Then you would have to extend the `ModifiedRestService` type to include this method -

```ts
type MyRestService = {
  customFunction: (token: string): Promise<void>
} & ModifiedRestService<YourModel>;
```

And then simply use this type while injecting your service -

```ts
    @restService(YourModel)
    public customRestService: MyRestService,
```

### Rest Relations

The proxy services generated through this component has an ability to fetch related information from a separate microservice, similar to the concept of cross database relations supported through inclusion resolvers in Loopback4.

It currently supports the following types of relations -

- BelongsTo
- HasMany
- HasManyThrough
- HasOne

To use such relations, you define the relation in the model in exactly the same way you would defined a database relation, but while defining the proxy config, you would have to provide a config of type `RestRelationConfig` -

```ts
export type RestRelationConfig = {
  // name of the relation, it should be same as the one defined in the model
  name: string;
  // name of the through relation in case this is a hasManyThrough relation
  throughRelation?: string;
  // disable stringification of parameters if it is not required
  disableStringify?: boolean;
} & (RestRelationConfigWithClass | RestRelationConfigWithKey);

export type RestRelationConfigWithKey = {
  // binding key of the relation service that follows the `ModifiedRestService` interface
  serviceKey: string;
};
export type RestRelationConfigWithClass = {
  // service class that follows the interface `ModifiedRestService`
  serviceClass: Function;
};
export type RestRelationConfigWithModelClass = {
  // entity class that has a proxy service bound against it's name
  modelClass: ModelConstructor<Entity>;
};
```

for example -

```ts
[
  {
    name: 'parent',
    modelClass: Parent,
  },
  {
    name: 'siblings',
    serviceKey: 'services.ChildProxy',
    throughRelation: 'siblingRelations',
  },
];
```

NOTE: Rest relation use the query parameters to get related data hence using them in a bulk GET api may result in breach of the HTTP header limit in Node.js. So either avoid using rest relations in such cases, or use the [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) flag in Node.js
