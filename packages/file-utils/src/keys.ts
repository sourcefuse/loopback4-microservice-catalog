// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey, BindingTemplate, extensionFor} from '@loopback/core';
import multer from 'multer';
import {FileValidatorService} from './services/file-validator.provider';

export const FileUtilComponentNamespace = 'bizbook.fileutil.extension';
export namespace FileUtilBindings {
  export const MulterInstance = BindingKey.create<multer.Multer>(
    `${FileUtilComponentNamespace}.multer.instance`,
  );
  export const MulterLimits = BindingKey.create<multer.Options['limits']>(
    `${FileUtilComponentNamespace}.multer.limits`,
  );
  export const MulterStorage = BindingKey.create<multer.StorageEngine>(
    `${FileUtilComponentNamespace}.multer.storage`,
  );
  export const PARSED_DATA = BindingKey.create<unknown>(
    `${FileUtilComponentNamespace}.current.file`,
  );
  export const FILE_REQUEST_METADATA = BindingKey.create<unknown>(
    `${FileUtilComponentNamespace}.file.request.metadata`,
  );
  export const TEXT_FILE_TYPES = BindingKey.create<string[]>(
    `${FileUtilComponentNamespace}.text.file.types`,
  );
}

export const FileValidatorExtensionPoint =
  BindingKey.create<FileValidatorService>(
    `${FileUtilComponentNamespace}.FileValidatorExtensionPoint`,
  );
export const asFileValidator: BindingTemplate = binding => {
  extensionFor(FileValidatorExtensionPoint.key)(binding);
  binding.tag({namespace: FileValidatorExtensionPoint.key});
};
