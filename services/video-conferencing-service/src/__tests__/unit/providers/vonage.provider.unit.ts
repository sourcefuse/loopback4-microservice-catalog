import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {VonageEnums} from '../../../enums';
import {
  VonageAzureTargetOptions,
  VonageConfig,
  VonageProvider,
  VonageS3TargetOptions,
} from '../../../providers/vonage';
import {AuditLogsRepository} from '../../../repositories';
import {VonageService} from '../../../providers/vonage/vonage.service';
import {
  getVonageArchive,
  getVonageArchiveList,
  getVonageMeetingOptions,
  getVonageSessionOptions,
} from '../../helpers';

describe('VonageProvider (unit)', () => {
  const sessionId = 'dummy-session-id';
  const vonageFailureError = new Error('Vonage failure');
  const archiveId = 'dummy-archive-id';
  let auditLogRepo: StubbedInstanceWithSinonAccessor<AuditLogsRepository>;
  let auidtLogCreate: sinon.SinonStub;
  let vonageProvider: VonageProvider;
  let vonageService: VonageService;
  let config: VonageConfig;

  beforeEach(() => setUp());
  afterEach(() => sinon.restore());

  it('gives an error when vonage API key and secret are not set', async () => {
    config = {
      apiKey: '',
      apiSecret: '',
      timeToStart: 30,
    };

    expect.throws(() => new VonageService(config));
  });

  describe('getMeetingLink', () => {
    it('returns a session id for archive enabled session', async () => {
      const error = null;
      const session = {sessionId: sessionId};
      sinon
        .stub(vonageService.VonageClient, 'createSession')
        .callsArgWith(1, error, session);

      const meetingOptions = getVonageMeetingOptions({enableArchiving: true});
      const result = await vonageProvider
        .value()
        .getMeetingLink(meetingOptions);
      expect(result).to.have.property('mediaMode').which.eql('routed');
      expect(result).to.have.property('archiveMode').which.eql('always');
      expect(result).to.have.property('sessionId').which.eql(sessionId);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns a session id for end to end encrypted session', async () => {
      const error = null;
      const session = {sessionId: sessionId};
      sinon
        .stub(vonageService.VonageClient, 'createSession')
        .callsArgWith(1, error, session);

      const meetingOptions = getVonageMeetingOptions({
        endToEndEncryption: true,
      });
      const result = await vonageProvider
        .value()
        .getMeetingLink(meetingOptions);
      expect(result).to.have.property('mediaMode').which.eql('relayed');
      expect(result).to.have.property('sessionId').which.eql(sessionId);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error if vonage fails to create session', async () => {
      sinon
        .stub(vonageService.VonageClient, 'createSession')
        .callsArgWith(1, vonageFailureError);

      const meetingOptions = getVonageMeetingOptions({});
      const result = await vonageProvider
        .value()
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(result).instanceOf(Error);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error if enable archiving is enabled with end to end encryption', async () => {
      const meetingOptions = getVonageMeetingOptions({
        endToEndEncryption: true,
        enableArchiving: true,
      });
      const result = await vonageProvider
        .value()
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(result).instanceOf(Error);
    });
  });

  describe('getToken', () => {
    it('generates a token', async () => {
      const sessionOptions = getVonageSessionOptions({});
      sinon
        .stub(vonageService.VonageClient, 'generateToken')
        .returns('dummy-token');

      const result = await vonageProvider
        .value()
        .getToken(sessionId, sessionOptions);
      expect(result).to.have.property('sessionId').which.eql(sessionId);
      expect(result).to.have.property('token').which.eql('dummy-token');
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error if vonage fails to generate token', async () => {
      const sessionOptions = getVonageSessionOptions({});
      sinon
        .stub(vonageService.VonageClient, 'generateToken')
        .throws(new Error('Failed to generate token'));

      const error = await vonageProvider
        .value()
        .getToken(sessionId, sessionOptions)
        .catch(err => err);
      expect(error).instanceOf(Error);
      sinon.assert.calledOnce(auidtLogCreate);
    });
  });

  describe('getArchives', () => {
    it('returns an archive response for given archive id', async () => {
      const error = null;
      const archive = getVonageArchive();
      sinon
        .stub(vonageService.VonageClient, 'getArchive')
        .callsArgWith(1, error, archive);

      const result = await vonageProvider.value().getArchives(archiveId);
      expect(result).to.have.property('name').which.eql(archive.name);
      expect(result).to.have.property('sessionId').which.eql(archive.sessionId);
      expect(result).to.have.property('metaData').which.is.an.Object();
    });

    it('returns an archive response list for null archive id', async () => {
      const nullArchiveId = null;
      const error = null;
      const archives = getVonageArchiveList();
      sinon
        .stub(vonageService.VonageClient, 'listArchives')
        .callsArgWith(1, error, archives);

      const result = await vonageProvider.value().getArchives(nullArchiveId);
      expect(result).to.have.property('count').which.eql(archives.length);
      expect(result).to.have.property('items').which.is.an.Array();
    });

    it('returns an error if vonage fails for given archive id', async () => {
      sinon
        .stub(vonageService.VonageClient, 'getArchive')
        .callsArgWith(1, vonageFailureError);

      const result = await vonageProvider
        .value()
        .getArchives(archiveId)
        .catch(err => err);
      expect(result).instanceOf(Error);
    });

    it('returns an error if vonage fails to list archives', async () => {
      const nullArchiveId = null;
      sinon
        .stub(vonageService.VonageClient, 'listArchives')
        .callsArgWith(1, vonageFailureError);

      const result = await vonageProvider
        .value()
        .getArchives(nullArchiveId)
        .catch(err => err);
      expect(result).instanceOf(Error);
    });
  });

  describe('deleteArchives', () => {
    it('deletes the archive with given archive id', async () => {
      const error = null;
      const deleteArchive = sinon.stub(
        vonageService.VonageClient,
        'deleteArchive',
      );
      deleteArchive.callsArgWith(1, error);

      await vonageProvider.value().deleteArchive(archiveId);
      sinon.assert.calledOnce(deleteArchive);
    });

    it('reutrns an error if vonage fails to delete archive', async () => {
      sinon
        .stub(vonageService.VonageClient, 'deleteArchive')
        .callsArgWith(1, vonageFailureError);

      const result = await vonageProvider
        .value()
        .deleteArchive(archiveId)
        .catch(err => err);
      expect(result).instanceOf(Error);
    });
  });

  describe('setUploadTarget', () => {
    const vonageS3Options: VonageS3TargetOptions = {
      accessKey: '1234',
      secretKey: '****',
      region: 'dummy-region',
      bucket: 'dummy-bucket',
      endpoint: 'dummy-endpoint',
      fallback: VonageEnums.FallbackType.Opentok,
    };
    it('sets the upload target for S3', async () => {
      const mock = new MockAdapter(axios);
      mock
        .onPut(
          `https://api.opentok.com/v2/project/${config.apiKey}/archive/storage`,
        )
        .reply(200);
      await vonageProvider.value().setUploadTarget(vonageS3Options);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('sets the upload target for Azure', async () => {
      const azureOptions: VonageAzureTargetOptions = {
        accountName: 'dummy-account-name',
        accountKey: 'dummy-account-key',
        container: 'dummy-container',
        domain: 'dummy-domain',
        fallback: VonageEnums.FallbackType.Opentok,
      };
      const mock = new MockAdapter(axios);
      mock
        .onPut(
          `https://api.opentok.com/v2/project/${config.apiKey}/archive/storage`,
        )
        .reply(200);
      await vonageProvider.value().setUploadTarget(azureOptions);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error if vonage API fails', async () => {
      const mock = new MockAdapter(axios);
      mock
        .onPut(
          `https://api.opentok.com/v2/project/${config.apiKey}/archive/storage`,
        )
        .reply(400);
      const error = await vonageProvider
        .value()
        .setUploadTarget(vonageS3Options)
        .catch(err => err);
      expect(error).instanceOf(Error);
      sinon.assert.calledOnce(auidtLogCreate);
    });
  });

  function setUp() {
    config = {
      apiKey: 'dummy',
      apiSecret: 'dummy',
      timeToStart: 30,
    };

    auditLogRepo = createStubInstance(AuditLogsRepository);

    vonageService = new VonageService(config);
    vonageProvider = new VonageProvider(vonageService, auditLogRepo);
    auidtLogCreate = auditLogRepo.stubs.create;
    auidtLogCreate.resolves();
  }
});
