// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {CacheManager} from '../../mixins/cache.mixin';
import {CacheStrategyTypes} from '../../strategy-types.enum';
import {DEFAULT_CACHE_PLUGIN_OPTIONS} from '../../types';
import {mockData} from './fixtures/data';
import {
  MockDefaultCrudRepository,
  resetCalls,
  superFindAllCalled,
  superFindCalled,
} from './fixtures/default-crud.repository';
import {TestDataSource} from './fixtures/in-memory.datasource';
import {MockModel} from './fixtures/model';
import {TestRedisDataSource} from './fixtures/redis.datasource';

describe('Unit Test Cases for Cache Mixin', () => {
  const mixedClass = CacheManager.CacheRepositoryMixin(
    MockDefaultCrudRepository,
    {
      cacheProvider: CacheStrategyTypes.Redis,
      prefix: 'testPrefix',
    },
  );
  const testDataSource = new TestDataSource();
  const cacheRepo = new mixedClass(MockModel, testDataSource);
  const redisDataSourceStub = sinon.createStubInstance(TestRedisDataSource);
  cacheRepo.getCacheDataSource = sinon.stub().resolves(redisDataSourceStub);
  let redisExecuteStub: sinon.SinonStub;
  let searchStub: sinon.SinonStub;

  afterEach(() => {
    if (redisExecuteStub) {
      redisExecuteStub.restore();
    }
    if (searchStub) {
      searchStub.restore();
    }
    resetCalls();
  });

  it('findById should return data from cache if present', async () => {
    searchStub = sinon
      .stub(cacheRepo.strategy, 'searchInCache')
      .resolves(mockData);
    const result = await cacheRepo.findById('0');
    expect(result).to.eql(mockData);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindCalled).to.be.false();
  });

  it('findById should return data from db if not present in cache', async () => {
    searchStub = sinon
      .stub(cacheRepo.strategy, 'searchInCache')
      .resolves(undefined);

    const result = await cacheRepo.findById('0');
    expect(result).to.eql(mockData);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindCalled).to.be.true();
  });

  it('find should return data from cache if present', async () => {
    searchStub = sinon
      .stub(cacheRepo.strategy, 'searchInCache')
      .resolves([mockData]);
    const result = await cacheRepo.find();
    expect(result).to.eql([mockData]);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindAllCalled).to.be.false();
  });

  it('find should return data from db if not present in cache', async () => {
    searchStub = sinon
      .stub(cacheRepo.strategy, 'searchInCache')
      .resolves(undefined);

    const result = await cacheRepo.find();
    expect(result).to.eql([mockData]);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindAllCalled).to.be.true();
  });

  it('should use default prefix and salt if not provided', () => {
    const mixedClassDefault = CacheManager.CacheRepositoryMixin(
      MockDefaultCrudRepository,
      {
        cacheProvider: CacheStrategyTypes.Redis,
      },
    );
    const strategy = new mixedClassDefault(MockModel, testDataSource).strategy;
    expect(strategy.prefix).to.equal(DEFAULT_CACHE_PLUGIN_OPTIONS.prefix);
  });

  it('should use custom prefix and salt if provided', async () => {
    const prefix = 'testPrefix';
    const mixedClassCustom = CacheManager.CacheRepositoryMixin(
      MockDefaultCrudRepository,
      {
        cacheProvider: CacheStrategyTypes.Redis,
        prefix,
      },
    );
    const strategy = new mixedClassCustom(MockModel, testDataSource).strategy;
    expect(strategy.prefix).to.equal(prefix);
  });

  it('should always return data from db if forceUpdate is true for findById', async () => {
    searchStub = sinon
      .stub(cacheRepo.strategy, 'searchInCache')
      .resolves(mockData);

    await cacheRepo.findById('0', {}, {forceUpdate: true});
    expect(superFindCalled).to.be.true();
    expect(searchStub.notCalled).to.be.true();
  });

  it('should always return data from db if forceUpdate is true for find', async () => {
    searchStub = sinon
      .stub(cacheRepo.strategy, 'searchInCache')
      .resolves([mockData]);

    await cacheRepo.find({}, {forceUpdate: true});
    expect(superFindAllCalled).to.be.true();
    expect(searchStub.notCalled).to.be.true();
  });
});
