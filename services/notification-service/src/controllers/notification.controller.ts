import {Getter, inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authenticate, AuthErrorKeys, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {INotification, NotificationBindings} from 'loopback4-notifications';
import {ErrorKeys} from '../enums/error-keys.enum';
import {PermissionKey} from '../enums/permission-key.enum';
import {NotifServiceBindings} from '../keys';
import {Notification, NotificationUser} from '../models';
import {
  NotificationRepository,
  NotificationUserRepository,
} from '../repositories';
import {INotificationUserManager} from '../types';

const maxBodyLen = 1000;
export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @inject.getter(NotificationBindings.NotificationProvider)
    private readonly notifProvider: Getter<INotification>,
    @repository(NotificationUserRepository)
    public notificationUserRepository: NotificationUserRepository,
    @inject(NotifServiceBindings.NotificationUserManager)
    private readonly notifUserService: INotificationUserManager,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateNotification]})
  @post('/notifications', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Notification)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Notification, {exclude: ['id']}),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    const provider = await this.notifProvider();
    await provider.publish(notification);
    if (notification.body.length > maxBodyLen) {
      notification.body = notification.body.substring(0, maxBodyLen - 1);
    }
    const notif = await this.notificationRepository.create(notification);
    if (!notif || !notif.id) {
      throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
    }

    const receiversToCreate = this.createNotifUsers(notif);
    await this.notificationUserRepository.createAll(receiversToCreate);
    return notif;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateNotification]})
  @post('/notifications/bulk', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Notifications',
        content: {
          [CONTENT_TYPE.JSON]: {
            type: 'array',
            items: getModelSchemaRef(Notification),
          },
        },
      },
    },
  })
  async createBulkNotificaitions(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Notification, {exclude: ['id']}),
          },
        },
      },
    })
    notifications: Notification[],
  ): Promise<Notification[]> {
    const provider = await this.notifProvider();
    notifications.forEach(notification => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      provider.publish(notification);
      if (notification.body.length > maxBodyLen) {
        notification.body = notification.body.substring(0, maxBodyLen - 1);
      }
    });
    const notifs = await this.notificationRepository.createAll(notifications);
    const notifUsers: NotificationUser[] = [];
    notifs.forEach(notif => {
      if (!notif || !notif.id) {
        throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
      }

      const receiversToCreate = this.createNotifUsers(notif);
      notifUsers.push(...receiversToCreate);
    });
    await this.notificationUserRepository.createAll(notifUsers);
    return notifs;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @get('/notifications/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Notification))
    where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get('/notifications', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Notification model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Notification)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Notification))
    filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    return this.notificationRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @get('/notifications/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Notification)},
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Notification> {
    return this.notificationRepository.findById(id);
  }

  createNotifUsers(notif: Notification) {
    if (!notif.receiver || !notif.receiver.to) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }

    return this.notifUserService.getNotifUsers(notif);
  }
}
