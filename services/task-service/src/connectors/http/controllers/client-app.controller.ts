// api-key.controller.ts
import {injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../../../enums/permission-key.enum';
import {ClientAppDTO} from '../../../models';
import {UtilityService} from '../../../services/utility.service';
import {ClientApp} from '../models';
import {ClientAppRepository} from '../repositories';

@injectable()
export class ClientAppController {
  constructor(
    @service(UtilityService)
    private readonly utilityService: UtilityService,
    @repository(ClientAppRepository)
    private readonly clientAppRepo: ClientAppRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [TaskPermssionKey.CreateApiKey]})
  @post('/client-app', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Generated Client Application',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(ClientApp, {exclude: ['id']}),
          },
        },
      },
    },
  })
  async generateClientApp(
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
  ): Promise<ClientApp> {
    const {apiKey, apiSecret} =
      this.utilityService.generateApiKeyAndSecret(clientApp);
    return this.clientAppRepo.create({
      apiKey,
      apiSecret,
      name: clientApp.clientName,
    });
  }
}
