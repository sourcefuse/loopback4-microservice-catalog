// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, Response, RestBindings} from '@loopback/rest';

import {CONTENT_TYPE, OPERATION_SECURITY_SPEC} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TemplateName, TemplateType} from '../enums';
import {PermissionKey} from '../enums/permission-key.enum';
import {GatewayBindings, IGateway} from '../providers';
import {SubscriptionsRepository, TemplatesRepository} from '../repositories';

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
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateSubscriptions,
      PermissionKey.UpdateSubscriptionsNum,
    ],
  })
  @get(`/transactions/subscription/{id}`, {
    security: OPERATION_SECURITY_SPEC,
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
