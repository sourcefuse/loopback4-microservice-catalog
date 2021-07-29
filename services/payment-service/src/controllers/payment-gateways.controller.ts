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
  response,
} from '@loopback/rest';
import {PaymentGateways} from '../models';
import {PaymentGatewaysRepository} from '../repositories';

export class PaymentGatewaysController {
  constructor(
    @repository(PaymentGatewaysRepository)
    public paymentGatewaysRepository: PaymentGatewaysRepository,
  ) {}

  @post('/payment-gateways')
  @response(200, {
    description: 'PaymentGateways model instance',
    content: {'application/json': {schema: getModelSchemaRef(PaymentGateways)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
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

  @get('/payment-gateways/count')
  @response(200, {
    description: 'PaymentGateways model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PaymentGateways) where?: Where<PaymentGateways>,
  ): Promise<Count> {
    return this.paymentGatewaysRepository.count(where);
  }

  @get('/payment-gateways')
  @response(200, {
    description: 'Array of PaymentGateways model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PaymentGateways, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PaymentGateways) filter?: Filter<PaymentGateways>,
  ): Promise<PaymentGateways[]> {
    return this.paymentGatewaysRepository.find(filter);
  }

  @patch('/payment-gateways')
  @response(200, {
    description: 'PaymentGateways PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentGateways, {partial: true}),
        },
      },
    })
    paymentGateways: PaymentGateways,
    @param.where(PaymentGateways) where?: Where<PaymentGateways>,
  ): Promise<Count> {
    return this.paymentGatewaysRepository.updateAll(paymentGateways, where);
  }

  @get('/payment-gateways/{id}')
  @response(200, {
    description: 'PaymentGateways model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PaymentGateways, {includeRelations: true}),
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

  @patch('/payment-gateways/{id}')
  @response(204, {
    description: 'PaymentGateways PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentGateways, {partial: true}),
        },
      },
    })
    paymentGateways: PaymentGateways,
  ): Promise<void> {
    await this.paymentGatewaysRepository.updateById(id, paymentGateways);
  }

  @put('/payment-gateways/{id}')
  @response(204, {
    description: 'PaymentGateways PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() paymentGateways: PaymentGateways,
  ): Promise<void> {
    await this.paymentGatewaysRepository.replaceById(id, paymentGateways);
  }

  @del('/payment-gateways/{id}')
  @response(204, {
    description: 'PaymentGateways DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.paymentGatewaysRepository.deleteById(id);
  }
}
