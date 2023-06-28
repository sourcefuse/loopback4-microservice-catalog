import {injectable, BindingScope, Provider, inject} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {FileProcessingFn} from '../types';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class FileProcessingProvider implements Provider<FileProcessingFn> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
  ) {}

  value(): FileProcessingFn {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (fileBuffer: any) => {
      throw new HttpErrors.NotImplemented(
        `FileProcessingProvider not implemented`,
      );
    };
  }
}
