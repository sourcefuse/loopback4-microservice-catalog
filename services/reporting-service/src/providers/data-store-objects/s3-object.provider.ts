import {Provider, inject} from '@loopback/core';

import AWS from 'aws-sdk';
import {S3DataStoreConfiguration} from '../../interfaces';
import {ReportingServiceComponentBindings} from '../../keys';

export class S3ObjectProvider implements Provider<AWS.S3> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATA_STORE_CONFIGURATION)
    private readonly s3Config: S3DataStoreConfiguration,
  ) {}
  value(): AWS.S3 {
    AWS.config.update({
      accessKeyId: this.s3Config.accessKeyId,
      secretAccessKey: this.s3Config.secretAccessKey,
      region: this.s3Config.region,
    });
    return new AWS.S3();
  }
}
