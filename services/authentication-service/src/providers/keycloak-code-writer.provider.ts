import {Provider} from '@loopback/core';
import {KeyCloakCodeWriterFn} from './types';

export class KeyCloakWriterProvider implements Provider<KeyCloakCodeWriterFn> {
  constructor() {}

  value(): KeyCloakCodeWriterFn {
    return async token => {
      return token;
    };
  }
}
