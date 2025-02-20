import {Context, Provider, inject, service} from '@loopback/core';
import multer from 'multer';
import {getConfigProperty, IFileRequestMetadata} from '../types';
import {FileUtilBindings} from '../keys';
import {Request} from '@loopback/rest';
import {FileValidatorService} from './file-validator.provider';

export class MulterStorageProvider implements Provider<multer.StorageEngine> {
  constructor(
    @inject.context()
    private readonly context: Context,
    @inject(FileUtilBindings.FILE_REQUEST_METADATA, {optional: true})
    private readonly config: IFileRequestMetadata,
    @service(FileValidatorService)
    private readonly validator: FileValidatorService,
  ) {}

  async value() {
    return {
      _handleFile: async (
        req: Request,
        file: Express.Multer.File,
        cb: (error?: Error, info?: Partial<Express.Multer.File>) => void,
      ) => {
        const storage = await this._getStorage(file);
        this.validator
          .validateParsedData({
            file,
            body: req.body,
          })
          .then(newFile => {
            if (newFile) storage._handleFile(req, newFile, cb);
          })
          .catch(err => cb(err));
      },
      _removeFile: async (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null) => void,
      ) => {
        const storage = await this._getStorage(file);
        storage._removeFile(req, file, cb);
      },
    };
  }

  private _getStorage(file: Express.Multer.File) {
    const config = getConfigProperty(this.config, 'storageOptions', file);
    return this.context.get<multer.StorageEngine>(
      `services.${config?.storageClass.name ?? 'MulterMemoryStorage'}`,
    );
  }
}
