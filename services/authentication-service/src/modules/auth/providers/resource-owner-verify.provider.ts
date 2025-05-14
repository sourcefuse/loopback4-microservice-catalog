// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticateErrorKeys, UserStatus} from '@sourceloop/core';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

import {Otp} from '../../../models';
import {
  AuthClientRepository,
  OtpRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../repositories';
export class ResourceOwnerVerifyProvider
  implements Provider<VerifyFunction.ResourceOwnerPasswordFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {}

  value(): VerifyFunction.ResourceOwnerPasswordFn {
    return async (clientId, clientSecret, username, password) => {
      let user;

      user = await this.userRepository.verifyPassword(username, password).catch(async () => {
        const otp: Otp = await this.otpRepository.get(username);
        if (!otp || otp.otp !== password) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        const foundUser = await this.userRepository.findOne({
          where: {username},
        });
        if (!foundUser) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        return foundUser;
      });
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

      const client = await this.authClientRepository.findOne({
        where: {
          clientId,
        },
      });
      if (
        !client ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user.authClientIds.indexOf(client.id ?? 0) < 0
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      } else if (!client.clientSecret || client.clientSecret !== clientSecret) {
        throw new HttpErrors.Unauthorized(
          AuthErrorKeys.ClientVerificationFailed,
        );
      } else {
        // Do nothing
      }
      return {
        client,
        user,
      };
    };
  }
}
