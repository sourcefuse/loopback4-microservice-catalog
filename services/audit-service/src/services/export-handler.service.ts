import {injectable, BindingScope, Provider} from '@loopback/core';
import {ExportHandlerFn} from '../types';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class ExportHandlerProvider implements Provider<ExportHandlerFn> {
  constructor() {
    //this is intentional
  }

  value(): ExportHandlerFn {
    return async (fileBuffer: Buffer) => {
      throw new HttpErrors.NotImplemented(
        `ExportHandlerProvider not implemented`,
      );
    };
  }
}
