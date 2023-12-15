// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter} from '@loopback/core';
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {INotification} from 'loopback4-notifications';
import sinon from 'sinon';
import {Notification} from '../../models';
import {
  NotificationRepository,
  NotificationUserRepository,
  UserNotificationSettingsRepository,
} from '../../repositories';
import {ProcessNotificationService} from '../../services';
import {
  INotificationSettingFilterFunc,
  INotificationUserManager,
} from '../../types';

const previousDate = new Date();
previousDate.setDate(previousDate.getDate() + 1);
const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 1);

describe('Process notification Service', () => {
  let userNotifSettingsRepository: StubbedInstanceWithSinonAccessor<UserNotificationSettingsRepository>;
  let notifProvider: Getter<INotification>;
  let filterNotificationSettings: INotificationSettingFilterFunc;
  let notifUserService: INotificationUserManager;

  let notificationRepository: StubbedInstanceWithSinonAccessor<NotificationRepository>;
  let notificationUserRepository: StubbedInstanceWithSinonAccessor<NotificationUserRepository>;
  let processNotificationService: ProcessNotificationService;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('Process Notifications', () => {
    it('returns the grouped notifications.', async () => {
      const notificationFind = [
        new Notification({
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
        }),
      ];

      const find = notificationRepository.stubs.find;
      find.resolves(notificationFind);

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
      const result =
        await processNotificationService.getAllGroupedNotifications(
          String(notification.groupKey),
        );
      expect(result).to.eql(notificationFind);
    });
  });
  function setUp() {
    userNotifSettingsRepository = createStubInstance(
      UserNotificationSettingsRepository,
    );
    notificationRepository = createStubInstance(NotificationRepository);
    notificationUserRepository = createStubInstance(NotificationUserRepository);
    processNotificationService = new ProcessNotificationService(
      notificationRepository,
      notifProvider,
      notificationUserRepository,
      notifUserService,
      filterNotificationSettings,
    );
  }
});
