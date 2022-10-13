// Copyright (c) 2022 Sourcefuse Technologies
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
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {Orders} from '../models';
import {OrdersRepository} from '../repositories';
const orderIdPath = '/orders/{id}';

export class OrdersController {
  constructor(
    @repository(OrdersRepository)
    public ordersRepository: OrdersRepository,
  ) {}
  @post('/orders', {
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
          }),
        },
      },
    })
    orders: Orders,
  ): Promise<Orders> {
    return this.ordersRepository.create(orders);
  }

  @get('/orders/count', {
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

  @get('/orders', {
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
    return this.ordersRepository.find(filter);
  }

  @patch('/orders', {
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
    orders: Orders,
    @param.where(Orders) where?: Where<Orders>,
  ): Promise<Count> {
    return this.ordersRepository.updateAll(orders, where);
  }

  @get(orderIdPath, {
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
    return this.ordersRepository.findById(id, filter);
  }

  @patch(orderIdPath, {
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
    orders: Orders,
  ): Promise<void> {
    await this.ordersRepository.updateById(id, orders);
  }

  @put(orderIdPath, {
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

  @del(orderIdPath, {
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
