// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import * as dotenv from 'dotenv';
import sinon from 'sinon';
import {TextDecoder} from 'util';
import {mockDataArray} from './fixtures/data';
import {ProductErrorRepository} from './fixtures/product-error.repository';
import {ProductRepository} from './fixtures/product.repository';
import {RedisDataSource} from './fixtures/redis.datasource';
import {TestDataSource} from './fixtures/test.datasource';

dotenv.config();
const decoder = new TextDecoder('utf-8');

const redisPort = process.env.REDIS_PORT;
const redisHost = process.env.REDIS_HOST;

describe('Acceptance Test Cases for Cache Mixin', function () {
  let redisDataSource: RedisDataSource;
  let getRedisDataSource;
  let repository: ProductRepository;
  before(async function () {
    if (!redisHost || !redisPort) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.skip();
    }
    redisDataSource = new RedisDataSource();
    getRedisDataSource = sinon.stub().resolves(redisDataSource);
    repository = new ProductRepository(
      new TestDataSource(),
      getRedisDataSource,
    );
    await repository.createAll(mockDataArray);
  });

  beforeEach(async () => {
    await executeRedisCommand('FLUSHALL');
  });

  it('should return data if not present in cache', async () => {
    const result1 = await repository.find();
    expect(result1).to.match(mockDataArray);
    const result2 = await repository.findById(mockDataArray[0].id);
    expect(result2).to.match(mockDataArray[0]);
  });

  it('should return data if present in cache', async () => {
    //extra call to store data in cache
    await repository.find();
    const result1 = await repository.find();
    expect(result1).to.match(mockDataArray);
    const result2 = await repository.findById(mockDataArray[0].id);
    expect(result2).to.match(mockDataArray[0]);
  });

  it('should delete from cache after ttl expires', async () => {
    //extra call to store data in cache
    await repository.find();

    await new Promise(resolve => setTimeout(resolve, 5000));

    const result = await executeRedisCommand('GET', [
      await repository.generateKey(),
    ]);
    expect(result).to.be.undefined();
  });

  it('should save data in cache on calling find and findById', async () => {
    //extra call to store data in cache
    await repository.find();
    const result1 = await executeRedisCommand('GET', [
      await repository.generateKey(),
    ]);
    expect(JSON.parse(decoder.decode(result1 as Buffer))).to.match(
      mockDataArray,
    );

    await repository.findById(mockDataArray[0].id);
    const result2 = await executeRedisCommand('GET', [
      await repository.generateKey(1),
    ]);
    expect(JSON.parse(decoder.decode(result2 as Buffer))).to.match(
      mockDataArray[0],
    );
  });

  it('should always update cache if forceUpdate is true for find', async () => {
    //extra call to store data in cache
    await repository.find({});

    //update data in db now
    const mockDataArrayCopy = mockDataArray;
    mockDataArrayCopy[0].name = 'product_Update';
    await repository.updateAll({name: 'product_Update'}, {name: 'product_X'});

    // now check if data is coming from db and updated in cache as well
    const res = await repository.find({}, {forceUpdate: true});
    expect(res).to.match(mockDataArrayCopy);

    const resCache = await executeRedisCommand('GET', [
      await repository.generateKey(undefined, {}),
    ]);

    expect(JSON.parse(decoder.decode(resCache as Buffer))).to.match(
      mockDataArrayCopy,
    );

    //restore db to previous state
    await repository.updateAll({name: 'product_X'}, {name: 'product_Update'});
  });

  it('should always update cache if forceUpdate is true for findById', async () => {
    //extra call to store data in cache
    await repository.findById(1, {});

    //update data in db now
    const mockDataCopy = mockDataArray[0];
    mockDataCopy.name = 'product_Update';
    await repository.updateAll({name: 'product_Update'}, {name: 'product_X'});

    // now check if data is coming from db and updated in cache as well
    const res = await repository.findById(1, {}, {forceUpdate: true});
    expect(res).to.match(mockDataCopy);

    const resCache = await executeRedisCommand('GET', [
      await repository.generateKey(1, {}),
    ]);

    expect(JSON.parse(decoder.decode(resCache as Buffer))).to.match(
      mockDataCopy,
    );

    //restore db to previous state
    await repository.updateAll({name: 'product_X'}, {name: 'product_Update'});
  });

  it('should delete all entries from cache', async () => {
    //extra call to store data in cache
    await repository.find();
    await repository.findById(mockDataArray[0].id);

    await repository.clearCache();
    const result = await executeRedisCommand('KEYS', ['product*']);
    expect(result).to.be.empty();
  });

  it('should throw error if no cache data source is provided', async () => {
    const errorRepo = new ProductErrorRepository(new TestDataSource());
    let errorThrown = false;
    try {
      await errorRepo.find();
    } catch {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true();
  });

  function executeRedisCommand(
    command: string,
    args: (string | number)[] = [],
  ): Promise<Buffer | number | undefined> {
    return new Promise((resolve, reject) => {
      if (redisDataSource.connector?.execute) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        redisDataSource.connector.execute(
          command,
          args,
          (err: Error, res: Buffer | number) => {
            if (err) {
              reject(err);
            }
            if (res) {
              resolve(res);
            } else {
              return resolve(undefined);
            }
          },
        );
      }
    });
  }
});
