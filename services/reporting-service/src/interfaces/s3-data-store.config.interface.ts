//this is for the sqs data store configuration, neeeds to be written later here for ssample purposes

import {OtherDataStore, Strategies} from '../enums';

export interface S3DataStoreConfiguration {
  type: OtherDataStore.S3;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  strategy: Strategies;
}
