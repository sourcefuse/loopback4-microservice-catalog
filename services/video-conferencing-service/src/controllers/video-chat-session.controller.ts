import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {param, patch, post, requestBody} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {CONTENT_TYPE, STATUS_CODE} from '../enums/index copy';
import {
  MeetingOptions,
  SessionOptions,
  VideoChatInterface,
  SessionResponse
} from '../types';
import {VideoChatSessionRepository} from '../repositories/video-chat-session.repository';
import { VideoChatBindings } from '../keys';

export class VideoChatSessionController {
  constructor(
    @repository(VideoChatSessionRepository)
    private readonly videoChatSessionRepository: VideoChatSessionRepository,
    @inject(VideoChatBindings.VideoChatProvider)
    private readonly videoChatProvider: VideoChatInterface,
  ) {}

  @authorize(['*'])
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

  @authorize(['*'])
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

  @authorize(['*'])
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
