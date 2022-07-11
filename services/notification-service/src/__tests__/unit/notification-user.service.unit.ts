// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {NotificationUserProvider} from '../../providers/notification-user.service';
import {Notification, NotificationUser} from '../../models';

describe('Notification User Service', () => {
  let notificationUserProvider: NotificationUserProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('adds notification from user into receivers array and returns it', () => {
    it('returns the notification user', async () => {
      const notificationUser = [
        new NotificationUser({
          notificationId: 'dummy',
          userId: 'dummy2',
        }),
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

      const result = await notificationUserProvider
        .value()
        .getNotifUsers(notification);
      expect(result).to.eql(notificationUser);
    });
  });

  function setUp() {
    notificationUserProvider = new NotificationUserProvider();
  }
});
