// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {MfaCheckFn} from './types';
import {AuthUser} from '../modules/auth';

export class MfaProvider implements Provider<MfaCheckFn> {
  constructor() {
    // This is intentional
  }

  value(): MfaCheckFn {
    return async (_user: AuthUser) => false;
  }
}
