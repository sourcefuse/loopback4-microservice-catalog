﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticateErrorKeys, UserStatus} from '@sourceloop/core';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

import {User} from '../../../models';
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
    const client = await this.authClientRepository.findOne({where: {clientId}});

    if (
      !client ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user.authClientIds.indexOf(client.id ?? 0) < 0
    ) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }

    if (!client.clientSecret || client.clientSecret !== clientSecret) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientVerificationFailed);
    }

    return client;
  }
}
