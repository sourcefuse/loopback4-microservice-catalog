import {Provider} from '@loopback/context';
import { PreSignupFn } from '../types';

export class LocalPreSignupProvider implements Provider<PreSignupFn> {

  value(): PreSignupFn {
    return async (
      token: string,
      email: string
    ) => {
    };
  }
}
