// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {
  Config,
  PubNubMessage,
  PubNubNotification,
} from 'loopback4-notifications';

export class PubNubMockProvider implements Provider<PubNubNotification> {
  value() {
    return {
      publish: async (message: PubNubMessage) => {
        return;
      },

      grantAccess: async (config: Config) => {
        return {
          ttl: 4,
        };
      },

      revokeAccess: async (config: Config) => {
        return {
          success: true,
        };
      },
    };
  }
}
