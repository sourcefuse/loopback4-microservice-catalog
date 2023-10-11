// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';
import {AuthSecureClientRepository} from '../../../repositories';
import {AuthSecureClientRepository as SequelizeAuthSecureClientRepository} from '../../../repositories/sequelize';

export class SecureClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn>
{
  constructor(
    @repository(AuthSecureClientRepository)
    public authSecureClientRepository:
      | AuthSecureClientRepository
      | SequelizeAuthSecureClientRepository,
  ) {}

  value(): VerifyFunction.OauthClientPasswordFn {
    return async (clientId: string, clientSecret: string) => {
      return this.authSecureClientRepository.findOne({
        where: {
          clientId,
        },
      });
    };
  }
}
