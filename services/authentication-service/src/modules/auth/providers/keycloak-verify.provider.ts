import {Provider, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {AuthUser} from '../models/auth-user.model';
import {KeyCloakSignUpBindings} from '../../../providers/keys';
import {KeyCloakSignUpFn} from '../../../providers/types';

export class KeycloakVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(KeyCloakSignUpBindings.KEYCLOAK_SIGN_UP_PROVIDER)
    private readonly signupProvider: KeyCloakSignUpFn,
  ) {}

  value(): VerifyFunction.KeycloakAuthFn {
    return async (accessToken, refreshToken, profile) => {
      let user = await this.userRepository.findOne({
        where: {
          email: profile.email,
        },
      });
      if (!user) {
        const newUser = await this.signupProvider(profile);
        if (newUser) {
          user = newUser;
        } else {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
      }
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id,
        },
      });
      if (
        !creds ||
        creds.authProvider !== 'keycloak' ||
        creds.authId !== profile.keycloakId
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
