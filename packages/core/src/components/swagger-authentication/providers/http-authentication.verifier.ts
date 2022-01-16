import {Provider} from '@loopback/core';
import {HttpAuthenticationVerifier} from '../types';

export class HttpAuthenticationVerifierProvider
  implements Provider<HttpAuthenticationVerifier>
{
  value(): HttpAuthenticationVerifier {
    return (username, password) => {
      return (
        username === process.env.SWAGGER_CREDS_USER &&
        password === process.env.SWAGGER_CREDS_PASS
      );
    };
  }
}
