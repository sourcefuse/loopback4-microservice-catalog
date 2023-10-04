import {CoreBindings, inject} from '@loopback/core';
import {AuditServiceApplication} from '../../application';
import {QuerySelectedFilesProvider as JugglerQuerySelectedFilesProvider} from '../query-selected-files.service';

export class QuerySelectedFilesProvider extends JugglerQuerySelectedFilesProvider {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected application: AuditServiceApplication,
  ) {
    super(application);
  }
}
