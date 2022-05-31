import {Provider} from '@loopback/context';
import {OtpFn} from './types';
import {authenticator} from 'otplib';
import {repository} from '@loopback/repository';
import {UserCredentialsRepository} from '../repositories';
import {User, UserCredentials} from '..';

export class GoogleAuthenticatorProvider implements Provider<OtpFn> {
  constructor(
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
  ) {}

  value(): OtpFn {
    return async (user: User) => {
      const authenticatorSecret: Pick<
        UserCredentials,
        'secretKey' | 'id'
      > | null = await this.userCredsRepository.findOne({
        where: {
          userId: user.id,
        },
        fields: {
          secretKey: true,
          id: true,
        },
      });

      if (authenticatorSecret?.secretKey) {
        return {
          key: authenticatorSecret.secretKey,
        };
      }

      const secretKey = authenticator.generateSecret();
      await this.userCredsRepository.updateById(authenticatorSecret?.id, {
        secretKey: secretKey,
      });

      return {
        key: secretKey,
      };
    };
  }
}
