import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  DataObject,
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
  Request,
  requestBody,
  response,
  Response,
  RestBindings,
} from '@loopback/rest';
import {v4 as uuidv4} from 'uuid';
import {Orders, Transactions} from '../models';
import {GatewayBindings, IGateway} from '../providers';
import {OrdersRepository, TransactionsRepository} from '../repositories';

export class TransactionsController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(GatewayBindings.GatewayHelper)
    private readonly gatewayHelper: IGateway,
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @repository(TransactionsRepository)
    public transactionsRepository: TransactionsRepository,
  ) {}

  @post('/transactions')
  @response(200, {
    description: 'Transactions model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transactions)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transactions, {
            title: 'NewTransactions',
          }),
        },
      },
    })
    transactions: Transactions,
  ): Promise<Transactions> {
    return this.transactionsRepository.create(transactions);
  }

  @get('/transactions/count')
  @response(200, {
    description: 'Transactions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<Count> {
    return this.transactionsRepository.count(where);
  }

  @get('/transactions')
  @response(200, {
    description: 'Array of Transactions model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transactions, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Transactions) filter?: Filter<Transactions>,
  ): Promise<Transactions[]> {
    return this.transactionsRepository.find(filter);
  }

  @patch('/transactions')
  @response(200, {
    description: 'Transactions PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transactions, {partial: true}),
        },
      },
    })
    transactions: Transactions,
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<Count> {
    return this.transactionsRepository.updateAll(transactions, where);
  }

  @get('/transactions/{id}')
  @response(200, {
    description: 'Transactions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Transactions, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Transactions, {exclude: 'where'})
    filter?: FilterExcludingWhere<Transactions>,
  ): Promise<Transactions> {
    return this.transactionsRepository.findById(id, filter);
  }

  @patch('/transactions/{id}')
  @response(204, {
    description: 'Transactions PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transactions, {partial: true}),
        },
      },
    })
    transactions: Transactions,
  ): Promise<void> {
    await this.transactionsRepository.updateById(id, transactions);
  }

  @put('/transactions/{id}')
  @response(204, {
    description: 'Transactions PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() transactions: Transactions,
  ): Promise<void> {
    await this.transactionsRepository.replaceById(id, transactions);
  }

  @del('/transactions/{id}')
  @response(204, {
    description: 'Transactions DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionsRepository.deleteById(id);
  }

  @post('/place-order-and-pay')
  @response(302, {
    description: 'Order model instance',
    content: {
      'text/html': {},
    },
  })
  async orderandtransactionscreate(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    orders: Orders,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const orderEntity = {
      id: uuidv4(),
      totalAmount: orders?.totalAmount,
      status: orders?.status,
      metaData: orders?.metaData ?? {},
      paymentGatewayId: orders?.paymentGatewayId,
      paymentmethod: orders?.paymentmethod,
    };
    const newOrder = await this.ordersRepository.create(orderEntity);
    return this.res.redirect(
      302,
      `http://localhost:3000/transactions/orderid/${newOrder.id}`,
    );
  }

  @get(`/transactions/orderid/{id}`)
  @response(302, {
    description: 'Array of Transactions model instances',
    content: {
      'text/html': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async transactionsPay(
    @param.path.string('id') id: string,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const Order = await this.ordersRepository.findById(id);
    return this.res.send(await this.gatewayHelper.create(Order));
  }

  @post('/transactions/charge')
  @response(200, {
    description: 'Order model instance',
    content: {
      'application/json': {},
    },
  })
  async transactionscharge(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    chargeResponse: DataObject<{}>,
  ): Promise<unknown> {
    chargeResponse = {
      ...chargeResponse,
      orderId: this.req.query.orderId,
    };
    return this.gatewayHelper.charge(chargeResponse);
  }

  @post(`/transactions/refund/{id}`)
  @response(200, {
    description: 'Array of Transactions model instances',
    content: {
      'application/json': {},
    },
  })
  async transactionsRefund(
    @param.path.string('id') id: string,
    // @param.filter(Transactions) filter?: Filter<Transactions>,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return this.gatewayHelper.refund(id);
  }
}
