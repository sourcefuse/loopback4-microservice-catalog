// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
const basePath = '/notifications/{id}/notification-users';

export class NotificationNotificationUserController {
  constructor(
    @repository(NotificationRepository)
    protected notificationRepository: NotificationRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewNotification,
      PermissionKey.ViewNotificationNum,
    ],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Notification has many NotificationUser',
        content: {
          [CONTENT_TYPE.JSON]: {
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
  @authorize({
    permissions: [
      PermissionKey.CreateNotification,
      PermissionKey.CreateNotificationNum,
    ],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
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
        [CONTENT_TYPE.JSON]: {
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
  @authorize({
    permissions: [
      PermissionKey.UpdateNotification,
      PermissionKey.UpdateNotificationNum,
    ],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification.NotificationUser PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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
  @authorize({
    permissions: [
      PermissionKey.DeleteNotification,
      PermissionKey.DeleteNotificationNum,
    ],
  })
  @del(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification.NotificationUser DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
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
