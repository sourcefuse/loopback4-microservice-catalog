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
import {Orders, Transactions, Subscriptions} from '../models';
import {GatewayBindings, IGateway} from '../providers';
import {
  OrdersRepository,
  TransactionsRepository,
  TemplatesRepository,
  PaymentGatewaysRepository,
  SubscriptionsRepository,
} from '../repositories';
import {STATUS_CODE} from '@sourceloop/core';
import {ResponseMessage, TemplateName} from '../enums';
const dotenvExt = require('dotenv-extended');
const path = require('path');
dotenvExt.load({
  path: path.join(process.env.INIT_CWD, '.env'),
  defaults: path.join(process.env.INIT_CWD, '.env.defaults'),
  errorOnMissing: false,
  includeProcessEnv: true,
});
const transactionsRoutePath = '/transactions';
const tranasactionsIdRoutePath = '/transactions/{id}';
const redirectStatusCode = 302;
const permRedirectStatusCode = 302;

export class TransactionsController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private readonly res: Response,
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @inject(GatewayBindings.GatewayHelper)
    private readonly gatewayHelper: IGateway,
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(TemplatesRepository)
    private readonly templatesRepository: TemplatesRepository,
    @repository(PaymentGatewaysRepository)
    private readonly paymentGatewaysRepository: PaymentGatewaysRepository,
    @repository(SubscriptionsRepository)
    private readonly subscriptionRepository: SubscriptionsRepository,
  ) {}

  @post(transactionsRoutePath)
  @response(STATUS_CODE.OK, {
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
  @response(STATUS_CODE.OK, {
    description: 'Transactions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<Count> {
    return this.transactionsRepository.count(where);
  }

  @get(transactionsRoutePath)
  @response(STATUS_CODE.OK, {
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

  @patch(transactionsRoutePath)
  @response(STATUS_CODE.OK, {
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

  @get(tranasactionsIdRoutePath)
  @response(STATUS_CODE.OK, {
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

  @patch(tranasactionsIdRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
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

  @put(tranasactionsIdRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Transactions PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() transactions: Transactions,
  ): Promise<void> {
    await this.transactionsRepository.replaceById(id, transactions);
  }

  @del(tranasactionsIdRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Transactions DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionsRepository.deleteById(id);
  }

  @post('/place-order-and-pay')
  @response(redirectStatusCode, {
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
  ): Promise<unknown> {
    const orderEntity = {
      id: uuidv4(),
      totalAmount: orders?.totalAmount,
      currency: orders?.currency,
      status: orders?.status,
      metaData: orders?.metaData ?? {},
      paymentGatewayId: orders?.paymentGatewayId,
      paymentmethod: orders?.paymentmethod,
    };
    const newOrder = await this.ordersRepository.create(orderEntity);
    const hostUrl = this.req.get('host');
    const hostProtocol = this.req.protocol;
    return this.res.redirect(
      redirectStatusCode,
      `${hostProtocol}://${hostUrl}/transactions/orderid/${newOrder.id}?method=${newOrder.paymentmethod}`,
    );
  }

  @get(`/transactions/orderid/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'HTML response for payment gateway interface.',
    content: {
      'text/html': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async transactionsPay(@param.path.string('id') id: string): Promise<unknown> {
    const Order = await this.ordersRepository.findById(id);
    const templates = await this.templatesRepository.find({
      where: {
        paymentGatewayId: Order?.paymentGatewayId,
        name: TemplateName.Create,
      },
    });
    const paymentTemplate = templates[0]?.template;
    return this.res.send(
      await this.gatewayHelper.create(Order, paymentTemplate),
    );
  }

  @post('/transactions/charge')
  @response(STATUS_CODE.OK, {
    description: 'Transacttion Gateway Request',
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
    const chargeHelper = await this.gatewayHelper.charge(chargeResponse);
    const hostUrl = this.req.get('host');
    const hostProtocol = this.req.protocol;
    const defaultUrl = `${hostProtocol}://${hostUrl}`;
    if (chargeHelper?.res === ResponseMessage.Sucess) {
      return this.res.redirect(
        permRedirectStatusCode,
        `${process.env.SUCCESS_CALLBACK_URL ?? defaultUrl}`,
      );
    } else {
      return this.res.redirect(
        permRedirectStatusCode,
        `${process.env.FAILURE_CALLBACK_URL ?? defaultUrl}`,
      );
    }
  }

  @post(`/transactions/refund/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Refund Object from payment gateway',
    content: {
      'application/json': {},
    },
  })
  async transactionsRefund(
    @param.path.string('id') id: string,
  ): Promise<unknown> {
    const transaction = await this.transactionsRepository.findById(id);
    if (transaction) {
      const gatewayId = transaction.paymentGatewayId;
      if (gatewayId) {
        const paymentGateway = await this.paymentGatewaysRepository.findById(
          gatewayId,
        );
        const gatewayType = paymentGateway?.gatewayType;
        const hostUrl = this.req.get('host');
        const hostProtocol = this.req.protocol;
        return this.res.redirect(
          permRedirectStatusCode,
          `${hostProtocol}://${hostUrl}/transactions/refund/parse/${id}?method=${gatewayType}`,
        );
      } else {
        return 'Not Valid Gateway Id';
      }
    } else {
      return 'Transaction does not exist';
    }
  }

  @get(`/transactions/refund/parse/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Refund Object from payment gateway',
    content: {
      'application/json': {},
    },
  })
  async transactionsRefundParse(
    @param.path.string('id') id: string,
  ): Promise<unknown> {
    return this.gatewayHelper.refund(id);
  }

  @post('/create-subscription-and-pay')
  @response(redirectStatusCode, {
    description: 'Subscription model instance',
    content: {
      'text/html': {},
    },
  })
  async subscriptionandtransactionscreate(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<void> {
    const subscriptionEntity = {
      id: uuidv4(),
      totalAmount: subscriptions?.totalAmount,
      status: subscriptions?.status,
      metaData: subscriptions?.metaData ?? {},
      paymentGatewayId: subscriptions?.paymentGatewayId,
      paymentMethod: subscriptions?.paymentmethod,
      currency: subscriptions?.currency,
      startDate: subscriptions.startDate
        ? new Date(subscriptions.startDate)
        : new Date(),
      endDate: subscriptions.endDate
        ? new Date(subscriptions.endDate)
        : new Date(),
      planId: subscriptions?.planId,
    };
    const newSubscription = await this.subscriptionRepository.create(
      subscriptionEntity,
    );
    const hostUrl = this.req.get('host');
    const hostProtocol = this.req.protocol;
    this.req.query.method = newSubscription.paymentMethod;
    return this.res.redirect(
      redirectStatusCode,
      `${hostProtocol}://${hostUrl}/transactions/subscriptionid/${newSubscription.id}?method=${newSubscription.paymentMethod}`,
    );
  }

  @get(`/transactions/subscriptionid/{id}`)
  @response(redirectStatusCode, {
    description: 'Array of Transactions model instances',
    content: {
      'text/html': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async subscriptionTransactionsPay(
    @param.path.string('id') id: string,
  ): Promise<unknown> {
    const Subscription = await this.subscriptionRepository.findById(id);
    const templates = await this.templatesRepository.find({
      where: {
        paymentGatewayId: Subscription?.paymentGatewayId,
        name: TemplateName.Create,
      },
    });
    const paymentTemplate = templates[0]?.template;
    return this.res.send(
      await this.gatewayHelper.subscriptionCreate(
        Subscription,
        paymentTemplate,
      ),
    );
  }

  @post('/transactions/charge/subscriptions')
  @response(STATUS_CODE.OK, {
    description: 'Subscription model instance',
    content: {
      'application/json': {},
    },
  })
  async subscriptionTransactionscharge(
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
      subscriptionId: this.req.query.subscriptionId,
    };
    const chargeHelper = await this.gatewayHelper.subscriptionCharge(
      chargeResponse,
    );
    const hostUrl = this.req.get('host');
    const hostProtocol = this.req.protocol;
    const defaultUrl = `${hostProtocol}://${hostUrl}`;
    if (chargeHelper?.res === ResponseMessage.Sucess) {
      return this.res.redirect(
        permRedirectStatusCode,
        `${process.env.SUCCESS_CALLBACK_URL ?? defaultUrl}`,
      );
    } else {
      return this.res.redirect(
        permRedirectStatusCode,
        `${process.env.FAILURE_CALLBACK_URL ?? defaultUrl}`,
      );
    }
  }

  @post('/transactions/webhook')
  @response(STATUS_CODE.OK, {
    description: 'Subscription Gateway Request',
    content: {
      'application/json': {},
    },
  })
  async subscriptionWebHook(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    chargeResponse: DataObject<{}>,
  ): Promise<unknown> {
    return this.res.send(
      await this.gatewayHelper.subscriptionWebHook(chargeResponse),
    );
  }
}
