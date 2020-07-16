import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {AuthUser} from '../models/auth-user.model';

export class GoogleOauth2VerifyProvider
  implements Provider<VerifyFunction.GoogleAuthFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
  ) {}

  value(): VerifyFunction.GoogleAuthFn {
    return async (accessToken, refreshToken, profile) => {
      const user = await this.userRepository.findOne({
        where: {
          email: profile._json.email,
        },
      });
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id,
        },
      });
      if (
        !creds ||
        creds.authProvider !== 'google' ||
        creds.authId !== profile.id
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser(user);
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      return authUser;
    };
  }
}
