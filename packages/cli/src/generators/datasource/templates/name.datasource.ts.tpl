import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
<% if (project.serviceDependency && project.baseServiceStoreName) { -%>
import {<%= project.baseServiceStoreName %>} from '@sourceloop/<%= project.serviceDependency -%>'
<% } -%>

const config = {
  name: '<%= project.datasourceName  %>',
  connector: '<%= project.datasourceConnectorName  %>',
  url: '',
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
export class <%= project.datasourceClassName %>DataSource extends juggler.DataSource
  implements LifeCycleObserver { 
  
  <% if (project.serviceDependency && project.baseServiceStoreName ) { -%>
    static dataSourceName = <%= project.baseServiceStoreName %>;
    <% }else{ -%>
  static dataSourceName = '<%= project.datasourceName %>';
  <% } -%>	

  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.<%= project.datasourceName %>', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}