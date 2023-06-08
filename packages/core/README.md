# @sourceloop/core

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/core)

![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/core)

![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/core/@loopback/core)

### Installation

```bash
npm install @sourceloop/core
```

## Overview

`@sourceloop/core` is the [application core](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) for the `sourceloop`. It contains

- adapters
- commands
- components
- constants
- decorators
- enums
- mixins
- models
- providers
- repositories
- sequence handlers
- utilities

that are used throughout the service catalog.

### Adapters

Adapters help objects with different interfaces collaborate. Here’s how it works:

- The adapter gets an interface, compatible with one of the existing objects.
- Using this interface, the existing object can safely call the adapter’s methods.
- Upon receiving a call, the adapter passes the request to the second object, but in a format
  and order of that the second object.It can act two-way adapter that can convert the calls in both directions.

```ts
export class AnyAdapter implements Adapter<any, any> {
  adaptToModel(resp: any): any {
    return resp;
  }
  adaptFromModel(data: any): any {
    return data;
  }
}

export interface Adapter<T, R> {
  adaptToModel(resp: R, ...rest: any[]): T;
  adaptFromModel(data: T, ...rest: any[]): R;
}
```

![Adapter](https://refactoring.guru/images/patterns/diagrams/adapter/solution-en.png?id=5f4f1b4575236a3853f274b690bd6656.jpg)

### Command

The interface contains parameters(optional) accepted by that command implementing this interface and an execute function.It's used to create different commands like save,update or delete that accepts some parameters and execute function using these parameters

```ts
export interface ICommand {
  parameters?: any;
  execute(): Promise<any>;
}

export class SaveCommand implements ICommand {
  public parameters: SaveStateParameters;
  execute(): Promise<any> {
    //This is intentional.
  }
}
```

### Component

Components serves like a vehicle to group extension contributions as context Bindings and various artifacts to allow easier extensibility in Application.
Sourceloop core provides three components i.e.bearer-verifier,logger-extension and swagger-authentication

### Bearer Verifier

## Usage

- In order to use this component in any service.Import the following:

```ts
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
} from '@sourceloop/core';
```

- Bind it in inbuilt setUpSequence() as follows along with providing the BearerVerifierComponent :

```ts
setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);
}
```

## Logger-Extension

### Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`.
- Configure `@sourceloop/core` component to include `LoggerExtensionComponent` -
  ```typescript
  this.bind(LOGGER.BINDINGS.LOG_ACTION.toProvider(
  LoggerProvider,
  );
  ```
- Start the application
  `npm start`

## Swagger Authentication Component

A Loopback Component that adds an authenticating middleware for Rest Explorer

### Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the sourceloop core using:
  `npm i @sourceloop/core`
- Configure `@sourceloop/core` component to include `SwaggerAuthenticateComponent` -
  ```typescript
  this.bind(SFCoreBindings.config).to({
    authenticateSwaggerUI: true,
    swaggerUsername: '<username>',
    swaggerPassword: '<password>',
  });
  ```
- Bind the `HttpAuthenticationVerifier` to override the basic authentication logic provided by [default](/providers/http-authentication.verifier.ts).
- Start the application
  `npm start`

### OBF

OBF is used for application programming interface (API) monitoring checks to see if API-connected resources are available, working properly and responding to calls ,detect and alert on errors, warnings, and failed API authentications to ensure secure data exchange etc.
For enabling this we need to provide its configuration as follows:

```typescript
// To check if monitoring is enabled from env or not
const enableObf = !!+(process.env.ENABLE_OBF ?? 0);
// To check if authorization is enabled for swagger stats or not
const authentication =
  process.env.SWAGGER_USER && process.env.SWAGGER_PASSWORD ? true : false;
this.bind(SFCoreBindings.config).to({
  enableObf,
  obfPath: process.env.OBF_PATH ?? '/obf',
  openapiSpec: openapi,
  authentication: authentication,
  swaggerUsername: process.env.SWAGGER_USER,
  swaggerPassword: process.env.SWAGGER_PASSWORD,
});
```

Open ApiSpecification:The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to RESTful APIs which allows us to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined,user can understand and interact with the remote service with a minimal amount of implementation logic.It is a self-contained or composite resource which defines or describes an API or elements of an API.

```typescript
constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    options.rest = options.rest ?? {};
    options.rest.basePath = process.env.BASE_PATH ?? '';
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    options.rest.openApiSpec = {
      endpointMapping: {
        [`${options.rest.basePath}/openapi.json`]: {
          version: '3.0.0',
          format: 'json',
        },
      },
    };

    super(options);
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Service Name',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
```

# Tenant Utilities

## Tenant Guard

Tenant Guard prevents cross db operations through a Loopback repository.

## Usage

Configure and load `TenantUtilitiesComponent` in the application constructor
as shown below.

```ts
import {TenantUtilitiesComponent} from '@sourceloop/core';
// ...
export class MyApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    this.component(TenantUtilitiesComponent);
    // ...
  }
  // ...
}
```

### With Mixin

Add the `TenantGuardMixin` mixin to a repository on which you want to prevent cross DB operations and provide and service type following the `ITenantGuard` with the name `tenantGuardService` -

```ts
export class TestModelRepository extends TenantGuardMixin(
  DefaultCrudRepository<
    TestModel,
    typeof TestModelRelations.prototype.id,
    TestModelRelations
  >,
) {
  tenantGuardService: ITenantGuard<TestModel, string | undefined>;
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(TestModel, dataSource);
  }
}
```

### With Decorator

Add the `tenantGuard()` decorator to your repository class -

```ts
import {tenantGuard} from '@sourceloop/core';
// ...
@tenantGuard()
export class TestWithoutGuardRepo extends DefaultTransactionalRepository<
  TestModel,
  string,
  {}
> {
  constructor(@inject('datasources.db') dataSource: juggler.DataSource) {
    super(TestModel, dataSource);
  }
}
```

### Service

#### With Mixin

The `TenantGuardMixin` uses a service of the type `ITenantGuard` to perform the modification of requests on a tenant, If you want to modify the modification logic, you can bind any service following this interface in your repo to a property with name `tenantGuardService`.

#### With Decorator

The decorator uses a binding on key `TenantUtilitiesBindings.GuardService` with the type `ITenantGuard`. It uses a default implementation provided in (`TenantGuardService`)[/src/components/tenant-utilities/services/tenant-guard.service.ts], to override this, implement a class from scratch or extending this class, and the binding that class to the `TenantUtilitiesBindings.GuardService` in your `application.ts`-

```ts
this.bind(TenantUtilitiesBindings.GuardService).toClass(TenantGuardService);
```

### Decorators

## Overview

Decorators provide annotations for class methods and arguments. Decorators use
the form `@decorator` where `decorator` is the name of the function that will be
called at runtime.

## Basic Usage

### txIdFromHeader

This simple decorator allows you to annotate a `Controller` method argument. The
decorator will annotate the method argument with the value of the header
`X-Transaction-Id` from the request.

**Example**

```ts
class MyController {
  @get('/')
  getHandler(@txIdFromHeader() txId: string) {
    return `Your transaction id is: ${txId}`;
  }
}
```

### Enums

Enums helps in defining a set of named constants. Using enums can make it easier to document intent, or create a set of distinct cases for both numeric and string-based enums.

For all the enums provided in here, see `packages/core/src/enums`.

### Mixins

You can find documentation for mixins. [here](/src/mixins)

### Models

A model describes business domain objects(shape of data) to be persisted in the database, for example, Customer, Address, and Order. It usually defines a list of properties with name, type, and other constraints.We use decorators `@model` and `@property` to annotate or modify the Class members and Class respectively which helps in manipulating the metadata or even integrate with JSON Schema generation.

```ts
export abstract class UserModifiableEntity extends BaseEntity {
  @property({
    type: 'string',
    name: 'created_by',
  })
  createdBy?: string;

  @property({
    type: 'string',
    name: 'modified_by',
  })
  modifiedBy?: string;
}
```

In order to use models provided, in your application:

- Extend your model class with name of model's class provided in sourceloop core i.e. **BaseEntity**(for example) replacing entity that will add two attributes to the model Class i.e. createdBy and modifiedBy of this model.

- Other models like SuccessResponse model will add attribute success,UpsertResponse model will add created,updated and failed attributes to the model class extending it.

For all models provided in here, see [here]`packages/core/src/models`.

### Providers

You can find documentation for the providers available .[here](/src/providers)

### Repositories

A Repository represents a specialized Service Interface that provides strong-typed data access (for example, CRUD) operations of a domain model against the underlying database or service
Repositories are adding behavior to Models. Models describe the shape of data, Repositories provide behavior like CRUD operations.

![Repository](https://loopback.io/pages/en/lb4/imgs/repository.png)

#### DefaultUserModifyCrudRepository

A repository Class which will provide CRUD operations for default user modifications adding modifiedby field along with it for the modified user.

Extend repositories with DefaultUserModifyCrudRepository Class replacing DefaultCrudRepository. For example,

```ts
export class UserRepository extends DefaultUserModifyCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly tenant: BelongsToAccessor<Tenant, typeof User.prototype.id>;

  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  public readonly userTenants: HasManyRepositoryFactory<
    UserTenant,
    typeof User.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @inject('models.User')
    private readonly user: typeof Entity & {prototype: User},
  )
```

![Connector](https://loopback.io/images/9830486.png)

#### SequelizeUserModifyCrudRepository

Similar to [DefaultUserModifyCrudRepository](#defaultusermodifycrudrepository) for projects using sequelize as the underlying ORM using [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) extension.

In order to use this follow the below import syntax:

```ts
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
```

and make sure you've [@loopback/sequelize](https://www.npmjs.com/package/@loopback/sequelize) installed.

### Sequence Handlers

Sourceloop Core has sequences that can be used in application providing casbin-secure sequence,secure-sequence and service sequence.

-**Casbin-secure sequence** :It uses [casbin library](https://casbin.org/docs/en/overview) to define permissions at level of entity or resource associated with an API call. Casbin authorisation implementation can be performed in two ways:

1. **Using default casbin policy document** - Define policy document in default casbin format in the app, and configure authorise decorator to use those policies.
2. **Defining custom logic to form dynamic policies** - Implement dynamic permissions based on app logic in casbin-enforcer-config provider. Authorisation extension will dynamically create casbin policy using this business logic to give the authorisation decisions.

## Usage

- Add both providers to implement casbin authorisation along with authorisation component as follows in application.ts

```ts
this.bind(AuthorizationBindings.CONFIG).to({
  allowAlwaysPaths: ['/explorer'],
});
this.component(AuthorizationComponent);

this.bind(AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER).toProvider(
  CasbinEnforcerConfigProvider,
);

this.bind(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN).toProvider(
  CasbinResValModifierProvider,
);
```

- Implement the **Casbin Resource value modifier provider**. Customise the resource value based on business logic using route arguments parameter in the provider.

```ts
import {Getter, inject, Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {
  AuthorizationBindings,
  AuthorizationMetadata,
  CasbinResourceModifierFn,
} from 'loopback4-authorization';

export class CasbinResValModifierProvider
  implements Provider<CasbinResourceModifierFn>
{
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
    @inject(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)
    private readonly allowAlwaysPath: string[],
  ) {}

  value(): CasbinResourceModifierFn {
    return (pathParams: string[], req: Request) => this.action(pathParams, req);
  }

  async action(pathParams: string[], req: Request): Promise<string> {
    const metadata: AuthorizationMetadata = await this.getCasbinMetadata();

    if (
      !metadata &&
      !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0)
    ) {
      return '';
    }

    if (!metadata) {
      throw new HttpErrors.InternalServerError(`Metadata object not found`);
    }
    const res = metadata.resource;

    // Now modify the resource parameter using on path params, as per business logic.
    // Returning resource value as such for default case.

    return `${res}`;
  }
}
```

- Implement the **casbin enforcer config provider** . Provide the casbin model path. Model definition can be initialized from [.CONF file, from code, or from a string](https://casbin.org/docs/en/model-storage).
  -For more details refer [loopback4-authorization](https://github.com/sourcefuse/loopback4-authorization)

```ts
import {Provider} from '@loopback/context';
import {
  CasbinConfig,
  CasbinEnforcerConfigGetterFn,
  IAuthUserWithPermissions,
} from 'loopback4-authorization';
import * as path from 'path';

export class CasbinEnforcerConfigProvider
  implements Provider<CasbinEnforcerConfigGetterFn>
{
  constructor() {}

  value(): CasbinEnforcerConfigGetterFn {
    return (
      authUser: IAuthUserWithPermissions,
      resource: string,
      isCasbinPolicy?: boolean,
    ) => this.action(authUser, resource, isCasbinPolicy);
  }

  async action(
    authUser: IAuthUserWithPermissions,
    resource: string,
    isCasbinPolicy?: boolean,
  ): Promise<CasbinConfig> {
    const model = path.resolve(__dirname, './../../fixtures/casbin/model.conf'); // Model initialization from file path
    /**
     * import * as casbin from 'casbin';
     *
     * To initialize model from code, use
     *      let m = new casbin.Model();
     *      m.addDef('r', 'r', 'sub, obj, act'); and so on...
     *
     * To initialize model from string, use
     *      const text = `
     *      [request_definition]
     *     r = sub, obj, act
     *
     *      [policy_definition]
     *      p = sub, obj, act
     *
     *      [policy_effect]
     *      e = some(where (p.eft == allow))
     *
     *      [matchers]
     *      m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
     *       `;
     *      const model = casbin.newModelFromString(text);
     */

    // Write business logic to find out the allowed resource-permission sets for this user. Below is a dummy value.
    //const allowedRes = [{resource: 'session', permission: "CreateMeetingSession"}];

    const policy = path.resolve(
      __dirname,
      './../../fixtures/casbin/policy.csv',
    );

    const result: CasbinConfig = {
      model,
      //allowedRes,
      policy,
    };
    return result;
  }
}
```

- Further it can be used by adding a step in custom sequence to check for authorization whenever any end point is hit.

```ts
import {inject} from '@loopback/context';
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
  UserPermissionsFn,
} from 'loopback4-authorization';

import {AuthClient} from './models/auth-client.model';
import {User} from './models/user.model';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<AuthUser>,
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateRequestClient: AuthenticateFn<AuthClient>,
    @inject(AuthorizationBindings.CASBIN_AUTHORIZE_ACTION)
    protected checkAuthorisation: CasbinAuthorizeFn,
    @inject(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN)
    protected casbinResModifierFn: CasbinResourceModifierFn,
  ) {}

  async handle(context: RequestContext) {
    const requestTime = Date.now();
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      await this.authenticateRequestClient(request);
      const authUser: User = await this.authenticateRequest(request);

      // Invoke Resource value modifier
      const resVal = await this.casbinResModifierFn(args);

      // Check authorisation
      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authUser,
        resVal,
        request,
      );
      // Checking access to route here
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
```

- Now we can add access permission keys to the controller methods using authorize
  decorator as below. Set isCasbinPolicy parameter to use casbin default policy format. Default is false.

```ts
@authorize({permissions: ['CreateRole'], resource:'role', isCasbinPolicy: true})
@post(rolesPath, {
  responses: {
    [STATUS_CODE.OK]: {
      description: 'Role model instance',
      content: {
        [CONTENT_TYPE.JSON]: {schema: {'x-ts-type': Role}},
      },
    },
  },
})
async create(@requestBody() role: Role): Promise<Role> {
  return await this.roleRepository.create(role);
}
```

- **Secure-sequence** :It is an action-based sequence. This sequence is a generated class that contains logger,authenticate and authorize actions in the handle method along with helmet and ratelimiting actions that can be used in facades

- Helmet action will get triggered for each request and helps in securing HTTP headers which sets them up to prevent attacks like Cross-Site-Scripting(XSS) etc

- Ratelimiting action will trigger ratelimiter middleware for all the requests passing through, providing different rate limiting options at API method level.
  For example, If you want to keep hard rate limit for unauthorized API requests and want to keep it softer for other API requests.

- **Service-sequence** :It is an action-based sequence. This sequence is a generated class that contains authenticate and authorize actions in the handle method.It is used while working with internal secure API's where user authentication and authorization actions are required.

## Usage

- import the sequence you want to use.for example,import ServiceSequence in your application component file.

```ts
import {ServiceSequence} from '@sourceloop/core';
```

- There is an inbuilt setUpSequence() that will enable user to provide these sequences as per requirement.

```ts
if (!this.config?.useCustomSequence) {
  this.setupSequence();
}
```

as follows:

```ts
setupSequence() {
    if (
      !this.config.controller?.authenticate ||
      !this.config.controller.authorizations
    ) {
      throw new HttpErrors.InternalServerError(Errors.AUTHENTICATION_SETUP);
    }
    //providing ServiceSequence here.
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
```

- You can also use custom sequence instead by providing custom sequence name in the application.

![sequence](https://loopback.io/pages/en/lb4/imgs/middleware.png)
