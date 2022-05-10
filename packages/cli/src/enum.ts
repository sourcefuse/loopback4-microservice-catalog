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

export const DATASOURCENAME: {
  [key in string]: string;
} = {
  'authentication-service': 'AuthDbSourceName',
  'audit-service': 'AuditSourceName',
  'notification-service': 'NotifDbSourceName',
  'bpmn-service': 'WorkflowCacheSourceName',
  'feature-toggle-service': 'FeatureToggleDbName',
  'in-mail-service': 'InMailDatasourceName',
  'payment-service': 'PaymentDatasourceName',
  'scheduler-service': 'SchedulerDatasourceName',
  'search-service': 'DATASOURCE_NAME',
  'video-conferencing-service': 'VideoConfDatasource',
};
