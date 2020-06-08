import { VideoChatInterface } from "../../../types";
import {
    sinon, expect, StubbedInstanceWithSinonAccessor, createStubInstance
} from '@loopback/testlab';
import { VideoChatArchiveController } from '../../../controllers';
import { VonageProvider } from '../../../providers/vonage';
import { setUpMockProvider, getVonageArchiveResponse, getVonageArchiveResponseList } from '../../helpers';
import { AuditLogsRepository } from '../../../repositories';

describe('Archive APIs', () => {
  const archiveId = 'dummy-archive-id';
  const invalidArchiveId = '';
  let auditLogRepo: StubbedInstanceWithSinonAccessor<AuditLogsRepository>;
  let videoChatProvider: VideoChatInterface;
  let controller: VideoChatArchiveController;

  afterEach(() => sinon.restore());

  describe('GET /archives/{archiveId}', () => {
    it('returns an archive object', async () => {
      setUp({getArchives: sinon.stub().returns(getVonageArchiveResponse({}))});
      const result = await controller.getArchive(archiveId);
      expect(result).to.have.property('sessionId').which.is.a.String;
    });

    it('returns an error for invalid archiveId', async () => {
      setUp({getArchives: sinon.stub().returns(getVonageArchiveResponse({}))});
      const error = await controller.getArchive(invalidArchiveId).catch(err => err);
      expect(error).instanceOf(Error);
    });
  });

  describe('GET /archives', () => {
    it('returns an archive list', async () => {
      setUp({getArchives: sinon.stub().returns(getVonageArchiveResponseList({}))});
      const result = await controller.getArchives();
      expect(result).to.have.property('count').which.is.a.Number;
      expect(result).to.have.property('items').which.is.an.Array;
    });

    it('returns a count of zero when no archvies exist', async () => {
      setUp({getArchives: sinon.stub().returns(getVonageArchiveResponseList({count: 0, items: []}))});
      const result = await controller.getArchives();
      expect(result).to.have.property('count').which.eql(0);
      expect(result).to.have.property('items').which.eql([]);
    });
  });

  describe('DEL /archives/{archiveId}', () => {
    it('deletes the archive', async () => {
      setUp({deleteArchive: sinon.stub().resolves() });
      const result = await controller.deleteArchive(archiveId);
      expect(result).to.be.Null;
    });

    it('returns an error for invalid archive id', async () => {
      setUp({deleteArchive: sinon.stub().resolves() });
      const error = await controller.deleteArchive(invalidArchiveId).catch(err => err);
      expect(error).instanceOf(Error);
    });
  });

  function setUp(providerStub: Partial<VideoChatInterface>) {
    process.env.VONAGE_API_KEY = 'dummy';
    process.env.VONAGE_API_SECRET = 'dummy';

    auditLogRepo = createStubInstance(AuditLogsRepository);

    const stubbedProvider = setUpMockProvider(providerStub);
    sinon.stub(VonageProvider.prototype, 'value').returns(stubbedProvider);
    videoChatProvider = new VonageProvider(auditLogRepo).value();

    controller = new VideoChatArchiveController(videoChatProvider);
  }
});
