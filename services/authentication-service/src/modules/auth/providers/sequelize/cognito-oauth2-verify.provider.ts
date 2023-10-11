// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  CognitoPostVerifyFn,
  CognitoPreVerifyFn,
  CognitoSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {CognitoOauth2VerifyProvider as JugglerCognitoOauth2VerifyProvider} from '../cognito-oauth2-verify.provider';

export class CognitoOauth2VerifyProvider extends JugglerCognitoOauth2VerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.COGNITO_SIGN_UP_PROVIDER)
    protected readonly signupProvider: CognitoSignUpFn,
    @inject(VerifyBindings.COGNITO_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: CognitoPreVerifyFn,
    @inject(VerifyBindings.COGNITO_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: CognitoPostVerifyFn,
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
