// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BearerVerifierBindings} from '../components/bearer-verifier/keys';
import {ILogger, LOGGER} from '../components/logger-extension';
import {UserTokensValidAfter} from '../models';
import {AuthCacheSourceName} from '../types';

const keyFor = (userId: string, tenantId?: string) =>
  tenantId
    ? `tokensValidAfter:${userId}:${tenantId}`
    : `tokensValidAfter:${userId}`;

export class UserTokensValidAfterRepository extends DefaultKeyValueRepository<UserTokensValidAfter> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
    @inject(LOGGER.LOGGER_INJECT, {optional: true})
    private readonly logger?: ILogger,
    @inject(BearerVerifierBindings.TokensValidAfterFailOpen, {optional: true})
    private readonly failOpen?: boolean,
  ) {
    super(UserTokensValidAfter, dataSource);
  }

  /**
   * Marks every token of the user (scoped to one tenant when given) issued
   * before now as revoked. The marker expires after ttlMs, the longest time
   * a token issued before it can still be alive.
   */
  async revoke(
    userId: string,
    ttlMs: number,
    tenantId?: string,
  ): Promise<void> {
    const key = keyFor(userId, tenantId);
    await this.set(
      key,
      new UserTokensValidAfter({key, validAfter: Date.now()}),
      {ttl: ttlMs},
    );
  }

  /**
   * A token without iat is treated as issued at 0, so any marker revokes it.
   * Comparison is strict and in ms because iat only has second precision.
   */
  async isRevoked(
    userId: string,
    issuedAtSec: number | undefined,
    tenantId?: string,
  ): Promise<boolean> {
    try {
      const keys = [keyFor(userId)];
      if (tenantId) {
        keys.push(keyFor(userId, tenantId));
      }
      const markers = await Promise.all(keys.map(key => this.get(key)));
      const validAfter = Math.max(0, ...markers.map(m => m?.validAfter ?? 0));
      return validAfter > 0 && (issuedAtSec ?? 0) * 1000 < validAfter;
    } catch (error) {
      this.logger?.error(
        `Failed to read tokensValidAfter marker for user ${userId}`,
      );
      if (this.failOpen) {
        return false;
      }
      throw new HttpErrors.ServiceUnavailable(
        'Authentication service temporarily unavailable. Please retry.',
      );
    }
  }
}
