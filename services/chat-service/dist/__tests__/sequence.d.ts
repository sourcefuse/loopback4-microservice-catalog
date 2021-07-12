import { FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceHandler } from '@loopback/rest';
import { AuthenticateFn } from 'loopback4-authentication';
import { AuthorizeFn } from 'loopback4-authorization';
import { IAuthUserWithPermissions } from './keys';
export declare class MySequence implements SequenceHandler {
    protected findRoute: FindRoute;
    protected parseParams: ParseParams;
    protected invoke: InvokeMethod;
    send: Send;
    reject: Reject;
    protected authenticateRequest: AuthenticateFn<IAuthUserWithPermissions>;
    protected checkAuthorisation: AuthorizeFn;
    constructor(findRoute: FindRoute, parseParams: ParseParams, invoke: InvokeMethod, send: Send, reject: Reject, authenticateRequest: AuthenticateFn<IAuthUserWithPermissions>, checkAuthorisation: AuthorizeFn);
    handle(context: RequestContext): Promise<void>;
}
