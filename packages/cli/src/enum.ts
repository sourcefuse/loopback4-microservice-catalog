// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
  USER_TENANT = 'user-tenant-service',
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

export type DataSourceMap = {
  type: 'cache' | 'store';
  name: string;
  fileName: string;
  isNotBase?: boolean;
};

export const BASESERVICEDSLIST: {
  [key in SERVICES]: Array<DataSourceMap>;
} = {
  'authentication-service': [
    {type: 'store', name: 'AuthDbSourceName', fileName: 'auth'},
    {type: 'cache', name: 'AuthCacheSourceName', fileName: 'redis'},
  ],
  'audit-service': [
    {type: 'store', name: 'AuditSourceName', fileName: 'audit'},
  ],
  'notification-service': [
    {type: 'store', name: 'NotifDbSourceName', fileName: 'notif'},
  ],
  'bpmn-service': [
    {type: 'store', name: 'WorkflowCacheSourceName', fileName: 'workflow'},
  ],
  'feature-toggle-service': [
    {type: 'store', name: 'FeatureToggleDbName', fileName: 'featureToggle'},
  ],
  'in-mail-service': [
    {type: 'store', name: 'InMailDatasourceName', fileName: 'mailer'},
  ],
  'payment-service': [
    {type: 'store', name: 'PaymentDatasourceName', fileName: 'payment'},
  ],
  'scheduler-service': [
    {type: 'store', name: 'SchedulerDatasourceName', fileName: 'scheduler'},
  ],
  'search-service': [
    {type: 'store', name: 'DATASOURCE_NAME', fileName: 'search'},
  ],
  'video-conferencing-service': [
    {type: 'store', name: 'VideoConfDatasource', fileName: 'videoConf'},
  ],
  'chat-service': [],
  'user-tenant-service': [],
};

export const BASESERVICECOMPONENTLIST: {
  [key in SERVICES]: string;
} = {
  'authentication-service': 'AuthenticationServiceComponent',
  'audit-service': 'AuditServiceComponent',
  'notification-service': 'NotificationServiceComponent',
  'bpmn-service': 'WorkflowServiceComponent',
  'feature-toggle-service': 'FeatureToggleServiceComponent',
  'in-mail-service': 'InMailServiceComponent',
  'payment-service': 'PaymentServiceComponent',
  'scheduler-service': 'SchedulerServiceComponent',
  'search-service': 'SearchServiceComponent',
  'video-conferencing-service': 'VideoConfServiceComponent',
  'chat-service': 'ChatServiceComponent',
  'user-tenant-service': 'UserTenantServiceComponent',
};
