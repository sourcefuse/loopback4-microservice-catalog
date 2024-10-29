// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Context, Provider, inject} from '@loopback/core';
import multer from 'multer';
import {FileUtilBindings} from '../keys';
import {IFileRequestMetadata} from '../types';

export class MulterStorageProvider implements Provider<multer.StorageEngine> {
  constructor(
    @inject.context()
    private readonly context: Context,
    @inject(FileUtilBindings.FILE_REQUEST_METADATA, {optional: true})
    private readonly config: IFileRequestMetadata,
  ) {}

  async value() {
    return this.context.get<multer.StorageEngine>(
      `services.${
        this.config?.storageOptions?.storageClass.name ?? 'MulterMemoryStorage'
      }`,
    );
  }
}
