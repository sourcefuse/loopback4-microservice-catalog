// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {WorkflowCacheSourceName} from '../..';

const config = {
  name: WorkflowCacheSourceName,
  connector: 'memory',
  localStorage: '',
  file: '',
};

@lifeCycleObserver('datasource')
export class WorkflowDbDatasource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = WorkflowCacheSourceName;

  constructor(
    @inject(`datasources.config.${WorkflowCacheSourceName}`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
