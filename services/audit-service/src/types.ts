import {AuditDbSourceName} from '@sourceloop/audit-log';
import {IServiceConfig} from '@sourceloop/core';

export interface IAuditServiceConfig extends IServiceConfig {
  //do nothing
}

export const AuditSourceName = AuditDbSourceName;
