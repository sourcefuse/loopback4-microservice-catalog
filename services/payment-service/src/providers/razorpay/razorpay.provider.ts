// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, inject} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {Orders, Subscriptions} from '../../models';
import Handlebars from 'handlebars';
import {
  OrdersRepository,
  TransactionsRepository,
  SubscriptionsRepository,
} from '../../repositories';
import {RazorpayPaymentGateway, IRazorpayConfig} from './types';
import {
  razorpayCreateTemplate,
  razorpaySubscriptionCreateTemplate,
} from '../../templates';
import {RazorpayBindings} from './keys';
import {ILogger, LOGGER} from '@sourceloop/core';
import {ResponseMessage, Status} from '../../enums';
const Razorpay = require('razorpay');
const monthsNumCount = 12;

export class RazorpayProvider implements Provider<RazorpayPaymentGateway> {
  constructor(
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @repository(SubscriptionsRepository)
    private readonly subscriptionsRepository: SubscriptionsRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(RazorpayBindings.RazorpayConfig)
    private readonly config?: IRazorpayConfig,
  ) {}

  instance = new Razorpay({
    // eslint-disable-next-line
    key_id: this.config?.dataKey,
    // eslint-disable-next-line
    key_secret: this.config?.publishKey,
  });
  razorpayKey = this.config?.dataKey;

  subscriptionCreate = async (
    subscription: Subscriptions,
    paymentTemplate: string,
  ) => {
    const transactions = await this.transactionsRepository.find({
      where: {orderId: subscription.id},
    });
    function monthDiff(d1: Date = new Date(), d2: Date = new Date()) {
      let months;
      months = (d2.getFullYear() - d1.getFullYear()) * monthsNumCount;
      months -= d1.getMonth();
      months += d2.getMonth();
      return months <= 0 ? 0 : months;
    }
    const razorpayPlan = await this.instance.plans.fetch(subscription.planId);
    const params = {
      // eslint-disable-next-line
      plan_id: razorpayPlan.id,
      // eslint-disable-next-line
      total_count: monthDiff(subscription.startDate, subscription.endDate),
      // eslint-disable-next-line
      expire_by: subscription.endDate?.valueOf(),
    };
    const response = await this.instance.subscriptions.create(params);
    await this.subscriptionsRepository.updateById(subscription.id, {
      metaData: {gatewaySubRes: response},
      gatewaySubscriptionId: response.id,
    });
    const template = Handlebars.compile(
      paymentTemplate || razorpaySubscriptionCreateTemplate,
    );

    const data = {
      razorpayKey: this.razorpayKey,
      subscriptionId: response.id,
    };
    const razorpayTemplate = template(data);
    const transactionData = {
      id: uuidv4(),
      amountPaid: subscription.totalAmount,
      status: 'draft',
      orderId: subscription.id,
      paymentGatewayId: subscription.paymentGatewayId,
      currency: subscription.currency,
      res: {
        gatewaySubscriptionRes: response,
      },
    };
    if (transactions.length === 0) {
      await this.transactionsRepository.create(transactionData);
    }
    return razorpayTemplate;
  };

  subscriptionCharge = async (
    chargeResponse: DataObject<{
      // eslint-disable-next-line @typescript-eslint/naming-convention
      razorpay_subscription_id: string;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      razorpay_payment_id: string;
    }>,
  ) => {
    const subscription = await this.subscriptionsRepository.find({
      where: {
        gatewaySubscriptionId: `${chargeResponse.razorpay_subscription_id}`,
      },
    });
    await this.subscriptionsRepository.updateById(subscription[0].id, {
      status: 'active',
    });
    const transactions = await this.transactionsRepository.find({
      where: {orderId: subscription[0].id},
    });
    await this.transactionsRepository.updateById(transactions[0].id, {
      status: 'paid',
      paidDate: new Date(),
      res: {...transactions[0].res, chargeResponse: chargeResponse},
    });
    if (subscription) {
      return {
        res: ResponseMessage.Sucess,
        subscriptionId: subscription[0].id,
      };
    } else {
      return {
        res: ResponseMessage.NotSucess,
        subscriptionId: chargeResponse.razorpay_subscription_id,
      };
    }
  };

  subscriptionWebHook = async (
    sub: DataObject<{
      payload: DataObject<{
        subscription: DataObject<{
          entity: DataObject<{id: string | undefined; status: string}>;
        }>;
      }>;
    }>,
  ) => {
    const subId = sub?.payload?.subscription?.entity?.id ?? '';
    const Subscription = await this.subscriptionsRepository.find({
      where: {gatewaySubscriptionId: `${subId}`},
    });
    Subscription[0].status =
      sub?.payload?.subscription?.entity?.status ?? Subscription[0].status;
    await this.subscriptionsRepository.updateById(Subscription[0].id, {
      ...Subscription[0],
    });
    return true;
  };

