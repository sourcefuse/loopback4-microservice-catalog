import {
  AnyObject,
  Count,
  DataObject,
  DefaultCrudRepository,
  Entity,
  Filter,
  FilterExcludingWhere,
  Where,
} from '@loopback/repository';
import {
  AbstractConstructor,
  ICacheMixinOptions,
  ICacheService,
  ICachedMethodOptions,
  ICachedRepository,
  ICachedService,
} from '../types';
import {inject} from '@loopback/core';
import {CacheComponentBindings} from '../keys';
import {cacheInvalidator} from '../decorators/cache-invalidator.decorator';

// sonarignore:start
/**
 * This is a mixin function that adds caching functionality to a given repository class.
 * @param superClass - The superclass is a generic type parameter that extends the
 * `DefaultCrudRepository` class. It represents the base repository class that the `CacheMixin` will
 * extend and add caching functionality to.
 * @param {ICacheMixinOptions} [cacheOptions] - `cacheOptions` is an optional parameter of type
 * `ICacheMixinOptions`. It is used to configure the caching behavior of the repository.
 */
export function CacheMixin<
  // sonarignore:end
  M extends Entity,
  ID,
  Relations extends object,
  S extends AbstractConstructor<DefaultCrudRepository<M, ID, Relations>>,
>(
  superClass: S & AbstractConstructor<DefaultCrudRepository<M, ID, Relations>>,
  cacheOptions?: ICacheMixinOptions,
): typeof superClass &
  AbstractConstructor<ICachedRepository<M, ID, Relations>> & {
    prototype: ICachedRepository<M, ID, Relations>;
  } {
  abstract class CachedRepo
    extends superClass
    implements ICachedService, ICachedRepository<M, ID, Relations>
  {
    @inject(CacheComponentBindings.CacheService)
    cache: ICacheService;

    abstract cacheIdentifier: string;

    async find(
      filter?: Filter<M>,
      options?: ICachedMethodOptions,
    ): Promise<(M & Relations)[]> {
      options = addTagsToOptions(options, cacheOptions?.cachedItemTags);
      if (cacheOptions?.disableCachedFetch) {
        return super.find(filter, options);
      }
      return this.cache.executeAndSave(
        super.find.bind(this),
        [filter, options],
        'find',
        this.cacheIdentifier,
        options,
        cacheOptions,
      );
    }

    async findOne(
      filter?: Filter<M>,
      options?: ICachedMethodOptions,
    ): Promise<(M & Relations) | null> {
      if (cacheOptions?.disableCachedFetch) {
        return super.findOne(filter, options);
      }
      options = addTagsToOptions(options, cacheOptions?.cachedItemTags);
      return this.cache.executeAndSave(
        super.findOne.bind(this),
        [filter, options],
        'findOne',
        this.cacheIdentifier,
        options,
        cacheOptions,
      );
    }

    async findById(
      id: ID,
      filter?: FilterExcludingWhere<M>,
      options?: ICachedMethodOptions,
    ): Promise<M & Relations> {
      if (cacheOptions?.disableCachedFetch) {
        return super.findById(id, filter, options);
      }
      options = addTagsToOptions(options, cacheOptions?.cachedItemTags);
      return this.cache.executeAndSave(
        super.findById.bind(this),
        [id, filter, options],
        'findById',
        this.cacheIdentifier,
        options,
        cacheOptions,
      );
    }

    async count(
      where?: Where<M>,
      options?: ICachedMethodOptions,
    ): Promise<Count> {
      if (cacheOptions?.disableCachedFetch) {
        return super.count(where, options);
      }
      options = addTagsToOptions(options, cacheOptions?.cachedItemTags);
      return this.cache.executeAndSave(
        super.count.bind(this),
        [where, options],
        'count',
        this.cacheIdentifier,
        options,
        cacheOptions,
      );
    }

    async exists(id: ID, options?: ICachedMethodOptions): Promise<boolean> {
      if (cacheOptions?.disableCachedFetch) {
        return super.exists(id, options);
      }
      options = addTagsToOptions(options, cacheOptions?.cachedItemTags);
      return this.cache.executeAndSave(
        super.exists.bind(this),
        [id, options],
        'exists',
        this.cacheIdentifier,
        options,
        cacheOptions,
      );
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async create(data: DataObject<M>, options?: AnyObject): Promise<M> {
      return super.create(data, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async createAll(data: DataObject<M>[], options?: AnyObject): Promise<M[]> {
      return super.createAll(data, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async save(entity: M, options?: AnyObject): Promise<M> {
      return super.save(entity, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async update(entity: M, options?: AnyObject): Promise<void> {
      return super.update(entity, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async updateAll(
      data: DataObject<M>,
      where?: Where<M>,
      options?: AnyObject,
    ): Promise<Count> {
      return super.updateAll(data, where, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async updateById(
      id: ID,
      data: DataObject<M>,
      options?: AnyObject,
    ): Promise<void> {
      return super.updateById(id, data, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async replaceById(
      id: ID,
      data: DataObject<M>,
      options?: AnyObject,
    ): Promise<void> {
      return super.replaceById(id, data, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async delete(entity: M, options?: AnyObject): Promise<void> {
      return super.delete(entity, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async deleteAll(where?: Where<M>, options?: AnyObject): Promise<Count> {
      return super.deleteAll(where, options);
    }

    @cacheInvalidator(cacheOptions?.invalidationTags)
    async deleteById(id: ID, options?: AnyObject): Promise<void> {
      return super.deleteById(id, options);
    }
  }
  return CachedRepo;
}

function addTagsToOptions(
  options?: ICachedMethodOptions,
  tags?: string[],
): ICachedMethodOptions {
  if (!options) {
    options = {};
  }
  if (!options.tags && tags?.length) {
    options.tags = [];
  }
  if (tags?.length) {
    options.tags = options.tags?.concat(tags);
  }
  return options;
}
