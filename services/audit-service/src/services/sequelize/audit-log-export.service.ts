import {inject} from '@loopback/core';
import {ExportHandlerServiceBindings} from '../../keys';
import {ExportHandlerFn} from '../../types';
import {AuditLogExportProvider as JugglerAuditLogExportProvider} from '../audit-log-export.service';

export class AuditLogExportProvider extends JugglerAuditLogExportProvider {
  constructor(
    @inject(ExportHandlerServiceBindings.PROCESS_FILE)
    public exportHandler: ExportHandlerFn,
  ) {
    super(exportHandler);
  }
}
