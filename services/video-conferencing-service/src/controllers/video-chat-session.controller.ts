import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {param, patch, post, requestBody, HttpErrors} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  MeetingOptions,
  SessionOptions,
  VideoChatInterface,
  SessionResponse,
} from '../types';
import {VideoChatBindings} from '../keys';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {PermissionKeys} from '../enums/permission-keys.enum';
import {STATUS_CODE, CONTENT_TYPE} from '@sourceloop/core';
import moment from 'moment';
import cryptoRandomString from 'crypto-random-string';
import {VideoChatSession} from '../models';
import {
  AuditLogsRepository,
  VideoChatSessionRepository,
  SessionAttendeesRepository,
} from '../repositories';
import {VonageBindings} from '../providers/vonage/keys';
import {VonageConfig, VonageSessionWebhookPayload} from '../providers/vonage';
import {VonageEnums} from '../enums';

export class VideoChatSessionController {
  constructor(
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
    @repository(AuditLogsRepository)
    private readonly auditLogRepository: AuditLogsRepository,
    @repository(SessionAttendeesRepository)
    private readonly sessionAttendeesRepository: SessionAttendeesRepository,
    @inject(VonageBindings.config, {optional: true})
    private readonly config: VonageConfig,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.CreateSession])
  @post('/session', {
    responses: {
      [STATUS_CODE.OK]: {
        content: {
          [CONTENT_TYPE.TEXT]: {schema: {type: 'string'}},
        },
      },
    },
  })
  async getMeetingLink(
    @requestBody()
    meetingOptions: MeetingOptions,
  ): Promise<string> {
    let scheduledTime: Date = new Date();
    const auditLogPayload = {
      action: 'session',
      actionType: 'meeting-link',
      actedAt: moment().format(),
      before: meetingOptions,
      after: {},
    };
    let errorMessage: string;

    if (meetingOptions.isScheduled) {
      if (!meetingOptions.scheduleTime) {
        errorMessage = 'Schedule time is not set.';
        auditLogPayload.after = {errorMessage};
        await this.auditLogRepository.create(auditLogPayload);
        throw new HttpErrors.BadRequest(errorMessage);
      } else if (isNaN(meetingOptions.scheduleTime.valueOf())) {
        errorMessage = 'Scheduled time is not in correct format.';
        auditLogPayload.after = {errorMessage};
        await this.auditLogRepository.create(auditLogPayload);
        throw new HttpErrors.BadRequest(errorMessage);
      } else if (moment().isAfter(meetingOptions.scheduleTime)) {
        errorMessage = `Meeting can't be scheduled with schedule time in past!`;
        auditLogPayload.after = {errorMessage};
        await this.auditLogRepository.create(auditLogPayload);
        throw new HttpErrors.BadRequest(errorMessage);
      } else {
        scheduledTime = meetingOptions.scheduleTime;
      }
    }

    const meetingResp = await this.videoChatProvider.getMeetingLink(
      meetingOptions,
    );

    const meetingLinkId = cryptoRandomString({length: 10, type: 'url-safe'});
    const videoSessionDetail = new VideoChatSession({
      sessionId: meetingResp.sessionId,
      meetingLink: meetingLinkId,
      isScheduled: meetingOptions.isScheduled,
      scheduleTime: new Date(scheduledTime),
      isArchived: meetingResp.isArchived,
    });

    await this.videoChatSessionRepository.save(videoSessionDetail);
    auditLogPayload.after = videoSessionDetail;
    await this.auditLogRepository.create(auditLogPayload);
    return meetingLinkId;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.GenerateToken])
  @post('/session/{meetingLinkId}/token', {
    responses: {
      [STATUS_CODE.OK]: {
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              sessionId: 'string',
              token: 'string',
            },
          },
        },
      },
    },
  })
  async getMeetingToken(
    @requestBody()
    sessionOptions: SessionOptions,
    @param.path.string('meetingLinkId') meetingLinkId: string,
  ): Promise<SessionResponse> {
    const auditLogPayload = {
      action: 'session',
      actionType: 'get-token',
      before: {meetingLinkId},
      actedAt: moment().format(),
      after: {},
    };
    let errorMessage;

    if (typeof meetingLinkId !== 'string' || !meetingLinkId) {
      errorMessage = 'Meeting link should be a valid string';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    if (
      sessionOptions.expireTime &&
      isNaN(sessionOptions.expireTime?.valueOf())
    ) {
      errorMessage = 'Expire time is not in correct format.';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    if (moment().isAfter(sessionOptions.expireTime)) {
      errorMessage = 'Expire time can not be in past.';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    const session = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink: meetingLinkId,
      },
    });

    if (!session) {
      errorMessage = 'Session does not exist';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    // check if meeting is already ended
    if (session.endTime) {
      errorMessage = 'This meeting has been expired';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
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
        auditLogPayload.after = {errorMessage};
        await this.auditLogRepository.create(auditLogPayload);
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

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.StopMeeting])
  @patch('/session/{meetingLinkId}/end', {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient PATCH success',
      },
    },
  })
  async endSession(
    @param.path.string('meetingLinkId') meetingLinkId: string,
  ): Promise<void> {
    const auditLogPayload = {
      action: 'session',
      actionType: 'end-session',
      before: {meetingLinkId},
      actedAt: moment().format(),
      after: {},
    };
    let errorMessage: string;
    if (typeof meetingLinkId !== 'string' || !meetingLinkId) {
      errorMessage = 'Meeting link should be a valid string.';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest('Meeting link should be a valid string.');
    }

    const videoSessionDetail = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink: meetingLinkId,
      },
    });

    if (!videoSessionDetail) {
      errorMessage = 'Meeting Not Found';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.NotFound(errorMessage);
    }

    if (videoSessionDetail.endTime) {
      errorMessage = 'Meeting has already been ended!';
      auditLogPayload.after = {errorMessage};
      await this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    await this.videoChatSessionRepository.updateById(videoSessionDetail.id, {
      endTime: new Date(),
    });

    auditLogPayload.after = {response: 'end session successful'};
    await this.auditLogRepository.create(auditLogPayload);
  }

  @authorize(['*'])
  @post('/webhooks/session', {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'POST /webhooks/session Success',
      },
    },
  })
  async checkWebhookPayload(
    @requestBody() webhookPayload: VonageSessionWebhookPayload,
  ) {
    try {
      const {
        connection: {data},
        event,
        sessionId,
      } = webhookPayload;

      if (event === VonageEnums.SessionWebhookEvents.ConnectionCreated) {
        const sessionAttendeeDetail = await this.sessionAttendeesRepository.findOne(
          {
            where: {
              attendee: data,
            },
          },
        );
        if (!sessionAttendeeDetail) {
          await this.sessionAttendeesRepository.create({
            sessionId: sessionId,
            attendee: data,
            createdOn: new Date(),
            isDeleted: false,
          });
        } else {
          await this.sessionAttendeesRepository.updateById(
            sessionAttendeeDetail.id,
            {
              modifiedOn: new Date(),
            },
          );
        }
      }
      await this.auditLogRepository.create(
        {
          action: 'session-webhook',
          actionType: event,
          before: webhookPayload,
          after: {response: 'Webhook event triggered successfully'},
          actedAt: moment().format(),
        },
        {skipCurrentUser: true},
      );
    } catch (error) {
      await this.auditLogRepository.create(
        {
          action: 'session-webhook',
          actionType: webhookPayload.event,
          before: webhookPayload,
          after: {errorStack: error.stack},
          actedAt: moment().format(),
        },
        {skipCurrentUser: true},
      );
      throw new HttpErrors.InternalServerError(
        'Error occured triggering webhook event',
      );
    }
  }
}
