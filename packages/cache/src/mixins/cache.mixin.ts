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
import {TextDecoder} from 'util';
import {CacheOptions} from '../types';

const decoder = new TextDecoder('utf-8');

export function CacheRespositoryMixin<
  M extends Entity,
  ID,
  Relations extends object,
  R extends MixinTarget<DefaultCrudRepository<M, ID, Relations>>,
>(baseClass: R, cacheOptions: CacheOptions) {
  class MixedRepository extends baseClass {
    cacheDataSource: JugglerDataSource;

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    async findById(
      id: ID,
      filter?: FilterExcludingWhere<M>,
      options?: Options,
    ): Promise<M> {
      this.checkDataSource();
      const key = this.getKey(id, filter, options);
      const result = await this.searchInCache(key);
      let finalResult;
      if (result) {
        finalResult = result;
      } else {
        finalResult = await super.findById(id, filter, options);
        this.saveInCache(key, finalResult);
      }
      return finalResult as M;
    }

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    async find(
      filter?: Filter<M> | undefined,
      options?: AnyObject | undefined,
    ): Promise<M[]> {
      this.checkDataSource();
      const key = this.getKey(undefined, filter, options);
      const result = await this.searchInCache(key);
      let finalResult;
      if (result) {
        finalResult = result;
      } else {
        finalResult = await super.find(filter, options);
        this.saveInCache(key, finalResult);
      }
      return finalResult as M[];
    }

    async searchInCache(key: string) {
      let result;

      try {
        const res = await this.executeRedisCommand('GET', [key]);
        if (res) {
          result = JSON.parse(decoder.decode(res as ArrayBuffer));
        }
      } catch (err) {
        throw new Error(
          `Unexpected error occured while searching in cache : ${err}`,
        );
      }
      return result;
    }

    saveInCache(key: string, value: AnyObject) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.executeRedisCommand('SET', [
          key,
          JSON.stringify(value),
          `PX`,
          cacheOptions.ttl ?? 60000,
        ]);
      } catch (err) {
        throw new Error(
          `Unexpected error occured while saving in cache : ${err}`,
        );
      }
    }

    getKey(id?: ID, filter?: FilterExcludingWhere<M>, options?: Options) {
      let key = cacheOptions.prefix;
      if (id) {
        key += `_${id}`;
      }
      if (filter) {
        key += `_${JSON.stringify(filter)}`;
      }
      if (options) {
        key += `_${JSON.stringify(options)}`;
      }
      return key;
    }

    async clearCache() {
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
        return await this.executeRedisCommand(`EVAL`, [
          script,
          0,
          `${cacheOptions.prefix}*`,
        ]);
      } catch (err) {
        throw new Error(
          `Unexpected error occured while executing script to empty cache : ${err}`,
        );
      }
    }

    checkDataSource() {
      if (!this.cacheDataSource) {
        throw new Error(`Please provide value for cacheDataSource`);
      }
    }

    // returns promisified execute function
    executeRedisCommand(command: string, args: (string | number)[]) {
      return new Promise((resolve, reject) => {
        if (this.cacheDataSource.connector?.execute) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.cacheDataSource.connector.execute(
            command,
            args,
            (err: Error, res: Buffer) => {
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
