import {Provider} from '@loopback/core';
import {CodeWriterFn} from './types';

export class CodeWriterProvider implements Provider<CodeWriterFn> {
  value(): CodeWriterFn {
    return async token => token;
  }
}
