// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {get, Request, RestBindings} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  featureFlag
} from '@sourceloop/feature-toggle';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

const desp = 'Array of Feature model instances';
export class FeatureToggleExampleController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @featureFlag({
    featureKey: 'Calendar'
  })
  @authorize({permissions: ['*']})
  @get('/all_3_strategies', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: desp,
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
  @featureFlag({
    featureKey: 'Calendar'
  })
  @authorize({permissions: ['*']})
  @get('/system_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: desp,
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
  @featureFlag({
    featureKey: 'Calendar'
  })
  @authorize({permissions: ['*']})
  @get('/tenant_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: desp,
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
  @featureFlag({
    featureKey: 'Calendar'
  })
  @authorize({permissions: ['*']})
  @get('/user_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: desp,
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
  @featureFlag({
    featureKey: 'Calendar'
  })
  @authorize({permissions: ['*']})
  @get('/skip_all_strategy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: desp,
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
