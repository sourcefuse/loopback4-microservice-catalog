import {BindingScope, Provider, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {AuditLog} from '../models';
import {ColumnBuilderFn} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ColumnBuilderProvider implements Provider<ColumnBuilderFn> {
  value(): ColumnBuilderFn {
    return async (auditLogs: AuditLog[]) => this.columnBuilder(auditLogs);
  }
  
  /**
   * The columnBuilder function in TypeScript returns an array of AuditLog objects asynchronously.
   * @param {AuditLog[]} auditLogs - An array of AuditLog objects.
   * @returns The `columnBuilder` function is returning a Promise that resolves to an array of
   * `AuditLog` objects.
   */
  async columnBuilder(auditLogs: AuditLog[]): Promise<AnyObject[]> {
    return auditLogs;
  }
}
