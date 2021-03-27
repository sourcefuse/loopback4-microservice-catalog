import {Provider} from '@loopback/core';
import {GoogleCodeWriterFn} from './types';

export class GoogleCodeWriterProvider implements Provider<GoogleCodeWriterFn> {

  value(): GoogleCodeWriterFn {
    return async token => token;
  }
}
