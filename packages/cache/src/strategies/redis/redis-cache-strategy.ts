import {JugglerDataSource} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {TextDecoder} from 'util';
import {CacheStrategyTypes} from '../../strategy-types.enum';
import {
  CachePluginComponentOptions,
  DEFAULT_CACHE_PLUGIN_OPTIONS,
} from '../../types';
import {ICacheStrategy} from '../cache-strategy';
import {RedisCacheMixinOptions} from './types';

const decoder = new TextDecoder('utf-8');

export class RedisCacheStrategy<M> implements ICacheStrategy<M> {
  getCacheDataSource: () => Promise<JugglerDataSource>;
  cacheProvider = CacheStrategyTypes.Redis;
  prefix: string;
  salt: string;

  constructor(opts: Partial<CachePluginComponentOptions>) {
    this.prefix = opts.prefix ?? DEFAULT_CACHE_PLUGIN_OPTIONS.prefix;
    this.salt = opts.salt ?? DEFAULT_CACHE_PLUGIN_OPTIONS.salt;
  }

  async searchInCache(
    key: string,
    cacheOptions: RedisCacheMixinOptions,
  ): Promise<M | M[] | undefined> {
    let result: M | M[] | undefined;
    try {
      const res = (await this.executeRedisCommand('GET', [key])) as Buffer;
      if (res) {
        result = JSON.parse(decoder.decode(res));
      }
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        `Unexpected error occured while searching in cache : ${err}`,
      );
    }
    return result;
  }

  async saveInCache(
    key: string,
    value: M | M[],
    cacheOptions: RedisCacheMixinOptions,
  ): Promise<void> {
    try {
      await this.executeRedisCommand('SET', [
        key,
        JSON.stringify(value),
        `PX`,
        cacheOptions.ttl ?? 60000,
      ]);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        `Unexpected error occured while saving in cache : ${err}`,
      );
    }
  }

  async clearCache(cacheOptions: RedisCacheMixinOptions): Promise<void> {
    this.checkDataSource();
    const script = `
      local cursor = 0
      local dels = 0
      repeat
          local result = redis.call('SCAN', cursor, 'MATCH', ARGV[1], 'COUNT', '${
            cacheOptions.scanCount ?? 50
          }')
          for _,key in ipairs(result[2]) do
              redis.call('DEL', key)
              dels = dels + 1
          end
          cursor = tonumber(result[1])
      until cursor == 0
      return dels`;
    try {
      await this.executeRedisCommand(`EVAL`, [script, 0, `${this.prefix}*`]);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        `Unexpected error occured while executing script to empty cache : ${err}`,
      );
    }
  }

  private checkDataSource(): void {
    if (!this.getCacheDataSource) {
      throw new Error(`Please provide value for getCacheDataSource`);
    }
  }

  async executeRedisCommand(
    command: string,
    args: (string | number)[],
  ): Promise<Buffer | number | undefined> {
    const cacheDataSource = await this.getCacheDataSource();
    return new Promise((resolve, reject) => {
      if (cacheDataSource.connector?.execute) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        cacheDataSource.connector.execute(
          command,
          args,
          (err: Error, res: Buffer | number) => {
            if (err) {
              reject(err);
            }
            if (res) {
              resolve(res);
            } else {
              return resolve(undefined);
            }
          },
        );
      }
    });
  }
}
