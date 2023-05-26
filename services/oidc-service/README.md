# @sourceloop/oidc-service

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

![npm](https://img.shields.io/npm/dm/@sourceloop/oidc-service)
![node-current (scoped)](https://img.shields.io/node/v/@sourceloop/oidc-service)
![npm (prod) dependency version (scoped)](https://img.shields.io/npm/dependency-version/@sourceloop/oidc-service/@loopback/core)
![check-code-coverage](https://img.shields.io/badge/code--coverage-75.01%25-yellow)

## Overview

The OIDC Service is a component built using LoopBack 4 that provides OpenID Connect (OIDC) support for authentication. It allows integration with external identity providers and enables the issuance and verification of JSON Web Tokens (JWTs) using the OIDC protocol. This service provides the following features:

- ### OpenID Connect Support: 
  The OIDC service fully supports the OpenID Connect standard, which is an identity layer built on top of the OAuth 2.0 protocol. It allows your application to authenticate and obtain user identity information from external identity providers.

- ### Authentication:
  The OIDC service handles the authentication process, allowing users to log in to your application using their credentials from supported identity providers. It supports various authentication flows, including authorization code flow, implicit flow, and hybrid flow.

- ### Authorization: 
  The OIDC service provides authorization capabilities, allowing you to control access to your application's resources based on user roles and permissions. It integrates with LoopBack 4's built-in authorization features, such as decorators and guards, to enforce fine-grained access control.

- ### Token Management: 
  The OIDC service handles the generation, validation, and revocation of access tokens, refresh tokens, and ID tokens. It follows the OAuth 2.0 and OpenID Connect specifications for token-based authentication and authorization.

- ### Extensibility: 
  The OIDC service is designed to be extensible and customizable. You can extend its functionality by adding custom authentication and authorization providers, implementing custom token handlers, or integrating additional identity management services.

- ### Developer-Friendly APIs: 
  The OIDC service provides a developer-friendly API for integrating authentication and authorization into your application. It offers easy-to-use methods and interfaces for handling user authentication, profile management, token management, and other related tasks.


To get started with a basic implementation of this service, refer to the `/sandbox/oidc-basic-example` directory. 

### Working and Flow

1. Application Registration: Before using OIDC, you need to register your application with the identity provider (IdP) or the OIDC service. During the registration process, you typically provide information about your application, such as the redirect URLs, client ID, and client secret.

2. User Initiation: When a user wants to log in to your application, they are directed to the login page of the IdP. This can be initiated by clicking a "Sign In" button or by accessing a protected resource that requires authentication.

3. Authentication Request: Your application initiates the authentication process by redirecting the user to the IdP's authorization endpoint. The request includes parameters such as the client ID, redirect URL, requested scopes, and response type (e.g., code, token, or both).

4. User Authentication: The user enters their credentials (username and password) on the IdP's login page. The IdP verifies the user's identity and may prompt for additional factors, such as multi-factor authentication (MFA).

5. Authorization Grant: Once the user is authenticated, the IdP generates an authorization grant. The type of grant depends on the requested response type. For example, in the authorization code flow, the grant is a short-lived authorization code returned to the client as a query parameter in the redirect URL.

6. Token Request: The client application (your application) exchanges the authorization grant for an access token and optionally a refresh token. The client makes a POST request to the IdP's token endpoint, providing the authorization grant, client ID, client secret, and other required parameters.

7. Token Validation: The IdP validates the authorization grant and, if valid, issues an access token and refresh token. The access token contains information about the user and their authorized scopes. The client can use the access token to access protected resources on behalf of the user.

8. User Info Request: To obtain additional information about the user, the client can make a request to the IdP's user info endpoint, providing the access token as an authorization header or query parameter. The user info response contains user attributes and claims, such as name, email, and profile picture.

9. Token Usage: The client application can use the access token to make authorized requests to the protected resources of your application's API. The access token is typically included as an authorization header or a query parameter in API requests.

Note: The OIDC flow may vary depending on the specific flow you choose (e.g., authorization code flow, implicit flow, hybrid flow) and the configurations of the IdP and client application. However, the general principles and steps outlined above provide an overview of the OIDC working and flow.

## Installation

```bash

npm i @sourceloop/oidc-service

```

### Usage

To use the OIDC Service in your LoopBack 4 application, follow these steps:

- Create a new LoopBack 4 application if you don't have one already: `lb4 testapp`
- Install the OIDC service: `npm i @sourceloop/oidc-service`
- Set the required [environment variables](#environment-variables).
- The .env variables `OIDC_CLAIMS_PROFILE`, `OIDC_ISSUER_URL` to set the common claims and issuer url for all the clients.
- Run the [migrations](#migrations).
- Make sure you have entries for `client_id`, `client_secret`, `grant-types`, `redirect-urls`, `response_types` in your `auth_clients` table.
- Set up a [Loopback4 Datasource](https://loopback.io/doc/en/lb4/DataSource.html) with `dataSourceName` property set to
  `AuthDbSourceName`. You can see an example datasource [here](#setting-up-a-datasource).
- Set up a Loopback4 Datasource for caching tokens with `dataSourceName` property set to `AuthCacheSourceName`.
- Add the OIDCServiceComponent to your LoopBack 4 application in the application.ts file:

```typescript
import {ApplicationConfig} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {OidcServiceComponent, TemplateBindings} from '@sourceloop/oidc-service';
import path from 'path';

export {ApplicationConfig};

export class OidcApplication extends RestApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // ...

    // Add the OidcServiceComponent to the application
    this.component(OidcServiceComponent);

    // Modify the template file path for login and interaction screens
     this.bind(TemplateBindings.LoginTemplate).to(
      path.join(__dirname, '../public/views/login.ejs'),
    );
    this.bind(TemplateBindings.InteractionTemplate).to(
      path.join(__dirname, '../public/views/interaction.ejs'),
    );

    // ...
  }
}

```

### Environment Variables

| Name | Required | Default Value | Description |



The OIDC Service requires the following environment variables:

| `NODE_ENV` | Node environment value, i.e. `dev`, `test`, `prod` |

| `LOG_LEVEL` | Log level value, i.e. `error`, `warn`, `info`, `verbose`, `debug` |

| `DB_HOST` | Hostname for the database server. |

| `DB_PORT` | Port for the database server. |

| `DB_USER` | User for the database. |

| `DB_PASSWORD` | Password for the database user. |

| `DB_DATABASE` | Database to connect to on the database server. |

| `DB_SCHEMA` | Database schema used for the data source. In PostgreSQL, this will be `public` unless a schema is made explicitly for the service. |

| `REDIS_HOST` | Hostname of the Redis server. |

| `REDIS_PORT` | Port to connect to the Redis server over. |

| `REDIS_URL` | Fully composed URL for Redis connection. Used instead of other settings if set. |

| `REDIS_PASSWORD` | Password for Redis if authentication is enabled. |

| `REDIS_DATABASE` | Database within Redis to connect to. |

| `JWT_PRIVATE_KEY` | Asymmetric signing key of the JWT token. |

| `JWT_PUBLIC_KEY` | Verifying signed JWT Token. |

| `JWT_SECRET` | Symmetric signing key of the JWT token. |

| `JWT_ISSUER` | Issuer of the JWT token. |

| `OIDC_CLAIMS_PROFILE` | Common claims for all the clients. |

| `OIDC_CLAIMS_PROFILE` | Common claims for all the clients. |

| `OIDC_ISSUER_URL` | Issuer URL. | 

| `OIDC_JWKS_KTY` | Key Type. It specifies the type of the key, eg. "RSA". | 

| `OIDC_JWKS_ALG` | Algorithm, eg. RS256. | 

| `OIDC_JWKS_USE` | Key Use. It indicates the purpose of the key, e.g. signature. | 

| `OIDC_JWKS_D` | Private Exponent. It represents the private exponent of the RSA key. | 

| `OIDC_JWKS_DP` | First Factor CRT Exponent. It is the exponent used for the Chinese Remainder Theorem (CRT) calculation. | 

| `OIDC_JWKS_DQ` | Second Factor CRT Exponent. It is another exponent used for the CRT calculation. | 

| `OIDC_JWKS_E` | Public Exponent. It represents the public exponent of the RSA key. | 

| `OIDC_JWKS_N` | Modulus. It is the modulus component of the RSA key. | 

| `OIDC_JWKS_P` | First Prime Factor. It represents the first prime factor of the modulus. | 

| `OIDC_JWKS_Q` | Second Prime Factor. It is the second prime factor of the modulus. | 

| `OIDC_JWKS_QI` | First CRT Coefficient. It is the coefficient used for the CRT calculation. | 

| `OIDC_JWKS_KID` | Key ID. It is an identifier for the key. | 

| `OIDC_COOKIES` | For setting cookiee key. | 


### Migrations
To run the database migrations, use the following command:

```bash
npm run migrate
```

#### API Details

Visit the [OpenAPI spec docs](./openapi.md)





