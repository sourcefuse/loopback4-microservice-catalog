// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {Filter} from '@loopback/repository';
import {AuditLog, AuditLogRepository} from '@sourceloop/audit-log';
import {AuditController} from '../../controllers';
import {dummyLog} from '../sample-data/dummy-log';

let auditLogRepository: StubbedInstanceWithSinonAccessor<AuditLogRepository>;
let controller: AuditController;
const setUpStub = () => {
  auditLogRepository = createStubInstance(AuditLogRepository);
  controller = new AuditController(auditLogRepository);
};

beforeEach(setUpStub);

describe('AuditController(unit) ', () => {
  describe('POST /audit-logs', () => {
    it('creates an audit log', async () => {
      const logCreate = auditLogRepository.stubs.create;
      logCreate.resolves(Object.assign(dummyLog, {id: 'uuid'}));
      const controllerResult = await controller.create(dummyLog);
      expect(controllerResult).to.have.a.property('id').which.is.a.String();
      sinon.assert.calledOnce(logCreate);
    });
    it('throws 400 if payload invalid', async () => {
      const logCreate = auditLogRepository.stubs.create;
      logCreate.rejects(new HttpErrors.BadRequest('Invalid Payload'));
      const controllerResult = await controller
        .create({abc: '1'})
        .catch(err => err);
      expect(controllerResult).instanceOf(HttpErrors.BadRequest);
    });
  });

  describe('GET /audit-logs', () => {
    it('fetches all audit logs', async () => {
      const logFetch = auditLogRepository.stubs.find;
      logFetch.resolves([dummyLog]);
      const controllerResult = await controller.find();
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).to.have.length(1);
    });

    it('fetches only filtered logs', async () => {
      const logFetch = auditLogRepository.stubs.find;
      const filter: Filter<AuditLog> = {
        where: {
          id: 1,
        },
      };
      logFetch.withArgs(filter).resolves([Object.assign(dummyLog, {id: 1})]);
      logFetch.resolves([
        Object.assign(dummyLog, {id: 1}),
        Object.assign(dummyLog, {id: 2}),
      ]);
      const controllerResult = await controller.find(filter);
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).to.have.length(1);
      const controllerResultWithoutFilter = await controller.find();
      expect(controllerResultWithoutFilter).to.have.length(2);
    });
  });

  describe('GET /audit-logs/count', () => {
    it('fetches count of all audit logs', async () => {
      const logFetch = auditLogRepository.stubs.count;
      logFetch.resolves({
        count: 1,
      });
      const controllerResult = await controller.count();
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).to.have.property('count').equal(1);
    });
  });

  describe('GET /audit-logs/:id', () => {
    it('fetches audit log by id', async () => {
      const logFetch = auditLogRepository.stubs.findById;
      logFetch.withArgs('1').resolves(dummyLog);
      const controllerResult = await controller.findById('1');
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).to.be.deepEqual(dummyLog);
    });

    it('gives 404 when audit log not found for given id', async () => {
      const logFetch = auditLogRepository.stubs.findById;
      logFetch.withArgs('1').rejects(new HttpErrors.NotFound('Not Found'));
      const controllerResult = await controller.findById('1').catch(err => err);
      sinon.assert.calledOnce(logFetch);
      expect(controllerResult).instanceOf(HttpErrors.NotFound);
    });
  });
});
