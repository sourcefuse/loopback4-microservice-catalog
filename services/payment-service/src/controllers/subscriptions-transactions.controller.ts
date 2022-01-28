import {inject} from '@loopback/core';
import {repository, DataObject} from '@loopback/repository';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {v4 as uuidv4} from 'uuid';
import {Subscriptions} from '../models';
import {GatewayBindings, IGateway} from '../providers';
import {SubscriptionsRepository} from '../repositories';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {STATUS_CODE} from '@sourceloop/core';
import {ResponseMessage} from '../enums';
const dotenvExt = require('dotenv-extended');
const path = require('path');
dotenvExt.load({
  path: path.join(process.env.INIT_CWD, '.env'),
  defaults: path.join(process.env.INIT_CWD, '.env.defaults'),
  errorOnMissing: false,
  includeProcessEnv: true,
});
const redirectStatusCode = 302;
const permRedirectStatusCode = 302;

export class SubscriptionTransactionsController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private readonly res: Response,
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @inject(GatewayBindings.GatewayHelper)
    private readonly gatewayHelper: IGateway,
    @repository(SubscriptionsRepository)
    private readonly subscriptionRepository: SubscriptionsRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateSubscription]})
  @post('/create-subscription-and-pay', {
    responses: {
      [redirectStatusCode]: {
        description: 'Subscription model instance',
        content: {
          'text/html': {},
        },
      },
    },
  })
  async subscriptionandtransactionscreate(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<void> {
    const subscriptionEntity = {
      id: uuidv4(),
      totalAmount: subscriptions?.totalAmount,
      status: subscriptions?.status,
      metaData: subscriptions?.metaData ?? {},
      paymentGatewayId: subscriptions?.paymentGatewayId,
      paymentMethod: subscriptions?.paymentmethod,
      currency: subscriptions?.currency,
      startDate: subscriptions.startDate
        ? new Date(subscriptions.startDate)
        : new Date(),
      endDate: subscriptions.endDate
        ? new Date(subscriptions.endDate)
        : new Date(),
      planId: subscriptions?.planId,
    };
    const newSubscription = await this.subscriptionRepository.create(
      subscriptionEntity,
    );
    const hostUrl = this.req.get('host');
    const hostProtocol = this.req.protocol;
    this.req.query.method = newSubscription.paymentMethod;
    return this.res.redirect(
      redirectStatusCode,
      `${hostProtocol}://${hostUrl}/transactions/subscription/${newSubscription.id}?method=${newSubscription.paymentMethod}`,
    );
  }

  @post('/subscription/transaction/charge', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription model instance',
        content: {
          'application/json': {},
        },
      },
    },
  })
  async subscriptionTransactionscharge(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {
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
      subscriptionId: this.req.query.subscriptionId,
    };
    const chargeHelper = await this.gatewayHelper.subscriptionCharge(
      chargeResponse,
    );
    const hostUrl = this.req.get('host');
    const hostProtocol = this.req.protocol;
    const defaultUrl = `${hostProtocol}://${hostUrl}`;
    if (chargeHelper?.res === ResponseMessage.Sucess) {
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
}
