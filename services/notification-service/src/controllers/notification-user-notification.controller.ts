// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {PermissionKey} from '../enums/permission-key.enum';
import {Notification, NotificationUser} from '../models';
import {NotificationUserRepository} from '../repositories';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
export class NotificationUserNotificationController {
  constructor(
    @repository(NotificationUserRepository)
    public notificationUserRepository: NotificationUserRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewNotification,
      PermissionKey.ViewNotificationNum,
    ],
  })
  @get('/notification-users/{id}/notification', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification belonging to NotificationUser',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Notification),
            },
          },
        },
      },
    },
  })
  async getNotification(
    @param.path.string('id') id: typeof NotificationUser.prototype.id,
  ): Promise<Notification> {
    return this.notificationUserRepository.notification(id);
  }
}
