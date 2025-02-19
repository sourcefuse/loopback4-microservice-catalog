import {
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject,
  injectable,
  ProviderMap,
  ServiceOrProviderClass,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {DEFAULT_TEXT_FILE_TYPES} from './constant';
import {MulterMiddleware} from './interceptors';
import {FileUtilBindings} from './keys';
import {
  FileNameValidator,
  FileTypeValidator,
  FileValidatorService,
  MulterMemoryStorage,
  MulterProvider,
} from './services';
import {FileMetadataProvider} from './services/file-metadata.service';
import {MulterConfigProvider} from './services/multer-config.provider';
import {MulterStorageProvider} from './services/multer-storage.provider';

@injectable()
export class FileUtilComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    app: RestApplication,
  ) {
    this.providers = {
      [FileUtilBindings.MulterInstance.key]: MulterProvider,
      [FileUtilBindings.MulterStorage.key]: MulterStorageProvider,
      [FileUtilBindings.FILE_REQUEST_METADATA.key]: FileMetadataProvider,
      [FileUtilBindings.MulterConfig.key]: MulterConfigProvider,
    };
    this.bindings = [
      createBindingFromClass(FileTypeValidator),
      createBindingFromClass(FileNameValidator),
    ];
    this.services = [FileValidatorService, MulterMemoryStorage];
    app.interceptor(MulterMiddleware, {global: true, group: 'multer'});
    app.bind(FileUtilBindings.TEXT_FILE_TYPES).to(DEFAULT_TEXT_FILE_TYPES);
  }
  bindings?: Binding[];
  providers?: ProviderMap;
  services?: ServiceOrProviderClass[];
}
