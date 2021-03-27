import {Provider} from '@loopback/core';
import {GoogleCodeWriterFn} from './types';

export class GoogleCodeWriterProvider implements Provider<GoogleCodeWriterFn> {
  constructor() {}

  value(): GoogleCodeWriterFn {
    return async token => token;
  }
}
