import {repository} from '@loopback/repository';
import {AuditLogRepository} from '../../repositories/sequelize';
import {AuditController as JugglerAuditController} from '../audit.controller';

export class AuditController extends JugglerAuditController {
  constructor(
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
  ) {
    super(auditLogRepository);
  }
}
