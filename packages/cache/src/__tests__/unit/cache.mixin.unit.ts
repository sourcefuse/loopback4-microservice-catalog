import {expect, sinon} from '@loopback/testlab';
import {CacheRespositoryMixin} from '../..';
import {mockData, mockKey} from './fixtures/data';
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
  const mixedClass = CacheRespositoryMixin(MockDefaultCrudRepository, {
    prefix: 'testPrefix',
  });
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

  it('should search and return data if present in cache', async () => {
    redisExecuteStub = sinon
      .stub(cacheRepo, 'executeRedisCommand')
      .resolves(Buffer.from(JSON.stringify(mockData)));

    const result = await cacheRepo.searchInCache(mockKey);
    expect(mockData).to.match(result);
    expect(redisExecuteStub.calledOnce).to.be.true();
    expect(redisExecuteStub.calledWith('GET', [mockKey])).to.be.true();
  });

  it('should save data in cache', async () => {
    redisExecuteStub = sinon
      .stub(cacheRepo, 'executeRedisCommand')
      .resolves(Buffer.from(JSON.stringify('OK')));

    await cacheRepo.saveInCache(mockKey, mockData);
    expect(redisExecuteStub.calledOnce).to.be.true();
    expect(
      redisExecuteStub.calledWith('SET', [
        mockKey,
        JSON.stringify(mockData),
        'PX',
        60000,
      ]),
    ).to.be.true();
  });

  it('findById should return data from cahce if present', async () => {
    searchStub = sinon.stub(cacheRepo, 'searchInCache').resolves(mockData);
    const result = await cacheRepo.findById('0');
    expect(result).to.eql(mockData);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindCalled).to.be.false();
  });

  it('findById should return data from db if not present in cache', async () => {
    searchStub = sinon.stub(cacheRepo, 'searchInCache').resolves(undefined);

    const result = await cacheRepo.findById('0');
    expect(result).to.eql(mockData);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindCalled).to.be.true();
  });

  it('find should return data from cahce if present', async () => {
    searchStub = sinon.stub(cacheRepo, 'searchInCache').resolves([mockData]);
    const result = await cacheRepo.find();
    expect(result).to.eql([mockData]);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindAllCalled).to.be.false();
  });

  it('find should return data from db if not present in cache', async () => {
    searchStub = sinon.stub(cacheRepo, 'searchInCache').resolves(undefined);

    const result = await cacheRepo.find();
    expect(result).to.eql([mockData]);
    expect(searchStub.calledOnce).to.be.true();
    expect(superFindAllCalled).to.be.true();
  });

  it('should throw error if unable to save in cache due to any reason', async () => {
    redisExecuteStub = sinon.stub(cacheRepo, 'executeRedisCommand').throws();
    let errorThrown = false;
    try {
      await cacheRepo.saveInCache(mockKey, mockData);
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true();
    expect(redisExecuteStub.calledOnce).to.be.true();
  });

  it('should throw error if unable to search in cache due to any reason', async () => {
    let errorThrown = false;
    redisExecuteStub = sinon.stub(cacheRepo, 'executeRedisCommand').rejects();
    try {
      await cacheRepo.searchInCache(mockKey);
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true();
    expect(redisExecuteStub.calledOnce).to.be.true();
  });

  it('should throw error if unable to clear cache due to any reason', async () => {
    let errorThrown = false;
    redisExecuteStub = sinon.stub(cacheRepo, 'executeRedisCommand').rejects();
    try {
      await cacheRepo.clearCache();
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true();
    expect(redisExecuteStub.calledOnce).to.be.true();
  });

  it('should clear cache', async () => {
    const cacheEntries = 5;
    redisExecuteStub = sinon
      .stub(cacheRepo, 'executeRedisCommand')
      .resolves(cacheEntries);
    const result = await cacheRepo.clearCache();
    expect(result).to.equal(cacheEntries);
    expect(redisExecuteStub.calledOnce).to.be.true();
    expect(redisExecuteStub.getCall(0).args[0]).to.equal('EVAL');
  });
});
