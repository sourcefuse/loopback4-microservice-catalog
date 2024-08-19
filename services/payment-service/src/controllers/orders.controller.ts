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
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {PermissionKey} from '../enums/permission-key.enum';
import {Orders} from '../models';
import {OrdersRepository} from '../repositories';

const basePath = '/Orders';

export class OrdersController {
  constructor(
    @repository(OrdersRepository)
    public OrdersRepository: OrdersRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateOrder, PermissionKey.CreateOrderNum],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Orders model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Orders)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Orders, {
            title: 'NewOrders',
            exclude: ['id'],
          }),
        },
      },
    })
    Orders: Omit<Orders, 'id'>,
  ): Promise<Orders> {
    return this.OrdersRepository.create(Orders);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewOrder, PermissionKey.ViewOrderNum],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Orders model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Orders) where?: Where<Orders>): Promise<Count> {
    return this.OrdersRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewOrder, PermissionKey.ViewOrderNum],
  })
  @get(`${basePath}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Orders model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Orders, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Orders) filter?: Filter<Orders>): Promise<Orders[]> {
    return this.OrdersRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateOrder, PermissionKey.UpdateOrderNum],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Orders PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Orders, {partial: true}),
        },
      },
    })
    Orders: Orders,
    @param.where(Orders) where?: Where<Orders>,
  ): Promise<Count> {
    return this.OrdersRepository.updateAll(Orders, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewOrder, PermissionKey.ViewOrderNum],
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Orders model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Orders, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Orders, {exclude: 'where'})
    filter?: FilterExcludingWhere<Orders>,
  ): Promise<Orders> {
    return this.OrdersRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateOrder, PermissionKey.UpdateOrderNum],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Orders PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Orders, {partial: true}),
        },
      },
    })
    Orders: Orders,
  ): Promise<void> {
    await this.OrdersRepository.updateById(id, Orders);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateOrder, PermissionKey.UpdateOrderNum],
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Orders PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() Orders: Orders,
  ): Promise<void> {
    await this.OrdersRepository.replaceById(id, Orders);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.DeleteOrder, PermissionKey.DeleteOrderNum],
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Orders DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.OrdersRepository.deleteById(id);
  }
}
