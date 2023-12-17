import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Transaction} from '@loopback/repository/dist';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from 'loopback4-authentication';
import {
  INotification,
  NotificationBindings,
  Subscriber,
} from 'loopback4-notifications';
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
const maxBodyLen = parseInt(String(process.env.MAX_LENGTH)) ?? 1000;

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
    if (notification?.receiver?.to.length < 1) {
      //Throw error in case receiver does not exists in request
      throw new HttpErrors.UnprocessableEntity(
        `Receiver's to array should not be empty, at least one receiver is mandatory.`,
      );
    }
    const categorizedSubscribers =
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

    const connectorName =
      this.notificationRepository?.dataSource?.connector?.name;
    const notifTx =
      connectorName !== 'memory'
        ? await this.notificationRepository.beginTransaction()
        : null;
    try {
      notif = await this.insertDataInDb(notification, notifTx);
      if (!notification.isDraft) {
        const notificationSent = await this.sendNotification(
          notif,
          categorizedSubscribers,
        );
        notif.body = notificationSent.body;
      }
      await notifTx?.commit();
    } catch (error) {
      await notifTx?.rollback();
      throw new HttpErrors.Forbidden(
        `Error Occurred! ${error.message}, the request completed and transaction has been reverted due to error.`,
      );
    }
    return notif;
  }
  async getAllGroupedNotifications(groupKey: string): Promise<Notification[]> {
    const where = {where: {groupKey: groupKey}};
    return this.notificationRepository.find(where);
  }
  async sendNotification(
    notif: Notification,
    categorizedSubscribers: Subscriber[],
  ) {
    if (notif.isGrouped && notif.groupKey) {
      const notifications = await this.getAllGroupedNotifications(
        notif.groupKey,
      );
      let groupNotificationBody = '';
      for (const element of notifications) {
        groupNotificationBody += element.body;
      }
      notif.body = groupNotificationBody;
    }
    notif.receiver.to =
      await this.filterNotificationSettings.getNotificationSubscribers(
        categorizedSubscribers,
      );
    const provider = await this.notifProvider();
    await provider.publish(notif);
    if (!notif?.id) {
      throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
    }
    notif.receiver.to = categorizedSubscribers;
    const receiversToCreate = await this.createNotifUsers(notif);
    await this.notificationUserRepository.createAll(receiversToCreate);
    return notif;
  }
  async insertDataInDb(
    notification: Notification,
    notifTx: Transaction | null,
  ) {
    const notif = this.notificationRepository.create(notification, {
      transaction: notifTx,
    });
    return notif;
  }
  createNotifUsers(notif: Notification) {
    if (!notif.receiver?.to) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }

    return this.notifUserService.getNotifUsers(notif);
  }
}
