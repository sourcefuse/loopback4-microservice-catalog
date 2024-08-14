// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
import {AwsS3Component} from 'loopback4-s3';
import {DEFAULT_TEXT_FILE_TYPES} from './constant';
import {MulterMiddleware} from './interceptors';
import {FileUtilBindings} from './keys';
import {
  FileNameValidator,
  FileTypeValidator,
  FileValidatorService,
  MulterMemoryStorage,
  MulterProvider,
  MulterS3Storage,
} from './services';
import {FileMetadataProvider} from './services/file-metadata.service';
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
    };
    this.bindings = [
      createBindingFromClass(FileTypeValidator),
      createBindingFromClass(FileNameValidator),
    ];
    this.services = [
      FileValidatorService,
      MulterMemoryStorage,
      MulterS3Storage,
    ];
    app.interceptor(MulterMiddleware, {global: true, group: 'multer'});
    app.bind(FileUtilBindings.TEXT_FILE_TYPES).to(DEFAULT_TEXT_FILE_TYPES);
    app.component(AwsS3Component);
  }
  bindings?: Binding[];
  providers?: ProviderMap;
  services?: ServiceOrProviderClass[];
}
