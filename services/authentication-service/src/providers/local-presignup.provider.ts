import {Provider} from '@loopback/context';
import {SignupRequestDto} from '../models/signup-request-dto.model';
import {PreSignupFn} from '../types';

export class LocalPreSignupProvider implements Provider<PreSignupFn> {
  value(): PreSignupFn {
    return async (signupRequest: SignupRequestDto) => {
      return new SignupRequestDto({
        email: signupRequest.email,
      });
    };
  }
}
