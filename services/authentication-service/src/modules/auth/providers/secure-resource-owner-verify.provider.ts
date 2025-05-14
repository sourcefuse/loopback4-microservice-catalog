// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticateErrorKeys, UserStatus} from '@sourceloop/core';
import {
  AuthErrorKeys,
  ClientType,
  VerifyFunction,
} from 'loopback4-authentication';

import {User} from '../../../models';
import {
  AuthSecureClientRepository,
  OtpRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../repositories';
export class SecureResourceOwnerVerifyProvider
  implements Provider<VerifyFunction.SecureResourceOwnerPasswordFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(AuthSecureClientRepository)
    public authSecureClientRepository: AuthSecureClientRepository,
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {}

  /**
   * The function verifies the secure resource owner password for a client and user.
   * @returns The `value()` function returns a SecureResourceOwnerPasswordFn function, which is an
   * asynchronous function that takes clientId, clientSecret, username, and password as parameters.
   * Inside the function, it verifies the user's password or OTP, checks the user's status, validates
   * the client, and returns an object containing the client and user if all validations pass.
   */
  
    value(): VerifyFunction.SecureResourceOwnerPasswordFn {
      return async (clientId, clientSecret, username, password) => {
        const user = await this.verifyUserOrOtp(username, password);
  
        await this.ensureUserIsActiveInTenant(user);
  
        const client = await this.validateClientAccess(
          clientId,
          clientSecret,
          user,
        );
  
        return {client, user};
      };
    }
  
    private async verifyUserOrOtp(username: string, password: string) {
      try {
        return await this.userRepository.verifyPassword(username, password);
      } catch {
        const otp = await this.otpRepository.get(username);
  
        if (!otp || otp.otp !== password) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
  
        const user = await this.userRepository.findOne({where: {username}});
  
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
  
        return user;
      }
    }
  
    private async ensureUserIsActiveInTenant(user: User) {
      const userTenant = await this.utRepository.findOne({
        where: {
          userId: user.id,
          tenantId: user.defaultTenantId,
          status: {
            nin: [UserStatus.REJECTED, UserStatus.INACTIVE],
          },
        },
      });
  
      if (!userTenant) {
        throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserInactive);
      }
    }
  
    private async validateClientAccess(
      clientId: string,
      clientSecret: string,
      user: User,
    ) {
      const client = await this.authSecureClientRepository.findOne({where: {clientId}});
  
      if (
        !client ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user.authClientIds.indexOf(client.id ?? 0) < 0
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      }
  
      if ( client.clientType !== ClientType.public 
        && !client.clientSecret || client.clientSecret !== clientSecret) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientVerificationFailed);
      }
  
      return client;
    }
}
