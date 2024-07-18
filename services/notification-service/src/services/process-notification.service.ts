import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {
  Filter,
  FilterBuilder,
  WhereBuilder,
  repository,
} from '@loopback/repository';
import {Transaction} from '@loopback/repository/dist';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from 'loopback4-authentication';
import {
  INotification,
  MessageType,
  NotificationBindings,
  Subscriber,
} from 'loopback4-notifications';
import {ErrorKeys} from '../enums';
import {NotifServiceBindings} from '../keys';
import {
  Notification,
  NotificationSettingsDto,
  NotificationUser,
} from '../models';
import {
  NotificationRepository,
  NotificationUserRepository,
} from '../repositories';
import {
  INotificationSettingFilterFunc,
  INotificationUserManager,
} from '../types';
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

  async sendGroupedNotification(notification: Notification, groupKey: string) {
    const notifications = await this.getAllGroupedNotifications(
      groupKey,
      notification.type,
    );
    const groupedNotifIds: string[] = [];
    let groupNotificationBody = notification.body;
    for (const element of notifications) {
      groupNotificationBody += element.body;
      if (element.id) {
        //groupedNotifIds are the notification ids to which notification has been sent, and the isDraft status to be updated to be false
        groupedNotifIds.push(String(element.id));
      }
    }
    notification.body = groupNotificationBody;
    const notifTx =
      process.env.NODE_ENV !== 'test'
        ? await this.notificationRepository.beginTransaction()
        : null;
    try {
      //Checking user notification settings for sleep time
      const categorizedSubscribers =
        await this.filterNotificationSettings.checkUserNotificationSettings(
          notification,
        );
      //Calling function to send notification to the subscriber which have not sleep time or if notification is critical
      const notificationSent = await this.sendNotification(
        notification,
        categorizedSubscribers,
        notifTx,
      );
      //Calling function to update isDraft status to false as the notification has been sent already for given Ids
      await this.updateDraftStatus(groupedNotifIds, notifTx, false);
      await notifTx?.commit();
      return notificationSent;
    } catch (error) {
      await notifTx?.rollback();
      throw new HttpErrors.UnprocessableEntity(error.message);
    }
  }

  /**
   * @param groupKey
   * @returns
   */
  async getAllGroupedNotifications(
    groupKey: string,
    type: MessageType,
  ): Promise<Notification[]> {
    const where = {where: {groupKey: groupKey, type: type, isDraft: true}};
    return this.notificationRepository.find(where);
  }

  /**
   * @param notif
   * @param categorizedSubscribers
   * @returns
   */
  async sendNotification(
    notification: Notification,
    categorizedSubscribers: Subscriber[],
    notifTx: Transaction | null,
  ) {
    if (!notification.body) {
      //Throw Error if notification body is not present
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.BodyNotFound);
    }
    if (notification.receiver) {
      //Going to make entry in DB with combined(grouped) notification body
      notification.isDraft = false;
      const notif = await this.insertDataInDb(notification, notifTx);
      notif.receiver.to =
        await this.filterNotificationSettings.getNotificationSubscribers(
          categorizedSubscribers,
        );
      const provider = await this.notifProvider();
      await provider.publish(notif);
      if (!notif?.id) {
        throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
      }
      try {
        notif.receiver.to = categorizedSubscribers;
        const receiversToCreate = await this.createNotifUsers(notif);
        await this.notificationUserRepository.createAll(receiversToCreate, {
          transaction: notifTx,
        });
      } catch (error) {
        throw new HttpErrors.UnprocessableEntity(
          'Error occurred while making entry in notification users table and the error is: ' +
            error.message,
        );
      }
      return notif;
    } else {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }
  }

  /**
   * @param notificationId
   * @param isDraft
   * @returns
   */
  async updateDraftStatus(
    notificationIds: string[],
    notifTx: Transaction | null,
    isDraft = true,
  ) {
    try {
      const promises: Promise<void>[] = [];
      notificationIds.forEach(notificationId => {
        const dataToUpdate = new Notification({
          id: notificationId,
          isDraft: isDraft,
        });
        promises.push(
          this.notificationRepository.update(dataToUpdate, {
            transaction: notifTx,
          }),
        );
      });
      await Promise.all(promises);
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(
        'Error occurred and notification data could not be updated. The error is:' +
          error.message,
      );
    }
  }

  /**
   *
   * @param notification
   * @param notifTx
   * @returns
   */
  async insertDataInDb(
    notification: Notification,
    notifTx: Transaction | null,
  ) {
    try {
      return await this.notificationRepository.create(notification, {
        transaction: notifTx,
      });
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(
        'Error occurred:' + error.message,
      );
    }
  }
  createNotifUsers(notif: Notification) {
    if (!notif.receiver?.to) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }
    return this.notifUserService.getNotifUsers(notif);
  }

  /**
   *
   * @param notification
   * @returns notification object
   */
  async processNotificationById(notification: Notification) {
    //Check if notification object has id , if not then throw error
    if (!notification?.id) {
      throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.UnknownError);
    }
    //Checking user notification settings for sleep time
    const categorizedSubscribers =
      await this.filterNotificationSettings.checkUserNotificationSettings(
        notification,
      );
    //Check if receiver exists in the request object or not
    if (notification.receiver) {
      //replace receiver.to array after checking user notification settings with respect to sleep time
      notification.receiver.to =
        await this.filterNotificationSettings.getNotificationSubscribers(
          categorizedSubscribers,
        );
      //Send notification to the users
      const provider = await this.notifProvider();
      await provider.publish(notification);
      //assign categorized subscribers (By whom to send and whom to not send notification) to notification.receiver.to
      notification.receiver.to = categorizedSubscribers;
      const receiversToCreate = await this.createNotifUsers(notification);
      await this.notificationUserRepository.createAll(receiversToCreate);
      await this.notificationRepository.updateById(notification.id, {
        isDraft: false,
      });
      notification.isDraft = false;
      return notification;
    } else {
      // throw error id receiver doesn't exists in the request object
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.ReceiverNotFound);
    }
  }

  /**
   *
   * @param notificationSettings
   * @returns filterBuilder
   */
  private _createFilterBuilder(notificationSettings: NotificationSettingsDto) {
    const filter: Filter<NotificationUser> = {};
    const filterBuilder = new FilterBuilder(filter);
    filter.where = {isDraft: true};
    const whereBuilder = new WhereBuilder(filter.where);
    if (notificationSettings.userId && notificationSettings.userId.length > 0) {
      whereBuilder.and([
        {
          userId: {inq: notificationSettings.userId},
        },
      ]);
    }
    if (notificationSettings.ids && notificationSettings.ids.length > 0) {
      whereBuilder.and([
        {
          notificationId: {inq: notificationSettings.ids},
        },
      ]);
    }
    if (notificationSettings.startTime && notificationSettings.endTime) {
      whereBuilder.and([
        {
          createdOn: {
            lte: notificationSettings.endTime,
            gte: notificationSettings.startTime,
          },
        },
      ]);
    }
    filterBuilder.where(whereBuilder.build());
    return filterBuilder;
  }

  async processNotificationForSleptTimeUsers(
    notificationSettings: NotificationSettingsDto,
  ) {
    //Validate request
    if (
      (notificationSettings.startTime && !notificationSettings.endTime) ??
      (!notificationSettings.startTime && notificationSettings.endTime)
    ) {
      throw new HttpErrors.UnprocessableEntity(
        ErrorKeys.StartEndTimeBothMandatoryTogether,
      );
    }
    //Create filter using criteria given in request
    const filterUsers = this._createFilterBuilder(notificationSettings).build();
    const notificationUsers =
      await this.notificationUserRepository.find(filterUsers);
    if (notificationUsers.length === 0) {
      throw new HttpErrors.UnprocessableEntity(
        ErrorKeys.NoUserFoundToSendNotification,
      );
    }
    //Get Notification Ids Which Are To Be Used To Send Notification
    const notificationIds = notificationUsers.map(
      notifUser => notifUser.notificationId,
    );
    const notifications = await this.notificationRepository.find({
      where: {id: {inq: notificationIds}},
    });
    //Iterate through the notifications and change the receivers object according to the notification user's user ID and after that send notification
    notifications.forEach(async notification => {
      const receivers: {type: MessageType; id: string}[] = [];
      const notificationUserIds: string[] = [];
      //Get receivers for specific notification object
      notificationUsers.find(notifUser => {
        const toObj = {type: notification.type, id: ''};
        if (notifUser.notificationId === notification.id) {
          toObj.id = notifUser.userId;
          receivers.push(toObj);
          //Prepare an Array of Id's for which isDraft field is to be updated to false in notification user table.
          notificationUserIds.push(String(notifUser.id));
        }
      });
      //Replace receiver.to according to notification user data found via  search criteria.
      notification.receiver.to = receivers;
      //Send notification to the user
      const provider = await this.notifProvider();
      await provider.publish(notification);
      //Update isDraft status in NotificationUsers table
      await this.notificationUserRepository.updateAll(
        {isDraft: false},
        {where: {id: {inq: notificationUserIds}}},
      );
    });
    // return notifications array with
    return notifications;
  }
}
