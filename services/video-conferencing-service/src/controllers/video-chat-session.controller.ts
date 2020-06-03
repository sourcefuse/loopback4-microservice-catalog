import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {param, patch, post, requestBody, HttpErrors} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {CONTENT_TYPE, STATUS_CODE} from '../enums';
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
import cryptoRandomString = require('crypto-random-string');
import { VideoChatSession } from '../models';
import moment from 'moment';

export class VideoChatSessionController {
  constructor(
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
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

    let scheduledTime: Date | undefined;

    if(meetingOptions.isScheduled ){
      if(!meetingOptions.scheduleTime){
        throw new HttpErrors.BadRequest(`Schedule time is not set.`);
      } else if (!this.isValidDate(meetingOptions.scheduleTime)){
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
    
    const meetingLink = cryptoRandomString({length: 10, type: 'url-safe'});

    const videoSessionDetail = new VideoChatSession({
      sessionId: meetingResp.sessionId,
      meetingLink,
      isScheduled: meetingOptions.isScheduled,
      scheduleTime: scheduledTime,
    });

    await this.videoChatSessionRepository.save(videoSessionDetail);

    return meetingLink;
  }


  private isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d.valueOf());
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.GenerateToken])
  @post('/session/{meetingLink}/token', {
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
    @param.path.string('meetingLink') meetingLink: string,
  ): Promise<SessionResponse> {

    if(typeof meetingLink !== 'string' || meetingLink === ''){
      throw new HttpErrors.BadRequest(`Meeting link should be a valid string.`);
    }

    if(!this.isValidDate(sessionOptions.expireTime)){
      throw new HttpErrors.BadRequest(`Expire time is not in correct format.`);
    }

    if(moment().isAfter(sessionOptions.expireTime)){
      throw new HttpErrors.BadRequest('Expire time can not be in past.');
    }

    // 1. fetch session id from meeting link
    const session = await this.videoChatSessionRepository.findOne({
      where: {meetingLink},
    });

    if (!session) {
      throw new HttpErrors.BadRequest(`This meeting doesn't exist`);
    }

    // check for schduled meeting:
    if (session.isScheduled && session.scheduleTime) {
      if (
        moment()
          .add(process.env.TIME_TO_START, 'minutes')
          .isBefore(session.scheduleTime)
      ) {
        return {
          sessionId: session.sessionId,
          error: `Scheduled meeting can't be started now`,
        };
      }
    }

    return this.videoChatProvider.getToken(session.sessionId, sessionOptions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKeys.StopMeeting])
  @patch('/session/{meetingLink}/end', {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient PATCH success',
      },
    },
  })
  async endSession(
    @requestBody()
    sessionOptions: SessionOptions,
    @param.path.string('meetingLink') meetingLink: string,
  ): Promise<void> {
    // sets end time for the session
    // fetch session id from meeting link
    const session = await this.videoChatSessionRepository.findOne({
      where: {meetingLink},
    });

    if (!session) {
      throw new HttpErrors.BadRequest(`This meeting doesn't exist`);
    }

    await this.videoChatSessionRepository.updateById(session.id, {
      endTime: Date.now(),
    });
  }
}
