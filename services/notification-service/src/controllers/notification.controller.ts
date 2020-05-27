import {inject} from '@loopback/core';
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
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourcefuse-service-catalog/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {INotification, NotificationBindings} from 'loopback4-notifications';

import {PermissionKey} from '../enums/permission-key.enum';
import {Notification} from '../models';
import {NotificationRepository} from '../repositories';

const maxBodyLen = 1000;
export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @inject(NotificationBindings.NotificationProvider)
    private readonly notifProvider: INotification,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKey.CreateNotification])
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
    await this.notifProvider.publish(notification);
    if (notification.body.length > maxBodyLen) {
      notification.body = notification.body.substring(0, maxBodyLen - 1);
    }
    return this.notificationRepository.create(notification);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKey.CreateNotification])
  @post('/notifications/bulk', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Notifications',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Notification)},
        },
      },
    },
  })
  async createBulkNotificaitions(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Notification, {exclude: ['id']}),
        },
      },
    })
    notifications: Notification[],
  ): Promise<Notification[]> {
    notifications.forEach(notification => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.notifProvider.publish(notification);
      if (notification.body.length > maxBodyLen) {
        notification.body = notification.body.substring(0, maxBodyLen - 1);
      }
    });
    return this.notificationRepository.createAll(notifications);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKey.ViewNotification])
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
  @authorize([PermissionKey.ViewNotification])
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
  @authorize([PermissionKey.ViewNotification])
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
}
