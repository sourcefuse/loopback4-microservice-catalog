/* eslint-disable @typescript-eslint/naming-convention*/
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, Response, RestBindings} from '@loopback/rest';

import {GatewayBindings, IGateway} from '../providers';
import {TemplatesRepository, SubscriptionsRepository} from '../repositories';
import {TemplateName, TemplateType} from '../enums';
const dotenvExt = require('dotenv-extended');
const path = require('path');
dotenvExt.load({
  path: path.join(process.env.INIT_CWD, '.env'),
  defaults: path.join(process.env.INIT_CWD, '.env.defaults'),
  errorOnMissing: false,
  includeProcessEnv: true,
});
const redirectStatusCode = 302;

export class TransactionSubscriptionsController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private readonly res: Response,
    @inject(GatewayBindings.GatewayHelper)
    private readonly gatewayHelper: IGateway,
    @repository(TemplatesRepository)
    private readonly templatesRepository: TemplatesRepository,
    @repository(SubscriptionsRepository)
    private readonly subscriptionRepository: SubscriptionsRepository,
  ) {}

  @get(`/transactions/subscription/{id}`, {
    responses: {
      [redirectStatusCode]: {
        description: 'Array of Transactions model instances',
        content: {
          'text/html': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async subscriptionTransactionsPay(
    @param.path.string('id') id: string,
  ): Promise<unknown> {
    const Subscription = await this.subscriptionRepository.findById(id);
    const templates = await this.templatesRepository.findOne({
      where: {
        paymentGatewayId: Subscription?.paymentGatewayId,
        name: TemplateName.Create,
        type: TemplateType.Subscription,
      },
    });
    const paymentTemplate = templates?.template;
    return this.res.send(
      await this.gatewayHelper.subscriptionCreate(
        Subscription,
        paymentTemplate,
      ),
    );
  }
}
