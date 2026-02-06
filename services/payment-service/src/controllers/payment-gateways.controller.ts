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
import {PaymentGateways} from '../models';
import {PaymentGatewaysRepository} from '../repositories';
const paymentGatewayRoutePath = '/payment-gateways';
const paymentGatewayIDRoutePath = '/payment-gateways/{id}';

export class PaymentGatewaysController {
  constructor(
    @repository(PaymentGatewaysRepository)
    public paymentGatewaysRepository: PaymentGatewaysRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateGateway, PermissionKey.CreateGatewayNum],
  })
  @post(paymentGatewayRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PaymentGateways model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(PaymentGateways)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(PaymentGateways, {
            title: 'NewPaymentGateways',
          }),
        },
      },
    })
    paymentGateways: PaymentGateways,
  ): Promise<PaymentGateways> {
    return this.paymentGatewaysRepository.create(paymentGateways);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewGateway, PermissionKey.ViewGatewayNum],
  })
  @get('/payment-gateways/count', {
    security: OPERATION_SECURITY_SPEC,
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewGateway, PermissionKey.ViewGatewayNum],
  })
  @get(paymentGatewayRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of PaymentGateways model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(PaymentGateways, {
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateGateway, PermissionKey.UpdateGatewayNum],
  })
  @patch(paymentGatewayRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
          schema: getModelSchemaRefSF(PaymentGateways, {partial: true}),
        },
      },
    })
    paymentGateways: PaymentGateways,
    @param.where(PaymentGateways) where?: Where<PaymentGateways>,
  ): Promise<Count> {
    return this.paymentGatewaysRepository.updateAll(paymentGateways, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewGateway, PermissionKey.ViewGatewayNum],
  })
  @get(paymentGatewayIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PaymentGateways model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(PaymentGateways, {
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateGateway, PermissionKey.UpdateGatewayNum],
  })
  @patch(paymentGatewayIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
          schema: getModelSchemaRefSF(PaymentGateways, {partial: true}),
        },
      },
    })
    paymentGateways: PaymentGateways,
  ): Promise<void> {
    await this.paymentGatewaysRepository.updateById(id, paymentGateways);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateGateway, PermissionKey.UpdateGatewayNum],
  })
  @put(paymentGatewayIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.DeleteGateway, PermissionKey.DeleteGatewayNum],
  })
  @del(paymentGatewayIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
