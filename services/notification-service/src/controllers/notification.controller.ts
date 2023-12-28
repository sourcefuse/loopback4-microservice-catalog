﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { BindingScope, Getter, bind, inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import { AuthErrorKeys, STRATEGY, authenticate } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { INotification, NotificationBindings } from 'loopback4-notifications';
import { ErrorKeys } from '../enums/error-keys.enum';
import { PermissionKey } from '../enums/permission-key.enum';
import { NotifServiceBindings } from '../keys';
import {
  Notification,
  NotificationUser
} from '../models';
import {
  NotificationRepository,
  NotificationUserRepository,
} from '../repositories';
import { ProcessNotificationService } from '../services';
import { INotificationFilterFunc, INotificationUserManager } from '../types';
const basePath = '/notifications';

const maxBodyLen = parseInt(String(process.env.MAX_LENGTH)) ?? 1000;
@bind({ scope: BindingScope.TRANSIENT })
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
    @inject(NotifServiceBindings.NotificationFilter)
    private readonly filterNotification: INotificationFilterFunc,
    @inject('services.ProcessNotificationService')
    private readonly processNotif: ProcessNotificationService,
  ) { }

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
        description:
          'Notification model instance, This API end point will be used to send the notification to the user.',
        content: {
          [CONTENT_TYPE.JSON]: { schema: getModelSchemaRef(Notification) },
        },
      },
    },
  })
  async create(
    @requestBody({
      description:
        'This API is used to send notifications, the request body contains the object of notification model.',
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Notification, {
            exclude: ['id', 'isDraft'],
          }),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    if (!notification.receiver) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }
    notification = await this.filterNotification(notification);
    const provider = await this.notifProvider();
    await provider.publish(notification);
    if (notification.body.length > maxBodyLen) {
      notification.body = notification.body.substring(0, maxBodyLen - 1);
    }
    const notif = await this.notificationRepository.create(notification);
    if (!notif?.id) {
      throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
    }

    const receiversToCreate = await this.createNotifUsers(notif);
    if (receiversToCreate.length) {
      await this.notificationUserRepository.createAll(receiversToCreate);
    }
    return notif;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateNotification,
      PermissionKey.CreateNotificationNum,
    ],
  })
  @post(`${basePath}/bulk`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Notifications, to send notifications as bulk.',
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
            items: getModelSchemaRef(Notification, { exclude: ['id'] }),
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
    if (notifications.length) {
      const notifs = await this.notificationRepository.createAll(notifications);
      const notifUsers: NotificationUser[] = [];
      for (const notif of notifs) {
        if (!notif?.id) {
          throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
        }

        const receiversToCreate = await this.createNotifUsers(notif);
        notifUsers.push(...receiversToCreate);
      }
      if (notifUsers.length) {
        await this.notificationUserRepository.createAll(notifUsers);
      }
      return notifs;
    } else {
      return [];
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewNotification,
      PermissionKey.ViewNotificationNum,
    ],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification model count',
        content: { [CONTENT_TYPE.JSON]: { schema: CountSchema } },
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
  @authorize({ permissions: ['*'] })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Array of Notification model instances, To get the notifications',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: { type: 'array', items: getModelSchemaRef(Notification) },
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
  @authorize({
    permissions: [
      PermissionKey.ViewNotification,
      PermissionKey.ViewNotificationNum,
    ],
  })
  @get(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: ', to get the notification by ID',
        content: {
          [CONTENT_TYPE.JSON]: { schema: getModelSchemaRef(Notification) },
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Notification> {
    return this.notificationRepository.findById(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
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
        description: 'Notification PATCH success count',
        content: { [CONTENT_TYPE.JSON]: { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Notification, { partial: true }),
        },
      },
    })
    notification: Notification,
    @param.query.object('where', getWhereSchemaFor(Notification))
    where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.updateAll(notification, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateNotification,
      PermissionKey.UpdateNotificationNum,
    ],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Notification PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Notification, { partial: true }),
        },
      },
    })
    notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.updateById(id, notification);
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
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Notification DELETE success',
      },
    },
  })
  async deleteAll(
    @param.query.object('where', getWhereSchemaFor(Notification))
    where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.deleteAll(where);
  }

  createNotifUsers(notif: Notification) {
    if (!notif.receiver?.to) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }

    return this.notifUserService.getNotifUsers(notif);
  }
}
