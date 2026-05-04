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
   * Uses Redis SET NX EX for true atomicity when connector supports it,
   * otherwise falls back to get/set pattern (may have race condition).
   */
  async setIfNotExists(
    key: string,
    value: RevokedToken,
    options: {ttl: number},
  ): Promise<boolean> {
    const ttlSeconds = Math.ceil(options.ttl / 1000);
    const connector = this.datasource.connector;

    if (connector?.execute) {
      try {
        const executeFn = connector.execute;
        const result = await new Promise<boolean>((resolve, reject) => {
          // eslint-disable-next-line no-void
          void executeFn(
            'SET',
            [key, JSON.stringify(value), 'NX', 'EX', ttlSeconds],
            (err: Error, res: Buffer) => {
              if (err) {
                reject(err);
              } else {
                resolve(res?.toString() === 'OK');
              }
            },
          );
        });
        if (!result) {
          return false;
        }
        return true;
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.message.includes('execute() must be implemented')
        ) {
          delete connector.execute;
        }
      }
    }

    const existing = await this.get(key);
    if (existing) {
      return false;
    }

    await this.set(key, value, {ttl: ttlSeconds * 1000});
    return true;
  }
}
