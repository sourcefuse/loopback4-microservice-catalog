import {BindingKey} from '@loopback/core';
import {ISurveyServiceConfig} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace SurveyServiceBindings {
  export const Config = BindingKey.create<ISurveyServiceConfig | null>(
    `${BINDING_PREFIX}.survey.config`,
  );
}
