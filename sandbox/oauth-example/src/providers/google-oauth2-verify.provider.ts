import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  GoogleSignUpFn,
  SignUpBindings,
  UserCredentialsRepository,
  UserRepository,
} from '@sourceloop/authentication-service';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import {AuthUser} from '../models';

export class GoogleOauth2VerifyProvider
  implements Provider<VerifyFunction.GoogleAuthFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.GOOGLE_SIGN_UP_PROVIDER)
    private readonly signupProvider: GoogleSignUpFn,
  ) {}

  value(): VerifyFunction.GoogleAuthFn {
    return async (accessToken, refreshToken, profile) => {
      const user = await this.signupProvider(profile);
      if (user == null) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      // Just to check if userCreds has entry for this user for this provider
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id,
          authProvider: 'google',
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
