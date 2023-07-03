import {Provider} from '@loopback/core';
import {AuditLog} from '@sourceloop/audit-log';
import {ColumnBuilderFn} from '../../../types';
import {AnyObject} from '@loopback/repository';

export class ColumnBuilderProvider implements Provider<ColumnBuilderFn> {
  constructor() {
    //this is intentional
  }

  value(): ColumnBuilderFn {
    return async (auditLogs: AuditLog[]) => this.columnBuilder(auditLogs);
  }
  async columnBuilder(auditLogs: AuditLog[]): Promise<AnyObject[]> {
    return auditLogs.map(log => ({
      beforeAfterCombined: `${JSON.stringify(log.before)} ${JSON.stringify(
        log.after,
      )}`,
      actedOnActionCombined: `${log.actedOn} ${log.actionKey}`,
    }));
  }
}
