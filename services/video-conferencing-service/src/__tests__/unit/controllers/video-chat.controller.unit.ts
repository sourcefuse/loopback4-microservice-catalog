import {HttpErrors} from '@loopback/rest';
import {createStubInstance, expect, StubbedInstanceWithSinonAccessor} from '@loopback/testlab';
import sinon from 'sinon';
import {getVideoChatSession} from '../../helpers';
import {VideoChatSessionController} from './../../../controllers';
import {VonageProvider} from './../../../providers/vonage';
import {VideoChatSessionRepository} from './../../../repositories';

describe('Session APIs', () => {
  let videoChatRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
  let videoChatProvider: StubbedInstanceWithSinonAccessor<VonageProvider>;
  let controller: VideoChatSessionController;
  beforeEach(reset);

  describe('POST /session', () => {
    it('returns a meeting Id of type string and saves the session Id', async () => {
      const meetingOptions = {
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
        isScheduled: true,
        scheduleTime: new Date(2020, 12),
      };

      const create = videoChatRepo.stubs.create;
      create.resolves();
      const result = await controller.getMeetingLink(meetingOptions);
      expect(result).to.be.a.String();
      sinon.assert.called(create);
    });

    it('only schedules a meeting with a schedule time', async () => {
      const meetingOptions = {
        isScheduled: true,
      };

      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => {
          return err;
        });
      expect(error).instanceof(HttpErrors);
    });

    it('does not schedule a meeting with invalid schedule time', async () => {
      const meetingOptions = {
        isScheduled: true,
        scheduleTime: new Date('Invalid'),
      };

      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => {
          return err;
        });
      expect(error).instanceof(HttpErrors);
    });

    it('does not schedule a meeting if schedule time is in the past', async () => {
      const meetingOptions = {
        isScheduled: true,
        scheduleTime: new Date(2018, 12),
      };

      const error = await controller
        .getMeetingLink(meetingOptions)
        .catch(err => {
          return err;
        });
      expect(error).instanceof(HttpErrors);
    });
  });

  describe('POST /session/{meetingId}/token', () => {
    it('returns a session Id and token of type string', async () => {
      const sessionOptions = {
        meetingId: 'meeting-id',
        expireTime: new Date(2020, 12),
      };

      const find = videoChatRepo.stubs.findById;
      find.resolves(getVideoChatSession({}));
      const result = await controller.getMeetingToken(
        sessionOptions,
        'meeting-link',
      );
      expect(result.sessionId).to.be.a.String();
      expect(result.token).to.be.a.String();
      sinon.assert.called(find);
    });

    it('gives an error for invalid meeting Id', async () => {
      const sessionOptions = {
        meetingId: '',
        expireTime: new Date(2020, 12),
      };

      const find = videoChatRepo.stubs.findById;
      find.resolves(getVideoChatSession({}));
      const error = await controller
        .getMeetingToken(sessionOptions, 'meeting-link')
        .catch(err => {
          return err;
        });
      expect(error).instanceof(HttpErrors);
      sinon.assert.called(find);
    });

    it('denies if the threshold time to join has not been achieved (scheduling logic)', async () => {
      const sessionOptions = {
        meetingId: '',
        expireTime: new Date(2020, 12),
      };

      const find = videoChatRepo.stubs.findById;
      find.resolves(getVideoChatSession({}));
      const error = await controller
        .getMeetingToken(sessionOptions, 'meeting-link')
        .catch(err => {
          return err;
        });
      expect(error).instanceof(HttpErrors);
      sinon.assert.called(find);
    });

    it('denies if the expire time is invalid', async () => {
      const sessionOptions = {
        meetingId: '',
        expireTime: new Date('Invalid'),
      };

      const error = await controller
        .getMeetingToken(sessionOptions, 'meeting-link')
        .catch(err => {
          return err;
        });
      expect(error).instanceof(HttpErrors);
    });

    it('denies if the expire time is in the past', async () => {
      const sessionOptions = {
        meetingId: '',
        expireTime: new Date(2018, 12),
      };

      const error = await controller
        .getMeetingToken(sessionOptions, 'meeting-link')
        .catch(err => {
          return err;
        });
      expect(error).instanceof(HttpErrors);
    });
  });

  describe('PATCH /session/{meetingId}/end', () => {
    it('updates the end time', async () => {
      const sessionOptions = {
        meetingId: 'meeting-id',
        expireTime: new Date(2020, 12),
      };

      const update = videoChatRepo.stubs.update;
      update.resolves();
      await controller.endSession(sessionOptions, 'meeting-link');
      sinon.assert.called(update);
    });
  });

  function reset() {
    videoChatRepo = createStubInstance(VideoChatSessionRepository);
    videoChatProvider = createStubInstance(VonageProvider);
    controller = new VideoChatSessionController(
      videoChatRepo,
      videoChatProvider.value(),
    );
  }
});
