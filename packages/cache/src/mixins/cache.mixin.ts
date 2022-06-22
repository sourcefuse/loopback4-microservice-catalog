import {MixinTarget} from '@loopback/core';
import {
  DefaultCrudRepository,
  Entity,
  Filter,
  FilterExcludingWhere,
  JugglerDataSource,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ICacheStrategy, RedisCacheStrategy} from '../strategies';
import {CacheStrategyTypes} from '../strategy-types.enum';
import {
  CacheMixinOptions,
  CacheOptions,
  CachePluginComponentOptions,
  DEFAULT_CACHE_PLUGIN_OPTIONS,
} from '../types';

const bcrypt = require('bcrypt');

export class CacheManager {
  static options: CachePluginComponentOptions = DEFAULT_CACHE_PLUGIN_OPTIONS;

  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  static CacheRepositoryMixin<
    M extends Entity,
    ID,
    Relations extends object,
    R extends MixinTarget<DefaultCrudRepository<M, ID, Relations>>,
  >(
    baseClass: R,
    cacheOptions: CacheMixinOptions & Partial<CachePluginComponentOptions>,
  ) {
    class MixedRepository extends baseClass {
      getCacheDataSource: () => Promise<JugglerDataSource>;
      strategy: ICacheStrategy<M>;

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      constructor(...args: any[]) {
        super(...args);

        const opts = {
          prefix: cacheOptions.prefix ?? CacheManager.options.prefix,
          salt: cacheOptions.salt ?? CacheManager.options.salt,
        };
        if (CacheManager.options.cacheProvider === CacheStrategyTypes.Redis) {
          this.strategy = new RedisCacheStrategy<M>(opts);
        } else {
          throw new HttpErrors.NotImplemented(
            'Cache strategy is not implemented !',
          );
        }
      }

      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      async findById(
        id: ID,
        filter?: FilterExcludingWhere<M>,
        options?: CacheOptions,
      ): Promise<M> {
        this.checkDataSource();
        const key = await this.generateKey(id, filter);
        let finalResult: M;
        if (options?.forceUpdate) {
          finalResult = await super.findById(id, filter, options);
          this.strategy
            .saveInCache(key, finalResult, cacheOptions)
            .catch(err => console.error(err));
        } else {
          const result = (await this.strategy.searchInCache(
            key,
            cacheOptions,
          )) as M;
          if (result) {
            finalResult = result;
          } else {
            finalResult = await super.findById(id, filter, options);
            this.strategy
              .saveInCache(key, finalResult, cacheOptions)
              .catch(err => console.error(err));
          }
        }

        return finalResult;
      }

      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      async find(
        filter?: Filter<M> | undefined,
        options?: CacheOptions,
      ): Promise<M[]> {
        this.checkDataSource();
        const key = await this.generateKey(undefined, filter);
        let finalResult: M[];
        if (options?.forceUpdate) {
          finalResult = await super.find(filter, options);
          this.strategy
            .saveInCache(key, finalResult, cacheOptions)
            .catch(err => console.error(err));
        } else {
          const result = (await this.strategy.searchInCache(
            key,
            cacheOptions,
          )) as M[];
          if (result) {
            finalResult = result;
          } else {
            finalResult = await super.find(filter, options);
            this.strategy
              .saveInCache(key, finalResult, cacheOptions)
              .catch(err => console.error(err));
          }
        }

        return finalResult;
      }

      async clearCache(): Promise<void> {
        this.checkDataSource();
        return this.strategy.clearCache(cacheOptions);
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
          cacheOptions.prefix + (await bcrypt.hash(key, cacheOptions.salt))
        );
      }

      checkDataSource(): void {
        if (!this.getCacheDataSource) {
          throw new Error(`Please provide value for getCacheDataSource`);
        }
        this.strategy.getCacheDataSource = this.getCacheDataSource;
      }
    }
    return MixedRepository;
  }
}
