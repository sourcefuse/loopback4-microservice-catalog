// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, Response, RestBindings} from '@loopback/rest';

import {GatewayBindings, IGateway} from '../providers';
import {TemplatesRepository, SubscriptionsRepository} from '../repositories';
import {TemplateName, TemplateType} from '../enums';
import {CONTENT_TYPE} from '@sourceloop/core';
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
          [CONTENT_TYPE.TEXT_HTML]: {
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
