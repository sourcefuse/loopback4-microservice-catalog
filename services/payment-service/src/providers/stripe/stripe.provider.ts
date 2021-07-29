import {inject, Provider} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Orders} from '../../models';
import {v4 as uuidv4} from 'uuid';
import {StripeBindings} from './keys';
import {OrdersRepository, TransactionsRepository} from '../../repositories';
import {IStripeConfig, StripePaymentGateway} from './types';
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
      create: async (payorder: Orders) => {
        const transactionData = {
          id: uuidv4(),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          amount_paid: payorder?.totalAmount,
          status: 'draft',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          order_id: payorder?.id,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          payment_gateway_id: payorder?.paymentGatewayId,
        };
        const transactions = await this.transactionsRepository.find({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          where: {order_id: payorder.id},
        });
        if (transactions.length === 0) {
          await this.transactionsRepository.create(transactionData);
        }
        return (
          '<html>' +
          '<title>Stripe Payment Demo</title>' +
          '<body>' +
          '<h3>Welcome to Payment Gateway</h3>' +
          '<form action=/transactions/charge?method=stripe&orderId=' +
          payorder?.id +
          ' method="POST">' +
          '<script src="//checkout.stripe.com/v2/checkout.js" class="stripe-button" data-key="' +
          this.config?.publishKey +
          '" data-amount="' +
          payorder.totalAmount +
          '" data-currency="inr" data-name="" data-description="Test Stripe" data-locale="auto" > </script>' +
          '</form>' +
          '</body>' +
          '</html>'
        );
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
          //eslint-disable-next-line @typescript-eslint/naming-convention
          where: {order_id: order?.id},
        });
        const amount = order?.totalAmount;
        await this.stripe.customers
          .create({
            email: chargeResponse.stripeEmail,
            source: chargeResponse.stripeToken,
          })
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .then((customer: any) =>
            this.stripe.charges.create({
              amount,
              description: 'Sample Charge',
              currency: 'inr',
              customer: customer.id,
            }),
          )
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .then(async (charge: any) => {
            fetchTransaction[0].status = charge ? 'paid' : 'draft';
            fetchTransaction[0].res = {chargeResponse: charge};
            await this.transactionsRepository.updateById(
              fetchTransaction[0]?.id,
              {...fetchTransaction[0]},
            );
            if (charge) {
              order.status = 'paid';
              await this.ordersRepository.updateById(order.id, {...order});
            }
          });
        return (
          '<html>' +
          '<title>Stripe Payment Demo</title>' +
          '<body>' +
          '<h3> Success with Stripe</h3>' +
          '</body>' +
          '</html>'
        );
      },

      refund: async (transactionId: string) => {
        const transaction = await this.transactionsRepository.findById(
          transactionId,
        );
        const paymentId = await transaction?.res?.chargeResponse?.id;
        // const refund = await instance.payments.refund(paymentId);
        const refund = await this.stripe.refunds.create({
          charge: paymentId,
        });
        transaction.res.refundDetails = refund;
        transaction.status = 'refund';
        if (refund) {
          await this.transactionsRepository.updateById(transactionId, {
            ...transaction,
          });
        }
        return refund;
      },
    };
  }
}
