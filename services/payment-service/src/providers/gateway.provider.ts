import {inject, Provider} from '@loopback/core';
import {DataObject} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import {Orders} from '../models';
import {RazorpayBindings, RazorpayPaymentGateway} from './razorpay/index';
import {StripeBindings, StripePaymentGateway} from './stripe';
import {IGateway} from './types';
export class GatewayProvider implements Provider<IGateway> {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RazorpayBindings.RazorpayHelper)
    private readonly razorpayPaymentHelper: RazorpayPaymentGateway,
    @inject(StripeBindings.StripeHelper)
    private readonly stripeHelper: StripePaymentGateway,
  ) {}

  async create(payorder: Orders) {
    if (payorder.paymentmethod === 'razorpay') {
      return this.res.send(await this.razorpayPaymentHelper.create(payorder));
    } else if (payorder.paymentmethod === 'stripe') {
      return this.res.send(await this.stripeHelper.create(payorder));
    } else {
      return 'Provider Missing';
    }
  }

  async charge(chargeResponse: DataObject<{}>) {
    if (this.req.query.method === 'razorpay') {
      return this.res.send(
        await this.razorpayPaymentHelper.charge(chargeResponse),
      );
    } else if (this.req.query.method === 'stripe') {
      return this.res.send(await this.stripeHelper.charge(chargeResponse));
    } else {
      return 'Provider Missing';
    }
  }

  value() {
    return {
      create: async (payorder: Orders) => this.create(payorder),
      charge: async (chargeResponse: DataObject<{}>) =>
        this.charge(chargeResponse),
    };
  }
}
