// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {CodeWriterFn} from './types';

export class CodeWriterProvider implements Provider<CodeWriterFn> {
  value(): CodeWriterFn {
    return async token => token;
  }
}
