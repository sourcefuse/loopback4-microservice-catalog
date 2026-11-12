// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {SNSMessage, SNSNotification} from 'loopback4-notifications/sns';

export class SnsMockProvider implements Provider<SNSNotification> {
  value() {
    return {
      publish: async (message: SNSMessage) => {
        return;
      },
    };
  }
}
