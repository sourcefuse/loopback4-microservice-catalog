// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  GooglePostVerifyFn,
  GooglePreVerifyFn,
  GoogleSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {GoogleOauth2VerifyProvider as JugglerGoogleOauth2VerifyProvider} from '../google-oauth2-verify.provider';

export class GoogleOauth2VerifyProvider extends JugglerGoogleOauth2VerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.GOOGLE_SIGN_UP_PROVIDER)
    protected readonly signupProvider: GoogleSignUpFn,
    @inject(VerifyBindings.GOOGLE_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: GooglePreVerifyFn,
    @inject(VerifyBindings.GOOGLE_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: GooglePostVerifyFn,
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
