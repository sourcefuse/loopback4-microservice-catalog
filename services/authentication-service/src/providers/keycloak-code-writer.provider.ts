import {Provider} from '@loopback/core';
import {KeyCloakCodeWriterFn} from './types';

export class KeyCloakWriterProvider implements Provider<KeyCloakCodeWriterFn> {
  value(): KeyCloakCodeWriterFn {
    return async token => token;
  }
}
