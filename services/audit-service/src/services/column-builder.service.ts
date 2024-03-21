import {BindingScope, Provider, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {AuditLog} from '../models';
import {ColumnBuilderFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ColumnBuilderProvider implements Provider<ColumnBuilderFn> {
  value(): ColumnBuilderFn {
    return async (auditLogs: AuditLog[]) => this.columnBuilder(auditLogs);
  }
  async columnBuilder(auditLogs: AuditLog[]): Promise<AnyObject[]> {
    return auditLogs;
  }
}
