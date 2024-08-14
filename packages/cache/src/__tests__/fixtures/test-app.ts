import {InMemoryStoreStrategy, RedisStoreStrategy} from '../../services';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin, juggler} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {CachingComponent} from '../../component';
import {CacheComponentBindings} from '../../keys';
import {TestController} from './controller/test.controller';

export class TestApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    if (
      process.env.REDIS_HOST &&
      process.env.REDIS_PORT &&
      !options.redisDisabled
    ) {
      const redisDs = new juggler.DataSource({
        name: 'redisCacheStore',
        connector: 'kv-redis',
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DATABASE,
      });
      this.dataSource(redisDs);
    }

    const memoryDS = new juggler.DataSource({
      name: 'memorydb',
      connector: 'memory',
    });
    const memoryDS2 = new juggler.DataSource({
      name: 'memorydb2',
      connector: 'memory',
    });
    this.dataSource(memoryDS);
    this.dataSource(memoryDS2);
    if (!options.redisDisabled) {
      this.bind(CacheComponentBindings.CacheConfig).to({
        ttl: 1000,
        strategy: RedisStoreStrategy,
        datasourceName: 'redisCacheStore',
      });
    } else {
      this.bind(CacheComponentBindings.CacheConfig).to({
        ttl: 1000,
        strategy: InMemoryStoreStrategy,
      });
    }
    this.component(CachingComponent);
    this.controller(TestController);
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
