import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
<% if (project.sequelize) { -%>
import {SequelizeDataSource} from '@loopback/sequelize';
 <% }else{ -%>
import {juggler} from '@loopback/repository';
<% } -%>
<% if (project.serviceDependency && project.baseServiceStoreName) { -%>
import {<%= project.baseServiceStoreName %>} from '@sourceloop/<%= project.serviceDependency -%>'
<% } -%>

const DEFAULT_MAX_CONNECTIONS = 25;
const DEFAULT_DB_IDLE_TIMEOUT_MILLIS = 60000;
const DEFAULT_DB_CONNECTION_TIMEOUT_MILLIS = 2000;

const config = {
  <% if (project.serviceDependency && project.baseServiceStoreName ) { -%>
  name: <%= project.baseServiceStoreName  %>,
  <% }else{ -%>
  name: '<%= project.datasourceName  %>',
  <% } -%>	
  connector: '<%= project.datasourceConnectorName  %>',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  <% if (project.datasourceType === 'postgres') { -%>
    schema: process.env.DB_SCHEMA,
  <% } -%>
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class <%= project.datasourceClassName %>DataSource extends <% if (project.sequelize ) { -%>
SequelizeDataSource
 <% }else{ -%>
juggler.DataSource
 <% } -%>	 implements LifeCycleObserver { 
  
  <% if (project.serviceDependency && project.baseServiceStoreName ) { -%>
    static dataSourceName = <%= project.baseServiceStoreName %>;
    <% }else{ -%>
  static dataSourceName = '<%= project.datasourceName %>';
  <% } -%>	

  static readonly defaultConfig = config;

  constructor(

  <% if (project.serviceDependency && project.baseServiceStoreName ) { -%>
    @inject(`datasources.config.${<%= project.baseServiceStoreName %>}`, {optional: true})
  <% }else{ -%>
    @inject('datasources.config.<%= project.datasourceName %>', {optional: true})
    <% } -%>	
    dsConfig: object = config,
  ) {
    if (!!+(process.env.ENABLE_DB_CONNECTION_POOLING ?? 0)) {
      const dbPool = {
        max: +(process.env.DB_MAX_CONNECTIONS ?? DEFAULT_MAX_CONNECTIONS),
        idleTimeoutMillis: +(
          process.env.DB_IDLE_TIMEOUT_MILLIS ?? DEFAULT_DB_IDLE_TIMEOUT_MILLIS
        ),
        connectionTimeoutMillis: +(
          process.env.DB_CONNECTION_TIMEOUT_MILLIS ??
          DEFAULT_DB_CONNECTION_TIMEOUT_MILLIS
        ),
      };

      dsConfig = {...dsConfig, ...dbPool};
    }

    super(dsConfig);
  }
}