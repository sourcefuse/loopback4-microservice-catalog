import {
  Application,
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject,
  injectable,
  ServiceOrProviderClass,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {LoggerExtensionComponent} from '@sourceloop/core';
import {CacheComponentBindings} from './keys';
import {ICacheOptions} from './types';
import {
  CacheService,
  InMemoryStoreStrategy,
  RedisStoreStrategy,
} from './services';

@injectable()
export class CachingComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    app: Application,
    @inject(CacheComponentBindings.CacheConfig)
    configuration: ICacheOptions,
  ) {
    app.component(LoggerExtensionComponent);
    this.bindings = [
      createBindingFromClass(CacheService, {
        key: CacheComponentBindings.CacheService,
      }),
    ];
    this.services = [RedisStoreStrategy, InMemoryStoreStrategy];
  }
  services?: ServiceOrProviderClass<AnyObject>[];
  bindings?: Binding<AnyObject>[];
}
