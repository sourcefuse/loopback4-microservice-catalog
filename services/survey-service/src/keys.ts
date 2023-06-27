import {BindingKey} from '@loopback/core';
import {ISurveyServiceConfig, SendReminderFunction} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace SurveyServiceBindings {
  export const Config = BindingKey.create<ISurveyServiceConfig | null>(
    `${BINDING_PREFIX}.survey.config`,
  );
  export const ReminderFunction =
    BindingKey.create<SendReminderFunction | null>(
      `${BINDING_PREFIX}.survey.reminder`,
    );
}
