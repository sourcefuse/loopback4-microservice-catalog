import {IFileLimitsGetter, MulterUploadOptions} from '../../../../types';

export class MulterConfigService implements IFileLimitsGetter {
  async get(): Promise<MulterUploadOptions> {
    return {
      sizeLimits: {fileSize: 10485761},
      definition: {
        file: {
          extensions: ['.png'],
          type: 'string',
        },
      },
    };
  }
}
