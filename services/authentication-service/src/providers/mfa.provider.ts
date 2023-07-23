// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {AuthUser} from '../modules/auth';
import {MfaCheckFn} from './types';

export class MfaProvider implements Provider<MfaCheckFn> {
  value(): MfaCheckFn {
    return async (_user: AuthUser) => false;
  }
}
