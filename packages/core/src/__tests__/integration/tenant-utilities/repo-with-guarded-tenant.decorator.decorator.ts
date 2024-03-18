import {juggler} from '@loopback/repository';
import {expect, sinon} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import {TenantUtilitiesBindings} from '../../../components/tenant-utilities/keys';
import {TenantGuardService} from '../../../components/tenant-utilities/services';
import {mockUser1} from '../../const';
import {DummyApp, TestRepo} from '../../fixtures/tenant-utilities';
import {TestWithoutGuardRepo} from '../../fixtures/tenant-utilities/test-without-guard.repository';

describe('TenantGuardDecorator', () => {
  let app: DummyApp;
  let repo: TestWithoutGuardRepo;
  beforeEach(async () => {
    app = new DummyApp({
      rest: {
        port: 3001,
      },
    });
    const ds = new juggler.DataSource({
      name: 'db',
      connector: 'memory',
    });
    app.bind(AuthenticationBindings.CURRENT_USER).to(mockUser1);
    app.dataSource(ds);
    await app.boot();
    await app.start();
    repo = await app.getRepository(TestWithoutGuardRepo);
  });
  afterEach(async () => {
    await app.stop();
  });

  it('should be able use existing guard service provided by the component', async () => {
    const result = await repo.create({name: 'test'});
    expect(result).to.have.property('tenantId', mockUser1.tenantId);
  });

  it('should be able to use a new guard service bound in the context', async () => {
    const stub = sinon.createStubInstance(TenantGuardService);
    stub.skipTenantGuard.resolves(false);
    const mockPayload = {name: 'test', tenantId: 'test'};
    stub.create.resolves(mockPayload);
    app.bind(TenantUtilitiesBindings.GuardService).to(stub);
    const newRepo = await app.get<TestRepo>('repositories.TestRepo');
    const result = await newRepo.create({name: 'test'});
    sinon.assert.calledOnce(stub.skipTenantGuard);
    expect(result).to.have.property('tenantId', mockPayload.tenantId);
    expect(result).to.have.property('name', mockPayload.name);
  });
});
