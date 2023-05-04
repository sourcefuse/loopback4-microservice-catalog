import {BindingScope, inject, injectable} from '@loopback/core';
import AWS from 'aws-sdk';
import {readFileSync} from 'fs';
import path from 'path';
import {FileUploadBindings} from '../keys';
import {IUploader} from '../providers/types';

@injectable({scope: BindingScope.TRANSIENT})
export class FileHelperService {
  constructor(
    @inject(FileUploadBindings.SafeMulterS3Provider)
    private readonly multerS3Provider: IUploader,
  ) {}
  config = {
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESSKEYID,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
  };
  s3 = new AWS.S3(this.config);

  async getObject(objectKey: string) {
    try {
      const params = {
        Bucket: process.env.S3_FILE_BUCKET ?? '',
        Key: objectKey,
      };

      return await this.s3.getObject(params).promise();
    } catch (error) {
      throw new Error(`Could not retrieve file from S3: ${error.message}`);
    }
  }
  async readFile() {
    try {
      const filePath = path.join(__dirname + `${process.env.FILE_PATH}`);
      const fileResponse = readFileSync(filePath);

      return {Body: fileResponse};
    } catch (e) {
      throw new Error(`Could not retrieve file: ${e.message}`);
    }
  }
}
