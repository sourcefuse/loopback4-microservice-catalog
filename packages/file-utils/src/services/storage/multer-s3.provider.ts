// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AWSS3Bindings, S3WithSigner} from 'loopback4-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

import {FileUtilBindings} from '../../keys';
import {IFileRequestMetadata, S3StorageOptions} from '../../types';

export class MulterS3Storage implements Provider<multer.StorageEngine> {
  constructor(
    @inject(AWSS3Bindings.AwsS3Provider) private readonly s3: S3WithSigner,
    @inject(FileUtilBindings.FILE_REQUEST_METADATA)
    private readonly metadata: IFileRequestMetadata<S3StorageOptions>,
  ) {}
  value() {
    if (!this.metadata.storageOptions?.options?.bucket) {
      throw new HttpErrors.InternalServerError(
        'Bucket name is required for S3 storage',
      );
    }
    return multerS3({
      s3: this.s3,
      bucket: this.metadata.storageOptions?.options.bucket,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      },
      contentType: function (req, file, cb) {
        cb(null, file.mimetype);
      },
    });
  }
}
