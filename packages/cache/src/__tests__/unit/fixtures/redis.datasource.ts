// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'CacheDB',
  connector: 'kv-redis',
  url: '',
  host: '',
  port: 0,
  password: '',
  db: '',
};

export class TestRedisDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'CacheDB';
  static readonly defaultConfig = config;

  constructor(dsConfig: object = config) {
    super(dsConfig);
  }
}
