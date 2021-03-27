import {Provider} from '@loopback/core';
import {CodeReaderFn} from './types';

export class OauthCodeReaderProvider implements Provider<CodeReaderFn> {
  value(): CodeReaderFn {
    return async token => token;
  }
}
