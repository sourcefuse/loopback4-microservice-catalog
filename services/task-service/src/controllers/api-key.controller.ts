// api-key.controller.ts
import {post, HttpErrors} from '@loopback/rest';
import {injectable, service} from '@loopback/core';
import {authorize} from 'loopback4-authorization';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {UtilityService} from '../services/utility.service';
import {repository} from '@loopback/repository';
import {ApiKeyRepository} from '../repositories';

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
  @post('/api-keys')
  async generateApiKeys(): Promise<{apiKey: string; apiSecret: string}> {
    try {
      const {apiKey, apiSecret} = this.utilityService.generateApiKeyAndSecret();
      await this.apiKeyRepo.create({apiKey, apiSecret});

      return {apiKey, apiSecret};
    } catch (error) {
      throw new HttpErrors.InternalServerError('Failed to generate API keys');
    }
  }
}
