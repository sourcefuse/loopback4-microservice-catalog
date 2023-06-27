// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {SendReminderFunction} from '../types';

export class SendReminderProvider implements Provider<SendReminderFunction> {
  value() {
    return {
      sendReminder: async (surveyId: string, reuiredData: any) => {
        return {
          reminderSuccessMsg: 'Reminder Sent successfully',
        };
      },
    };
  }
}
