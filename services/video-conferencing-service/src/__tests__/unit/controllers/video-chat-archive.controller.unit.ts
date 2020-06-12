import {VideoChatInterface} from '../../../types';
import {
  sinon,
  expect,
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
} from '@loopback/testlab';
import {VideoChatArchiveController} from '../../../controllers';
import {VonageProvider, VonageConfig} from '../../../providers/vonage';
import {
  setUpMockProvider,
  getArchiveResponse,
  getArchiveResponseList,
  getVideoChatSession,
} from '../../helpers';
import {AuditLogsRepository, VideoChatSessionRepository} from '../../../repositories';

describe('Archive APIs', () => {
  const archiveId = 'dummy-archive-id';
  const invalidArchiveId = '';
  let auditLogRepo: StubbedInstanceWithSinonAccessor<AuditLogsRepository>;
  let auidtLogCreate: sinon.SinonStub;
  let videoChatSessionRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
  let videoChatProvider: VideoChatInterface;
  let config: VonageConfig;
  let controller: VideoChatArchiveController;

  afterEach(() => sinon.restore());

  describe('GET /archives/{archiveId}', () => {
    it('returns an archive object', async () => {
      setUp({getArchives: sinon.stub().returns(getArchiveResponse({}))});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({archiveId: archiveId}));
      const result = await controller.getArchive(archiveId);
      expect(result).to.have.property('sessionId').which.is.a.String;
      sinon.assert.calledWith(findOne, {where: {archiveId}});
    });

    it('returns an error for non-existent archiveId', async () => {
      setUp({getArchives: sinon.stub().returns(getArchiveResponse({}))});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .getArchive(invalidArchiveId)
        .catch(err => err);
      expect(error).instanceOf(Error);
      sinon.assert.calledWith(findOne, {where: {archiveId: invalidArchiveId}});
      sinon.assert.calledOnce(auidtLogCreate);
    });
  });

  describe('GET /archives', () => {
    it('returns an archive list', async () => {
      setUp({getArchives: sinon.stub().returns(getArchiveResponseList({}))});
      const result = await controller.getArchives();
      expect(result).to.have.property('count').which.is.a.Number;
      expect(result).to.have.property('items').which.is.an.Array;
    });

    it('returns a count of zero when no archvies exist', async () => {
      setUp({
        getArchives: sinon
          .stub()
          .returns(getArchiveResponseList({count: 0, items: []})),
      });
      const result = await controller.getArchives();
      expect(result)
        .to.have.property('count')
        .which.eql(0);
      expect(result)
        .to.have.property('items')
        .which.eql([]);
    });
  });

  describe('DEL /archives/{archiveId}', () => {
    it('deletes the archive', async () => {
      setUp({deleteArchive: sinon.stub().resolves()});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({archiveId: archiveId}));
      await controller.deleteArchive(archiveId);
      sinon.assert.calledWith(findOne, {where: {archiveId}});
    });

    it('returns an error for non-existent archive id', async () => {
      setUp({deleteArchive: sinon.stub().resolves()});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .deleteArchive(invalidArchiveId)
        .catch(err => err);
      expect(error).instanceOf(Error);
            sinon.assert.calledWith(findOne, {where: {archiveId: invalidArchiveId}});
      sinon.assert.calledOnce(auidtLogCreate);
    });
  });

  function setUp(providerStub: Partial<VideoChatInterface>) {
    config = {
      apiKey: 'dummy',
      apiSecret: 'dummy',
      timeToStart: 30,
    }; 
    videoChatSessionRepo = createStubInstance(VideoChatSessionRepository);
    auditLogRepo = createStubInstance(AuditLogsRepository);
    auidtLogCreate = auditLogRepo.stubs.create;
    auidtLogCreate.resolves();

    const stubbedProvider = setUpMockProvider(providerStub);
    sinon.stub(VonageProvider.prototype, 'value').returns(stubbedProvider);
    videoChatProvider = new VonageProvider(config, auditLogRepo).value();

    controller = new VideoChatArchiveController(videoChatProvider, videoChatSessionRepo, auditLogRepo);
  }
});
