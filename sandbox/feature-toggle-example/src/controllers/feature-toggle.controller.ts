import {get, response} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  featuresFlag,
  StrategyBindings,
} from '@sourceloop/feature-toggle-service';
import {STATUS_CODE} from '@sourceloop/core';
import {FeatureToggleBindings} from '../keys';

export class FeatureToggleController {
  constructor() {}

  @get('/featureFlag')
  @response(STATUS_CODE.OK, {
    description: '',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Response',
          properties: {
            message: {type: 'string'},
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @featuresFlag({
    features: [
      StrategyBindings.TENANT_FEATURE,
      StrategyBindings.SYSTEM_FEATURE,
    ],
  })
  async checkFeature(): Promise<Object> {
    return {
      message: 'Feature Flags are Enabled!!',
    };
  }

  @get('/skipFeatureFlag')
  @response(STATUS_CODE.OK, {
    description: '',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Response',
          properties: {
            message: {type: 'string'},
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @featuresFlag({features: ['*']})
  async skipFeatureFlag(): Promise<Object> {
    return {
      message: 'Will skip the flag check and be accessible always',
    };
  }

  @get('/customFeatureFlag')
  @response(STATUS_CODE.OK, {
    description: '',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Response',
          properties: {
            message: {type: 'string'},
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @featuresFlag({features: [FeatureToggleBindings.ROLE_REATURE]})
  async roleFeatureFlag(): Promise<Object> {
    return {
      message: 'Will skip the flag check and be accessible always',
    };
  }
}
