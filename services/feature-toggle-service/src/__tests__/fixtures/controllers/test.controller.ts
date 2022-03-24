import {inject} from '@loopback/core';
import {get, Request, RestBindings} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {featuresFlag, StrategyBindings} from '../../..';

export class TestController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @authenticate(STRATEGY.BEARER)
  @featuresFlag({
    featureKey: 'feature_1',
    strategies: [
      StrategyBindings.SYSTEM_STRATEGY,
      StrategyBindings.TENANT_STRATEGY,
      StrategyBindings.USER_STRATEGY,
    ],
  })
  @authorize({permissions: ['*']})
  @get('/all_strategies_enabled_test', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
  async find0(): Promise<boolean> {
    return true;
  }

  @authenticate(STRATEGY.BEARER)
  @featuresFlag({
    featureKey: 'feature_1',
    strategies: [
      StrategyBindings.SYSTEM_STRATEGY,
      StrategyBindings.TENANT_STRATEGY,
      StrategyBindings.USER_STRATEGY,
    ],
  })
  @authorize({permissions: ['*']})
  @get('/all_strategies_enabled', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
    featureKey: 'feature_4',
    strategies: [
      StrategyBindings.SYSTEM_STRATEGY,
      StrategyBindings.TENANT_STRATEGY,
      StrategyBindings.USER_STRATEGY,
    ],
  })
  @authorize({permissions: ['*']})
  @get('/system_strategy_is_off', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
    featureKey: 'feature_3',
    strategies: [
      StrategyBindings.SYSTEM_STRATEGY,
      StrategyBindings.TENANT_STRATEGY,
      StrategyBindings.USER_STRATEGY,
    ],
  })
  @authorize({permissions: ['*']})
  @get('/tenant_strategy_is_off', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
    featureKey: 'feature_2',
    strategies: [
      StrategyBindings.SYSTEM_STRATEGY,
      StrategyBindings.TENANT_STRATEGY,
      StrategyBindings.USER_STRATEGY,
    ],
  })
  @authorize({permissions: ['*']})
  @get('/user_strategy_is_off', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
    featureKey: 'feature_1',
    strategies: ['*'],
  })
  @authorize({permissions: ['*']})
  @get('/skip_all_strategy_checks', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
  async find5(): Promise<boolean> {
    return true;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get('/no_decorator', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
