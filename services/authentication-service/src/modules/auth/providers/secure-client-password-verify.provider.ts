// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';

import {AuthSecureClientRepository} from '../../../repositories';

export class SecureClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn>
{
  constructor(
    @repository(AuthSecureClientRepository)
    public authSecureClientRepository: AuthSecureClientRepository,
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
