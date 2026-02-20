// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {del, get, param, patch, post, put, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  getModelSchemaRefSF,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {Subscriptions} from '../models';
import {SubscriptionsRepository} from '../repositories';
const subscriptionsRoutePath = '/subscriptions';
const subscriptionsIdRoutePath = '/subscriptions/{id}';

export class SubscriptionsController {
  constructor(
    @repository(SubscriptionsRepository)
    public subscriptionsRepository: SubscriptionsRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateSubscription,
      PermissionKey.CreateSubscriptionNum,
    ],
  })
  @post(subscriptionsRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(Subscriptions)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Subscriptions, {
            title: 'NewSubscriptions',
          }),
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<Subscriptions> {
    return this.subscriptionsRepository.create(subscriptions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.GetSubscriptionCount,
      PermissionKey.GetSubscriptionCountNum,
    ],
  })
  @get('/subscriptions/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Subscriptions) where?: Where<Subscriptions>,
  ): Promise<Count> {
    return this.subscriptionsRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.GetSubscriptions,
      PermissionKey.GetSubscriptionsNum,
    ],
  })
  @get(subscriptionsRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Subscriptions model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(Subscriptions, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Subscriptions) filter?: Filter<Subscriptions>,
  ): Promise<Subscriptions[]> {
    return this.subscriptionsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateSubscriptions,
      PermissionKey.UpdateSubscriptionsNum,
    ],
  })
  @patch(subscriptionsRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Subscriptions, {partial: true}),
        },
      },
    })
    subscriptions: Subscriptions,
    @param.where(Subscriptions) where?: Where<Subscriptions>,
  ): Promise<Count> {
    return this.subscriptionsRepository.updateAll(subscriptions, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.GetSubscriptions,
      PermissionKey.GetSubscriptionsNum,
    ],
  })
  @get(subscriptionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscriptions model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(Subscriptions, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Subscriptions, {exclude: 'where'})
    filter?: FilterExcludingWhere<Subscriptions>,
  ): Promise<Subscriptions> {
    return this.subscriptionsRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateSubscriptions,
      PermissionKey.UpdateSubscriptionsNum,
    ],
  })
  @patch(subscriptionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscriptions PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Subscriptions, {partial: true}),
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<void> {
    await this.subscriptionsRepository.updateById(id, subscriptions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateSubscriptions,
      PermissionKey.UpdateSubscriptionsNum,
    ],
  })
  @put(subscriptionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscriptions PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscriptions: Subscriptions,
  ): Promise<void> {
    await this.subscriptionsRepository.replaceById(id, subscriptions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteSubscriptions,
      PermissionKey.DeleteSubscriptionsNum,
    ],
  })
  @del(subscriptionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscriptions DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subscriptionsRepository.deleteById(id);
  }
}
