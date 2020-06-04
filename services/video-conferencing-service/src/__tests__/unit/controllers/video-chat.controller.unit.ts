import {HttpErrors} from '@loopback/rest';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {
  getDate,
  getSessionOptions,
  getVideoChatSession,
  getVonageMeetingResponse,
  getMeetingOptions,
  getVonageSessionResponse,
  getDatePastThreshold,
  setUpMockProvider,
  getFutureDate,
} from '../../helpers';
import {VideoChatSessionController} from './../../../controllers';
import {VonageProvider} from './../../../providers/vonage';
import {VideoChatSessionRepository} from './../../../repositories';
import {VideoChatInterface} from '../../../types';

describe('Session APIs', () => {
  const pastDate = getDate('October 01, 2019 00:00:00');
  const futureDate = getFutureDate();
  const meetingLink = 'dummy-meeting-link';
  const timeToStart = 30;
  let videoChatSessionRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
  let videoChatProvider: VideoChatInterface;
  let controller: VideoChatSessionController;

  afterEach(() => sinon.restore());

  describe('POST /session', () => {
    it('returns a meeting Id of type string, saves the session Id, schedules meeting', async () => {
      setUp({
        getMeetingLink: sinon.stub().returns(getVonageMeetingResponse({})),
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
    });

    it('returns an error when vonage fails to create a session', async () => {
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
        getToken: sinon.stub().returns(getVonageSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const result = await controller.getMeetingToken(
        sessionOptions,
        meetingLink,
      );
      expect(result.sessionId).to.be.a.String();
      expect(result.token).to.be.a.String();
      sinon.assert.calledOnce(findOne);
    });

    it('gives an error for invalid meeting link', async () => {
      setUp({
        getToken: sinon.stub().returns(getVonageSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({});
      const invalidMeetingLink = '';
      const error = await controller
        .getMeetingToken(sessionOptions, invalidMeetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
    });

    it('gives an error when vonage fails to generate token', async () => {
      setUp({
        getToken: sinon
          .stub()
          .rejects(new HttpErrors.BadRequest('Error generating token')),
      });
      const sessionOptions = getSessionOptions({});
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
    });

    it('denies if the threshold time to join has not been achieved (scheduling logic)', async () => {
      setUp({
        getToken: sinon.stub().returns(getVonageSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(
        getVideoChatSession({
          isScheduled: true,
          scheduleTime: getDatePastThreshold(timeToStart),
        }),
      );
      const error = await controller.getMeetingToken(
        sessionOptions,
        meetingLink,
      );
      expect(error).eql({
        sessionId: 'dummy-session-id',
        error: `Scheduled meeting can't be started now`,
      });
      sinon.assert.called(findOne);
    });

    it('denies if the expire time is invalid', async () => {
      setUp({
        getToken: sinon.stub().returns(getVonageSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({
        expireTime: new Date('Invalid'),
      });
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
    });

    it('denies if the expire time is in the past', async () => {
      setUp({
        getToken: sinon.stub().returns(getVonageSessionResponse({})),
      });
      const sessionOptions = getSessionOptions({expireTime: pastDate});
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
    });
  });

  describe('PATCH /session/{meetingLink}/end', () => {
    it('updates the end time', async () => {
      setUp({});
      const sessionOptions = getSessionOptions({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({}));
      const updateById = videoChatSessionRepo.stubs.updateById;
      updateById.resolves();
      await controller.endSession(sessionOptions, meetingLink);
      sinon.assert.calledWith(findOne, {where: {meetingLink}});
      sinon.assert.calledOnce(updateById);
    });

    it('returns an error if this session does not exist', async () => {
      setUp({});
      const sessionOptions = getSessionOptions({});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .endSession(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(Error);
    });
  });

  function setUp(providerStub: Partial<VideoChatInterface>) {
    process.env.API_KEY = 'dummy';
    process.env.API_SECRET = 'dummy';
    process.env.TIME_TO_START = '30';

    videoChatSessionRepo = createStubInstance(VideoChatSessionRepository);

    const stubbedProvider = setUpMockProvider(providerStub);
    sinon.stub(VonageProvider.prototype, 'value').returns(stubbedProvider);
    videoChatProvider = new VonageProvider().value();
    controller = new VideoChatSessionController(
      videoChatSessionRepo,
      videoChatProvider,
    );
  }
});
