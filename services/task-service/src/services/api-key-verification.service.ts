// api-key-verification.service.ts
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ApiKeyRepository} from '../repositories';
import {injectable} from '@loopback/core';

@injectable()
export class ApiKeyVerificationService {
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
      console.log(error);
      throw new HttpErrors.InternalServerError('Error verifying API keys');
    }
  }
}
