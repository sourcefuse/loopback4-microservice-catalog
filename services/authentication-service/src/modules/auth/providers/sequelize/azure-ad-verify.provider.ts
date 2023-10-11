import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AzureAdPostVerifyFn,
  AzureAdPreVerifyFn,
  AzureAdSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {AzureAdVerifyProvider as JugglerAzureAdVerifyProvider} from '../azure-ad-verify.provider';
export class AzureAdVerifyProvider extends JugglerAzureAdVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.AZURE_AD_SIGN_UP_PROVIDER)
    protected readonly signupProvider: AzureAdSignUpFn,
    @inject(VerifyBindings.AZURE_AD_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: AzureAdPreVerifyFn,
    @inject(VerifyBindings.AZURE_AD_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: AzureAdPostVerifyFn,
  ) {
    super(
      userRepository,
      userCredsRepository,
      signupProvider,
      preVerifyProvider,
      postVerifyProvider,
    );
  }
}
