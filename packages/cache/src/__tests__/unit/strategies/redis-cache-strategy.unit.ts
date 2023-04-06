// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {RedisCacheStrategy} from '../../../strategies';
import {CacheStrategyTypes} from '../../../strategy-types.enum';
import {mockData, mockKey} from '../fixtures/data';
import {resetCalls} from '../fixtures/default-crud.repository';
import {TestRedisDataSource} from '../fixtures/redis.datasource';

describe('Unit Test Cases for Redis Strategy', () => {
  const redisStrategy = new RedisCacheStrategy({
    cacheProvider: CacheStrategyTypes.Redis,
    prefix: 'testPrefix',
    ttl: 60000,
  });
  const redisDataSourceStub = sinon.createStubInstance(TestRedisDataSource);
  redisStrategy.getCacheDataSource = sinon.stub().resolves(redisDataSourceStub);
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
      .stub(redisStrategy, 'executeRedisCommand')
      .callsFake(async (command: string, args: (string | number)[]) => {
        if (command === 'GET' && args[0] === 'testPrefix_DELETION_TIME') {
          return undefined;
        } else {
          return Buffer.from(
            JSON.stringify({payload: mockData, insertionTime: Date.now()}),
          );
        }
      });

    const result = await redisStrategy.searchInCache(mockKey);
    expect(mockData).to.match(result);
    expect(redisExecuteStub.calledTwice).to.be.true();
    expect(redisExecuteStub.calledWith('GET', [mockKey])).to.be.true();
    expect(
      redisExecuteStub.calledWith('GET', ['testPrefix_DELETION_TIME']),
    ).to.be.true();
  });

  it('should save data in cache', async () => {
    redisExecuteStub = sinon
      .stub(redisStrategy, 'executeRedisCommand')
      .resolves(Buffer.from(JSON.stringify('OK')));

    await redisStrategy.saveInCache(mockKey, mockData);
    sinon.assert.calledOnce(redisExecuteStub);
    expect(redisExecuteStub.getCalls()[0].args[0]).equal('SET');

    const args = redisExecuteStub.getCalls()[0].args[1];
    expect(args[0]).to.equal(mockKey);
    expect(args[2]).to.equal('PX');
    expect(args[3]).to.equal(60000);

    const value = JSON.parse(args[1]);
    expect(value.payload).to.containDeep(mockData);
    sinon.assert.match(value.insertionTime, sinon.match.number);
  });

  it('should throw error if unable to save in cache due to any reason', async () => {
    redisExecuteStub = sinon
      .stub(redisStrategy, 'executeRedisCommand')
      .throws();
    let errorThrown = false;
    try {
      await redisStrategy.saveInCache(mockKey, mockData);
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
      await redisStrategy.searchInCache(mockKey);
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
      await redisStrategy.clearCache();
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
    await redisStrategy.clearCache();
    expect(redisExecuteStub.calledOnce).to.be.true();

    sinon.assert.calledOnceWithMatch(redisExecuteStub, 'SET', [
      'testPrefix_DELETION_TIME',
      sinon.match.number,
    ]);
  });
});
