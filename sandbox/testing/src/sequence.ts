import {inject} from '@loopback/context';
import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler
} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  CasbinAuthorizeFn,
  CasbinResourceModifierFn,
  IAuthUserWithPermissions
} from 'loopback4-authorization';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  /**
   * Optional invoker for registered middleware in a chain.
   * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
   */
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<IAuthUserWithPermissions>,
    @inject(AuthorizationBindings.CASBIN_AUTHORIZE_ACTION)
    protected checkAuthorisation: CasbinAuthorizeFn,
    @inject(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN)
    protected casbinResModifierFn: CasbinResourceModifierFn,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;
      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      console.log('in sequence');

      // Providing sample output of authentication, for sake of simplicity
      // const authUser: IAuthUserWithPermissions = {
      //   id: '0851e3b-156b-4b7f-85e9-48f0953a6cc8',
      //   username: 'test_user',
      //   permissions: ['read'],
      //   authClientId: 1,
      //   role: 'admin',
      //   firstName: 'Test',
      //   lastName: 'user',
      // };

      const authUser: IAuthUserWithPermissions = await this.authenticateRequest(
        request,
      );

      const resVal = await this.casbinResModifierFn(args);

      const isAccessAllowed: boolean = await this.checkAuthorisation(
        authUser,
        resVal,
        request,
      );

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
