// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {repository} from '@loopback/repository';
import {
  OtpRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../../repositories/sequelize';
import {LocalPasswordVerifyProvider as JugglerLocalPasswordVerifyProvider} from '../local-password-verify.provider';
export class LocalPasswordVerifyProvider extends JugglerLocalPasswordVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {
    super(userRepository, utRepository, otpRepository);
  }
}
