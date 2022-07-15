// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Action, AuditLog} from '@sourceloop/audit-log';

export const dummyLog: AuditLog = new AuditLog({
  action: Action.INSERT_ONE,
  actedAt: new Date(),
  actionKey: 'insertone',
  entityId: '1',
  actor: 'testUser',
});
