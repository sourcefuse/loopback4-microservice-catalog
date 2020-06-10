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

export class VideoChatSessionController {
  constructor(
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
    @repository(AuditLogsRepository)
    private readonly auditLogRepository: AuditLogsRepository,
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

    if(meetingOptions.isScheduled ){
      if(!meetingOptions.scheduleTime){
        throw new HttpErrors.BadRequest(`Schedule time is not set.`);
      } else if (!moment(meetingOptions.scheduleTime).isValid){
        throw new HttpErrors.BadRequest(`Scheduled time is not in correct format.`);
      } else if (moment().isAfter(meetingOptions.scheduleTime)) {
        throw new HttpErrors.BadRequest(`Meeting can't be scheduled with schedule time in past!`);
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
      scheduleTime: scheduledTime,
    });

    await this.videoChatSessionRepository.save(videoSessionDetail);

    this.auditLogRepository.create({
      action: 'session',
      actionType: 'meeting-link',
      actedEntity: meetingLinkId,
      actedAt: moment().format(),
      after: videoSessionDetail,
    });

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

    if(typeof meetingLinkId !== 'string' || !meetingLinkId){
      throw new HttpErrors.BadRequest(`Meeting link should be a valid string.`);
    }

    if(!moment(sessionOptions.expireTime).isValid){
      throw new HttpErrors.BadRequest(`Expire time is not in correct format.`);
    }

    if(moment().isAfter(sessionOptions.expireTime)){
      throw new HttpErrors.BadRequest('Expire time can not be in past.');
    }

    const session = await this.videoChatSessionRepository.findOne({
      where: {
        meetingLink:  meetingLinkId
      },
    });

    if (!session) {
      throw new HttpErrors.BadRequest(`This meeting doesn't exist`);
    }

    // check if meeting is already ended
    if(session.endTime){
      throw new HttpErrors.BadRequest('This meeting has been expired');
    }

    // check for schduled meeting:
    if (session.isScheduled && session.scheduleTime) {
      if (
        moment()
          .add(process.env.TIME_TO_START, 'minutes')
          .isBefore(session.scheduleTime)
      ) {
         throw new Error(`Meeting can not be started before ${process.env.TIME} minutes earlier time than the scheduled time`)
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
    if(typeof meetingLinkId !== 'string' || !meetingLinkId){
      throw new HttpErrors.BadRequest(`Meeting link should be a valid string.`);
    }

    const { count } = await this.videoChatSessionRepository.updateAll({
      endTime: new Date(),
    },{
        meetingLink: meetingLinkId,
    });

    if (!count) {
      throw new HttpErrors.NotFound('meeting Link Not Found');
    }
  }
}
