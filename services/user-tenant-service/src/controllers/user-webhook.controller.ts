import {intercept, service} from '@loopback/core';
import {getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {USER_CALLBACK} from '../keys';
import {UserWebhookDTO} from '../models';
import {UserWebhookHelperService} from '../services';

const basePath = '/user-callback';

export class UserWebhookController {
  constructor(
    @service(UserWebhookHelperService)
    public userWebhookHelperService: UserWebhookHelperService,
  ) {}
  @intercept(USER_CALLBACK)
  @authorize({
    permissions: ['*'],
  })
  @post(`${basePath}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Webhook success',
      },
    },
  })
  async callback(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(UserWebhookDTO, {
            title: 'UserWebhookDTO',
          }),
        },
      },
    })
    dto: UserWebhookDTO,
    @param.header.string('x-signature') signature: string,
    @param.header.string('x-timestamp') timestamp: string,
  ): Promise<void> {
    await this.userWebhookHelperService.create(dto);
  }
}
