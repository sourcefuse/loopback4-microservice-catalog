import {BindingScope, injectable} from '@loopback/context';

import {v4 as uuidv4} from 'uuid';
import {ClientAppDTO} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class UtilityService {
  public generateApiKeyAndSecret(clientApp: ClientAppDTO): {
    apiKey: string;
    apiSecret: string;
  } {
    const apiKey = `${clientApp.key}-${uuidv4()}`;
    const apiSecret = `${clientApp.secret}-${uuidv4()}`;
    return {apiKey, apiSecret};
  }
}
