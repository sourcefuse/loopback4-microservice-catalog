import {Provider, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthErrorKeys,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';
import * as Auth0Strategy from 'passport-auth0';
import {
  Auth0PostVerifyFn,
  Auth0PreVerifyFn,
  Auth0SignUpFn,
} from '../../../providers';
import {SignUpBindings, VerifyBindings} from '../../../providers/keys';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {AuthUser} from '../models';

export class Auth0VerifyProvider implements Provider<VerifyFunction.Auth0Fn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.AUTH0_SIGN_UP_PROVIDER)
    private readonly signupProvider: Auth0SignUpFn,
    @inject(VerifyBindings.AUTH0_PRE_VERIFY_PROVIDER)
    private readonly preVerifyProvider: Auth0PreVerifyFn,
    @inject(VerifyBindings.AUTH0_POST_VERIFY_PROVIDER)
    private readonly postVerifyProvider: Auth0PostVerifyFn,
  ) {}

  value(): VerifyFunction.Auth0Fn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Auth0Strategy.Profile,
    ) => {
      let user: IAuthUser | null = await this.userRepository.findOne({
        where: {
          email: profile._json.email,
        },
      });
      user = await this.preVerifyProvider(
        accessToken,
        refreshToken,
        profile,
        user,
      );
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
          userId: user.id as string,
        },
      });
      if (
        !creds ||
        creds.authProvider !== 'auth0' ||
        creds.authId !== profile.id
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser({
        ...user,
        id: user.id as string,
      });
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      return this.postVerifyProvider(profile, authUser);
    };
  }
}
