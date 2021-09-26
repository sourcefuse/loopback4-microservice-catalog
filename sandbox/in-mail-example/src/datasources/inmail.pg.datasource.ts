
import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import InMailDatasourceName from '@sourceloop/in-mail-service';


const config = {
  name: InMailDatasourceName,
  connector: 'postgresql',
  host: "localhost",
  port: 5432,
  user: "jyotidb",
  password: "admin",
  database: "inmail",
 
};

@lifeCycleObserver('datasource')
export class InmailDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = InMailDatasourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject(`datasources.config.InMailDatasourceName`, {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
