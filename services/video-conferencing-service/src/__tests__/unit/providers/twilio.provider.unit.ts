// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import proxyquire from 'proxyquire';
import {
  ExternalStorageName,
  SessionAttendeesRepository,
  VideoChatSessionRepository,
} from '../../..';
import {
  TwilioProvider,
  TwilioConfig,
  TwilioS3TargetOptions,
} from '../../../providers/twilio';
import {TwilioService} from '../../../providers/twilio/twilio.service';
import {
  getRoomInstance,
  getTwilioArchiveResponse,
  getTwilioMeetingOptions,
} from '../../helpers';

describe('TwilioProvider (unit)', () => {
  const sessionId = 'RM-dummy-meeting-id';
  const twilioFailureError = new Error('Twilio failure');
  const archiveId = 'RTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  const jwtToken = 'dummy-jwt-token';

  let sessionAttendeesRepo: StubbedInstanceWithSinonAccessor<SessionAttendeesRepository>;
  let videoChatSessionRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;

  let twilioProvider: TwilioProvider;
  let twilioService: TwilioService;
  let twilioConfig: TwilioConfig;

  sessionAttendeesRepo = createStubInstance(SessionAttendeesRepository);
  videoChatSessionRepo = createStubInstance(VideoChatSessionRepository);

  beforeEach(() => setUp());
  afterEach(() => sinon.restore());

  it('gives an error when twilio API keys and secret are not set', async () => {
    twilioConfig = {
      apiSecret: '',
      apiSid: '',
      accountSid: '',
      authToken: '',
    };

    expect.throws(
      () =>
        new TwilioService(
          twilioConfig,
          videoChatSessionRepo,
          sessionAttendeesRepo,
        ),
    );
  });

  describe(`getMeetingLink`, () => {
    it(`returns roomSid of new room`, async () => {
      sinon.stub(twilioService, 'createRoom').returns(getRoomInstance());
      const meetingOptions = getTwilioMeetingOptions({enableArchiving: true});
      const result = await twilioProvider
        .value()
        .getMeetingLink(meetingOptions);
      expect(result).to.have.property('meetingId').which.startWith('RM');
      expect(result).to.have.property('isArchived').which.eql(true);
    });

    it('returns an error if enableParticipantsOnConnect is enabled for peer-to-peer room type', async () => {
      const meetingOptions = getTwilioMeetingOptions({
        enableArchiving: true,
        type: 'peer-to-peer',
      });
      const result = await twilioProvider
        .value()
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(result).to.instanceOf(Error);
      expect(result).to.have.property(
        'message',
        'recordParticipantsOnConnect feature is not available for peer-to-peer',
      );
    });

    it('returns an error if twilio fails to create room', async () => {
      sinon
        .stub(twilioService, 'createRoom')
        .callsArgWith(0, twilioFailureError);
      const meetingOptions = getTwilioMeetingOptions({enableArchiving: true});
      const result = await twilioProvider
        .value()
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(result).instanceOf(Error);
    });
  });

  describe('getToken', () => {
    it('generates a token', async () => {
      const twilioSessionOptions = {};
      sinon.stub(twilioService, 'getAccessToken').returns(jwtToken);
      const result = await twilioProvider
        .value()
        .getToken(sessionId, twilioSessionOptions);
      expect(result).to.have.property('token').which.eql(jwtToken);
      expect(result).to.have.property('sessionId').which.eql(sessionId);
    });
    /* eslint-disable no-unused-expressions */

    it('returns an error twilio fails to generate token', async () => {
      const twilioSessionOptions = {};
      sinon.stub(twilioService, 'getAccessToken').throws(twilioFailureError);
      const call = async function () {
        await twilioProvider.value().getToken(sessionId, twilioSessionOptions);
      };
      expect(call).to.be.rejected;
    });
  });

  describe('getArchives', () => {
    it('returns an archive response for given archive id', async () => {
      sinon
        .stub(twilioService, 'fetchArchive')
        .returns(getTwilioArchiveResponse());

      const result = await twilioProvider.value().getArchives(archiveId);
      expect(result).to.have.property('sessionId').which.startWith('RM');
      expect(result).to.have.property('metaData').which.is.an.Object();
    });
    it('returns an error if passing null archive id', async () => {
      const error = await twilioProvider
        .value()
        .getArchives(null)
        .catch(err => err);
      expect(error).instanceOf(Error);
    });

    it('returns an error if twilio fails for archive id', async () => {
      sinon.stub(twilioService, 'fetchArchive').throws(twilioFailureError);
      expect(async () => {
        await twilioProvider.value().getArchives(archiveId);
      }).to.be.rejected;
    });
  });

  describe('deleteArchive', () => {
    it('delete the archive with given arhive id', async () => {
      const removeStub = sinon.stub().resolves(true);
      const recordingStub = sinon.stub().returns({
        remove: removeStub,
      });

      const TwilioMockService = proxyquire(
        '../../../providers/twilio/twilio.service',
        {
          twilio: (accountSid: string, authToken: string) => {
            return {
              video: {
                recordings: recordingStub,
              },
            };
          },
        },
      ).TwilioService;
      const twilioMockServiceInstance = new TwilioMockService(
        twilioConfig,
        videoChatSessionRepo,
        sessionAttendeesRepo,
      );
      twilioProvider = new TwilioProvider(twilioMockServiceInstance);

      await twilioProvider.value().deleteArchive(archiveId);
      sinon.assert.calledOnce(removeStub);
    });
  });

  describe('setUplloadTarget', () => {
    it('sets the upload target for S3', async () => {
      const tConig: TwilioConfig = {
        accountSid: 'ACdummy',
        apiSecret: 'dummy',
        authToken: 'dummyToken',
        apiSid: 'dummy',
        awsCredentialSid: 'dummy-awsCredentialSid',
      };
      const twilioS3TargetOption: TwilioS3TargetOptions = {
        awsS3Url: 'dummy-aws3Url',
        bucket: 'dummy-bucket',
        name: ExternalStorageName.AWSS3,
      };
      const createStub = sinon.stub().resolves({
        accountSid: twilioConfig.accountSid,
        awsCredentialsSid: twilioConfig.awsCredentialSid,
      });
      const recordingSettingsStub = sinon.stub().returns({
        create: createStub,
      });
      const TwilioMockService = proxyquire(
        '../../../providers/twilio/twilio.service',
        {
          twilio: (accountSid: string, authToken: string) => {
            return {
              video: {
                recordingSettings: recordingSettingsStub,
              },
            };
          },
        },
      ).TwilioService;
      const twilioMockServiceInstance = new TwilioMockService(
        tConig,
        videoChatSessionRepo,
        sessionAttendeesRepo,
      );
      twilioProvider = new TwilioProvider(twilioMockServiceInstance);
      await twilioProvider.value().setUploadTarget(twilioS3TargetOption);
      sinon.assert.calledOnce(createStub);
    });

    it('returns an error if S3 configs are null', async () => {
      const twilioS3TargetOption: TwilioS3TargetOptions = {
        awsS3Url: 'dummy-aws3Url',
        bucket: 'dummy-bucket',
        name: ExternalStorageName.AWSS3,
      };
      const result = await twilioProvider
        .value()
        .setUploadTarget(twilioS3TargetOption)
        .catch(err => err);
      expect(result).instanceOf(Error);
    });
  });

  function setUp() {
    twilioConfig = {
      accountSid: 'ACdummy',
      apiSecret: 'dummy',
      authToken: 'dummyToken',
      apiSid: 'dummy',
    };
    sessionAttendeesRepo = createStubInstance(SessionAttendeesRepository);
    videoChatSessionRepo = createStubInstance(VideoChatSessionRepository);

    twilioService = new TwilioService(
      twilioConfig,
      videoChatSessionRepo,
      sessionAttendeesRepo,
    );
    twilioProvider = new TwilioProvider(twilioService);
  }
});
