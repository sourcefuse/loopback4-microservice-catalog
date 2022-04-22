import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {VerifyFunction} from 'loopback4-authentication';
import {OtpCacheRepository, UserRepository} from '../repositories';
import {AuthenticateErrorKeys} from '@sourceloop/core';
const {verify} = require('2fa-util');

export class AuthenticatorVerifyProvider
  implements Provider<VerifyFunction.OtpAuthFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
  ) {}

  value(): VerifyFunction.OtpAuthFn {
    return async (key: string, otp: string) => {
      const otpCache = await this.otpCacheRepo.get(key);
      if (!otpCache) {
        throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.InvalidKey);
      }
      const isValid = await verify(otp, key);
      if (!isValid) {
        throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.InvalidOtp);
      }
      return this.userRepository.findById(otpCache.userId);
    };
  }
}
