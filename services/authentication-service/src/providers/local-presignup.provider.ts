import {Provider} from '@loopback/context';
import { LocalUserProfileDto } from '../models/local-user-profile';
import { preSignupFn, userSignupFn } from '../types';

export class LocalPreSignupProvider implements Provider<preSignupFn> {
  constructor() {}

  value(): preSignupFn {
    return async (
      token: string,
      email: string
    ) => {
    };
  }
}
