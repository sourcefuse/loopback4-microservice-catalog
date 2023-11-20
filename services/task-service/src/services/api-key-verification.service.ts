// api-key-verification.service.ts
import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ApiKeyVerificationServiceInterface} from '../interfaces';
import {ApiKeyRepository} from '../repositories';

@injectable()
export class ApiKeyVerificationService
  implements ApiKeyVerificationServiceInterface
{
  constructor(
    @repository(ApiKeyRepository)
    private readonly apiKeyRepo: ApiKeyRepository,
  ) {}

  async verifyApiKeys(apiKey: string, apiSecret: string): Promise<boolean> {
    try {
      const apiKeysObject = await this.apiKeyRepo.findOne({
        where: {
          apiKey,
          apiSecret,
        },
      });

      if (apiKeysObject) {
        return true; // Valid API key and secret
      } else {
        return false; // Invalid API key and/or secret
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError('Error verifying API keys');
    }
  }
}
