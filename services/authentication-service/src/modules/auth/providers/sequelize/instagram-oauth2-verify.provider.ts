// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  InstagramPostVerifyFn,
  InstagramPreVerifyFn,
  InstagramSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {InstagramOauth2VerifyProvider as JugglerInstagramOauth2VerifyProvider} from '../instagram-oauth2-verify.provider';
export class InstagramOauth2VerifyProvider extends JugglerInstagramOauth2VerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.INSTAGRAM_SIGN_UP_PROVIDER)
    protected readonly signupProvider: InstagramSignUpFn,
    @inject(VerifyBindings.INSTAGRAM_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: InstagramPreVerifyFn,
    @inject(VerifyBindings.INSTAGRAM_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: InstagramPostVerifyFn,
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
