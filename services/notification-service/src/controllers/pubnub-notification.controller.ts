import {inject} from '@loopback/core';
import {
  patch,
  getModelSchemaRef,
  requestBody,
  param,
  HttpErrors,
  del,
} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {
  NotificationBindings,
  PubNubNotification,
  Config,
  MessageType,
} from 'loopback4-notifications';
import {NotifServiceBindings} from '../keys';
import {
  authenticate,
  STRATEGY,
  AuthenticationBindings,
} from 'loopback4-authentication';
import {authorize, AuthorizeErrorKeys} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  SuccessResponse,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {AccessResponseDto, NotificationAccess} from '../models';
import {IChannelManager} from '../types';
import {NotificationAccessRepository} from '../repositories';

export class PubnubNotificationController {
  constructor(
    @inject(NotificationBindings.PushProvider, {optional: true})
    private readonly pushProvider: PubNubNotification,
    @inject(NotifServiceBindings.ChannelManager, {optional: true})
    private readonly channelManagerService: IChannelManager,
    @repository(NotificationAccessRepository)
    public notificationAccessRepository: NotificationAccessRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CanGetNotificationAccess]})
  @patch('/notifications/access/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Access response',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AccessResponseDto)},
        },
      },
    },
  })
  async grantAccess(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(NotificationAccess),
        },
      },
    })
    notification: Omit<NotificationAccess, 'id'>,
    @param.path.string('id') userId: string,
    @param.header.string('Authorization') auth: string,
    @param.header.string('pubnubToken', {required: true}) token: string,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true})
    currentUser?: IAuthUserWithPermissions,
  ): Promise<AccessResponseDto> {
    const config: Config = {
      receiver: notification.receiver,
      type: MessageType.Push,
      options: notification.options,
    };
    if (config.options) {
      config.options.token = token;
    }
    if (
      currentUser &&
      !this.channelManagerService.isChannelAccessAllowed(currentUser, config)
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    await this.pushProvider.grantAccess(config);
    await this.notificationAccessRepository.set(userId, config);
    return new AccessResponseDto({
      cipherKey: '',
    });
  }

  @authorize({permissions: ['*']})
  @del('/notifications/access/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Object with success',
      },
    },
  })
  async revokeAccess(
    @param.path.string('id') userId: string,
  ): Promise<SuccessResponse> {
    const config: Config = await this.notificationAccessRepository.get(userId);
    if (config) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.pushProvider.revokeAccess(config);
      await this.notificationAccessRepository.delete(userId);
      return new SuccessResponse({
        success: true,
      });
    } else {
      throw new HttpErrors.NotFound('Token not found');
    }
  }
}
