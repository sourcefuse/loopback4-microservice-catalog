// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {SendReminderFunction} from '../types';
import {AnyObject} from '@loopback/repository';

export class SendReminderProvider implements Provider<SendReminderFunction> {
  value() {
    return {
      sendReminder: async (surveyId: string, reuiredData: AnyObject) => {
        return {
          reminderSuccessMsg: 'Reminder Sent successfully',
        };
      },
    };
  }
}
