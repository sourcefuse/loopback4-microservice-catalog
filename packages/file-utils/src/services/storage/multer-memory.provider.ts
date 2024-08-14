// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import multer from 'multer';

export class MulterMemoryStorage implements Provider<multer.StorageEngine> {
  value() {
    return multer.memoryStorage();
  }
}
