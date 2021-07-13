import {repository} from '@loopback/repository';
import {getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {PermissionKey} from '../enums/permission-key.enum';
import {Notification, NotificationUser} from '../models';
import {NotificationUserRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC, sourceloopGet} from '@sourceloop/core';
export class NotificationUserNotificationController {
  constructor(
    @repository(NotificationUserRepository)
    public notificationUserRepository: NotificationUserRepository,
  ) {}

  @sourceloopGet('/notification-users/{id}/notification', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Notification belonging to NotificationUser',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Notification),
            },
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewNotification]})
  async getNotification(
    @param.path.string('id') id: typeof NotificationUser.prototype.id,
  ): Promise<Notification> {
    return this.notificationUserRepository.notification(id);
  }
}
