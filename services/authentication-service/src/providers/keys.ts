import {BindingKey} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';
import {PreSignupFn, UserSignupFn} from '../types';

import {
  GooglePostVerifyFn,
  GooglePreVerifyFn,
  GoogleSignUpFn,
  InstagramPostVerifyFn,
  InstagramPreVerifyFn,
  InstagramSignUpFn,
  ApplePostVerifyFn,
  ApplePreVerifyFn,
  AppleSignUpFn,
  FacebookSignUpFn,
  FacebookPreVerifyFn,
  FacebookPostVerifyFn,
  KeyCloakPostVerifyFn,
  KeyCloakPreVerifyFn,
  KeyCloakSignUpFn,
  CodeReaderFn,
  CodeWriterFn,
} from './types';

export namespace SignUpBindings {
  export const GOOGLE_SIGN_UP_PROVIDER = BindingKey.create<GoogleSignUpFn>(
    'sf.google.signup.provider',
  );
  export const INSTAGRAM_SIGN_UP_PROVIDER =
    BindingKey.create<InstagramSignUpFn>('sf.instagram.signup.provider');
  export const APPLE_SIGN_UP_PROVIDER = BindingKey.create<AppleSignUpFn>(
    'sf.apple.signup.provider',
  );
  export const FACEBOOK_SIGN_UP_PROVIDER = BindingKey.create<FacebookSignUpFn>(
    'sf.facebook.signup.provider',
  );
  export const KEYCLOAK_SIGN_UP_PROVIDER = BindingKey.create<KeyCloakSignUpFn>(
    'sf.keycloak.signup.provider',
  );
  export const PRE_LOCAL_SIGNUP_PROVIDER = BindingKey.create<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PreSignupFn<any, any>
  >(`sf.local.presignup.provider`);
  export const LOCAL_SIGNUP_PROVIDER = BindingKey.create<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UserSignupFn<any, any>
  >(`sf.local.signup.provider`);
}

export namespace VerifyBindings {
  export const GOOGLE_PRE_VERIFY_PROVIDER =
    BindingKey.create<GooglePreVerifyFn>('sf.google.preverify.provider');
  export const GOOGLE_POST_VERIFY_PROVIDER =
    BindingKey.create<GooglePostVerifyFn>('sf.google.postverify.provider');
  export const INSTAGRAM_POST_VERIFY_PROVIDER =
    BindingKey.create<InstagramPostVerifyFn>('sf.instgram.postverify.provider');
  export const INSTAGRAM_PRE_VERIFY_PROVIDER =
    BindingKey.create<InstagramPreVerifyFn>('sf.instagram.preverify.provider');
  export const APPLE_PRE_VERIFY_PROVIDER = BindingKey.create<ApplePreVerifyFn>(
    'sf.apple.preverify.provider',
  );
  export const APPLE_POST_VERIFY_PROVIDER =
    BindingKey.create<ApplePostVerifyFn>('sf.apple.postverify.provider');
  export const FACEBOOK_POST_VERIFY_PROVIDER =
    BindingKey.create<FacebookPostVerifyFn>('sf.facebook.postverify.provider');
  export const FACEBOOK_PRE_VERIFY_PROVIDER =
    BindingKey.create<FacebookPreVerifyFn>('sf.facebook.preverify.provider');
  export const KEYCLOAK_PRE_VERIFY_PROVIDER =
    BindingKey.create<KeyCloakPreVerifyFn>('sf.keycloak.preverify.provider');
  export const KEYCLOAK_POST_VERIFY_PROVIDER =
    BindingKey.create<KeyCloakPostVerifyFn>('sf.keycloak.postverify.provider');

  export const BEARER_SIGNUP_VERIFY_PROVIDER =
    BindingKey.create<VerifyFunction.GenericAuthFn>(
      `sf.bearer.signupverify.provider`,
    );
}

export namespace AuthCodeBindings {
  export const CODEWRITER_PROVIDER = BindingKey.create<CodeWriterFn>(
    'sf.keycloack.codewriter.provider',
  );

  export const CODEREADER_PROVIDER = BindingKey.create<CodeReaderFn>(
    'sf.oauth.codereader.provider',
  );
}
