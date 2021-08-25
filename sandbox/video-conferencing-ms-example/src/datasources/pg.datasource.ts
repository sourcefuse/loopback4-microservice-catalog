import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'videochatDb',
  connector: 'postgresql',
  url: '',
  host:process.env.HOST,
  port: 5432,
  user: 'postgres',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  schema: process.env.SCHEMA,
};

console.log("*****");
console.log('HOST', process.env.HOST);
    console.log('USER', process.env.USER);
    console.log('port', process.env.PORT);
console.log('pASSWORD', process.env.PASSWORD);
console.log('DATABASE', process.env.DATABASE);
    console.log('SCHEMA', process.env.SCHEMA);
@lifeCycleObserver('datasource')
export class VideoConferecingDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'videochatDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.videochatDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
