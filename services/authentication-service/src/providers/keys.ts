import {BindingKey} from '@loopback/core';

import {
  GooglePostVerifyFn,
  GooglePreVerifyFn,
  GoogleSignUpFn,
  KeyCloakPostVerifyFn,
  KeyCloakPreVerifyFn,
  KeyCloakSignUpFn,
} from './types';

export namespace SignUpBindings {
  export const GOOGLE_SIGN_UP_PROVIDER = BindingKey.create<GoogleSignUpFn>(
    'sf.google.signup.provider',
  );
  export const KEYCLOAK_SIGN_UP_PROVIDER = BindingKey.create<KeyCloakSignUpFn>(
    'sf.keycloak.signup.provider',
  );
}

export namespace VerifyBindings {
  export const GOOGLE_PRE_VERIFY_PROVIDER = BindingKey.create<GooglePreVerifyFn>(
    'sf.google.preverify.provider',
  );
  export const GOOGLE_POST_VERIFY_PROVIDER = BindingKey.create<GooglePostVerifyFn>(
    'sf.google.postverify.provider',
  );

  export const KEYCLOAK_PRE_VERIFY_PROVIDER = BindingKey.create<KeyCloakPreVerifyFn>(
    'sf.keycloak.preverify.provider',
  );
  export const KEYCLOAK_POST_VERIFY_PROVIDER = BindingKey.create<KeyCloakPostVerifyFn>(
    'sf.keycloak.postverify.provider',
  );
}
