import {HttpErrors} from '@loopback/rest';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {VideoChatSessionController} from '../../../controllers';
import {VonageConfig, VonageProvider} from '../../../providers/vonage';
import {
  AuditLogsRepository,
  SessionAttendeesRepository,
  VideoChatSessionRepository,
} from '../../../repositories';
import {VonageService} from '../../../providers/vonage/vonage.service';
import {VideoChatInterface} from '../../../types';
import {
  getDate,
  getDatePastThreshold,
  getFutureDate,
  getMeetingOptions,
  getMeetingResponse,
  getSessionAttendeesModel,
  getSessionOptions,
  getSessionResponse,
  getVideoChatSession,
  getWebhookPayload,
  setUpMockProvider,
} from '../../helpers';

describe('Session APIs', () => {
  const pastDate = getDate('October 01, 2019 00:00:00');
  const futureDate = getFutureDate();
  const meetingLinkId = 'dummy-meeting-link-id';
  const timeToStart = 30;
  let videoChatSessionRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
  let auditLogRepo: StubbedInstanceWithSinonAccessor<AuditLogsRepository>;
  let auidtLogCreate: sinon.SinonStub;
  let sessionAttendeesRepo: StubbedInstanceWithSinonAccessor<SessionAttendeesRepository>;
  let config: VonageConfig;

  let videoChatProvider: VideoChatInterface;
  let controller: VideoChatSessionController;
  let vonageService: VonageService;

  afterEach(() => sinon.restore());

  describe('POST /session', () => {
    it('returns a meeting Id of type string, saves the session Id, schedules meeting', async () => {
      setUp({
        getMeetingLink: sinon.stub().returns(getMeetingResponse({})),
      });
      const meetingOptions = getMeetingOptions({
        isScheduled: true,
        scheduleTime: futureDate,
      });
      const save = videoChatSessionRepo.stubs.save;
      save.resolves();
      const result = await controller.getMeetingLink(meetingOptions);
      expect(result).to.be.a.String();
      sinon.assert.calledOnce(save);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error when provider fails to create a session', async () => {
      setUp({
        getMeetingLink: sinon
          .stub()
          .rejects(new HttpErrors.BadRequest('Error creating session')),
      });
      const meetingOptions = getMeetingOptions({});
      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(error).instanceof(Error);
    });

    it('only schedules a meeting with a schedule time', async () => {
      setUp({});
      const meetingOptions = getMeetingOptions({
        isScheduled: true,
      });
      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(error).instanceof(Error);
    });

    it('does not schedule a meeting with invalid schedule time', async () => {
      setUp({});
      const meetingOptions = getMeetingOptions({
        isScheduled: true,
        scheduleTime: getDate('Invalid'),
      });
      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(error).instanceof(Error);
    });

    it('does not schedule a meeting if schedule time is in the past', async () => {
      setUp({});
      const meetingOptions = getMeetingOptions({
        isScheduled: true,
        scheduleTime: pastDate,
      });
      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(error).instanceof(Error);
    });
  });

  describe('POST /session/{meetingLink}/token', () => {
    it('returns a session Id and token of type string', async () => {
      setUp({
        getToken: sinon.stub().returns(getSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const result = await controller.getMeetingToken(
        sessionOptions,
        meetingLinkId,
      );
      expect(result.sessionId).to.be.a.String();
      expect(result.token).to.be.a.String();
      sinon.assert.calledOnce(findOne);
    });

    it('gives an error for invalid meeting link', async () => {
      setUp({
        getToken: sinon.stub().returns(getSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({});
      const invalidMeetingLink = '';
      const error = await controller
        .getMeetingToken(sessionOptions, invalidMeetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('gives an error when provider fails to generate token', async () => {
      setUp({
        getToken: sinon
          .stub()
          .rejects(new HttpErrors.BadRequest('Error generating token')),
      });
      const sessionOptions = getSessionOptions({});
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLinkId)
        .catch(err => err);
      expect(error).instanceof(Error);
    });

    it('denies if the threshold time to join has not been achieved (scheduling logic)', async () => {
      setUp({
        getToken: sinon.stub().returns(getSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(
        getVideoChatSession({
          isScheduled: true,
          scheduleTime: getDatePastThreshold(timeToStart),
        }),
      );
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLinkId)
        .catch(err => err);
      expect(error).instanceOf(Error);
      sinon.assert.called(findOne);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('denies if the expire time is invalid', async () => {
      setUp({
        getToken: sinon.stub().returns(getSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({
        expireTime: new Date('Invalid'),
      });
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLinkId)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('denies if the expire time is in the past', async () => {
      setUp({
        getToken: sinon.stub().returns(getSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({expireTime: pastDate});
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLinkId)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('denies if the meeting has already ended', async () => {
      setUp({
        getToken: sinon.stub().returns(getSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({endTime: pastDate}));
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLinkId)
        .catch(err => err);
      expect(error).instanceOf(Error);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledOnce(auidtLogCreate);
    });
  });

  describe('PATCH /session/{meetingLink}/end', () => {
    it('updates the end time', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      const dummyId = 1;
      findOne.resolves(getVideoChatSession({id: dummyId}));
      const updateById = videoChatSessionRepo.stubs.updateById;
      updateById.resolves();
      await controller.endSession(meetingLinkId);
      sinon.assert.calledWith(findOne, {where: {meetingLink: meetingLinkId}});
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error for invalid meeting link', async () => {
      setUp({});
      const invalidMeetingLink = '';
      const error = await controller
        .endSession(invalidMeetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error if meeting link not found ', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .endSession(meetingLinkId)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('returns an error if meeting has already ended', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({endTime: pastDate}));
      const error = await controller
        .endSession(meetingLinkId)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(findOne);
      sinon.assert.calledOnce(auidtLogCreate);
    });
  });

  describe('POST /webhooks/session', () => {
    it('saves the attendee for event connectionCreated when attendee connects', async () => {
      setUp({});
      const webhookPayload = getWebhookPayload({});
      const find = sessionAttendeesRepo.stubs.find;
      find.resolves();
      const create = sessionAttendeesRepo.stubs.create;
      create.resolves();
      await controller.checkWebhookPayload(webhookPayload);
      sinon.assert.calledOnce(create);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('updates the attendee for event connectionCreated when attendee re-connects', async () => {
      setUp({});
      const webhookPayload = getWebhookPayload({
        connection: {
          id: 'd053fcc8-c681-41d5-8ec2-7a9e1434a21f',
          createdAt: 2470257688144,
          data: 'TOKENDATA',
        },
      });
      const findOne = sessionAttendeesRepo.stubs.findOne;
      findOne.resolves(getSessionAttendeesModel());
      const updateById = sessionAttendeesRepo.stubs.updateById;
      updateById.resolves();
      await controller.checkWebhookPayload(webhookPayload);
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auidtLogCreate);
    });

    it('audit logs for any other event', async () => {
      setUp({});
      const webhookPayload = getWebhookPayload({
        event: 'connectionDestroyed',
        reason: 'clientDisconnected',
      });
      await controller.checkWebhookPayload(webhookPayload);
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

    sessionAttendeesRepo = createStubInstance(SessionAttendeesRepository);

    const stubbedProvider = setUpMockProvider(providerStub);
    sinon.stub(VonageProvider.prototype, 'value').returns(stubbedProvider);
    vonageService = new VonageService(config);
    videoChatProvider = new VonageProvider(vonageService, auditLogRepo).value();
    controller = new VideoChatSessionController(
      videoChatSessionRepo,
      videoChatProvider,
      auditLogRepo,
      sessionAttendeesRepo,
      config,
    );
  }
});
