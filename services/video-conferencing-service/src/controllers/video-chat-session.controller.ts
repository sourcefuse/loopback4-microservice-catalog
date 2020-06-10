import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {param, patch, post, requestBody} from '@loopback/rest';
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
import { STATUS_CODE, CONTENT_TYPE } from '@sourcefuse-service-catalog/core';

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
    return 'meetingLink';
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
    return {sessionId: 'session_one', token: 'secret_token'};
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
  ): Promise<void> {}
}
