import {inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AuthErrorKeys,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';
import {
  SamlPostVerifyFn,
  SamlPreVerifyFn,
  SamlSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../providers';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import * as SamlStrategy from '@node-saml/passport-saml';
import {HttpErrors} from '@loopback/rest';
import {AuthUser} from '../models/auth-user.model';

export class SamlVerifyProvider implements Provider<VerifyFunction.SamlFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.SAML_SIGN_UP_PROVIDER)
    private readonly signupProvider: SamlSignUpFn,
    @inject(VerifyBindings.SAML_PRE_VERIFY_PROVIDER)
    private readonly preVerifyProvider: SamlPreVerifyFn,
    @inject(VerifyBindings.SAML_POST_VERIFY_PROVIDER)
    private readonly postVerifyProvider: SamlPostVerifyFn,
  ) {}

  value(): VerifyFunction.SamlFn {
    return async (profile: SamlStrategy.Profile) => {
      let user: IAuthUser | null = await this.userRepository.findOne({
        where: {
          email: profile.email,
        },
      });
      user = await this.preVerifyProvider(profile, user);
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
        creds.authProvider !== 'saml' ||
        creds.authId !== profile.id
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser({
        ...user,
        id: user.id as string,
      });
      authUser.permissions = [];
      return this.postVerifyProvider(profile, authUser);
    };
  }
}
