import {Context} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {expect, sinon} from '@loopback/testlab';
import * as dotenv from 'dotenv';
import {CacheComponentBindings} from '../../keys';
import {CacheService, RedisStoreStrategy} from '../../services';
import {logger} from '../helpers';

dotenv.config();

describe('CacheService: Acceptance', () => {
  let cacheService: CacheService;
  let cacheStore: RedisStoreStrategy;
  const testPrefix = 'test';
  const testTags = ['SomeEntity', 'SomeOtherEntity'];
  const testKey = JSON.stringify({id: 1});
  const testValue = {name: 'test'};
  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT;
  let mochaContext: Mocha.Context;
  before(function () {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this, @typescript-eslint/no-this-alias
    mochaContext = this;
    if (!redisHost || !redisPort) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.skip();
    }
  });
  beforeEach(async () => {
    const options = {
      ttl: 1000,
      strategy: RedisStoreStrategy,
      datasourceName: 'cacheStore',
    };
    const context = new Context();
    context.bind(CacheComponentBindings.CacheConfig).to(options);
    const ds = new juggler.DataSource({
      name: 'cacheStore',
      connector: 'kv-redis',
      host: redisHost,
      port: redisPort,
      password: process.env.REDIS_PASSWORD ?? '',
      db: process.env.REDIS_DB ?? 0,
    });
    context.bind('datasources.cacheStore').to(ds);
    cacheStore = new RedisStoreStrategy(options, context);
    context.bind(`services.${RedisStoreStrategy.name}`).to(cacheStore);
    cacheService = new CacheService(logger, context, options);
    await cacheStore.executeCommand('FLUSHALL', []);
  });

  it("should save a value in cache with it's insertion time", async () => {
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
    const expectedKey = cacheService.buildKey(testPrefix, testTags, testKey);
    const value = await cacheStore.get(expectedKey);
    expect(value).to.eql(testValue);
  });
  it('should return a value from cache if it is not expired', async () => {
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
    const value = await cacheService.getFromCache(
      testPrefix,
      testKey,
      testTags,
    );
    expect(value).to.eql(testValue);
  });
  it('should not return a value from cache if it is expired', async function () {
    mochaContext.timeout(3000);
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
    await waitFor(2000);
    const value = await cacheService.getFromCache(
      testPrefix,
      testKey,
      testTags,
    );
    expect(value).to.eql(undefined);
  });
  it("should not a return a value from cache if it is not expired but it's prefix is invalidated", async () => {
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
    await cacheService.invalidate(testPrefix, []);
    const value = await cacheService.getFromCache(
      testPrefix,
      testKey,
      testTags,
    );
    expect(value).to.eql(undefined);
  });
  it("should not a return a value from cache if it is not expired but one of it's tags are invalidated", async () => {
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
    await cacheService.invalidate('', [testTags[0]]);
    const value = await cacheService.getFromCache(
      testPrefix,
      testKey,
      testTags,
    );
    expect(value).to.eql(undefined);
  });
  it('should not be effected by invalidation of other tags', async () => {
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
    await cacheService.invalidate('', ['RandomEntity']);
    const value = await cacheService.getFromCache(
      testPrefix,
      testKey,
      testTags,
    );
    expect(value).to.eql(testValue);
  });

  describe('Performance', () => {
    it('should not call set more than twice for saveInCache', async () => {
      const spy = sinon.spy(cacheStore, 'set');
      await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
      // should only make two set calls, one for the value and one for the insertionTime
      expect(spy.callCount).to.eql(2);
    });
    it('should not call getMany and get more than once for getFromCache', async () => {
      const spyGetMany = sinon.spy(cacheStore, 'getMany');
      const spyGet = sinon.spy(cacheStore, 'get');
      await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
      await cacheService.getFromCache(testPrefix, testKey, testTags);
      expect(spyGet.callCount).to.eql(1);
      expect(spyGetMany.callCount).to.eql(1);
    });
    it('should not call get if key has expired', async function () {
      mochaContext.timeout(3000);
      const spyGetMany = sinon.spy(cacheStore, 'getMany');
      const spyGet = sinon.spy(cacheStore, 'get');
      await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
      await waitFor(2000);
      await cacheService.getFromCache(testPrefix, testKey, testTags);
      expect(spyGetMany.callCount).to.eql(1);
      expect(spyGet.callCount).to.eql(0);
    });
    it("should not call get if it's tag has been invalidated", async () => {
      const spyGetMany = sinon.spy(cacheStore, 'getMany');
      const spyGet = sinon.spy(cacheStore, 'get');
      await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
      await cacheService.invalidate('', [testTags[0]]);
      await cacheService.getFromCache(testPrefix, testKey, testTags);
      expect(spyGetMany.callCount).to.eql(1);
      expect(spyGet.callCount).to.eql(0);
    });
    it("should not call get if it's prefix has been invalidated", async () => {
      const spyGetMany = sinon.spy(cacheStore, 'getMany');
      const spyGet = sinon.spy(cacheStore, 'get');
      await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
      await cacheService.invalidate('', [testTags[0]]);
      await cacheService.getFromCache(testPrefix, testKey, testTags);
      expect(spyGetMany.callCount).to.eql(1);
      expect(spyGet.callCount).to.eql(0);
    });
  });

  async function waitFor(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }
});
