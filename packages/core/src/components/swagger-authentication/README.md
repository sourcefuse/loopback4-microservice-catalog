# SwaggerAuthentication Component

## Overview

A Loopback Component that adds an authenticating middleware for Rest Explorer.

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
