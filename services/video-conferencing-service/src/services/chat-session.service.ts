import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import {VonageEnums} from '../enums';
import {MeetLinkGeneratorProvider, VideoChatBindings} from '../keys';
import {SessionAttendees, VideoChatSession} from '../models';
import {VonageSessionWebhookPayload} from '../providers/vonage';

import {VonageBindings} from '../providers/vonage/keys';
import {
  SessionAttendeesRepository,
  VideoChatSessionRepository,
} from '../repositories';
import moment from 'moment';
import {
  MeetingOptions,
  SessionOptions,
  SessionResponse,
  VideoChatInterface,
  IConfig,
} from '../types';
import {MeetingLinkIdGenerator} from './meeting-link-id-generator.provider';

@injectable({scope: BindingScope.TRANSIENT})
export class ChatSessionService {
  constructor(
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
    @inject(MeetLinkGeneratorProvider)
    public generator: MeetingLinkIdGenerator,
    @repository(SessionAttendeesRepository)
    private readonly sessionAttendeesRepository: SessionAttendeesRepository,
    @inject(VonageBindings.config, {optional: true})
    private readonly config: IConfig,
  ) {}

  async getMeetingLink(meetingOptions: MeetingOptions): Promise<string> {
    let scheduledTime: Date = new Date();

    let errorMessage: string;

    if (meetingOptions.isScheduled) {
      if (!meetingOptions.scheduleTime) {
        errorMessage = 'Schedule time is not set.';

        throw new HttpErrors.BadRequest(errorMessage);
      } else if (isNaN(meetingOptions.scheduleTime.valueOf())) {
        errorMessage = 'Scheduled time is not in correct format.';

        throw new HttpErrors.BadRequest(errorMessage);
      } else if (moment().isAfter(meetingOptions.scheduleTime)) {
        errorMessage = `Meeting can't be scheduled with schedule time in past!`;

        throw new HttpErrors.BadRequest(errorMessage);
      } else {
        scheduledTime = meetingOptions.scheduleTime;
      }
    }

    const meetingResp = await this.videoChatProvider.getMeetingLink(
      meetingOptions,
    );
    const meetingLinkId = this.generator();

    //provider for this cryptoRandomString
    const videoSessionDetail = new VideoChatSession({
      sessionId: meetingResp.sessionId,
      meetingLink: meetingLinkId,
      isScheduled: meetingOptions.isScheduled,
      scheduleTime: new Date(scheduledTime),
      isArchived: meetingResp.isArchived,
    });

    await this.videoChatSessionRepository.save(videoSessionDetail);

    return meetingLinkId;
  }

