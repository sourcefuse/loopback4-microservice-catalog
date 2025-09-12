import {BindingScope, Provider, inject, injectable} from '@loopback/core';
import {AnyObject, DataObject, repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {v4 as uuidv4} from 'uuid';
import {
  OrdersRepository,
  SubscriptionsRepository,
  TransactionsRepository,
} from '../../repositories';
import {PayPalBindings} from './keys';
import {IPayPalConfig, PayPalPaymentGateway} from './types';

import {HttpErrors} from '@loopback/rest';
import paypal from '@paypal/checkout-server-sdk';
import {ResponseMessage, Status} from '../../enums';
import {Orders, Subscriptions} from '../../models';
/*
 * Fix the service type. Possible options can be:
 * - import {PaypalProvider} from 'your-module';
 * - export type PaypalProvider = string;
 * - export interface PaypalProvider {}
 */

@injectable({scope: BindingScope.TRANSIENT})
export class PaypalProvider implements Provider<PayPalPaymentGateway> {
  environment: paypal.core.SandboxEnvironment | paypal.core.LiveEnvironment;
  client: paypal.core.PayPalHttpClient;
  constructor(
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @repository(SubscriptionsRepository)
    private readonly subscriptionsRepository: SubscriptionsRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(PayPalBindings.PayPalConfig)
    private readonly config?: IPayPalConfig,
  ) {
    if (!this.config?.clientId || !this.config?.clientSecret) {
      throw new Error('Paypal config missing');
    }
    if (process.env.PAYPAL_ENVIRONMENT === 'sandbox') {
      this.environment = new paypal.core.SandboxEnvironment(
        this.config?.clientId,
        this.config?.clientSecret,
      );
    }
    if (process.env.PAYPAL_ENVIRONMENT === 'live') {
      this.environment = new paypal.core.LiveEnvironment(
        this.config?.clientId,
        this.config?.clientSecret,
      );
    }
    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  /**
   * The `value` function in the TypeScript code handles payment processing, including creating orders,
   * capturing charges, and processing refunds.
   * @returns The `value()` function returns an object with several asynchronous functions for handling
   * payment-related operations. These functions include `create` for creating a payment order,
   * `charge` for capturing payment for an order, `refund` for processing refunds, `subscriptionCreate`
   * for creating subscriptions (to be developed), `subscriptionCharge` for charging subscriptions (to
   * be developed), and `subscriptionWebHook` for handling subscription
   */
  value() {
    return {
      create: async (payorder: Orders, paymentTemplate: string) => {
        const transaction = await this.transactionsRepository.findOne({
          where: {orderId: payorder.id},
        });
        if (payorder?.status === Status.Paid) {
          return {
            res: 'Payment already Done for this Order',
            status: Status.AlreadyPaid,
            orderId: payorder.id,
          };
        }
        if (!transaction) {
          const request = new paypal.orders.OrdersCreateRequest();
          request.prefer('return=representation'); // to return full response from
          // the server
          request.requestBody({
            intent: 'CAPTURE',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            purchase_units: [
              {
                amount: {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  currency_code: payorder.currency,
                  value: String(payorder.totalAmount),
                },
              },
            ],
          });
          const response = await this.client.execute(request);
          const order = response.result;
          if (order.status === 'CREATED') {
            payorder.metaData = {
              paypalOrderId: order.id,
              paypalOrderStatus: order.status,
              paypalOrderPayLink: order.links.find(
                (link: {rel: string; href: string}) => {
                  if (link.rel === 'approve') {
                    return link.href;
                  }
                },
              ),
            };
            await this.ordersRepository.updateById(payorder.id, payorder);
          }
          const transactionData = {
            id: uuidv4(),
            amountPaid: payorder.totalAmount,
            currency: payorder.currency,
            status: Status.Draft,
            orderId: payorder.id,
            paymentGatewayId: payorder.paymentGatewayId,
            res: {
              gatewayOrderRes: payorder?.metaData,
            },
          };
          await this.transactionsRepository.create(transactionData);
          return {
            orderPayLink: payorder.metaData?.paypalOrderPayLink,
            orderId: payorder.id,
            payOrderId: order.id,
          };
        } else if (transaction.status === Status.Paid) {
          // transaction exists check its status
          return {
            res: 'Payment already Done for this Order',
            status: Status.AlreadyPaid,
            orderId: payorder.id,
          };
        } else {
          return {
            orderPayLink: transaction.res.gatewayOrderRes.paypalOrderPayLink,
            orderId: payorder.id,
            payOrderId: transaction.res.gatewayOrderRes.paypalOrderId,
          };
        }
      },
      charge: async (chargeResponse: {orderId: string}) => {
        const orderDetails = await this.ordersRepository.findById(
          chargeResponse.orderId,
        );
        let chargeComplete = false;
        if (orderDetails.status !== Status.Paid) {
          const request = new paypal.orders.OrdersCaptureRequest(
            orderDetails.metaData?.paypalOrderId,
          );
          const response = await this.client.execute(request);
          const order = response.result;
          if (order.status === 'COMPLETED') {
            orderDetails.status = Status.Paid;
            await this.ordersRepository.updateById(
              orderDetails.id,
              orderDetails,
            );
            const transaction = await this.transactionsRepository.findOne({
              where: {orderId: orderDetails.id},
            });
            if (!transaction) {
              throw new HttpErrors.UnprocessableEntity(
                'Some problem with order creation',
              );
            }
            transaction.status = Status.Paid;
            transaction.res = {
              ...transaction.res,
              gatewayChargeRes: order,
              captureId: order.purchase_units[0].payments.captures[0].id,
            };
            await this.transactionsRepository.updateById(
              transaction.id,
              transaction,
            );
            chargeComplete = true;
          }
        }
        if (chargeComplete) {
          return {res: ResponseMessage.Sucess, orderId: orderDetails.id};
        } else {
          return {res: ResponseMessage.NotSucess, orderId: orderDetails.id};
        }
      },
      refund: async (transactionId: string, note?: string) => {
        const transaction =
          await this.transactionsRepository.findById(transactionId);
        const orderDetails = await this.ordersRepository.findById(
          transaction.orderId,
        );
        const paymentId = transaction?.res?.captureId;
        const request = new paypal.payments.CapturesRefundRequest(paymentId);

        request.requestBody({
          amount: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            currency_code: orderDetails.currency,
            value: String(orderDetails.totalAmount),
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          invoice_id: String(orderDetails.id),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          note_to_payer: note ?? 'Refund',
        });
        const response = await this.client.execute(request);
        const order = response.result;
        transaction.res.refundDetails = order;
        transaction.status = Status.Refund;
        orderDetails.status = Status.Refund;
        if (order.status === 'COMPLETED') {
          await this.ordersRepository.updateById(orderDetails.id, orderDetails);
          await this.transactionsRepository.updateById(
            transaction.id,
            transaction,
          );
          return order;
        } else {
          return {
            err: ResponseMessage.NotSucess,
            message: 'please check transactionId',
          };
        }
      },
      subscriptionCreate: async (
        subscriptions: Subscriptions,
        paymentTemplate: string,
      ) => {
        // to be developed
        return {
          res: '',
        };
      },
      subscriptionCharge: async (chargeResponse: AnyObject) => {
        // to be developed
      },
      subscriptionWebHook: async (sub: DataObject<{}>) => {
        // to be developed
      },
    };
  }
}
