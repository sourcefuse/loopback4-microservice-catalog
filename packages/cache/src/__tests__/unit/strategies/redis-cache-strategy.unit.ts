// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {RedisCacheStrategy} from '../../../strategies';
import {ICacheMixinOptions} from '../../../types';
import {mockData, mockKey} from '../fixtures/data';
import {resetCalls} from '../fixtures/default-crud.repository';
import {TestRedisDataSource} from '../fixtures/redis.datasource';

describe('Unit Test Cases for Redis Strategy', () => {
  const redisStrategy = new RedisCacheStrategy({
    prefix: 'testPrefix',
  });
  const redisDataSourceStub = sinon.createStubInstance(TestRedisDataSource);
  redisStrategy.getCacheDataSource = sinon.stub().resolves(redisDataSourceStub);
  let redisExecuteStub: sinon.SinonStub;
  let searchStub: sinon.SinonStub;
  const mixinOpts: ICacheMixinOptions = {
    ttl: 60000,
  };

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
      .stub(redisStrategy, 'executeRedisCommand')
      .resolves(Buffer.from(JSON.stringify(mockData)));

    const result = await redisStrategy.searchInCache(mockKey, mixinOpts);
    expect(mockData).to.match(result);
    expect(redisExecuteStub.calledOnce).to.be.true();
    expect(redisExecuteStub.calledWith('GET', [mockKey])).to.be.true();
  });

  it('should save data in cache', async () => {
    redisExecuteStub = sinon
      .stub(redisStrategy, 'executeRedisCommand')
      .resolves(Buffer.from(JSON.stringify('OK')));

    await redisStrategy.saveInCache(mockKey, mockData, mixinOpts);
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

  it('should throw error if unable to save in cache due to any reason', async () => {
    redisExecuteStub = sinon
      .stub(redisStrategy, 'executeRedisCommand')
      .throws();
    let errorThrown = false;
    try {
      await redisStrategy.saveInCache(mockKey, mockData, mixinOpts);
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true();
    expect(redisExecuteStub.calledOnce).to.be.true();
  });

  it('should throw error if unable to search in cache due to any reason', async () => {
    let errorThrown = false;
    redisExecuteStub = sinon
      .stub(redisStrategy, 'executeRedisCommand')
      .rejects();
    try {
      await redisStrategy.searchInCache(mockKey, mixinOpts);
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true();
    expect(redisExecuteStub.calledOnce).to.be.true();
  });

  it('should throw error if unable to clear cache due to any reason', async () => {
    let errorThrown = false;
    redisExecuteStub = sinon
      .stub(redisStrategy, 'executeRedisCommand')
      .rejects();
    try {
      await redisStrategy.clearCache(mixinOpts);
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true();
    expect(redisExecuteStub.calledOnce).to.be.true();
  });

  it('should clear cache', async () => {
    const cacheEntries = 5;
    redisExecuteStub = sinon
      .stub(redisStrategy, 'executeRedisCommand')
      .resolves(cacheEntries);
    await redisStrategy.clearCache(mixinOpts);
    expect(redisExecuteStub.calledOnce).to.be.true();
    expect(redisExecuteStub.getCall(0).args[0]).to.equal('EVAL');
  });
});
