import {Provider, inject} from '@loopback/core';

import {QueryBinding} from '../interfaces/query-binding.interface';
import {ReportingServiceComponentBindings} from '../keys';
import {QueryBindingManager} from '../utils/query-binding-manager';

export class QueryBindingObjectProvider implements Provider<QueryBinding> {
  constructor(
    @inject(ReportingServiceComponentBindings.BINDING_MANAGER_CLASS) // eslint-disable-next-line @typescript-eslint/naming-convention
    private BindingManagerClass: typeof QueryBindingManager,
  ) {}

  value(): QueryBinding {
    return new this.BindingManagerClass();
  }
}
