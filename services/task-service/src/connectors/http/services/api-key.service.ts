import {injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {createHmac} from 'crypto';
import {ClientAppRepository} from '../repositories';

@injectable()
export class ApiKeyService {
  constructor(
    @repository(ClientAppRepository)
    private readonly clientApp: ClientAppRepository,
  ) {}

  async verify(apiKey: string, apiSecret: string): Promise<boolean> {
    try {
      const apiKeysObject = await this.clientApp.findOne({
        where: {
          apiKey,
          apiSecret,
        },
      });

      return !!apiKeysObject;
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        `Error verifying API keys ${error.message}`,
      );
    }
  }

  async generateSignature(
    event: AnyObject,
    timestamp: number,
  ): Promise<string> {
    const apiKeyData = await this.clientApp.findOne({
      where: {
        apiKey: event.apiKey,
      },
    });
    if (!apiKeyData) {
      throw new HttpErrors.Unauthorized('Invalid API key');
    }
    const hmac = createHmac('sha256', apiKeyData.apiSecret);
    hmac.update(`${JSON.stringify(event)}:${timestamp}`);
    return hmac.digest('hex');
  }
}
