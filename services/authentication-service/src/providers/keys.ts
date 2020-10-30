import {BindingKey} from '@loopback/core';
import {GoogleSignUpFn, KeyCloakSignUpFn} from './types';

export namespace SignUpBindings {
  export const GOOGLE_SIGN_UP_PROVIDER = BindingKey.create<GoogleSignUpFn>(
    'sf.google.signup.provider',
  );
}

export namespace KeyCloakSignUpBindings {
  export const KEYCLOAK_SIGN_UP_PROVIDER = BindingKey.create<KeyCloakSignUpFn>(
    'sf.keycloak.signup.provider',
  );
}
