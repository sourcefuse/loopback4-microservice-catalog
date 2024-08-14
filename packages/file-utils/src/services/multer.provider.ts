// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import multer from 'multer';
import {DEFAULT_MULTER_LIMITS} from '../constant';
import {FileUtilBindings} from '../keys';

export class MulterProvider {
  constructor(
    @inject(FileUtilBindings.MulterStorage)
    private readonly storage: multer.StorageEngine,
    @inject(FileUtilBindings.MulterLimits, {optional: true})
    private readonly limits: multer.Options['limits'] = DEFAULT_MULTER_LIMITS,
  ) {}
  value() {
    return multer({storage: this.storage, limits: this.limits});
  }
}
