import {inject} from '@loopback/core';
import {DefaultTransactionalRepository, juggler} from '@loopback/repository';
import {tenantGuard} from '../../../components/tenant-utilities/decorators';
import {TenantUtilitiesBindings} from '../../../components/tenant-utilities/keys';
import {ITenantGuard} from '../../../components/tenant-utilities/types';
import {TestModel} from './test.model';

@tenantGuard()
export class TestRepo extends DefaultTransactionalRepository<
  TestModel,
  string,
  {}
> {
  constructor(
    @inject('datasources.db') dataSource: juggler.DataSource,
    @inject(TenantUtilitiesBindings.GuardService)
    public tenantGuardService?: ITenantGuard<TestModel, string>,
  ) {
    super(TestModel, dataSource);
  }
}
