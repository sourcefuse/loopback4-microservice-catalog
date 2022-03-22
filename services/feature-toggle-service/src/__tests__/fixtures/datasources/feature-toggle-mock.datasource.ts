import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {FeatureToggleDbName} from '../../..';

const config = {
  name: FeatureToggleDbName,
  connector: 'memory',
  localStorage: '',
  file: '',
};

export class FeatureToggleMockDataSource extends juggler.DataSource {
  static dataSourceName = FeatureToggleDbName;

  constructor(
    @inject('datasources.config.FeatureToggleDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
