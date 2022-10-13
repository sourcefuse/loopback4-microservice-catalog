// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/core';
import {SNS} from 'aws-sdk';
import {
  SNSBindings,
  SNSMessage,
  SNSNotification,
} from 'loopback4-notifications/sns';

export class SnsMockProvider implements Provider<SNSNotification> {
  constructor(
    @inject(SNSBindings.Config, {
      optional: true,
    })
    private readonly snsConfig?: SNS.ClientConfiguration,
  ) {}

  value() {
    return {
      publish: async (message: SNSMessage) => {
        return;
      },
    };
  }
}
