// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {SurveyDbSourceName} from '../../types';

const config = {
  name: SurveyDbSourceName,
  connector: 'postgres',
};

export class SurveyeMockDataSource extends juggler.DataSource {
  static dataSourceName = SurveyDbSourceName;

  constructor(
    @inject('datasources.config.SurveyDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
