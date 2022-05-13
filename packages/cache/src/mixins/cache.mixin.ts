import {MixinTarget} from '@loopback/core';
import {
  AnyObject,
  DefaultCrudRepository,
  Entity,
  Filter,
  FilterExcludingWhere,
  JugglerDataSource,
  Options,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {TextDecoder} from 'util';
import {CacheOptions} from '../types';
const bcrypt = require('bcrypt');

const decoder = new TextDecoder('utf-8');
const salt = '$2b$10$Pdp69XWPJjQ8iFcum6GHEe';

export function CacheRespositoryMixin<
  M extends Entity,
  ID,
  Relations extends object,
  R extends MixinTarget<DefaultCrudRepository<M, ID, Relations>>,
>(baseClass: R, cacheOptions: CacheOptions) {
  class MixedRepository extends baseClass {
    getCacheDataSource: () => Promise<JugglerDataSource>;

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    async findById(
      id: ID,
      filter?: FilterExcludingWhere<M>,
      options?: Options,
    ): Promise<M> {
      this.checkDataSource();
      const key = await this.generateKey(id, filter);
      const result = (await this.searchInCache(key)) as M;
      let finalResult: M;
      if (result) {
        finalResult = result;
      } else {
        finalResult = await super.findById(id, filter, options);
        this.saveInCache(key, finalResult).catch((err: Error) =>
          console.error(err),
        );
      }
      return finalResult;
    }

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    async find(
      filter?: Filter<M> | undefined,
      options?: AnyObject | undefined,
    ): Promise<M[]> {
      this.checkDataSource();
      const key = await this.generateKey(undefined, filter);
      const result = (await this.searchInCache(key)) as M[];
      let finalResult: M[];
      if (result) {
        finalResult = result;
      } else {
        finalResult = await super.find(filter, options);
        this.saveInCache(key, finalResult).catch((err: Error) =>
          console.error(err),
        );
      }
      return finalResult;
    }

    async searchInCache(key: string): Promise<M | M[] | undefined> {
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

    async saveInCache(key: string, value: M | M[]): Promise<void> {
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

    async generateKey(id?: ID, filter?: Filter<M>): Promise<string> {
      let key = '';
      if (id) {
        key += `_${id}`;
      }
      if (filter) {
        key += `_${JSON.stringify(filter)}`;
      }
      // hash to reduce key length
      return (
        cacheOptions.prefix +
        (await bcrypt.hash(key, cacheOptions.salt ?? salt))
      );
    }

    async clearCache(): Promise<number> {
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
        return (await this.executeRedisCommand(`EVAL`, [
          script,
          0,
          `${cacheOptions.prefix}*`,
        ])) as number;
      } catch (err) {
        throw new HttpErrors.UnprocessableEntity(
          `Unexpected error occured while executing script to empty cache : ${err}`,
        );
      }
    }

    checkDataSource(): void {
      if (!this.getCacheDataSource) {
        throw new Error(`Please provide value for getCacheDataSource`);
      }
    }

    // returns promisified execute function
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
  return MixedRepository;
}
