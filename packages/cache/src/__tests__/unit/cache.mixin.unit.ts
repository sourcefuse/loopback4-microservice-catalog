import {expect, sinon} from '@loopback/testlab';
import {CacheManager} from '../../mixins/cache.mixin';
import {CacheStrategyTypes} from '../../strategy-types.enum';
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
      salt: '$2b$10$Pdp69XWPJjQ8iFcum6GHEe',
    },
  );
  const cacheRepo = new mixedClass(MockModel, new TestDataSource());
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
});
