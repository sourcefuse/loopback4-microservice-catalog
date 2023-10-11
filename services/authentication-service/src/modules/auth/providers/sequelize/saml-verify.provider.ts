import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  SamlPostVerifyFn,
  SamlPreVerifyFn,
  SamlSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {SamlVerifyProvider as JugglerSamlVerifyProvider} from '../saml-verify.provider';
export class SamlVerifyProvider extends JugglerSamlVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.SAML_SIGN_UP_PROVIDER)
    protected readonly signupProvider: SamlSignUpFn,
    @inject(VerifyBindings.SAML_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: SamlPreVerifyFn,
    @inject(VerifyBindings.SAML_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: SamlPostVerifyFn,
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