  value() {
    return {
      create: async (payorder: Orders, paymentTemplate: string) => {
        let razorpayTemplate: unknown;
        const transactions = await this.transactionsRepository.find({
          where: {orderId: payorder.id},
        });
        const transRes = transactions[0]?.res;
        if (payorder?.status === Status.Paid) {
          return {
            res: 'Payment already Done for this Order',
            status: Status.AlreadyPaid,
            orderId: payorder.id,
          };
        }
        const razorPayOptions = {
          amount: payorder.totalAmount, // amount in the smallest currency unit
          currency: payorder.currency,
        };
        if (transactions.length === 0) {
          await this.instance.orders.create(
            razorPayOptions,
            async (err: unknown, order: DataObject<{id: string}>) => {
              if (err) {
                this.logger.info(`${err}, err`);
              }
              if (order) {
                payorder.metaData = {
                  razorpayOrderID: order.id,
                };
                const template = Handlebars.compile(
                  paymentTemplate || razorpayCreateTemplate,
                );

                const data = {
                  razorpayKey: this.razorpayKey,
                  totalAmount: payorder.totalAmount,
                  orderId: order.id,
                };
                razorpayTemplate = template(data);
              }
            },
          );
          await this.ordersRepository.updateById(payorder.id, {...payorder});
        } else {
          const template = Handlebars.compile(
            paymentTemplate || razorpayCreateTemplate,
          );

          const data = {
            razorpayKey: this.razorpayKey,
            totalAmount: payorder.totalAmount,
            orderId: transRes.gatewayOrderRes.razorpayOrderID,
          };
          razorpayTemplate = template(data);
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
        if (transactions.length === 0) {
          await this.transactionsRepository.create(transactionData);
        }
        return razorpayTemplate;
      },

      charge: async (
        chargeResponse: DataObject<{
          // eslint-disable-next-line
          razorpay_order_id: string;
          // eslint-disable-next-line
          razorpay_payment_id: string;
        }>,
      ) => {
        const order = await this.ordersRepository.find({
          where: {
            'metaData.razorpayOrderID': `${chargeResponse.razorpay_order_id}`,
          },
        });
        let chargeComplete = false;
        if (
          chargeResponse.razorpay_payment_id &&
          order.length > 0 &&
          order[0].totalamount
        ) {
          await this.instance.payments.capture(
            chargeResponse.razorpay_payment_id,
            order[0].totalamount,
            order[0].currency,
            (err: unknown, response: unknown) => {
              if (err) {
                this.logger.info(`${err}, err`);
              } else {
                //do nothing
              }
            },
          );
          await this.instance.payments.fetch(
            chargeResponse.razorpay_payment_id,
            async (err: unknown, resdata: DataObject<{status: string}>) => {
              if (err) {
                this.logger.info(`${err}, err`);
              }
              if (
                resdata.status === Status.Captured ||
                resdata.status === Status.Paid
              ) {
                order[0].status = Status.Paid;
                await this.ordersRepository.updateById(order[0].id, {
                  ...order[0],
                });
                const transactions = await this.transactionsRepository.find({
                  where: {orderId: order[0].id},
                });
                transactions[0].res = {
                  ...transactions[0].res,
                  chargeResponse: resdata,
                };
                await this.transactionsRepository.updateById(
                  transactions[0].id,
                  {...transactions[0]},
                );
                chargeComplete = true;
              }
            },
          );
        }
        if (chargeComplete) {
          return {res: ResponseMessage.Sucess, orderId: order[0].id};
        } else {
          return {res: ResponseMessage.NotSucess, orderId: order[0].id};
        }
      },

      refund: async (transactionId: string) => {
        const transaction = await this.transactionsRepository.findById(
          transactionId,
        );
        const paymentId = transaction?.res?.chargeResponse?.id;
        const refund = await this.instance.payments.refund(paymentId);
        transaction.res.refundDetails = refund;
        transaction.status = Status.Refund;
        if (refund) {
          await this.transactionsRepository.updateById(transactionId, {
            ...transaction,
          });
          return refund;
        } else {
          return {
            err: ResponseMessage.NotSucess,
            message: 'please check PaymentId',
          };
        }
      },
      subscriptionCreate: this.subscriptionCreate,
      subscriptionCharge: this.subscriptionCharge,
      subscriptionWebHook: this.subscriptionWebHook,
    };
  }
}
