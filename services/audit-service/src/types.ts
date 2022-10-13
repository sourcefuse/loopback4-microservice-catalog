// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {IServiceConfig} from '@sourceloop/core';

// sonarignore:start
export interface IAuditServiceConfig extends IServiceConfig {
  //do nothing
}

// sonarignore:end

export const AuditSourceName = AuditDbSourceName;