  async getMeetingToken(
    sessionOptions: SessionOptions,
    meetingLinkId: string,
  ): Promise<SessionResponse> {
    let errorMessage;

    if (typeof meetingLinkId !== 'string' || !meetingLinkId) {
      errorMessage = 'Meeting link should be a valid string';

      throw new HttpErrors.BadRequest(errorMessage);
    }

    if (
      sessionOptions.expireTime &&
      isNaN(sessionOptions.expireTime?.valueOf())
    ) {
      errorMessage = 'Expire time is not in correct format.';

      throw new HttpErrors.BadRequest(errorMessage);
    }

    if (moment().isAfter(sessionOptions.expireTime)) {
      errorMessage = 'Expire time can not be in past.';

      throw new HttpErrors.BadRequest(errorMessage);
    }

    const session = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink: meetingLinkId,
      },
    });

    if (!session) {
      errorMessage = 'Session does not exist';

      throw new HttpErrors.BadRequest(errorMessage);
    }

    // check if meeting is already ended
    if (session.endTime) {
      errorMessage = 'This meeting has been expired';

      throw new HttpErrors.BadRequest(errorMessage);
    }

    // check for schduled meeting:
    if (session.isScheduled && session.scheduleTime) {
      if (
        moment()
          .add(this.config.timeToStart, 'minutes')
          .isBefore(session.scheduleTime)
      ) {
        errorMessage = `Meeting can only be started ${this.config.timeToStart} minutes before
         the scheduled time`;

        throw new HttpErrors.BadRequest(errorMessage);
      }
    }

    if (!session.startTime) {
      await this.videoChatSessionRepository.updateById(session.id, {
        startTime: new Date(),
      });
    }

    return this.videoChatProvider.getToken(session.sessionId, sessionOptions);
  }

  async editMeeting(
    meetingLinkId: string,

    body: Partial<VideoChatSession>,
  ): Promise<void> {
    const {isScheduled, scheduleTime} = body;
    let errorMessage = '';

    const sessionDetail = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink: meetingLinkId,
      },
    });

    if (!sessionDetail) {
      errorMessage = `Meeting link ${meetingLinkId} not found`;

      throw new HttpErrors.NotFound(errorMessage);
    }

    if (isScheduled && !scheduleTime) {
      errorMessage = `Schedule Time is required if isScheduled is set to true`;

      throw new HttpErrors.BadRequest(errorMessage);
    }

    if (scheduleTime && isNaN(moment(scheduleTime).valueOf())) {
      errorMessage = `Schedule Time is Not in correct format`;

      throw new HttpErrors.BadRequest(errorMessage);
    }

    if (moment().isAfter(scheduleTime)) {
      errorMessage = 'Schedule Time cannot be set in the past';

      throw new HttpErrors.BadRequest(errorMessage);
    }

    const updateData: Partial<VideoChatSession> = {};
    if (isScheduled) {
      updateData.scheduleTime = scheduleTime;
    } else {
      updateData.scheduleTime = new Date();
    }

    await this.videoChatSessionRepository.updateById(
      sessionDetail.id,
      updateData,
    );
  }

  async endSession(meetingLinkId: string): Promise<void> {
    let errorMessage: string;
    if (typeof meetingLinkId !== 'string' || !meetingLinkId) {
      throw new HttpErrors.BadRequest('Meeting link should be a valid string.');
    }

    const videoSessionDetail = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink: meetingLinkId,
      },
    });

    if (!videoSessionDetail) {
      errorMessage = 'Meeting Not Found';

      throw new HttpErrors.NotFound(errorMessage);
    }

    if (videoSessionDetail.endTime) {
      errorMessage = 'Meeting has already been ended!';

      throw new HttpErrors.BadRequest(errorMessage);
    }

    await this.videoChatSessionRepository.updateById(videoSessionDetail.id, {
      endTime: new Date(),
    });
  }

  async checkWebhookPayload(webhookPayload: VonageSessionWebhookPayload) {
    try {
      const {
        connection: {data},
        event,
        sessionId,
      } = webhookPayload;

      const sessionAttendeeDetail =
        await this.sessionAttendeesRepository.findOne({
          where: {
            sessionId: sessionId,
            attendee: data,
          },
        });
      if (!sessionAttendeeDetail) {
        if (event === VonageEnums.SessionWebhookEvents.ConnectionCreated) {
          await this.sessionAttendeesRepository.create({
            sessionId: sessionId,
            attendee: data,
            createdOn: new Date(),
            isDeleted: false,
            extMetadata: {webhookPayload: webhookPayload},
          });
        }
      } else {
        const updatedAttendee = {
          modifiedOn: new Date(),
          isDeleted: sessionAttendeeDetail.isDeleted,
          extMetadata: {webhookPayload: webhookPayload},
        };

        if (event === VonageEnums.SessionWebhookEvents.ConnectionCreated) {
          updatedAttendee.isDeleted = false;
          await this.sessionAttendeesRepository.updateById(
            sessionAttendeeDetail.id,
            updatedAttendee,
          );
        } else if (event === VonageEnums.SessionWebhookEvents.StreamCreated) {
          await this.sessionAttendeesRepository.updateById(
            sessionAttendeeDetail.id,
            updatedAttendee,
          );
        } else if (event === VonageEnums.SessionWebhookEvents.StreamDestroyed) {
          await this.processStreamDestroyedEvent(
            webhookPayload,
            sessionAttendeeDetail,
            updatedAttendee,
          );
        } else if (
          event === VonageEnums.SessionWebhookEvents.ConnectionDestroyed
        ) {
          updatedAttendee.isDeleted = true;
          await this.sessionAttendeesRepository.updateById(
            sessionAttendeeDetail.id,
            updatedAttendee,
          );
        } else {
          //DO NOTHING
        }
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Error occured triggering webhook event',
      );
    }
  }
  async processStreamDestroyedEvent(
    webhookPayload: VonageSessionWebhookPayload,
    sessionAttendeeDetail: SessionAttendees,
    updatedAttendee: Partial<SessionAttendees>,
  ) {
    if (
      webhookPayload.reason === 'forceUnpublished' ||
      webhookPayload.reason === 'mediaStopped'
    ) {
      await this.sessionAttendeesRepository.updateById(
        sessionAttendeeDetail.id,
        updatedAttendee,
      );
    } else {
      updatedAttendee.isDeleted = true;
      await this.sessionAttendeesRepository.updateById(
        sessionAttendeeDetail.id,
        updatedAttendee,
      );
    }
  }

  async getAttendeesList(
    meetingLinkId: string,
    active: string,
  ): Promise<SessionAttendees[]> {
    let errorMessage: string;

    const videoSessionDetail = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink: meetingLinkId,
      },
    });

    if (!videoSessionDetail) {
      errorMessage = 'Meeting Not Found';

      throw new HttpErrors.NotFound(errorMessage);
    }

    let whereFilter = {};
    if (active === 'true') {
      whereFilter = {
        sessionId: videoSessionDetail?.sessionId,
        isDeleted: false,
      };
    } else {
      whereFilter = {
        sessionId: videoSessionDetail?.sessionId,
      };
    }

    return this.sessionAttendeesRepository.find({
      where: whereFilter,
    });
  }
}
