// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {repository} from '@loopback/repository';
import {
  AuthClientRepository,
  OtpRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../../repositories/sequelize';
import {ResourceOwnerVerifyProvider as JugglerResourceOwnerVerifyProvider} from '../resource-owner-verify.provider';
export class ResourceOwnerVerifyProvider extends JugglerResourceOwnerVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {
    super(userRepository, utRepository, authClientRepository, otpRepository);
  }
}
