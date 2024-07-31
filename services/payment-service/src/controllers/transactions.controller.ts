// Copyright (c) 2023 Sourcefuse Technologies
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
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {v4 as uuidv4} from 'uuid';

import {ResponseMessage, TemplateName, TemplateType} from '../enums';
import {PermissionKey} from '../enums/permission-key.enum';
import {Orders, Transactions} from '../models';
import {GatewayBindings, IGateway} from '../providers';
import {
  OrdersRepository,
  PaymentGatewaysRepository,
  TemplatesRepository,
  TransactionsRepository,
} from '../repositories';

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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateTransaction,
      PermissionKey.CreateTransactionNum,
    ],
  })
  @post(transactionsRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transactions model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Transactions)},
        },
      },
    },
  })
  /**
   * The above function is an async function that creates a new transaction and returns the created
   * transaction.
   * @param {Transactions} transactions - The `transactions` parameter is an object of type
   * `Transactions`. It represents the data for creating a new transaction.
   * @returns The `create` function is returning a Promise that resolves to an instance of the
   * `Transactions` model.
   */
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewTransaction,
      PermissionKey.ViewTransactionNum,
    ],
  })
  @get('/transactions/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transactions model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  /**
   * The count function returns the number of transactions that match the given criteria.
   * @param [where] - The `where` parameter is an optional parameter of type `Where<Transactions>`. It
   * is used to specify the conditions for filtering the transactions. The `Where` type is a generic
   * type that allows you to define the conditions for filtering based on the properties of the
   * `Transactions` entity.
   * @returns The count of transactions that match the provided `where` condition.
   */
  async count(
    @param.where(Transactions) where?: Where<Transactions>,
  ): Promise<Count> {
    return this.transactionsRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewTransaction,
      PermissionKey.ViewTransactionNum,
    ],
  })
  @get(transactionsRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
  /**
   * The `find` function is an asynchronous method that takes an optional filter parameter and returns a
   * promise that resolves to an array of `Transactions` objects.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<Transactions>`.
   * It is used to specify the filtering criteria for the transactions that need to be retrieved. The
   * `Filter` type is a generic type that allows you to define the filtering criteria based on the
   * properties of the `Transactions`
   * @returns The `find` method is returning a promise that resolves to an array of `Transactions`
   * objects.
   */
  async find(
    @param.filter(Transactions) filter?: Filter<Transactions>,
  ): Promise<Transactions[]> {
    return this.transactionsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateTransaction,
      PermissionKey.UpdateTransactionNum,
    ],
  })
  @patch(transactionsRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transactions PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  /**
   * The function `updateAll` updates multiple transactions based on the provided filter and returns
   * the count of updated transactions.
   * @param {Transactions} transactions - The `transactions` parameter is an object of type
   * `Transactions` which represents the data that needs to be updated in the database. It is
   * decorated with `@requestBody` to indicate that it is coming from the request body of the API
   * call.
   * @param [where] - The `where` parameter is an optional filter object that specifies the conditions
   * for updating the transactions. It is used to narrow down the scope of the update operation by
   * specifying certain criteria that the transactions must meet in order to be updated.
   * @returns a Promise that resolves to a Count.
   */
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewTransaction,
      PermissionKey.ViewTransactionNum,
    ],
  })
  @get(tranasactionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
  /**
   * The `findById` function retrieves a transaction by its ID, with an optional filter.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * transaction you want to find. It is passed as a path parameter in the URL.
   * @param [filter] - The `filter` parameter is an optional parameter that allows you to specify
   * additional filtering options for the `findById` method. It is of type
   * `FilterExcludingWhere<Transactions>`, which means it can include any properties of the
   * `Transactions` model except for the `where` property.
   * @returns a Promise that resolves to an instance of the Transactions model.
   */
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Transactions, {exclude: 'where'})
    filter?: FilterExcludingWhere<Transactions>,
  ): Promise<Transactions> {
    return this.transactionsRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateTransaction,
      PermissionKey.UpdateTransactionNum,
    ],
  })
  @patch(tranasactionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Transactions PATCH success',
      },
    },
  })
  /**
   * The function updates a transaction by its ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * transaction that needs to be updated.
   * @param {Transactions} transactions - The `transactions` parameter is an object of type
   * `Transactions`. It represents the data that will be used to update a specific transaction in the
   * database.
   */
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateTransaction,
      PermissionKey.UpdateTransactionNum,
    ],
  })
  @put(tranasactionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Transactions PUT success',
      },
    },
  })
  /**
   * The function replaces a transaction by its ID in the transactions repository.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * transaction that needs to be replaced.
   * @param {Transactions} transactions - The `transactions` parameter is of type `Transactions`. It
   * is the request body that contains the data to be used for replacing the transaction with the
   * specified `id`.
   */
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() transactions: Transactions,
  ): Promise<void> {
    await this.transactionsRepository.replaceById(id, transactions);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteTransaction,
      PermissionKey.DeleteTransactionNum,
    ],
  })
  @del(tranasactionsIdRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Transactions DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionsRepository.deleteById(id);
  }

  /**
   * The function creates a new order entity and redirects the user to a transaction page with the
   * order ID and payment method.
   * @param {Orders} orders - The `orders` parameter is an object that contains the following
   * properties:
   * @returns a Promise that resolves to an unknown value.
   */
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateOrder, PermissionKey.CreateOrderNum],
  })
  @post('/place-order-and-pay', {
    security: OPERATION_SECURITY_SPEC,
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
          schema: getModelSchemaRef(Orders, {
            title: 'NewOrder',
            exclude: ['id'],
          }),
        },
      },
    })
    orders: Omit<Orders, 'id'>,
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
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateOrder, PermissionKey.CreateOrderNum],
  })
  @get(`/transactions/orderid/{id}`, {
    security: OPERATION_SECURITY_SPEC,
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
  /**
   * The function retrieves an order by its ID, finds a payment template based on the order's payment
   * gateway ID, name, and type, and then sends the created order and payment template to a gateway
   * helper for processing.
   * @param {string} id - The `id` parameter is a string that represents the ID of an order.
   * @returns the result of the `this.gatewayHelper.create(Order, paymentTemplate)` method call.
   */
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
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateTransaction,
      PermissionKey.CreateTransactionNum,
    ],
  })
  @post('/transactions/charge', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Transacttion Gateway Request',
        content: {
          [CONTENT_TYPE.JSON]: {},
        },
      },
    },
  })
  /**
   * The function `transactionscharge` handles a charge response, performs a charge operation, and
   * redirects the user to a success or failure callback URL based on the result.
   * @param chargeResponse - The `chargeResponse` parameter is an object of type `DataObject<{}>`. It
   * is used to store the response data for the charge transaction.
   * @returns a Promise that resolves to an unknown value.
   */
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
    if (chargeHelper?.res === ResponseMessage.Success) {
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
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateRefund, PermissionKey.CreateRefundNum],
  })
  @post(`/transactions/refund/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Refund Object from payment gateway',
        content: {
          [CONTENT_TYPE.JSON]: {},
        },
      },
    },
  })
  /**
   * The `transactionsRefund` function refunds a transaction by redirecting to a refund parsing
   * endpoint based on the payment gateway type.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
   * transaction.
   * @returns either a redirect response or a string message. If the transaction exists and has a
   * valid payment gateway ID, it will return a redirect response to the specified URL. If the
   * transaction does not exist, it will return the string message "Transaction does not exist". If
   * the transaction exists but does not have a valid payment gateway ID, it will return the string
   * message "Not Valid Gateway Id".
   */
  async transactionsRefund(
    @param.path.string('id') id: string,
  ): Promise<unknown> {
    const transaction = await this.transactionsRepository.findById(id);
    if (transaction) {
      const gatewayId = transaction.paymentGatewayId;
      if (gatewayId) {
        const paymentGateway =
          await this.paymentGatewaysRepository.findById(gatewayId);
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
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateRefund, PermissionKey.CreateRefundNum],
  })
  @get(`/transactions/refund/parse/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Refund Object from payment gateway',
        content: {
          [CONTENT_TYPE.JSON]: {},
        },
      },
    },
  })
  /**
   * The function `transactionsRefundParse` refunds a transaction with the given ID using the
   * `gatewayHelper` object.
   * @param {string} id - The `id` parameter is a string that represents the transaction ID.
   * @returns a Promise that resolves to an unknown value.
   */
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
  /**
   * The function `subscriptionWebHook` is an async function that receives a charge response as a
   * request body and sends it to a helper function called `subscriptionWebHook` before returning the
   * response.
   * @param chargeResponse - The `chargeResponse` parameter is an object that represents the response
   * received from a charge or payment processing operation. It is of type `DataObject<{}>`, which
   * means it is a generic object with no specific properties defined.
   * @returns the result of the `subscriptionWebHook` method of the `gatewayHelper` object.
   */
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
