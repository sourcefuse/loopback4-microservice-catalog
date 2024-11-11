import {createStubInstance, expect, sinon} from '@loopback/testlab';
import {archiveLogs} from '../sample-data/archive-log';

import {juggler} from '@loopback/repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {CustomFilter} from '../../models';
import {MappingLogRepository} from '../../repositories';
import {DummyAuditServiceApplication} from '../fixtures/dummy-application';
import {
  auditLogRepository,
  getTestAuditController,
  givenEmptyTestDB,
  populateTestDB,
  testUser,
} from '../helpers/db.helper';
import {mappingLog} from '../sample-data/mapping-log';

const testFromDate = new Date('2023-05-06T09:35:07.826Z');
const testToDate = new Date('2023-05-10T09:35:07.826Z');

describe('POST /audit-logs/archive', () => {
  let app: DummyAuditServiceApplication;
  beforeEach(async () => {
    app = new DummyAuditServiceApplication({
      rest: {
        port: 3001,
      },
    });
    const ds = new juggler.DataSource({
      name: 'AuditDB',
      connector: 'memory',
    });
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    app.dataSource(ds);

    await app.boot();
    await app.start();
    await givenEmptyTestDB();
    await populateTestDB(app);
  });
  afterEach(async () => {
    await app.stop();
  });
  it('archive logs when  3 parameters are provided and deleted is false', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      date: {
        fromDate: testFromDate,
        toDate: testToDate,
      },
      deleted: false,
      actedOn: 'Product',
    });

    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();

    const expectedIds = ['3', '4', '5', '6'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    sinon.assert.match(controllerResult.numberOfEntriesArchived, 2);
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when 3 parameters are provided and deleted is true', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      date: {
        fromDate: testFromDate,
        toDate: testToDate,
      },
      deleted: true,
      actedOn: 'Product',
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '6'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when date parameter is not provided and deleted is true', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      deleted: true,
      actedOn: 'Product',
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '6'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when deleted parameter is not provided', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      date: {
        fromDate: testFromDate,
        toDate: testToDate,
      },
      actedOn: 'Product',
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '5', '6'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when actedOn parameter is not provided and deleted is false', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      date: {
        fromDate: testFromDate,
        toDate: testToDate,
      },
      deleted: false,
    });

    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '4', '5'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when actedOn parameter is not provided and deleted is true', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      date: {
        fromDate: testFromDate,
        toDate: testToDate,
      },
      deleted: true,
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '6'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when only date parameter is provided', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      date: {
        fromDate: testFromDate,
        toDate: testToDate,
      },
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '5'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when none of the parameter is provided', async () => {
    const customFilter: CustomFilter = new CustomFilter({});
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when actedOnList parameter is provided', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      actedOnList: ['Product'],
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['6'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when actedOnList parameter is provided and deleted is true', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      actedOnList: ['Product'],
      deleted: true,
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '6'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when actionGroupList parameter is provided', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      actionGroupList: ['Product_group'],
    });
    const {auditLogController} = getTestAuditController(app);
    const mappingLogRepositoryStub = createStubInstance(MappingLogRepository);
    const mappingLogFetch = mappingLogRepositoryStub.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const actualResult = await auditLogRepository.find();
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
});
