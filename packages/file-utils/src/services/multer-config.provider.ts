import {inject} from '@loopback/core';
import {DEFAULT_MULTER_LIMITS, getUploadConfig} from '../constant';
import {FileUtilBindings} from '../keys';
import {
  IBaseMetadata,
  IFileLimitsGetter,
  IModelWithFileMetadata,
  MulterConfig,
  MulterUploadOptions,
  getConfigProperty,
} from '../types';

export class MulterConfigProvider {
  constructor(
    @inject(FileUtilBindings.FILE_REQUEST_METADATA)
    private readonly metadata: IModelWithFileMetadata<never>,
    @inject(FileUtilBindings.LimitProvider, {optional: true})
    private readonly limits: IFileLimitsGetter,
  ) {}

  async value() {
    const isLimitProviderEnabled = this.metadata?.multerConfig?.limitsProvider;
    const fileUploadOptions: MulterUploadOptions = isLimitProviderEnabled
      ? await this.limits.get()
      : {sizeLimits: DEFAULT_MULTER_LIMITS};
    const config = getUploadConfig(this.metadata, fileUploadOptions);
    const result: MulterConfig = {
      limits: fileUploadOptions ?? DEFAULT_MULTER_LIMITS,
      configFor: <T, S extends keyof IBaseMetadata<T>>(
        property: S,
        file: Express.Multer.File,
      ) => getConfigProperty<T, S>(config, property, file),
    };
    return result;
  }
}
