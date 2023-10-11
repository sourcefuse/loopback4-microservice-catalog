// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {AuthClientRepository} from '../../../../repositories/sequelize';
import {ClientPasswordVerifyProvider as JugglerClientPasswordVerifyProvider} from '../client-password-verify.provider';

export class ClientPasswordVerifyProvider extends JugglerClientPasswordVerifyProvider {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) {
    super(authClientRepository);
  }
}
