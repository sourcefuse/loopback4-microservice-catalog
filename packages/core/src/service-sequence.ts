import {inject} from '@loopback/context';
import {
  ExpressRequestHandler,
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {isString} from 'lodash';
import {
  AuthenticateFn,
  AuthenticationBindings,
  AuthErrorKeys,
} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
} from 'loopback4-authorization';

import {IAuthUserWithPermissions, ILogger, LOGGER} from './components';
import {SFCoreBindings} from './keys';

const SequenceActions = RestBindings.SequenceActions;
const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export class ServiceSequence implements SequenceHandler {
  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;
  @inject(SFCoreBindings.EXPRESS_MIDDLEWARES, {optional: true})
  protected expressMiddlewares: ExpressRequestHandler[] = [];

  constructor(
    // sonarignore:start
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD)
    protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<IAuthUserWithPermissions>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,
    @inject(SFCoreBindings.i18n)
    protected i18n: i18nAPI, // sonarignore:end
  ) {}

  async handle(context: RequestContext) {
    const requestTime = Date.now();
    try {
      const {request, response} = context;
      response.removeHeader('x-powered-by');
      this.logger.info(
        `Request ${request.method} ${
          request.url
        } started at ${requestTime.toString()}.
        Request Details
        Referer = ${request.headers.referer}
        User-Agent = ${request.headers['user-agent']}
        Remote Address = ${request.connection.remoteAddress}
        Remote Address (Proxy) = ${request.headers['x-forwarded-for']}`,
      );

      if (this.expressMiddlewares?.length) {
        const responseGenerated = await this.invokeMiddleware(
          context,
          this.expressMiddlewares,
        );
        if (responseGenerated) return;
      }

      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

      const authUser: IAuthUserWithPermissions = await this.authenticateRequest(
        request,
        response,
      );
      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authUser?.permissions,
        request,
      );
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }

      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.logger.error(
        `Request ${context.request.method} ${
          context.request.url
        } errored out. Error :: ${JSON.stringify(err)} ${err}`,
      );

      const error = this._rejectErrors(err);
      if (
        // sonarignore:start
        !(
          error.message &&
          [
            AuthErrorKeys.TokenInvalid,
            AuthErrorKeys.TokenExpired,
            'TokenExpired',
          ].includes(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error.message as any).message,
          )
        )
        // sonarignore:end
      ) {
        if (isString(error.message)) {
          error.message = this.i18n.__({
            phrase: error.message,
            locale: process.env.LOCALE ?? 'en',
          });
        } else {
          error.message =
            error.message || 'Some error occured. Please try again';
        }
      }
      this.reject(context, error);
    } finally {
      this.logger.info(
        `Request ${context.request.method} ${
          context.request.url
        } Completed in ${Date.now() - requestTime}ms`,
      );
    }
  }

  // sonarignore:start
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private _rejectErrors(err: any) {
    // sonarignore:end
    if (!!err.table && !!err.detail) {
      if (err.code === '23505') {
        // Postgres unique index error
        return new HttpErrors.Conflict(
          `Unique constraint violation error ! ${err.detail}`,
        );
      } else if (err.code === '23503') {
        // Postgres foreign key error
        return new HttpErrors.NotFound(
          `Related entity not found ! ${err.detail}`,
        );
      } else if (err.code === '23502') {
        // Postgres not null constraint error
        return new HttpErrors.NotFound(
          `Not null constraint violation error ! ${err.detail}`,
        );
      } else {
        return err as Error;
      }
    } else if (
      err.message &&
      isJsonString(err.message) &&
      JSON.parse(err.message).error
    ) {
      return JSON.parse(err.message).error as Error;
    } else if (
      err.message?.message &&
      isJsonString(err.message.message) &&
      JSON.parse(err.message.message).error
    ) {
      return JSON.parse(err.message.message).error as Error;
    } else if (err.name && err.name === 'PubNubError') {
      return new HttpErrors.UnprocessableEntity(
        `Pubnub returned with error ! ${JSON.stringify(err)}`,
      );
    } else {
      return err as Error;
    }
  }
}
