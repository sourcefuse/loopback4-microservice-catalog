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
import {VideoChatSessionRepository} from '../repositories/video-chat-session.repository';
import {VideoChatBindings} from '../keys';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { PermissionKeys } from '../enums/permission-keys.enum';
import { STATUS_CODE, CONTENT_TYPE } from '@sourceloop/core';
import moment from 'moment';
import cryptoRandomString from 'crypto-random-string';
import { VideoChatSession } from '../models';
import { AuditLogsRepository } from '../repositories';
import { VonageBindings } from '../providers/vonage/keys';
import { VonageConfig } from '../providers/vonage';

export class VideoChatSessionController {
  constructor(
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
    @repository(AuditLogsRepository)
    private readonly auditLogRepository: AuditLogsRepository,
    @inject(VonageBindings.config)
    private readonly config: VonageConfig
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


    if(meetingOptions.isScheduled){
      if(!meetingOptions.scheduleTime){
        errorMessage = 'Schedule time is not set.';
        auditLogPayload.after = { errorMessage };
        this.auditLogRepository.create(auditLogPayload);
        throw new HttpErrors.BadRequest(errorMessage);
      } else if (isNaN(meetingOptions.scheduleTime.valueOf() as number)) {
        errorMessage = 'Scheduled time is not in correct format.';
        auditLogPayload.after = { errorMessage };
        this.auditLogRepository.create(auditLogPayload);
        throw new HttpErrors.BadRequest(errorMessage);
      } else if (moment().isAfter(meetingOptions.scheduleTime)) {
        errorMessage = `Meeting can't be scheduled with schedule time in past!`;
        auditLogPayload.after = { errorMessage };
        this.auditLogRepository.create(auditLogPayload);
        throw new HttpErrors.BadRequest(errorMessage);
      } else {
        scheduledTime = meetingOptions.scheduleTime;
      }
    }

    const meetingResp = await this.videoChatProvider.getMeetingLink(
      meetingOptions,
    );

    const meetingLinkId = cryptoRandomString({length: 10, type: 'url-safe' });
    const videoSessionDetail = new VideoChatSession({
      sessionId: meetingResp.sessionId,
      meetingLink: meetingLinkId,
      isScheduled: meetingOptions.isScheduled,
      scheduleTime: new Date(scheduledTime),
    });

    await this.videoChatSessionRepository.save(videoSessionDetail);
    auditLogPayload.after = videoSessionDetail;
    this.auditLogRepository.create(auditLogPayload);
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
      before: { meetingLinkId, },
      actedAt: moment().format(),
      after: {},
    };
    let errorMessage;

    if(typeof meetingLinkId !== 'string' || !meetingLinkId) {
      errorMessage = 'Meeting link should be a valid string';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    if(isNaN(sessionOptions.expireTime?.valueOf() as number)) {
      errorMessage = 'Expire time is not in correct format.';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    if(moment().isAfter(sessionOptions.expireTime)){
      errorMessage = 'Expire time can not be in past.';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    const session = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink:  meetingLinkId
      },
    });

    if (!session) {
      errorMessage = 'Expire time can not be in past.';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    // check if meeting is already ended
    if(session.endTime){
      errorMessage = 'This meeting has been expired';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }

    // check for schduled meeting:
    if (session.isScheduled && session.scheduleTime) {
      if (
        moment()
          .add(this.config.timeToStart, 'minutes')
          .isBefore(session.scheduleTime)
      ) {
        errorMessage = `Meeting can not be started before ${process.env.TIME} minutes earlier time than the scheduled time`;
        auditLogPayload.after = { errorMessage };
        this.auditLogRepository.create(auditLogPayload);
        throw new Error(errorMessage);
      }
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
    @requestBody()
    sessionOptions: SessionOptions,
    @param.path.string('meetingLinkId') meetingLinkId: string,
  ): Promise<void> {
    const auditLogPayload = {
      action: 'session',
      actionType: 'get-token',
      before: { meetingLinkId, },
      actedAt: moment().format(),
      after: {},
    };
    let errorMessage: string;
    if (typeof meetingLinkId !== 'string' || !meetingLinkId) {        
      errorMessage = 'Meeting link should be a valid string.';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest('Meeting link should be a valid string.');
    }

    const videoSessionDetail = await this.videoChatSessionRepository.findOne({
      where: {
         meetingLink: meetingLinkId,
        }
    });

    if (!videoSessionDetail) {
      errorMessage = 'Meeting Not Found';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.NotFound(errorMessage);
    }

    if (videoSessionDetail.endTime) {
      errorMessage = 'Meeting has already been ended!';
      auditLogPayload.after = { errorMessage };
      this.auditLogRepository.create(auditLogPayload);
      throw new HttpErrors.BadRequest(errorMessage);
    }
    
    return this.videoChatSessionRepository.updateById(videoSessionDetail.id, { endTime: new Date() });
  }
}
