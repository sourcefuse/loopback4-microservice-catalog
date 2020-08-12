import {BindingKey} from '@loopback/core';
import {GoogleSignUpFn} from './types';

export namespace SignUpBindings {
  export const GOOGLE_SIGN_UP_PROVIDER = BindingKey.create<GoogleSignUpFn>(
    'sf.google.signup.provider',
  );
}
