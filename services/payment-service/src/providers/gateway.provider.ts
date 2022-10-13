// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/core';
import {Request, Response, RestBindings} from '@loopback/rest';
import {RazorpayBindings, RazorpayPaymentGateway} from './razorpay/index';
import {StripeBindings, StripePaymentGateway} from './stripe';
import {IGateway} from './types';
import {GatewayType} from '../enums';
const providerMissingError = 'Provider Not Implemented';
const providerMethodNumbers = 6;
export class GatewayProvider implements Provider<IGateway> {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private readonly res: Response,
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @inject(RazorpayBindings.RazorpayHelper)
    private readonly razorpayPaymentHelper: RazorpayPaymentGateway,
    @inject(StripeBindings.StripeHelper)
    private readonly stripeHelper: StripePaymentGateway,
  ) {}

  value() {
    if (this.req.query.method === GatewayType.Razorpay) {
      return this.razorpayPaymentHelper;
    } else if (this.req.query.method === GatewayType.Stripe) {
      return this.stripeHelper;
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
