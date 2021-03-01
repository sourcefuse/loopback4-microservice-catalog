import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import { LocalUserProfileDto } from '../models/local-user-profile';
import { userSignupFn } from '../types';

export class LocalSignupProvider implements Provider<userSignupFn<LocalUserProfileDto>> {
  constructor() {}

  value(): userSignupFn<LocalUserProfileDto> {
    return async (
      model: LocalUserProfileDto
    ) => {
      return model;
    };
  }
}
