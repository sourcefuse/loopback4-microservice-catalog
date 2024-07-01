// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import * as fs from 'fs/promises';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {AuthServiceBindings} from '../keys';
import {SignupRequest} from '../models/signup-request.model';
import {IAuthServiceConfig} from '../types';

export class SignupBearerVerifyProvider
  implements Provider<VerifyFunction.BearerFn<SignupRequest>>
{
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
  ) {}

  value(): VerifyFunction.BearerFn<SignupRequest> {
    return async (token: string, req?: Request) => {
      let result: SignupRequest;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let publicKey: any; //NOSONAR
      try {
        if (this.authConfig?.useSymmetricEncryption) {
          result = verify(token, process.env.JWT_SECRET as string, {
            issuer: process.env.JWT_ISSUER,
            algorithms: ['HS256'],
          }) as SignupRequest;
        } else {
          publicKey = await fs.readFile(process.env.JWT_PUBLIC_KEY ?? '');
          result = verify(token, publicKey, {
            issuer: process.env.JWT_ISSUER,
            algorithms: ['RS256'],
          }) as SignupRequest;
        }
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        throw new HttpErrors.Unauthorized('TokenExpired');
      }
      return result;
    };
  }
}
