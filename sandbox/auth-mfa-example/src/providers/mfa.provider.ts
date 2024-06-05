import {Provider} from '@loopback/context';
import {MfaCheckFn} from '@sourceloop/authentication-service';
// import { AuthUser } from '@sourceloop/authentication-service/dist/modules/auth';
// import { AuthUser } from '@sourceloop/authentication-service';

export class MfaProvider implements Provider<MfaCheckFn> {
  value(): MfaCheckFn {
    return async (_user: unknown) => true;
  }
}
