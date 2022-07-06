import {AuditDbSourceName} from '@sourceloop/audit-log';
import {IServiceConfig} from '@sourceloop/core';

// sonarignore:start
export interface IAuditServiceConfig extends IServiceConfig {
  //do nothing
}

// sonarignore:end

export const AuditSourceName = AuditDbSourceName;
