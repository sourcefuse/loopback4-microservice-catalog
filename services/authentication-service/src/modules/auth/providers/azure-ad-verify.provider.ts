import {inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthErrorKeys,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';
import * as AzureADStrategy from 'passport-azure-ad';
import {
  AzureAdPostVerifyFn,
  AzureAdPreVerifyFn,
  AzureAdSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../providers';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {
  UserCredentialsRepository as SequelizeUserCredentialsRepository,
  UserRepository as SequelizeUserRepository,
} from '../../../repositories/sequelize';
import {AuthUser} from '../models/auth-user.model';
export class AzureAdVerifyProvider
  implements Provider<VerifyFunction.AzureADAuthFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository | SequelizeUserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository:
      | UserCredentialsRepository
      | SequelizeUserCredentialsRepository,
    @inject(SignUpBindings.AZURE_AD_SIGN_UP_PROVIDER)
    protected readonly signupProvider: AzureAdSignUpFn,
    @inject(VerifyBindings.AZURE_AD_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: AzureAdPreVerifyFn,
    @inject(VerifyBindings.AZURE_AD_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: AzureAdPostVerifyFn,
  ) {}

  value(): VerifyFunction.AzureADAuthFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: AzureADStrategy.IProfile,
    ) => {
      let user: IAuthUser | null = await this.userRepository.findOne({
        where: {
          email: profile.upn,
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
      if (!creds || creds.authProvider !== 'azure') {
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
