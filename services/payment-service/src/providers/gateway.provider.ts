// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/core';
import {Request, Response, RestBindings} from '@loopback/rest';
import {GatewayType} from '../enums';
import {PayPalBindings, PayPalPaymentGateway} from './paypal';
import {RazorpayBindings, RazorpayPaymentGateway} from './razorpay';
import {StripeBindings, StripePaymentGateway} from './stripe';
import {IGateway} from './types';
const providerMissingError = 'Provider Not Implemented';
const providerMethodNumbers = 6;
export class GatewayProvider implements Provider<IGateway> {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private readonly res: Response,
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @inject(RazorpayBindings.RazorpayHelper, {optional: true})
    private readonly razorpayPaymentHelper: RazorpayPaymentGateway,
    @inject(StripeBindings.StripeHelper, {optional: true})
    private readonly stripeHelper: StripePaymentGateway,
    @inject(PayPalBindings.PayPalHelper, {optional: true})
    private readonly paypalHelper: PayPalPaymentGateway,
  ) {}

  value() {
    if (this.req.query.method === GatewayType.Razorpay) {
      return this.razorpayPaymentHelper;
    } else if (this.req.query.method === GatewayType.Stripe) {
      return this.stripeHelper;
    } else if (this.req.query.method === GatewayType.PayPal) {
      return this.paypalHelper;
    } else {
      const [
        create,
        charge,
        refund,
        subscriptionCreate,
        subscriptionCharge,
        subscriptionWebHook,
      ] = Array(providerMethodNumbers).fill(providerMissingError);
      return {
        create,
        charge,
        refund,
        subscriptionCreate,
        subscriptionCharge,
        subscriptionWebHook,
      };
    }
  }
}
