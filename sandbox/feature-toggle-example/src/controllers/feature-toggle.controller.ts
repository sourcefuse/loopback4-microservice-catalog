import {inject} from '@loopback/core';
import {get, Request, RestBindings} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  featuresFlag,
  StrategyBindings,
} from '@sourceloop/feature-toggle-service';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

export class FeatureToggleExampleController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @authenticate(STRATEGY.BEARER)
  @featuresFlag({
    featureKey: 'Calendar',
    strategies: [
      StrategyBindings.SYSTEM_STRATEGY,
      StrategyBindings.TENANT_STRATEGY,
      StrategyBindings.USER_STRATEGY,
    ],
  })
  @authorize({permissions: ['*']})
  @get('/all_3_strategies', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Feature model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  async find1(): Promise<boolean> {
    return true;
  }

  @authenticate(STRATEGY.BEARER)
  @featuresFlag({
    featureKey: 'Calendar',
    strategies: [StrategyBindings.SYSTEM_STRATEGY],
  })
  @authorize({permissions: ['*']})
  @get('/system_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Feature model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  async find2(): Promise<boolean> {
    return true;
  }

  @authenticate(STRATEGY.BEARER)
  @featuresFlag({
    featureKey: 'Calendar',
    strategies: [StrategyBindings.TENANT_STRATEGY],
  })
  @authorize({permissions: ['*']})
  @get('/tenant_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Feature model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  async find3(): Promise<boolean> {
    return true;
  }

  @authenticate(STRATEGY.BEARER)
  @featuresFlag({
    featureKey: 'Calendar',
    strategies: [StrategyBindings.USER_STRATEGY],
  })
  @authorize({permissions: ['*']})
  @get('/user_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Feature model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  async find4(): Promise<boolean> {
    return true;
  }

  @authenticate(STRATEGY.BEARER)
  @featuresFlag({
    featureKey: 'Calendar',
    strategies: ['*'],
  })
  @authorize({permissions: ['*']})
  @get('/skip_all_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Feature model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'boolean',
            },
          },
        },
      },
    },
  })
  async find6(): Promise<boolean> {
    return true;
  }
}
