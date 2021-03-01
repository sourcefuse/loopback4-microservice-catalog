import { inject, Provider } from '@loopback/context';
import { HttpErrors } from '@loopback/rest';
import { ILogger, LOGGER } from '@sourceloop/core';
import { verify } from 'jsonwebtoken';
import { VerifyFunction } from 'loopback4-authentication';
import { SignupRequest } from '../models/signup-request.model';

export class SignupBearerVerifyProvider
  implements Provider<VerifyFunction.BearerFn<SignupRequest>> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) { }

  value(): VerifyFunction.BearerFn<SignupRequest> {
    return async (token, req) => {
      let result: SignupRequest;
      try {
        result = verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
        }) as SignupRequest;
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        throw new HttpErrors.Unauthorized('TokenExpired');
      }
      return result;
    };
  }
}
