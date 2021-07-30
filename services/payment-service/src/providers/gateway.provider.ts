import {inject, Provider} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import {Orders} from '../models';
import {RazorpayBindings, RazorpayPaymentGateway} from './razorpay/index';
import {StripeBindings, StripePaymentGateway} from './stripe';
import {
  TransactionsRepository,
  PaymentGatewaysRepository,
} from '../repositories';
import {IGateway} from './types';
const providerMissingError = 'Provider Missing';
export class GatewayProvider implements Provider<IGateway> {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private readonly res: Response,
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @inject(RazorpayBindings.RazorpayHelper)
    private readonly razorpayPaymentHelper: RazorpayPaymentGateway,
    @inject(StripeBindings.StripeHelper)
    private readonly stripeHelper: StripePaymentGateway,
    @repository(TransactionsRepository)
    private readonly transactionsRepository: TransactionsRepository,
    @repository(PaymentGatewaysRepository)
    private readonly paymentGatewaysRepository: PaymentGatewaysRepository,
  ) {}

  async create(payorder: Orders) {
    if (payorder.paymentmethod === 'razorpay') {
      return this.res.send(await this.razorpayPaymentHelper.create(payorder));
    } else if (payorder.paymentmethod === 'stripe') {
      return this.res.send(await this.stripeHelper.create(payorder));
    } else {
      return providerMissingError;
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
      return providerMissingError;
    }
  }

  async refund(transactionId: string) {
    const transaction = await this.transactionsRepository.findById(
      transactionId,
    );
    const gatewayId = transaction?.payment_gateway_id;
    if (gatewayId) {
      const paymentGateway = await this.paymentGatewaysRepository.findById(
        gatewayId,
      );
      const gatewayType = paymentGateway.gateway_type;
      if (gatewayType === 'stripe') {
        return this.stripeHelper.refund(transactionId);
      } else if (gatewayType === 'razorpay') {
        return this.razorpayPaymentHelper.refund(transactionId);
      } else {
        return providerMissingError;
      }
    }
    return 'Could Not able to Decide Gateway Provider';
  }

  value() {
    return {
      create: async (payorder: Orders) => this.create(payorder),
      charge: async (chargeResponse: DataObject<{}>) =>
        this.charge(chargeResponse),
      refund: async (transactionId: string) => this.refund(transactionId),
    };
  }
}
