// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import {MeetLinkGeneratorProvider, VideoChatBindings} from '../keys';
import {SessionAttendees, VideoChatSession} from '../models';
import {VonageSessionWebhookPayload} from '../providers/vonage';

import moment from 'moment';
import {VonageBindings} from '../providers/vonage/keys';
import {
  SessionAttendeesRepository,
  VideoChatSessionRepository,
} from '../repositories';
import {
  IConfig,
  MeetingLink,
  MeetingOptions,
  SessionOptions,
  SessionResponse,
  VideoChatInterface,
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

  async getMeetingLink(meetingOptions: MeetingOptions): Promise<MeetingLink> {
    let scheduledTime: Date = new Date();

    let errorMessage: string;

    if (meetingOptions.isScheduled) {
      if (!meetingOptions.scheduleTime) {
        errorMessage = 'Schedule time is not set.';

        throw new HttpErrors.BadRequest(errorMessage);
      } else if (!moment(meetingOptions.scheduleTime).isValid()) {
        errorMessage = 'Scheduled time is not in correct format.';
        throw new HttpErrors.BadRequest(errorMessage);
      } else if (moment().isAfter(meetingOptions.scheduleTime)) {
        errorMessage = `Meeting can't be scheduled with schedule time in past!`;

        throw new HttpErrors.BadRequest(errorMessage);
      } else {
        scheduledTime = meetingOptions.scheduleTime;
      }
    }

    const meetingResp =
      await this.videoChatProvider.getMeetingLink(meetingOptions);
    const meetingLinkId = await this.generator();
    //provider for this cryptoRandomString
    const videoSessionDetail = new VideoChatSession({
      sessionId: meetingResp.sessionId,
      meetingLink: meetingLinkId,
      isScheduled: meetingOptions.isScheduled,
      scheduleTime: new Date(scheduledTime),
      isArchived: meetingResp.isArchived,
    });

    await this.videoChatSessionRepository.save(videoSessionDetail);

    return {code: meetingLinkId};
  }

  /**
   * The function `getMeetingToken` retrieves a session token for a meeting based on provided options and
   * meeting link ID, with validation checks for session existence, expiration, and scheduled start time.
   * @param {SessionOptions} sessionOptions - The `sessionOptions` parameter in the `getMeetingToken`
   * function represents the options for the session, such as the configuration settings for the meeting.
   * It is an object that contains various properties like `expireTime`, `sessionId`, etc., which are
   * used to customize the session behavior.
   * @param {string} meetingLinkId - The `meetingLinkId` parameter is a string that represents the unique
   * identifier for a specific meeting or session. It is used to retrieve information about the meeting
   * from the database and validate its status before generating a meeting token.
   * @returns The `getMeetingToken` function returns a Promise that resolves to a `SessionResponse`
   * object.
   */
  async getMeetingToken(
    sessionOptions: SessionOptions,
    meetingLinkId: string,
  ): Promise<SessionResponse> {
    this._validateMeetingLinkId(meetingLinkId);
    this._validateExpireTime(sessionOptions.expireTime);

    const session = await this.videoChatSessionRepository.findOne({
      where: {meetingLink: meetingLinkId},
    });

    if (!session) {
      throw new HttpErrors.BadRequest('Session does not exist');
    }

    if (session.endTime) {
      throw new HttpErrors.BadRequest('This meeting has been expired');
    }

    if (session.isScheduled && session.scheduleTime) {
      const canStartTime = moment().add(this.config.timeToStart, 'minutes');
      if (canStartTime.isBefore(session.scheduleTime)) {
        throw new HttpErrors.BadRequest(
          `Meeting can only be started ${this.config.timeToStart} minutes before the scheduled time`,
        );
      }
    }

    if (!session.startTime) {
      await this.videoChatSessionRepository.updateById(session.id, {
        startTime: new Date(),
      });
    }

    Object.assign(sessionOptions, {sessionId: session.sessionId});
    return this.videoChatProvider.getToken(session.sessionId, sessionOptions);
  }

  /**
   * The function `_validateMeetingLinkId` checks if the provided meeting link ID is a valid non-empty
   * string in TypeScript.
   * @param {string} meetingLinkId - The `meetingLinkId` parameter is a string that represents the link
   * to a meeting. The `_validateMeetingLinkId` function is used to check if the `meetingLinkId` is a
   * valid string and not empty. If the `meetingLinkId` is not a valid string or is empty, it will throw
   */
  private _validateMeetingLinkId(meetingLinkId: string): void {
    if (typeof meetingLinkId !== 'string' || !meetingLinkId.trim()) {
      throw new HttpErrors.BadRequest('Meeting link should be a valid string');
    }
  }

  /**
   * The function `_validateExpireTime` checks if the provided expire time is in the correct format and
   * not in the past.
   * @param {Date} [expireTime] - The `_validateExpireTime` function is used to validate the
   * `expireTime` parameter. It checks if the `expireTime` is provided and if it is a valid Date object.
   * It also ensures that the `expireTime` is not in the past.
   */
  private _validateExpireTime(expireTime?: Date): void {
    if (expireTime) {
      if (isNaN(expireTime.valueOf())) {
        throw new HttpErrors.BadRequest(
          'Expire time is not in correct format.',
        );
      }
      if (moment().isAfter(expireTime)) {
        throw new HttpErrors.BadRequest('Expire time cannot be in the past.');
      }
    }
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

    if (isScheduled && !this.videoChatProvider.getFeatures().schedule) {
      errorMessage = `Cannot schedule meeting, this feature is not available for this provider`;
      throw new HttpErrors.BadRequest(errorMessage);
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

  checkWebhookPayload(webhookPayload: VonageSessionWebhookPayload) {
    return this.videoChatProvider.checkWebhookPayload(webhookPayload);
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
