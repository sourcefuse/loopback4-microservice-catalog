import {Context, inject, Provider, service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import multer from 'multer';
import {FileUtilBindings} from '../keys';
import {getConfigProperty, IFileRequestMetadata} from '../types';
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
          .then(result => {
            if (result) {
              storage._handleFile(req, result.file, (error, info) => {
                if (error) {
                  cb(error);
                } else {
                  Promise.all(result.waiters)
                    .then(results => {
                      const firstError = results.find(r => r);
                      if (firstError) {
                        if (info) {
                          // need to do this casting because of wrong typings
                          storage._removeFile(
                            req,
                            info as Express.Multer.File,
                            err => {
                              cb(new HttpErrors.BadRequest(firstError));
                            },
                          );
                        }
                      } else {
                        cb(undefined, info);
                      }
                    })
                    .catch(cb);
                }
              });
            }
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
