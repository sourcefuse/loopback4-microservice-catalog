import { /* inject, */ BindingScope, Provider, injectable } from '@loopback/core';

/*
 * Fix the service type. Possible options can be:
 * - import {NotificationUserSettings} from 'your-module';
 * - export type NotificationUserSettings = string;
 * - export interface NotificationUserSettings {}
 */
import { repository } from '@loopback/repository';
import moment from 'moment';
import { Notification } from '../models';
import { NotificationRepository, UserNotificationSettingsRepository } from '../repositories';
export type NotificationUserSettings = unknown;

@injectable({ scope: BindingScope.TRANSIENT })
export class NotificationUserSettingsProvider implements Provider<NotificationUserSettings> {
  constructor(
    /* Add @inject to inject parameters */
    @repository(UserNotificationSettingsRepository)
    public userNotifSettingsRepository: UserNotificationSettingsRepository,
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
  ) { }

  value() {
    //Function to filter the recipients based on their respective sleep time to send notification or save it only as draft
    return {
      /**
       *
       * @param notification
       * @returns notification object which contains filtered recipient(s) which does not have those recipient(s) which have sleep time at the moment
       */
      checkUserNotificationSettings: async (notification: Notification) => {
        const recipientToSendNotif = [];
        const recipientToNotSendNotif = [];
        const toUsers = notification.receiver.to;
        for (const toUser of toUsers) {
          const element = toUser;
          const currentTime = new Date();
          const sleepTime = await this.userNotifSettingsRepository.findOne({ where: { userId: element.id, sleepStartTime: { lte: currentTime }, sleepEndTime: { gte: currentTime } } });
          element.isDraft = false;
          if (sleepTime) {
            element.isDraft = true;
            recipientToNotSendNotif.push(element);
          }
          else {
            element.isDraft = false;
            recipientToSendNotif.push(element);
          }
        }
        if (recipientToNotSendNotif.length > 0) {
          const draftNotification = JSON.parse(JSON.stringify(notification));
          draftNotification.receiver.to = recipientToNotSendNotif;
          draftNotification.isDraft = true;
          draftNotification.isGrouped = true;
          const currentDate = moment(new Date()).format("YYYY-MM-DD");
          draftNotification.groupKey = `sleep_${currentDate}`;
          //Draft notification for recipient To Whom Not Send Notificatuon
          await this.insertDataInDb(draftNotification);
        }
        if (recipientToSendNotif.length > 0) {
          notification.receiver.to = recipientToSendNotif;
        }
        return notification;
      },
    };
  }
  async insertDataInDb(notification: Notification) {
    return this.notificationRepository.create(notification);
  }
}
