// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {JugglerDataSource} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {TextDecoder} from 'util';
import {CacheStrategyTypes} from '../../strategy-types.enum';
import {
  CacheEntity,
  CachePluginComponentOptions,
  RedisConnectorExecuteReturnType,
  SaveInCacheValue,
  SearchInCacheResponse,
} from '../../types';
import {ICacheStrategy} from '../cache-strategy';

const decoder = new TextDecoder('utf-8');

export class RedisCacheStrategy<M> implements ICacheStrategy<M> {
  getCacheDataSource: () => Promise<JugglerDataSource>;
  cacheProvider = CacheStrategyTypes.Redis;
  prefix: string;
  ttl: number;
  deletionKey: string;

  constructor(opts: CachePluginComponentOptions) {
    this.prefix = opts.prefix;
    this.ttl = opts.ttl;
    this.deletionKey = `${this.prefix}_DELETION_TIME`;
  }

  async searchInCache(key: string): Promise<SearchInCacheResponse<M>> {
    let result: CacheEntity<M> | undefined;
    try {
      const res = await this.executeRedisCommand<Buffer>('GET', [key]);
      if (res) {
        result = JSON.parse(decoder.decode(res));
        const deletionTime = await this.executeRedisCommand<Buffer>('GET', [
          this.deletionKey,
        ]);
        if (
          deletionTime &&
          (result as CacheEntity<M>).insertionTime <=
            parseInt(JSON.parse(decoder.decode(deletionTime)))
        ) {
          await this.executeRedisCommand('DEL', [key]);
          result = undefined;
        }
      }
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        `Unexpected error occured while searching in cache : ${err}`,
      );
    }
    return result?.payload;
  }

  async saveInCache(key: string, value: SaveInCacheValue<M>): Promise<void> {
    try {
      const valueWithTime: CacheEntity<SaveInCacheValue<M>> = {
        payload: value,
        insertionTime: Date.now(),
      };
      await this.executeRedisCommand('SET', [
        key,
        JSON.stringify(valueWithTime),
        `PX`,
        this.ttl,
      ]);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        `Unexpected error occured while saving in cache : ${err}`,
      );
    }
  }

  async clearCache(): Promise<void> {
    try {
      await this.executeRedisCommand('SET', [this.deletionKey, Date.now()]);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        `Unexpected error occured while saving deletion time : ${err}`,
      );
    }
  }

  async executeRedisCommand<T extends RedisConnectorExecuteReturnType>(
    command: string,
    args: (string | number)[],
  ): Promise<T | undefined> {
    const cacheDataSource = await this.getCacheDataSource();
    return new Promise((resolve, reject) => {
      if (cacheDataSource.connector?.execute) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        cacheDataSource.connector.execute(
          command,
          args,
          (err: Error, res: T) => {
            if (err) {
              reject(err);
            }
            if (res) {
              resolve(res);
            } else {
              resolve(undefined);
            }
          },
        );
      }
    });
  }
}
