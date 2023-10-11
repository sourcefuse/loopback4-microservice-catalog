// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {repository} from '@loopback/repository';
import {AuthSecureClientRepository} from '../../../../repositories/sequelize';
import {SecureClientPasswordVerifyProvider as JugglerSecureClientPasswordVerifyProvider} from '../secure-client-password-verify.provider';
export class SecureClientPasswordVerifyProvider extends JugglerSecureClientPasswordVerifyProvider {
  constructor(
    @repository(AuthSecureClientRepository)
    public authSecureClientRepository: AuthSecureClientRepository,
  ) {
    super(authSecureClientRepository);
  }
}
