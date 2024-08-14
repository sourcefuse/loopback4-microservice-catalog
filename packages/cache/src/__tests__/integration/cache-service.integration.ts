import {CacheService, InMemoryStoreStrategy} from '../../services';
import {expect, sinon} from '@loopback/testlab';
import {ICacheStore} from '../../types';
import {Context} from '@loopback/core';
import {CacheComponentBindings} from '../../keys';
import {flushPromises, logger} from '../helpers';
import {fail} from 'assert';

describe('CacheService: Integration', () => {
  let cacheService: CacheService;
  let cacheStore: ICacheStore;
  const testPrefix = 'test';
  const testTags = ['SomeEntity', 'SomeOtherEntity'];
  const testKey = JSON.stringify({id: 1});
  const testValue = {name: 'test'};
  const originalDateNow = Date.now;
  const baseTime = 1000;
  beforeEach(() => {
    cacheStore = new InMemoryStoreStrategy();
    const options = {
      ttl: 1000,
      strategy: InMemoryStoreStrategy,
      datasourceName: 'cacheStore',
    };
    const context = new Context();
    context.bind(CacheComponentBindings.CacheConfig).to(options);
    context.bind(`services.${InMemoryStoreStrategy.name}`).to(cacheStore);
    cacheService = new CacheService(logger, context, options);
    Date.now = () => baseTime;
  });
  after(() => {
    Date.now = originalDateNow;
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
  it('should not return a value from cache if it is expired', async () => {
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
    Date.now = () => baseTime + 10000;
    const value = await cacheService.getFromCache(
      testPrefix,
      testKey,
      testTags,
    );
    expect(value).to.eql(undefined);
  });
  it('should return a value from cache with custom ttl', async () => {
    await cacheService.saveInCache(testPrefix, testKey, testTags, testValue, {
      ttl: 30000,
    });
    Date.now = () => baseTime + 10000;
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

  describe('Error Handling', () => {
    it('should throw error if invalid strategy is provided', async () => {
      class DummyStrategy extends InMemoryStoreStrategy {}
      const context = new Context();
      const options = {
        ttl: 1000,
        strategy: DummyStrategy,
        datasourceName: 'cacheStore',
      };
      try {
        cacheService = new CacheService(logger, context, options);
        fail();
      } catch (error) {
        expect(error.message).startWith(
          `The key 'services.${DummyStrategy.name}' is not bound to any value in context`,
        );
      }
    });
    it('should log error if get fails', async () => {
      const spy = sinon.spy(logger, 'error');
      const error = new Error('Test Error');
      sinon.stub(cacheStore, 'getMany').throws(error);
      const testFunction = async function () {};
      await cacheService.executeAndSave(testFunction, [], 'test', testPrefix);
      await flushPromises();
      expect(spy.calledOnceWith('Test Error')).to.eql(true);
      spy.restore();
    });
    it('should log error if set fails', async () => {
      const spy = sinon.spy(logger, 'error');
      const error = new Error('Test Error');
      sinon.stub(cacheStore, 'set').throws(error);
      const testFunction = async function () {};
      await cacheService.executeAndSave(testFunction, [], 'test', testPrefix);
      await flushPromises();
      expect(spy.calledOnceWith('Test Error')).to.eql(true);
      spy.restore();
    });
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
    it('should not call get if key has expired', async () => {
      const spyGetMany = sinon.spy(cacheStore, 'getMany');
      const spyGet = sinon.spy(cacheStore, 'get');
      await cacheService.saveInCache(testPrefix, testKey, testTags, testValue);
      Date.now = () => baseTime + 10000;
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
});
