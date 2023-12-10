import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from 'loopback4-authentication';
import {INotification, NotificationBindings} from 'loopback4-notifications';
import {ErrorKeys} from '../enums';
import {NotifServiceBindings} from '../keys';
import {Notification} from '../models';
import {
  NotificationRepository,
  NotificationUserRepository,
} from '../repositories';
import {
  INotificationSettingFilterFunc,
  INotificationUserManager,
} from '../types';
const maxBodyLen = 1000;

@injectable({scope: BindingScope.TRANSIENT})
export class ProcessNotificationService {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @inject.getter(NotificationBindings.NotificationProvider)
    private readonly notifProvider: Getter<INotification>,
    @repository(NotificationUserRepository)
    public notificationUserRepository: NotificationUserRepository,
    @inject(NotifServiceBindings.NotificationUserManager)
    private readonly notifUserService: INotificationUserManager,
    @inject(NotifServiceBindings.NotificationSettingFilter)
    private readonly filterNotificationSettings: INotificationSettingFilterFunc,
  ) {}

  /**
   *
   * @param notification
   * @returns notif which is of type Notification(Model)
   */
  async draftAndSendNotification(notification: Notification) {
    //In case notification body has the critical flag as false then only system will check for the notification settings i.e. the sleep time of the user.
    notification =
      await this.filterNotificationSettings.checkUserNotificationSettings(
        notification,
      );
    let notif: Notification;
    if (
      !notification.isDraft &&
      notification.isGrouped &&
      !notification.groupKey
    ) {
      throw new HttpErrors.UnprocessableEntity(
        'In case it is grouped notification, group key field is mandatory in request body.',
      );
    }
    //Cutting the length of the notification to predefined max length only in case if it is not a grouped notification
    if (
      (!notification.isGrouped || !notification.groupKey) &&
      notification.body.length > maxBodyLen
    ) {
      notification.body = notification.body.substring(0, maxBodyLen - 1);
    }
    notif = await this.insertDataInDb(notification);
    if (!notification.isDraft) {
      notif = await this.insertDataInDb(notification);
      const notificationSent = await this.sendNotification(notification, notif);
      notif.body = notificationSent.body;
    }
    return notif;
  }
  async getAllGroupedNotifications(
    notification: Notification,
  ): Promise<Notification[]> {
    const where = {where: {groupKey: notification.groupKey}};
    return this.notificationRepository.find(where);
  }
  async sendNotification(notification: Notification, notif: Notification) {
    if (notification.isGrouped && notification.groupKey) {
      const notifications = await this.getAllGroupedNotifications(notification);
      let groupNotificationBody = '';
      for (const element of notifications) {
        groupNotificationBody += element.body;
      }
      groupNotificationBody += notification.body;
      notification.body = groupNotificationBody;
    }
    const provider = await this.notifProvider();
    await provider.publish(notification);
    if (!notif?.id) {
      throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
    }
    const receiversToCreate = await this.createNotifUsers(notif);
    await this.notificationUserRepository.createAll(receiversToCreate);
    return notification;
  }
  async insertDataInDb(notification: Notification) {
    return this.notificationRepository.create(notification);
  }
  createNotifUsers(notif: Notification) {
    if (!notif.receiver?.to) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }

    return this.notifUserService.getNotifUsers(notif);
  }
}
