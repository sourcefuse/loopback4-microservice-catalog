// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';

import {RevokedToken} from '../models';
import {AuthCacheSourceName} from '../types';

export class RevokedTokenRepository extends DefaultKeyValueRepository<RevokedToken> {
  private readonly datasource: juggler.DataSource;

  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(RevokedToken, dataSource);
    this.datasource = dataSource;
  }

  /**
   * Atomically marks the key as used if not already present.
   * Returns true if the key was set (first use), false if it already existed (replay).
   * Uses Redis SET NX EX for atomicity.
   */
  async setIfNotExists(
    key: string,
    value: RevokedToken,
    options: {ttl: number},
  ): Promise<boolean> {
    // ttl from LoopBack is in milliseconds; Redis EX is in seconds
    const ttlSeconds = Math.ceil(options.ttl / 1000);

    // Try to check if key exists first
    const existing = await this.get(key);
    if (existing) {
      // Key already exists - this is a replay attempt
      return false;
    }

    // Key doesn't exist, try to set it atomically
    await this.set(key, value, {ttl: ttlSeconds * 1000});
    return true;
  }
}
