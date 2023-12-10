import {model, property} from '@loopback/repository';
import {AuditLog as SourceloopAuditLog} from '@sourceloop/audit-log';

@model({
  name: 'audit_logs',
  settings: {
    strict: false,
  },
})
export class AuditLog extends SourceloopAuditLog {
  @property({
    type: 'string',
    name: 'tenant_id',
  })
  tenantId?: string;

  constructor(data?: Partial<AuditLog>) {
    super(data);
  }
}
