# SwaggerAuthentication Component

## Overview

A Loopback Component that adds an authenticating middleware for Rest Explorer

### Installation

```bash

npm i @sourceloop/authentication-service

```

### Usage

- Create a new Loopback4 Application (If you don't have one already)
  `lb4 testapp`
- Install the authentication service
  `npm i @sourceloop/core`
- Add the `SwaggerAuthenticationComponent` to your Loopback4 Application (in `application.ts`).
  ```typescript
  // import the AuthenticationServiceComponent
  import {SwaggerAuthenticationComponent} from '@sourceloop/core';
  // add Component for AuthenticationService
  this.component(SwaggerAuthenticationComponent);
  ```
- Bind the `HttpAuthenticationVerifier` to override the basic authentication logic provided by default.
- Start the application
  `npm start`

### Environment Variables

By default, the application allows access on the basis of `SWAGGER_CREDS_USER`(username) and `SWAGGER_CREDS_PASS`(password) variables provided in the environment.
