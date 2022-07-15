// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
  Response,
  RestBindings,
} from '@loopback/rest';
import {v4 as uuidv4} from 'uuid';
import {Orders, Transactions} from '../models';
import {GatewayBindings, IGateway} from '../providers';
import {
  OrdersRepository,
  TransactionsRepository,
  TemplatesRepository,
  PaymentGatewaysRepository,
} from '../repositories';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {ResponseMessage, TemplateName, TemplateType} from '../enums';
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
  ) {}

  @post(transactionsRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transactions model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Transactions)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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

  @get('/transactions/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transactions model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<Count> {
    return this.transactionsRepository.count(where);
  }

  @get(transactionsRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Transactions model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Transactions, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Transactions) filter?: Filter<Transactions>,
  ): Promise<Transactions[]> {
    return this.transactionsRepository.find(filter);
  }

  @patch(transactionsRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transactions PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Transactions, {partial: true}),
        },
      },
    })
    transactions: Transactions,
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<Count> {
    return this.transactionsRepository.updateAll(transactions, where);
  }

  @get(tranasactionsIdRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transactions model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Transactions, {includeRelations: true}),
          },
        },
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

  @patch(tranasactionsIdRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Transactions PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Transactions, {partial: true}),
        },
      },
    })
    transactions: Transactions,
  ): Promise<void> {
    await this.transactionsRepository.updateById(id, transactions);
  }

  @put(tranasactionsIdRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Transactions PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() transactions: Transactions,
  ): Promise<void> {
    await this.transactionsRepository.replaceById(id, transactions);
  }

  @del(tranasactionsIdRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Transactions DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionsRepository.deleteById(id);
  }

  @post('/place-order-and-pay', {
    responses: {
      [redirectStatusCode]: {
        description: 'Order model instance',
        content: {
          [CONTENT_TYPE.TEXT_HTML]: {},
        },
      },
    },
  })
  async orderandtransactionscreate(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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

  @get(`/transactions/orderid/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'HTML response for payment gateway interface.',
        content: {
          [CONTENT_TYPE.TEXT_HTML]: {
            schema: {
              type: 'object',
            },
          },
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
        type: TemplateType.Order,
      },
    });
    const paymentTemplate = templates[0]?.template;
    return this.res.send(
      await this.gatewayHelper.create(Order, paymentTemplate),
    );
  }

  @post('/transactions/charge', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transacttion Gateway Request',
        content: {
          [CONTENT_TYPE.JSON]: {},
        },
      },
    },
  })
  async transactionscharge(
    @requestBody({
      content: {
        [CONTENT_TYPE.FORM_URLENCODED]: {
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

  @post(`/transactions/refund/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Refund Object from payment gateway',
        content: {
          [CONTENT_TYPE.JSON]: {},
        },
      },
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

  @get(`/transactions/refund/parse/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Refund Object from payment gateway',
        content: {
          [CONTENT_TYPE.JSON]: {},
        },
      },
    },
  })
  async transactionsRefundParse(
    @param.path.string('id') id: string,
  ): Promise<unknown> {
    return this.gatewayHelper.refund(id);
  }

  @post('/transactions/webhook', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription Gateway Request',
        content: {
          [CONTENT_TYPE.JSON]: {},
        },
      },
    },
  })
  async subscriptionWebHook(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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
