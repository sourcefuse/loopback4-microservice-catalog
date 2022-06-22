export enum SERVICES {
  AUTH = 'authentication-service',
  AUDIT = 'audit-service',
  CHAT = 'chat-service',
  NOTIFICATION = 'notification-service',
  BPMN = 'bpmn-service',
  FEATURE_TOGGLE = 'feature-toggle-service',
  IN_MAIL = 'in-mail-service',
  PAYMENT = 'payment-service',
  SCHEDULER = 'scheduler-service',
  SEARCH = 'search-service',
  VIDEO_CONF = 'video-conferencing-service',
  REPORTING = 'reporting-service',
}

export enum DATASOURCES {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
}

export type MigrationConnectors = 'pg' | 'mysql';
export type DatasourceConnectors = 'postgresql' | 'mysql';
export const MIGRATION_CONNECTORS: {
  [key in DATASOURCES]: MigrationConnectors;
} = {
  [DATASOURCES.POSTGRES]: 'pg',
  [DATASOURCES.MYSQL]: 'mysql',
};

export const DATASOURCE_CONNECTORS: {
  [key in DATASOURCES]: DatasourceConnectors;
} = {
  [DATASOURCES.POSTGRES]: 'postgresql',
  [DATASOURCES.MYSQL]: 'mysql',
};

export enum MIGRATIONS {
  CUSTOM = 'Setup custom migrations',
  INCLUDED = 'Include migrations provided by base service',
}

export type DataSourceMap = {type: 'cache' | 'store'; name: string};

export const BASESERVICEDSLIST: {
  [key in SERVICES]: Array<DataSourceMap>;
} = {
  'authentication-service': [
    {type: 'store', name: 'AuthDbSourceName'},
    {type: 'cache', name: 'AuthCacheSourceName'},
  ],
  'audit-service': [{type: 'store', name: 'AuditSourceName'}],
  'notification-service': [{type: 'store', name: 'NotifDbSourceName'}],
  'bpmn-service': [{type: 'store', name: 'WorkflowCacheSourceName'}],
  'feature-toggle-service': [{type: 'store', name: 'FeatureToggleDbName'}],
  'in-mail-service': [{type: 'store', name: 'InMailDatasourceName'}],
  'payment-service': [{type: 'store', name: 'PaymentDatasourceName'}],
  'scheduler-service': [{type: 'store', name: 'SchedulerDatasourceName'}],
  'search-service': [{type: 'store', name: 'DATASOURCE_NAME'}],
  'video-conferencing-service': [{type: 'store', name: 'VideoConfDatasource'}],
  'chat-service': [],
  'reporting-service': [{type: 'store', name: 'ReportingDatasourceName'}],
};
