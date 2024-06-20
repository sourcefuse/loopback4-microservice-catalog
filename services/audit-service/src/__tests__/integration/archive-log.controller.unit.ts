import {expect, sinon} from '@loopback/testlab';
import {archiveLogs} from '../sample-data/archive-log';

import {CustomFilter} from '../../models';
import {
  getTestAuditController,
  getTestDBRepositories,
  givenEmptyTestDB,
  populateTestDB,
} from '../helpers/db.helper';
import {mappingLog} from '../sample-data/mapping-log';

const testFromDate = new Date('2023-05-06T09:35:07.826Z');
const testToDate = new Date('2023-05-10T09:35:07.826Z');

describe('POST /audit-logs/archive', () => {
  beforeEach(async () => {
    await givenEmptyTestDB();
    await populateTestDB();
  });
  it('archive logs when 3 parameters are provided and deleted is false', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      date: {
        fromDate: testFromDate,
        toDate: testToDate,
      },
      deleted: false,
      actedOn: 'Product',
    });

    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);

    const {auditLogRepository} = getTestDBRepositories();
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
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
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
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
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
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
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

    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);

    const {auditLogRepository} = getTestDBRepositories();

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
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
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
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
    const actualResult = await auditLogRepository.find();
    const expectedIds = ['3', '5'];

    expect(actualResult).to.be.containDeep(expectedIds.map(id => ({id})));
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when none of the parameter is provided', async () => {
    const customFilter: CustomFilter = new CustomFilter({});
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
    const actualResult = await auditLogRepository.find();
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
  it('archive logs when actedOnList parameter is provided', async () => {
    const customFilter: CustomFilter = new CustomFilter({
      actedOnList: ['Product'],
    });
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
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
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
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
    const {auditLogController, mappingLogRepository} = getTestAuditController();

    const mappingLogFetch = mappingLogRepository.stubs.create;
    mappingLogFetch.resolves(mappingLog);

    const controllerResult = await auditLogController.archive(customFilter);
    const {auditLogRepository} = getTestDBRepositories();
    const actualResult = await auditLogRepository.find();
    expect(
      actualResult.length + controllerResult.numberOfEntriesArchived,
    ).to.be.equal(archiveLogs.length);
  });
});
