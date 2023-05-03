// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';
import {SignupTokenHandlerFn} from '.';
import {PreSignupFn, UserSignupFn} from '../types';
import {AuthCodeGeneratorProvider} from './auth-code-generator.provider';

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
  OtpGenerateFn,
  OtpSenderFn,
  OtpFn,
  MfaCheckFn,
  AzureAdSignUpFn,
  AzureAdPreVerifyFn,
  AzureAdPostVerifyFn,
  CognitoSignUpFn,
  CognitoPreVerifyFn,
  CognitoPostVerifyFn,
  JWTSignerFn,
  JWTVerifierFn,
  SamlSignUpFn,
  SamlPostVerifyFn,
  SamlPreVerifyFn,
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
  export const AZURE_AD_SIGN_UP_PROVIDER = BindingKey.create<AzureAdSignUpFn>(
    'sf.azuread.signup.provider',
  );
  export const COGNITO_SIGN_UP_PROVIDER = BindingKey.create<CognitoSignUpFn>(
    'sf.cognito.signup.provider',
  );
  export const SAML_SIGN_UP_PROVIDER = BindingKey.create<SamlSignUpFn>(
    'sf.saml.signup.provider',
  );
  export const PRE_LOCAL_SIGNUP_PROVIDER = BindingKey.create<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PreSignupFn<any, any> //NOSONAR
  >(`sf.local.presignup.provider`);
  export const LOCAL_SIGNUP_PROVIDER = BindingKey.create<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    UserSignupFn<any, any> //NOSONAR
  >(`sf.local.signup.provider`);

  export const SIGNUP_HANDLER_PROVIDER =
    BindingKey.create<SignupTokenHandlerFn>(`sf.local.signup.handler.provider`);
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
  export const COGNITO_PRE_VERIFY_PROVIDER =
    BindingKey.create<CognitoPreVerifyFn>('sf.cognito.preverify.provider');
  export const COGNITO_POST_VERIFY_PROVIDER =
    BindingKey.create<CognitoPostVerifyFn>('sf.cognito.postverify.provider');
  export const SAML_PRE_VERIFY_PROVIDER = BindingKey.create<SamlPreVerifyFn>(
    'sf.saml.preverify.provider',
  );
  export const SAML_POST_VERIFY_PROVIDER = BindingKey.create<SamlPostVerifyFn>(
    'sf.saml.postverify.provider',
  );

  export const OTP_PROVIDER = BindingKey.create<OtpFn>('sf.otp.provider');
  export const OTP_GENERATE_PROVIDER = BindingKey.create<OtpGenerateFn>(
    'sf.otp.generate.provider',
  );
  export const OTP_SENDER_PROVIDER = BindingKey.create<OtpSenderFn>(
    'sf.otp.sender.provider',
  );
  export const MFA_PROVIDER = BindingKey.create<MfaCheckFn>(
    'sf.mfa.check.provider',
  );

  export const BEARER_SIGNUP_VERIFY_PROVIDER =
    BindingKey.create<VerifyFunction.GenericAuthFn>(
      `sf.bearer.signupverify.provider`,
    );

  export const AZURE_AD_PRE_VERIFY_PROVIDER =
    BindingKey.create<AzureAdPreVerifyFn>('sf.azure.preverify.provider');
  export const AZURE_AD_POST_VERIFY_PROVIDER =
    BindingKey.create<AzureAdPostVerifyFn>('sf.azure.postverify.provider');
}

export namespace AuthCodeBindings {
  export const CODEWRITER_PROVIDER = BindingKey.create<CodeWriterFn>(
    'sf.auth.codewriter.provider',
  );

  export const CODEREADER_PROVIDER = BindingKey.create<CodeReaderFn>(
    'sf.auth.codereader.provider',
  );
  export const AUTH_CODE_GENERATOR_PROVIDER =
    BindingKey.create<AuthCodeGeneratorProvider>(
      'sf.auth-code.generator.provider',
    );
  export const JWT_SIGNER = BindingKey.create<JWTSignerFn<object>>(
    'sf.auth-token.generator.provider',
  );
  export const JWT_VERIFIER = BindingKey.create<JWTVerifierFn<string>>(
    'sf.auth-payload.provider',
  );
}
