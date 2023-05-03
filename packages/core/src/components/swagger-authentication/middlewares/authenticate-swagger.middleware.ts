// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Context,
  globalInterceptor,
  inject,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {Request, RequestContext} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerConfig,
} from '@loopback/rest-explorer';
import {MiddlewareContext, Middleware} from '@loopback/express';
import {SwaggerAuthenticationBindings} from '../keys';
import {HttpAuthenticationVerifier} from '../types';
import {STATUS_CODE} from '../../../enums';

@globalInterceptor('auth', {tags: {name: 'AuthenticateSwaggerMiddleware'}})
export class AuthenticateSwaggerMiddlewareInterceptor
  implements Provider<Middleware>
{
  constructor(
    @inject(SwaggerAuthenticationBindings.VERIFIER)
    private readonly verifier: HttpAuthenticationVerifier,
    @inject(RestExplorerBindings.CONFIG)
    private readonly config: RestExplorerConfig,
  ) {}
  value() {
    return this.intercept.bind(this);
  }

  async intercept(
    context: MiddlewareContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    let request, response;
    if (this.isRequestContext(context.parent)) {
      request = context.parent.request;
      response = context.parent.response;
    }
    if (request && response && this.isOpenAPISpecRequest(request)) {
      const {username, password} = this.decodeHeader(request);
      const verified = this.verifier(username, password);
      if (!verified) {
        response
          .status(STATUS_CODE.UNAUTHORISED)
          .setHeader('WWW-Authenticate', 'Basic realm="Node"');
        response.end('Unauthorized');
        return null;
      }
    }
    return next();
  }

  private decodeHeader(request: Request) {
    const header = request.headers.authorization ?? ''; // get the auth header
    const token = header.split(/\s+/).pop() ?? ''; // and the encoded auth token
    const auth = Buffer.from(token, 'base64').toString(); // convert from base64
    const parts = auth.split(/:/); // split on colon
    const username = parts.shift(); // username is first
    const password = parts.join(':');

    return {
      username,
      password,
    };
  }

  private isOpenAPISpecRequest(request: Request) {
    const swaggerUrl = `${this.config.path}/openapi.json`;
    if (request.url.includes(swaggerUrl)) {
      return true;
    }
    return false;
  }

  private isRequestContext(context?: Context): context is RequestContext {
    return !!(
      (context as RequestContext).request &&
      (context as RequestContext).response
    );
  }
}
