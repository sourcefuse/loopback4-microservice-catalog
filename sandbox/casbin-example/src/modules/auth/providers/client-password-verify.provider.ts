import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {AuthClientRepository} from '@sourceloop/authentication-service';
import {VerifyFunction} from 'loopback4-authentication';

export class ClientPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn>
{
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) {}

  value(): VerifyFunction.OauthClientPasswordFn {
    return async (clientId: string, clientSecret: string) => {
      return this.authClientRepository.findOne({
        where: {
          clientId,
          clientSecret,
        },
      });
    };
  }
}
