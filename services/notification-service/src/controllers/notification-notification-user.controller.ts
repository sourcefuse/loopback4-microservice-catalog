import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {Notification, NotificationUser} from '../models';
import {NotificationRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from '@sourceloop/core';
const basePath = '/notifications/{id}/notification-users';

export class NotificationNotificationUserController {
  constructor(
    @repository(NotificationRepository)
    protected notificationRepository: NotificationRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Notification has many NotificationUser',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(NotificationUser),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<NotificationUser>,
  ): Promise<NotificationUser[]> {
    return this.notificationRepository.notificationUsers(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateNotification]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Notification model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(NotificationUser),
          },
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Notification.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NotificationUser, {
            title: 'NewNotificationUserInNotification',
            exclude: ['id'],
            optional: ['notificationId'],
          }),
        },
      },
    })
    notificationUser: Omit<NotificationUser, 'id'>,
  ): Promise<NotificationUser> {
    return this.notificationRepository
      .notificationUsers(id)
      .create(notificationUser);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateNotification]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Notification.NotificationUser PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NotificationUser, {partial: true}),
        },
      },
    })
    notificationUser: Partial<NotificationUser>,
    @param.query.object('where', getWhereSchemaFor(NotificationUser))
    where?: Where<NotificationUser>,
  ): Promise<Count> {
    return this.notificationRepository
      .notificationUsers(id)
      .patch(notificationUser, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteNotification]})
  @del(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Notification.NotificationUser DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(NotificationUser))
    where?: Where<NotificationUser>,
  ): Promise<Count> {
    return this.notificationRepository.notificationUsers(id).delete(where);
  }
}
