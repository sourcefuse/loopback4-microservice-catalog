import {Provider} from '@loopback/context';
import {SignupRequestDto} from '../models/signup-request-dto.model';
import {PreSignupFn} from '../types';

export class LocalPreSignupProvider
  implements Provider<PreSignupFn<SignupRequestDto, {email: string}>>
{
  value(): PreSignupFn<SignupRequestDto, {email: string}> {
    return async (signupRequest: SignupRequestDto) => {
      return {
        email: signupRequest.email,
      };
    };
  }
}
