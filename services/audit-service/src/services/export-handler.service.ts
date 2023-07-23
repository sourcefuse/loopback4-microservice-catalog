import {BindingScope, Provider, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {ExportHandlerFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ExportHandlerProvider implements Provider<ExportHandlerFn> {
  value(): ExportHandlerFn {
    return async (fileBuffer: Buffer) => {
      throw new HttpErrors.NotImplemented(
        `ExportHandlerProvider not implemented`,
      );
    };
  }
}
