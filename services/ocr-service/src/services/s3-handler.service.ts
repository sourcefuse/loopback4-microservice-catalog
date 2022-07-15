// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {injectable, BindingScope, inject} from '@loopback/core';
import {AWSS3Bindings, S3WithSigner} from 'loopback4-s3';

@injectable({
  scope: BindingScope.TRANSIENT,
})
export class S3HandlerService {
  constructor(
    @inject(AWSS3Bindings.AwsS3Provider) public s3Client: S3WithSigner,
  ) {}

  async listObjects(bucketName: string, contractName: string) {
    const {Contents} = await this.s3Client.listObjectsV2({
      Bucket: bucketName,
      Prefix: contractName,
    });
    return Contents;
  }

  async getObject(bucketName: string, key: string | undefined) {
    const data = await this.s3Client.getObject({
      Bucket: bucketName,
      Key: key,
    });
    const {Body} = data;
    return Body;
  }
  // sonarignore:start
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  async streamToString(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      stream.on('data', (chunk: any) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }
  // sonarignore:end
}
