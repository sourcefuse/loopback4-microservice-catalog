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
import {PaymentGateways} from '../models';
import {PaymentGatewaysRepository} from '../repositories';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
const paymentGatewayRoutePath = '/payment-gateways';
const paymentGatewayIDRoutePath = '/payment-gateways/{id}';

export class PaymentGatewaysController {
  constructor(
    @repository(PaymentGatewaysRepository)
    public paymentGatewaysRepository: PaymentGatewaysRepository,
  ) {}

  @post(paymentGatewayRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PaymentGateways model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(PaymentGateways)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(PaymentGateways, {
            title: 'NewPaymentGateways',
          }),
        },
      },
    })
    paymentGateways: PaymentGateways,
  ): Promise<PaymentGateways> {
    return this.paymentGatewaysRepository.create(paymentGateways);
  }

  @get('/payment-gateways/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PaymentGateways model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(PaymentGateways) where?: Where<PaymentGateways>,
  ): Promise<Count> {
    return this.paymentGatewaysRepository.count(where);
  }

  @get(paymentGatewayRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of PaymentGateways model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PaymentGateways, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(PaymentGateways) filter?: Filter<PaymentGateways>,
  ): Promise<PaymentGateways[]> {
    return this.paymentGatewaysRepository.find(filter);
  }

  @patch(paymentGatewayRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PaymentGateways PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(PaymentGateways, {partial: true}),
        },
      },
    })
    paymentGateways: PaymentGateways,
    @param.where(PaymentGateways) where?: Where<PaymentGateways>,
  ): Promise<Count> {
    return this.paymentGatewaysRepository.updateAll(paymentGateways, where);
  }

  @get(paymentGatewayIDRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PaymentGateways model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(PaymentGateways, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PaymentGateways, {exclude: 'where'})
    filter?: FilterExcludingWhere<PaymentGateways>,
  ): Promise<PaymentGateways> {
    return this.paymentGatewaysRepository.findById(id, filter);
  }

  @patch(paymentGatewayIDRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PaymentGateways PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(PaymentGateways, {partial: true}),
        },
      },
    })
    paymentGateways: PaymentGateways,
  ): Promise<void> {
    await this.paymentGatewaysRepository.updateById(id, paymentGateways);
  }

  @put(paymentGatewayIDRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PaymentGateways PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() paymentGateways: PaymentGateways,
  ): Promise<void> {
    await this.paymentGatewaysRepository.replaceById(id, paymentGateways);
  }

  @del(paymentGatewayIDRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PaymentGateways DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.paymentGatewaysRepository.deleteById(id);
  }
}
