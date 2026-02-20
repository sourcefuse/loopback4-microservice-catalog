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
import {Orders} from '../models';
import {OrdersRepository} from '../repositories';
const orderIdPath = '/orders/{id}';
export class OrdersController {
  constructor(
    @repository(OrdersRepository)
    public ordersRepository: OrdersRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateOrder, PermissionKey.CreateOrderNum],
  })
  @post('/orders', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Orders model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(Orders)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Orders, {
            title: 'NewOrders',
          }),
        },
      },
    })
    orders: Orders,
  ): Promise<Orders> {
    return this.ordersRepository.create(orders);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewOrder, PermissionKey.ViewOrderNum],
  })
  @get('/orders/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Orders model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Orders) where?: Where<Orders>): Promise<Count> {
    return this.ordersRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewOrder, PermissionKey.ViewOrderNum],
  })
  @get('/orders', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Orders model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(Orders, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Orders) filter?: Filter<Orders>): Promise<Orders[]> {
    return this.ordersRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateOrder, PermissionKey.UpdateOrderNum],
  })
  @patch('/orders', {
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
          schema: getModelSchemaRefSF(Orders, {partial: true}),
        },
      },
    })
    orders: Orders,
    @param.where(Orders) where?: Where<Orders>,
  ): Promise<Count> {
    return this.ordersRepository.updateAll(orders, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewOrder, PermissionKey.ViewOrderNum],
  })
  @get(orderIdPath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Orders model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(Orders, {includeRelations: true}),
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
    return this.ordersRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateOrder, PermissionKey.UpdateOrderNum],
  })
  @patch(orderIdPath, {
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
          schema: getModelSchemaRefSF(Orders, {partial: true}),
        },
      },
    })
    orders: Orders,
  ): Promise<void> {
    await this.ordersRepository.updateById(id, orders);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateOrder, PermissionKey.UpdateOrderNum],
  })
  @put(orderIdPath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Orders PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() orders: Orders,
  ): Promise<void> {
    await this.ordersRepository.replaceById(id, orders);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.DeleteOrder, PermissionKey.DeleteOrderNum],
  })
  @del(orderIdPath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Orders DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ordersRepository.deleteById(id);
  }
}
