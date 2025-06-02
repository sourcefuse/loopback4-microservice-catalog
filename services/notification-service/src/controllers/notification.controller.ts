// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, Getter, bind, inject} from '@loopback/core';
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
import {AuthErrorKeys, STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {INotification, NotificationBindings} from 'loopback4-notifications';
import {ErrorKeys} from '../enums/error-keys.enum';
import {PermissionKey} from '../enums/permission-key.enum';
import {NotifServiceBindings} from '../keys';
import {
  Notification,
  NotificationDto,
  NotificationSettingsDto,
  NotificationUser,
} from '../models';
import {
  NotificationRepository,
  NotificationUserRepository,
} from '../repositories';
import {ProcessNotificationService} from '../services';
import {INotificationFilterFunc, INotificationUserManager} from '../types';
const basePath = '/notifications';

const maxBodyLen = parseInt(String(process.env.MAX_LENGTH)) ?? 1000;
@bind({scope: BindingScope.TRANSIENT})
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
  ) {}

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
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Notification)},
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

    await this.notificationUserRepository.createAll(receiversToCreate);
    return notif;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateNotification,
      PermissionKey.CreateNotificationNum,
    ],
  })
  @post(`${basePath}/groups/{groupKey}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'This API is used to send notification by grouping by given key in the end point.',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(NotificationDto, {
              exclude: ['id'],
            }),
          },
        },
      },
    },
  })
  async sendGroupedNotificationByGroupKey(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(NotificationDto, {
            exclude: ['id', 'groupKey'],
          }),
        },
      },
    })
    notificationRequest: Omit<NotificationDto, 'id'>,
    @param.path.string('groupKey') groupKey: string,
  ): Promise<Notification> {
    groupKey = decodeURI(groupKey);
    if (!groupKey) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.MandatoryGroupKey);
    }
    let notification = new Notification({
      body: notificationRequest.body ?? '',
      subject: notificationRequest.subject,
      receiver: notificationRequest.receiver,
      type: notificationRequest.type,
      options: notificationRequest.options,
      isCritical: notificationRequest.isCritical,
      groupKey: groupKey,
    });
    notification = await this.filterNotification(notification);
    return this.processNotif.sendGroupedNotification(notification, groupKey);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateNotification,
      PermissionKey.CreateNotificationNum,
    ],
  })
  @post(`${basePath}/drafts`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'This API is used to draft notifications, here in case isDraft .',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Notification, {
              exclude: ['id', 'isDraft'],
            }),
          },
        },
      },
    },
  })
  async draftNotification(
    @requestBody({
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
    const {groupKey, receiver, subject, options} = notification;
    const hasTo = receiver?.to?.length > 0;
    const hasFromEmail = options?.fromEmail;

    if (groupKey) {
      if (hasTo) {
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.GroupedDraftReceiverError,
        );
      }
      if (subject) {
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.GroupedDraftSubjectError,
        );
      }
      if (hasFromEmail) {
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.GroupedDraftFromEmailError,
        );
      }
    } else if (!(subject && hasTo && hasFromEmail)) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.DraftError);
    } else {
      notification.isDraft = true;
      return this.notificationRepository.create(notification);
    }

    notification.isDraft = true;
    return this.notificationRepository.create(notification);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateNotification,
      PermissionKey.CreateNotificationNum,
    ],
  })
  @post(`${basePath}/{id}/send`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'This API is used to send notifications for given Notification Id.',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(NotificationDto, {
              exclude: [
                'id',
                'groupKey',
                'receiver',
                'subject',
                'body',
                'type',
              ],
            }),
          },
        },
      },
    },
  })
  async sendNotificationById(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(NotificationDto, {
            exclude: ['id', 'groupKey', 'receiver', 'subject', 'body', 'type'],
          }),
        },
      },
    })
    notificationDto: NotificationDto,
    @param.path.string('id') id: string,
  ): Promise<Notification> {
    if (!id) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.MandatoryGroupKey);
    }
    const notificationData = await this.notificationRepository.find({
      where: {id: id, isDraft: true},
    });
    if (notificationData.length > 0) {
      let notification = notificationData[0];
      notification.options = notificationDto.options;
      notification = await this.filterNotification(notification);
      return this.processNotif.processNotificationById(notification);
    } else {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.NoDraftFound);
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateNotification,
      PermissionKey.CreateNotificationNum,
    ],
  })
  @post(`${basePath}/send`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'This API is used to send notifications for given search criteria.',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(NotificationSettingsDto, {}),
          },
        },
      },
    },
  })
  async sendNotificationForSleepTimeUsers(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(NotificationSettingsDto, {}),
        },
      },
    })
    notificationSettingsDto: NotificationSettingsDto,
  ): Promise<Notification[]> {
    return this.processNotif.processNotificationForSleptTimeUsers(
      notificationSettingsDto,
    );
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
    for (const notif of notifs) {
      if (!notif?.id) {
        throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
      }

      const receiversToCreate = await this.createNotifUsers(notif);
      notifUsers.push(...receiversToCreate);
    }
    await this.notificationUserRepository.createAll(notifUsers);
    return notifs;
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
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Array of Notification model instances, To get the notifications',
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
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Notification)},
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
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Notification, {partial: true}),
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
          schema: getModelSchemaRef(Notification, {partial: true}),
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
