// Copyright (c) 2022 Sourcefuse Technologies
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

/**
 * @decorator `@globalInterceptor` A decorator that is used to register the interceptor globally.
 */
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

  /**
   * @param {intercept} intercept - a middleware interceptor that intercepts the request and checks if the request is for swagger.
   * If it is, it checks if the request has the basic authentication header.
   * If it does not, it returns a 401 response.
   * */
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

  /**
   * It takes a request object, extracts the authorization header, decodes it, and returns an object
   * with the username and password
   * @param {Request} request - Request - this is the request object that is passed to the middleware
   * function.
   * @returns An object with username and password properties.
   */
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

  /**
   * If the request URL contains the path to the OpenAPI spec, return true
   * @param {Request} request - The request object that was sent to the server.
   * @returns The return value is a boolean.
   */
  private isOpenAPISpecRequest(request: Request) {
    const swaggerUrl = `${this.config.path}/openapi.json`;
    if (request.url.includes(swaggerUrl)) {
      return true;
    }
    return false;
  }

  /**
   *  @param {isRequestContext} isRequestContext a type guard function. It checks if the context is of type RequestContext.
   *  */
  private isRequestContext(context?: Context): context is RequestContext {
    return !!(
      (context as RequestContext).request &&
      (context as RequestContext).response
    );
  }
}
