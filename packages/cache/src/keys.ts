import {BindingKey} from '@loopback/core';
import {ICacheComponentOptions, ICacheService, ICacheStore} from './types';
import {IAuthUserWithPermissions} from '@sourceloop/core';

export const CachingComponentNamespace = 'sourceloop.caching.extension';
export namespace CacheComponentBindings {
  export const CacheConfig = BindingKey.create<ICacheComponentOptions>(
    `${CachingComponentNamespace}.CacheConfig`,
  );
  export const CacheService = BindingKey.create<ICacheService>(
    `${CachingComponentNamespace}.CacheService`,
  );
  export const DatasourceName = BindingKey.create<string>(
    `${CachingComponentNamespace}.CacheDatasourceKey`,
  );
  export const TTL = BindingKey.create<number>(
    `${CachingComponentNamespace}.CacheTTL`,
  );
  export const CacheStore = BindingKey.create<ICacheStore>(
    `${CachingComponentNamespace}.CacheStore`,
  );
}

export const AUTH_USER_KEY = BindingKey.create<
  IAuthUserWithPermissions | undefined
>('sf.userAuthentication.currentUser');
