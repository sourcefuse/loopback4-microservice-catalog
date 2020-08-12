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
  getAttendeesList,
  stream,
} from '../../helpers';

describe('Session APIs', () => {
  const pastDate = getDate('October 01, 2019 00:00:00');
  const futureDate = getFutureDate();
  const meetingLinkId = 'dummy-meeting-link-id';
  const timeToStart = 30;
  let videoChatSessionRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
  let auditLogRepo: StubbedInstanceWithSinonAccessor<AuditLogsRepository>;
  let auditLogCreate: sinon.SinonStub;
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
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
    });
  });

  describe('PATCH /session/{meetingLink},', () => {
    it('updates the scheduled Meeting time if the meeting is schedeuled', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      const dummyId = 1;
      findOne.resolves(getVideoChatSession({id: dummyId}));
      const updateById = videoChatSessionRepo.stubs.updateById;
      updateById.resolves();
      await controller.editMeeting(meetingLinkId, {
        scheduleTime: futureDate,
        isScheduled: true,
      });
      sinon.assert.calledWith(findOne, {
        where: {
          meetingLink: meetingLinkId,
        },
      });
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auditLogCreate);
    });
    it('updates the meeting if it is not scheduled', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      const dummyId = 1;
      findOne.resolves(getVideoChatSession({id: dummyId}));
      const updateById = videoChatSessionRepo.stubs.updateById;
      updateById.resolves();
      await controller.editMeeting(meetingLinkId, {
        isScheduled: false,
      });
      sinon.assert.calledWith(findOne, {
        where: {
          meetingLink: meetingLinkId,
        },
      });
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auditLogCreate);
    });
    it('returns an error for invalid meeting link', async () => {
      setUp({});
      const invalidMeetingLink = '';
      const error = await controller
        .endSession(invalidMeetingLink)
        .catch(err => err);
      sinon.assert.calledOnce(auditLogCreate);
      expect(error).instanceof(Error);
    });
    it('returns an error if meeting link not found ', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .endSession(meetingLinkId)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(auditLogCreate);
      sinon.assert.calledOnce(findOne);
    });
    it('returns an error if isScheduled is true but scheduleTime is not provided', async () => {
      setUp({});
      const meetingOptions = getMeetingOptions({
        isScheduled: true,
      });
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const error = await controller
        .editMeeting(meetingLinkId, meetingOptions)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledWith(findOne, {
        where: {
          meetingLink: meetingLinkId,
        },
      });
      sinon.assert.calledOnce(auditLogCreate);
      sinon.assert.calledOnce(findOne);
    });
    it('does not schedule a meeting with invalid schedule time', async () => {
      setUp({});
      const meetingOptions = getMeetingOptions({
        isScheduled: true,
        scheduleTime: getDate('Invalid'),
      });
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const error = await controller
        .editMeeting(meetingLinkId, meetingOptions)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledWith(findOne, {
        where: {
          meetingLink: meetingLinkId,
        },
      });
      sinon.assert.calledOnce(auditLogCreate);
      sinon.assert.calledOnce(findOne);
    });
    it('does not schedule a meeting if schedule time is in the past', async () => {
      setUp({});
      const meetingOptions = getMeetingOptions({
        isScheduled: true,
        scheduleTime: pastDate,
      });
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const error = await controller
        .editMeeting(meetingLinkId, meetingOptions)
        .catch(err => err);
      sinon.assert.calledWith(findOne, {
        where: {
          meetingLink: meetingLinkId,
        },
      });
      sinon.assert.calledOnce(auditLogCreate);
      sinon.assert.calledOnce(findOne);
      expect(error).instanceof(Error);
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
      sinon.assert.calledOnce(auditLogCreate);
    });

    it('returns an error for invalid meeting link', async () => {
      setUp({});
      const invalidMeetingLink = '';
      const error = await controller
        .endSession(invalidMeetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
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
      sinon.assert.calledOnce(auditLogCreate);
    });

    it('updates the metaData and isDeleted status for event connectionCreated if the attendee already exists', async () => {
      setUp({});
      const webhookPayload = getWebhookPayload({});
      const findOne = sessionAttendeesRepo.stubs.findOne;
      findOne.resolves(getSessionAttendeesModel());
      const updateById = sessionAttendeesRepo.stubs.updateById;
      updateById.resolves();
      await controller.checkWebhookPayload(webhookPayload);
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auditLogCreate);
    });

    it('updates the metaData and isDeleted status for event connectionDestroyed if the attendee already exists', async () => {
      setUp({});
      const webhookPayload = getWebhookPayload({
        event: 'connectionDestroyed',
        reason: 'clientDisconnected',
      });
      const findOne = sessionAttendeesRepo.stubs.findOne;
      findOne.resolves(getSessionAttendeesModel());
      const updateById = sessionAttendeesRepo.stubs.updateById;
      updateById.resolves();
      await controller.checkWebhookPayload(webhookPayload);
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auditLogCreate);
    });

    it('updates the metaData and isDeleted status for event streamCreated if the attendee already exists', async () => {
      setUp({});
      const webhookPayload = getWebhookPayload({
        event: 'streamCreated',
        stream: stream,
      });
      const findOne = sessionAttendeesRepo.stubs.findOne;
      findOne.resolves(getSessionAttendeesModel());
      const updateById = sessionAttendeesRepo.stubs.updateById;
      updateById.resolves();
      await controller.checkWebhookPayload(webhookPayload);
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auditLogCreate);
    });

    it('updates the metaData and isDeleted status for event streamDestroyed if the attendee already exists', async () => {
      setUp({});
      const webhookPayload = getWebhookPayload({
        event: 'streamDestroyed',
        reason: 'clientDisconnected',
        stream: stream,
      });
      const findOne = sessionAttendeesRepo.stubs.findOne;
      findOne.resolves(getSessionAttendeesModel());
      const updateById = sessionAttendeesRepo.stubs.updateById;
      updateById.resolves();
      await controller.checkWebhookPayload(webhookPayload);
      sinon.assert.calledOnce(updateById);
      sinon.assert.calledOnce(auditLogCreate);
    });
  });

  describe('GET /session/{meetingLinkId}/attendees', () => {
    it('returns a list of all attendees given a valid meeting link', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const find = sessionAttendeesRepo.stubs.find;
      find.resolves(getAttendeesList());
      const result = await controller.getAttendeesList(meetingLinkId, 'false');
      expect(result).to.eql(getAttendeesList());
      sinon.assert.calledWith(findOne, {where: {meetingLink: meetingLinkId}});
      sinon.assert.calledWith(find, {where: {sessionId: 'dummy-session-id'}});
    });

    it('returns an error if the meeting link does not exist', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .getAttendeesList(meetingLinkId, 'false')
        .catch(err => err);
      expect(error).instanceOf(Error);
    });

    it('returns active attendees only if areActive is true', async () => {
      setUp({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const find = sessionAttendeesRepo.stubs.find;
      find.resolves(getAttendeesList());
      const result = await controller.getAttendeesList(meetingLinkId, 'true');
      expect(result).to.eql(getAttendeesList());
      sinon.assert.calledWith(findOne, {where: {meetingLink: meetingLinkId}});
      sinon.assert.calledWith(find, {
        where: {sessionId: 'dummy-session-id', isDeleted: false},
      });
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
    auditLogCreate = auditLogRepo.stubs.create;
    auditLogCreate.resolves();

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
