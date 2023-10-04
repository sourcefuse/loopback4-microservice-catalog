// api-key.controller.ts
import {injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {ApiKey, ClientAppDTO} from '../models';
import {ApiKeyRepository} from '../repositories';
import {UtilityService} from '../services/utility.service';

@injectable()
export class ApiKeyController {
  constructor(
    @service(UtilityService)
    private readonly utilityService: UtilityService,
    @repository(ApiKeyRepository)
    private readonly apiKeyRepo: ApiKeyRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [TaskPermssionKey.APIAdmin]})
  @post('/api-keys', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Generated API keys',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(ApiKey, {exclude: ['id']}),
          },
        },
      },
    },
  })
  async generateApiKeys(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(ClientAppDTO, {
            title: 'ClientApp',
          }),
        },
      },
    })
    clientApp: ClientAppDTO,
  ): Promise<{apiKey: string; apiSecret: string}> {
    try {
      const {apiKey, apiSecret} =
        this.utilityService.generateApiKeyAndSecret(clientApp);
      await this.apiKeyRepo.create({apiKey, apiSecret});

      return {apiKey, apiSecret};
    } catch (error) {
      throw new HttpErrors.InternalServerError('Failed to generate API keys');
    }
  }
}
