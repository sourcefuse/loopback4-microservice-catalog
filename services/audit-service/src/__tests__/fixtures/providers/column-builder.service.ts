import {Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {AuditLog} from '@sourceloop/audit-log';
import {ColumnBuilderFn} from '../../../types';

export class ColumnBuilderProvider implements Provider<ColumnBuilderFn> {
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
