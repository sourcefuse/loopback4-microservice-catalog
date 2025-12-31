import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import * as samlStrategy from '@node-saml/passport-saml';
import {
  AuthUser,
  SamlSignUpFn,
  SignUpBindings,
  UserCredentialsRepository,
  UserRepository,
} from '@sourceloop/authentication-service';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

export class SamlVerifyProvider implements Provider<VerifyFunction.SamlFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.SAML_SIGN_UP_PROVIDER)
    private readonly signupProvider: SamlSignUpFn,
  ) {}

  value(): VerifyFunction.SamlFn {
    return async (
      profile: samlStrategy.Profile,
      cb: samlStrategy.VerifiedCallback,
      req?: Request,
    ) => {
      const user = await this.signupProvider(profile);
      if (user == null) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      // Just to check if userCreds has entry for this user for this provider
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id,
          authProvider: 'saml',
        },
      });
      if (creds?.authProvider !== 'saml' || creds?.authId !== profile.ID) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser(user);
      authUser.permissions = [];
      return authUser;
    };
  }
}
