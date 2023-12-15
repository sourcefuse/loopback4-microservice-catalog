// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {Subscriber} from 'loopback4-notifications';
import sinon from 'sinon';
import {Notification, UserNotificationSettings} from '../../models';
import {NotificationUserSettingsProvider} from '../../providers';
import {
  NotificationRepository,
  UserNotificationSettingsRepository,
} from '../../repositories';

const previousDate = new Date();
previousDate.setDate(previousDate.getDate() + 1);
const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 1);

describe('Notification User Settings Service', () => {
  let userNotifSettingsRepository: StubbedInstanceWithSinonAccessor<UserNotificationSettingsRepository>;
  let notificationRepository: StubbedInstanceWithSinonAccessor<NotificationRepository>;
  let notificationUserSettingsProvider: NotificationUserSettingsProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('adds notification from user into receivers array and returns it', () => {
    it('returns exact sam e notification object after applying user  notification settings in case there is no sleep time for the given user.', async () => {
      const subscriber: Subscriber[] = [
        {
          id: 'dummy2',
          ['test']: 'test',
          isDraft: false,
        },
      ];
      const notification = new Notification({
        id: 'dummy',
        receiver: {
          to: [
            {
              id: 'dummy2',
              ['test']: 'test',
            },
          ],
        },
        body: 'dummy body',
        type: 0,
      });

      const result = await notificationUserSettingsProvider
        .value()
        .checkUserNotificationSettings(notification);
      expect(result).to.eql(subscriber);
    });

    it('returns the filtered  subscriber object with isDraft alue true after applying user  notification settings in case there is sleep time for the given user.', async () => {
      const userNotificationSettingsToAdd = new UserNotificationSettings({
        userId: '1',
        type: 1,
        sleepStartTime: previousDate,
        sleepEndTime: nextDate,
      });

      const findOne = userNotifSettingsRepository.stubs.findOne;
      findOne.resolves(userNotificationSettingsToAdd);
      const subscriber: Subscriber[] = [
        {
          id: '1',
          ['test']: 'test',
          isDraft: true,
        },
        {
          id: '2',
          ['test']: 'test',
          isDraft: true,
        },
      ];
      const notification = new Notification({
        id: 'dummy',
        receiver: {
          to: [
            {
              id: '1',
              ['test']: 'test',
            },
            {
              id: '2',
              ['test']: 'test',
            },
          ],
        },
        body: 'dummy body',
        type: 0,
      });
      const result = await notificationUserSettingsProvider
        .value()
        .checkUserNotificationSettings(notification);
      expect(result).to.eql(subscriber);
    });
  });

  function setUp() {
    userNotifSettingsRepository = createStubInstance(
      UserNotificationSettingsRepository,
    );
    notificationRepository = createStubInstance(NotificationRepository);
    notificationUserSettingsProvider = new NotificationUserSettingsProvider(
      userNotifSettingsRepository,
      notificationRepository,
    );
  }
});
