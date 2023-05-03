// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {CodeReaderFn} from './types';

export class OauthCodeReaderProvider implements Provider<CodeReaderFn> {
  value(): CodeReaderFn {
    return async token => token;
  }
}
