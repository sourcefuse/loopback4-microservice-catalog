// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {
  AuthSecureClientRepository,
  OtpRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../../repositories/sequelize';
import {SecureResourceOwnerVerifyProvider as JugglerSecureResourceOwnerVerifyProvider} from '../secure-resource-owner-verify.provider';
export class SecureResourceOwnerVerifyProvider extends JugglerSecureResourceOwnerVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(AuthSecureClientRepository)
    public authSecureClientRepository: AuthSecureClientRepository,
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {
    super(
      userRepository,
      utRepository,
      authSecureClientRepository,
      otpRepository,
    );
  }
}
