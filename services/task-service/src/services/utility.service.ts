import {BindingScope, injectable} from '@loopback/context';

import {createHmac} from 'crypto';
import {v4 as uuidv4} from 'uuid';
import {ClientAppDTO} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class UtilityService {
  public generateApiKeyAndSecret(clientApp: ClientAppDTO): {
    apiKey: string;
    apiSecret: string;
  } {
    const apiKey = `${clientApp.clientName}-${uuidv4()}`;
    // generate a secret key using client app and random uuid
    const base = `${clientApp.clientName}-${uuidv4()}`;
    const apiSecret = createHmac('sha256', base).digest('hex');

    return {apiKey, apiSecret};
  }
}
