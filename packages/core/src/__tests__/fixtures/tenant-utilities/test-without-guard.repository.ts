import {inject} from '@loopback/core';
import {DefaultTransactionalRepository, juggler} from '@loopback/repository';
import {tenantGuard} from '../../../components/tenant-utilities/decorators/tenant-guard.decorator';
import {TestModel} from './test.model';

@tenantGuard()
export class TestWithoutGuardRepo extends DefaultTransactionalRepository<
  TestModel,
  string,
  {}
> {
  constructor(@inject('datasources.db') dataSource: juggler.DataSource) {
    super(TestModel, dataSource);
  }
}
