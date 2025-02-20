import {inject, Provider} from '@loopback/core';
import {AWSS3Bindings, S3WithSigner} from 'loopback4-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import {
  FileUtilBindings,
  getConfigProperty,
  IFileRequestMetadata,
  S3StorageOptions,
} from '../../..';

export class MulterS3Storage implements Provider<multer.StorageEngine> {
  constructor(
    @inject(AWSS3Bindings.AwsS3Provider) private readonly s3: S3WithSigner,
    @inject(FileUtilBindings.FILE_REQUEST_METADATA)
    private readonly metadata: IFileRequestMetadata<S3StorageOptions>,
  ) {}
  value() {
    return multerS3({
      s3: this.s3,
      bucket: (req, file, cb) => {
        const storageOptions = getConfigProperty(
          this.metadata,
          'storageOptions',
          file,
        );
        const bucket = storageOptions?.options?.bucket;
        if (!bucket) {
          cb(`Bucket not specified`);
        } else {
          cb(null, bucket);
        }
      },
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
