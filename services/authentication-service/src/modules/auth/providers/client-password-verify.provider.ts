import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';

import {AuthClientRepository} from '../../../repositories';

export class ClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn> {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) {}

  value(): VerifyFunction.OauthClientPasswordFn {
    return async (clientId, clientSecret) => {
      return this.authClientRepository.findOne({
        where: {
          clientId,
          clientSecret,
        },
      });
    };
  }
}
