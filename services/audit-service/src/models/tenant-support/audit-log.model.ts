import {model, property} from '@loopback/repository';
import {AuditLog as BaseAuditLog} from '../audit-log.model';

@model({
  name: 'audit_logs',
  settings: {
    strict: false,
  },
})
export class AuditLog extends BaseAuditLog {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}
