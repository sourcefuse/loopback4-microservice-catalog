import {Provider} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {LocalUserProfileDto} from '../models/local-user-profile';
import {UserSignupFn} from '../types';

export class LocalSignupProvider
  implements Provider<UserSignupFn<LocalUserProfileDto>> {
  value(): UserSignupFn<LocalUserProfileDto> {
    return async (model: LocalUserProfileDto, tokenInfo?: AnyObject) => model;
  }
}
