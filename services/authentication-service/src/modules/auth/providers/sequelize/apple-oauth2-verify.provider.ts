// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  ApplePostVerifyFn,
  ApplePreVerifyFn,
  AppleSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {AppleOauth2VerifyProvider as JugglerAppleOauth2VerifyProvider} from '../apple-oauth2-verify.provider';
export class AppleOauth2VerifyProvider extends JugglerAppleOauth2VerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.APPLE_SIGN_UP_PROVIDER)
    protected readonly signupProvider: AppleSignUpFn,
    @inject(VerifyBindings.APPLE_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: ApplePreVerifyFn,
    @inject(VerifyBindings.APPLE_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: ApplePostVerifyFn,
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
