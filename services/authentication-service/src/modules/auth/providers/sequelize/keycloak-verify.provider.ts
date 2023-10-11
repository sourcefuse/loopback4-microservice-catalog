// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  KeyCloakPostVerifyFn,
  KeyCloakPreVerifyFn,
  KeyCloakSignUpFn,
  SignUpBindings,
  VerifyBindings,
} from '../../../../providers';
import {
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {KeycloakVerifyProvider as JugglerKeycloakVerifyProvider} from '../keycloak-verify.provider';
export class KeycloakVerifyProvider extends JugglerKeycloakVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.KEYCLOAK_SIGN_UP_PROVIDER)
    protected readonly signupProvider: KeyCloakSignUpFn,
    @inject(VerifyBindings.KEYCLOAK_PRE_VERIFY_PROVIDER)
    protected readonly preVerifyProvider: KeyCloakPreVerifyFn,
    @inject(VerifyBindings.KEYCLOAK_POST_VERIFY_PROVIDER)
    protected readonly postVerifyProvider: KeyCloakPostVerifyFn,
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
