import {inject, Provider} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import Handlebars from 'handlebars';
import {Orders} from '../../models';
import {v4 as uuidv4} from 'uuid';
import {StripeBindings} from './keys';
import {stripeCreateTemplate} from '../../templates';
import {OrdersRepository, TransactionsRepository} from '../../repositories';
import {IStripeConfig, StripePaymentGateway} from './types';
import {ResponseMessage, Status} from '../../enums';
const Stripe = require('stripe');

export class StripeProvider implements Provider<StripePaymentGateway> {
  constructor(
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository,
    @inject(StripeBindings.Config, {
      optional: true,
    })
    private readonly config?: IStripeConfig,
  ) {
    if (this.config) {
      this.stripe = Stripe(this.config.dataKey);
    } else {
      throw new HttpErrors.PreconditionFailed('Stripe Config missing !');
    }
  }

  stripe = Stripe;

  value() {
    return {
      create: async (payorder: Orders, paymentTemplate: string) => {
        const orderAmount = payorder.totalamount;
        const transactionData = {
          id: uuidv4(),
          amountPaid: payorder?.totalAmount,
          currency: payorder?.currency,
          status: Status.Draft,
          orderId: payorder?.id,
          paymentGatewayId: payorder?.paymentGatewayId,
        };
        const transactions = await this.transactionsRepository.find({
          where: {orderId: payorder.id},
        });
        if (transactions.length === 0) {
          await this.transactionsRepository.create(transactionData);
        }
        const template = Handlebars.compile(
          paymentTemplate || stripeCreateTemplate,
        );

        const data = {
          orderId: payorder?.id,
          publishKey: this.config?.publishKey,
          orderAmount: orderAmount,
          currency: payorder?.currency,
        };
        return template(data);
      },

      charge: async (
        chargeResponse: DataObject<{
          stripeEmail: string;
          stripeToken: string;
          orderId: string;
        }>,
      ) => {
        const order = await this.ordersRepository.findById(
          chargeResponse?.orderId,
        );
        const fetchTransaction = await this.transactionsRepository.find({
          where: {orderId: order?.id},
        });
        const amount = order?.totalAmount;
        const currency = order?.currency;
        await this.stripe.customers
          .create({
            email: chargeResponse.stripeEmail,
            source: chargeResponse.stripeToken,
          })
          .then((customer: DataObject<{id: string}>) =>
            this.stripe.charges.create({
              amount,
              currency: currency,
              customer: customer.id,
            }),
          )
          .then(async (charge: DataObject<{}>) => {
            fetchTransaction[0].status = charge ? Status.Paid : Status.Draft;
            fetchTransaction[0].res = {chargeResponse: charge};
            await this.transactionsRepository.updateById(
              fetchTransaction[0]?.id,
              {...fetchTransaction[0]},
            );
            if (charge) {
              order.status = Status.Paid;
              await this.ordersRepository.updateById(order.id, {...order});
            }
          });
        return {res: ResponseMessage.Sucess, orderId: order.id};
      },

      refund: async (transactionId: string) => {
        const transaction = await this.transactionsRepository.findById(
          transactionId,
        );
        const paymentId = await transaction?.res?.chargeResponse?.id;
        const refund = await this.stripe.refunds.create({
          charge: paymentId,
        });
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
    };
  }
}
