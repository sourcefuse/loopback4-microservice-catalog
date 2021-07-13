import {inject, Provider} from '@loopback/core';
import {DataObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Orders} from '../../models';
import {StripeBindings} from './keys';
import {IStripeConfig, StripePaymentGateway} from './types';
const Stripe = require('stripe');

export class StripeProvider implements Provider<StripePaymentGateway> {
  constructor(
    @inject(StripeBindings.Config, {
      optional: true,
    })
    private readonly config?: IStripeConfig,
  ) {
    if (this.config) {
      this.stripe = Stripe('stripe-key');
    } else {
      throw new HttpErrors.PreconditionFailed('Stripe Config missing !');
    }
  }

  stripe = Stripe;

  value() {
    return {
      create: async (payorder: Orders) => {
        return (
          '<html>' +
          '<title>Stripe Payment Demo</title>' +
          '<body>' +
          '<h3>Welcome to Payment Gateway</h3>' +
          '<form action="/transactions/charge?method=stripe" method="POST">' +
          '<script src="//checkout.stripe.com/v2/checkout.js" class="stripe-button" data-key="Stripe-key" data-amount="' +
          payorder.totalAmount +
          '" data-currency="inr" data-name="" data-description="Test Stripe" data-locale="auto" > </script>' +
          '</form>' +
          '</body>' +
          '</html>'
        );
      },
      charge: async (
        chargeResponse: DataObject<{stripeEmail: string; stripeToken: string}>,
      ) => {
        const amount = 10000;
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
          .then((charge: any) => {
            console.log(charge, 'charge');
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
    };
  }
}
