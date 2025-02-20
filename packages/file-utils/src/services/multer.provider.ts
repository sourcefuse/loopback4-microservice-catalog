import multer from 'multer';
import {inject} from '@loopback/core';
import {FileUtilBindings} from '../keys';
import {MulterConfig} from '..';

export class MulterProvider {
  constructor(
    @inject(FileUtilBindings.MulterStorage)
    private readonly storage: multer.StorageEngine,
    @inject(FileUtilBindings.MulterConfig, {optional: true})
    private readonly multerConfigs: MulterConfig,
  ) {}

  async value() {
    const uploadOptions = this.multerConfigs.limits;
    return multer({
      storage: this.storage,
      limits: uploadOptions.sizeLimits,
    });
  }
}
