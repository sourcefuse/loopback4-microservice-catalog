import { Provider } from '@loopback/context';
import { VerifyFunction } from 'loopback4-authentication';
export declare class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
    constructor();
    value(): VerifyFunction.BearerFn;
}
