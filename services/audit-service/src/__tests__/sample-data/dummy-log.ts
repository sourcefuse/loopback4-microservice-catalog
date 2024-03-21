// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Action} from '@sourceloop/audit-log';
import {AuditLog} from '../../models/tenant-support';

export const dummyLog: AuditLog = new AuditLog({
  action: Action.INSERT_ONE,
  actedAt: new Date(),
  actionKey: 'insertone',
  entityId: '1',
  actor: 'testUser',
  tenantId: 'fac65aad-3f01-dd25-3ea0-ee6563fbe02b',
});
