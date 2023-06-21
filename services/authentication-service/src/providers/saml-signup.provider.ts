import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {SamlSignUpFn} from './types';

export class SamlSignupProvider implements Provider<SamlSignUpFn> {
  value(): SamlSignUpFn {
    // sonarignore:start
    return async profile => {
      // sonarignore:end
      throw new HttpErrors.NotImplemented(`SamlSignupProvider not implemented`);
    };
  }
}
