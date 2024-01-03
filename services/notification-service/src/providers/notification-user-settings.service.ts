import {/* inject, */ BindingScope, Provider, injectable} from '@loopback/core';

/*
 * Fix the service type. Possible options can be:
 * - import {NotificationUserSettings} from 'your-module';
 * - export type NotificationUserSettings = string;
 * - export interface NotificationUserSettings {}
 */
import {repository} from '@loopback/repository';
import {Subscriber} from 'loopback4-notifications/dist';
import {Notification} from '../models';
import {
  NotificationRepository,
  UserNotificationSettingsRepository,
} from '../repositories';
import {INotificationSettingFilterFunc} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationUserSettingsProvider
  implements Provider<INotificationSettingFilterFunc>
{
  constructor(
    /* Add @inject to inject parameters */
    @repository(UserNotificationSettingsRepository)
    public userNotifSettingsRepository: UserNotificationSettingsRepository,
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
  ) {}

  value() {
    //Function to filter the recipients based on their respective sleep time to send notification or save it only as draft
    return {
      /**
       *
       * @param notification
       * @returns notification object which contains filtered recipient(s) which does not have those recipient(s) which have sleep time at the moment
       */
      checkUserNotificationSettings: async (notification: Notification) => {
        //In case notification body has the critical flag as false then only system will check for the notification settings i.e. the sleep time of the user.
        const categorizedSubscribes: Subscriber[] = [];
        if (notification.isCritical && notification.receiver) {
          return notification.receiver.to;
        } else if (!notification.isCritical && notification.receiver) {
          //here the participants will be filtered based on the sleep time of the individual participant
          for (const toUser of notification.receiver.to) {
            const element = {...toUser};
            const currentTime = new Date();
            const sleepTime = await this.userNotifSettingsRepository.findOne({
              where: {
                userId: toUser.id,
                sleepStartTime: {lte: currentTime},
                sleepEndTime: {gte: currentTime},
              },
            });
            element.isDraft = false;
            if (sleepTime) {
              element.isDraft = true;
            }
            categorizedSubscribes.push(element);
          }
        } else {
          return [];
        }
        return categorizedSubscribes;
      },
      getNotificationSubscribers: async (categorizedSubscribes: Subscriber[]) =>
        categorizedSubscribes.filter(subscriber => !subscriber.isDraft),
      getDraftSubscribers: async (categorizedSubscribes: Subscriber[]) =>
        categorizedSubscribes.filter(subscriber => !subscriber.isDraft),
    };
  }
}
