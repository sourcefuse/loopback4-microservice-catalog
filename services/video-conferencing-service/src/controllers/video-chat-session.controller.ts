import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {param, patch, post, requestBody} from '@loopback/rest';
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
    const meetingResp = await this.videoChatProvider.getMeetingLink(
      meetingOptions,
    );
    
    const meetingLink = cryptoRandomString({length: 10, type: 'url-safe'});

    const videoSessionDetail = new VideoChatSession({
      sessionId: meetingResp.sessionId,
      meetingLink,
      isScheduled: meetingOptions.isScheduled,
      scheduleTime: meetingOptions.scheduleTime,
    });

    await this.videoChatSessionRepository.save(videoSessionDetail);

    return meetingLink;
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
    return this.videoChatProvider.getToken(sessionOptions);
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
    return this.videoChatProvider.stopMeeting(meetingLink);
  }
}
