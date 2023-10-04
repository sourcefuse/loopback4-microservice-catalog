import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AWSS3Bindings, AwsS3Config} from '../../keys';

import {AuditLogRepository} from '../../repositories/sequelize';
import {ExportToCsvProvider as JugglerExportToCsvProvider} from '../export-to-csv.service';

export class ExportToCsvProvider extends JugglerExportToCsvProvider {
  constructor(
    @inject(AWSS3Bindings.Config, {optional: true})
    protected readonly config: AwsS3Config,
    @repository(AuditLogRepository)
    public auditLogRepository: AuditLogRepository,
  ) {
    super(config, auditLogRepository);
  }
}
