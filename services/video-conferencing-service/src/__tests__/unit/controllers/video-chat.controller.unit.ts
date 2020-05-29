import {HttpErrors} from '@loopback/rest';
import {createStubInstance, expect, sinon, StubbedInstanceWithSinonAccessor} from '@loopback/testlab';
import {getDate, getSessionOptions, getVideoChatSession} from '../../helpers';
import {VideoChatSessionController} from './../../../controllers';
import {VonageProvider} from './../../../providers/vonage';
import {VideoChatSessionRepository} from './../../../repositories';

describe('Session APIs', () => {
  let pastDate: Date;
  let futureDate: Date;
  let meetingLink: string;
  let videoChatRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
  let videoChatProvider: StubbedInstanceWithSinonAccessor<VonageProvider>;
  let controller: VideoChatSessionController;
  beforeEach(reset);

  describe('POST /session', () => {
    it('returns a meeting Id of type string and saves the session Id', async () => {
      const meetingOptions = {
        enableArchiving: true,
        isScheduled: false,
      };

      const create = videoChatRepo.stubs.create;
      create.resolves();
      const result = await controller.getMeetingLink(meetingOptions);
      expect(result).to.be.a.String();
      sinon.assert.called(create);
    });

    it('schedules a meeting', async () => {
      const meetingOptions = {
        enableArchiving: true,
        isScheduled: true,
        scheduleTime: futureDate,
      };

      const create = videoChatRepo.stubs.create;
      create.resolves();
      const result = await controller.getMeetingLink(meetingOptions);
      expect(result).to.be.a.String();
      sinon.assert.called(create);
    });

    it('only schedules a meeting with a schedule time', async () => {
      const meetingOptions = {
        enableArchiving: true,
        isScheduled: true,
      };

      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(error).instanceof(HttpErrors);
    });

    it('does not schedule a meeting with invalid schedule time', async () => {
      const meetingOptions = {
        enableArchiving: true,
        isScheduled: true,
        scheduleTime: getDate('Invalid'),
      };

      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(error).instanceof(HttpErrors);
    });

    it('does not schedule a meeting if schedule time is in the past', async () => {
      const meetingOptions = {
        enableArchiving: true,
        isScheduled: true,
        scheduleTime: pastDate,
      };

      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => err);
      expect(error).instanceof(HttpErrors);
    });
  });

  describe('POST /session/{meetingLink}/token', () => {
    it('returns a session Id and token of type string', async () => {
      const sessionOptions = getSessionOptions({});

      const find = videoChatRepo.stubs.findById;
      find.resolves(getVideoChatSession({}));
      const result = await controller.getMeetingToken(
        sessionOptions,
        meetingLink,
      );
      expect(result.sessionId).to.be.a.String();
      expect(result.token).to.be.a.String();
      sinon.assert.called(find);
    });

    it('gives an error for invalid meeting link', async () => {
      const sessionOptions = getSessionOptions({meetingLink: ''});

      const find = videoChatRepo.stubs.findById;
      find.resolves(getVideoChatSession({}));
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(HttpErrors);
      sinon.assert.called(find);
    });

    it('denies if the threshold time to join has not been achieved (scheduling logic)', async () => {
      const sessionOptions = getSessionOptions({});

      const find = videoChatRepo.stubs.findById;
      find.resolves(getVideoChatSession({}));
      const error = await controller
        .getMeetingToken(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(HttpErrors);
      sinon.assert.called(find);
    });

    it('denies if the expire time is invalid', async () => {
      const sessionOptions = getSessionOptions({expireTime: new Date('Invalid')});

      const error = await controller
        .getMeetingToken(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(HttpErrors);
    });

    it('denies if the expire time is in the past', async () => {
      const sessionOptions = getSessionOptions({expireTime: pastDate});

      const error = await controller
        .getMeetingToken(sessionOptions, meetingLink)
        .catch(err => err);
      expect(error).instanceof(HttpErrors);
    });
  });

  describe('PATCH /session/{meetingLink}/end', () => {
    it('updates the end time', async () => {
      const sessionOptions = getSessionOptions({});

      const update = videoChatRepo.stubs.update;
      update.resolves();
      await controller.endSession(sessionOptions, meetingLink);
      sinon.assert.called(update);
    });
  });

  function reset() {
    pastDate = getDate('October 01, 2019 00:00:00');
    futureDate = getDate('October 01, 2020 00:00:00');
    meetingLink = 'dummy-meeting-link';
    videoChatRepo = createStubInstance(VideoChatSessionRepository);
    videoChatProvider = createStubInstance(VonageProvider);
    controller = new VideoChatSessionController(
      videoChatRepo,
      videoChatProvider.value(),
    );
  }
});
