import {
  Interceptor,
  InvocationContext,
  Provider,
  Setter,
  ValueOrPromise,
  inject,
} from '@loopback/core';
import {HttpErrors, RequestContext} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {createHmac, timingSafeEqual} from 'crypto';
import {AuthenticationBindings} from 'loopback4-authentication';
import {FeaturesDTO} from '../models';
import {TempUser} from '../types';

const DEFAULT_TIME_TOLERANCE = 5000;

export class BootstrapVerifierProvider implements Provider<Interceptor> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    private readonly setCurrentUser: Setter<TempUser>,
  ) {}

  value() {
    return this.intercept.bind(this);
  }

  async intercept<T>(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<T>,
  ) {
    const {request} = invocationCtx.parent as RequestContext;
    const value: FeaturesDTO = request.body;
    const TIMESTAMP_TOLERANCE = +(
      process.env.TIMESTAMP_TOLERANCE ?? DEFAULT_TIME_TOLERANCE
    );
    const timestamp = Number(request.headers['x-timestamp']);
    if (isNaN(timestamp)) {
      this.logger.error('Invalid timestamp');
      throw new HttpErrors.Unauthorized();
    }
    const signature = request.headers['x-signature'];
    if (!signature || typeof signature !== 'string') {
      this.logger.error('Missing signature string');
      throw new HttpErrors.Unauthorized();
    }
    const secret = process.env.USER_CALLBACK_SECRET!;
    const expectedSignature = createHmac('sha256', secret)
      .update(`${JSON.stringify(value)}${timestamp}`)
      .digest('hex');
    try {
      // actual signature should be equal to expected signature
      // timing safe equal is used to prevent timing attacks
      if (
        !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
      ) {
        this.logger.error('Invalid signature');
        throw new HttpErrors.Unauthorized();
      }

      const hh = Math.abs(timestamp - Date.now());
      // timestamp should be within 5 seconds
      if (hh > TIMESTAMP_TOLERANCE) {
        this.logger.error('Timestamp out of tolerance');
        throw new HttpErrors.Unauthorized();
      }
    } catch (e) {
      this.logger.error(e);
      throw new HttpErrors.Unauthorized();
    }

    this.setCurrentUser({
      id: process.env.ADMIN_USER_TENANT_ID!,
      username: 'SUPERADMIN',
      userTenantId: process.env.ADMIN_USER_TENANT_ID!,
      tenantType: 'master',
    });
    return next();
  }
}
