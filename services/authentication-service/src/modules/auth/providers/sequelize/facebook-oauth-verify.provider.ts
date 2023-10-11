// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  FacebookPostVerifyFn,
  FacebookPreVerifyFn,
  FacebookSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {FacebookOauth2VerifyProvider as JugglerFacebookOauth2VerifyProvider} from '../facebook-oauth-verify.provider';
export class FacebookOauth2VerifyProvider extends JugglerFacebookOauth2VerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.FACEBOOK_SIGN_UP_PROVIDER)
    protected readonly signupProvider: FacebookSignUpFn,
    @inject(VerifyBindings.FACEBOOK_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: FacebookPreVerifyFn,
    @inject(VerifyBindings.FACEBOOK_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: FacebookPostVerifyFn,
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
