import {expect} from '@loopback/testlab';
import * as dotenv from 'dotenv';
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
  const redisDataSource = new RedisDataSource();
  const repositroy = new ProductRepository(
    new TestDataSource(),
    redisDataSource,
  );
  before(async function () {
    if (!redisHost || !redisPort) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.skip();
    }
    await repositroy.createAll(mockDataArray);
  });

  beforeEach(async () => {
    await executeRedisCommand('FLUSHALL');
  });

  it('should return data if not present in cache', async () => {
    const result1 = await repositroy.find();
    expect(result1).to.match(mockDataArray);
    const result2 = await repositroy.findById(mockDataArray[0].id);
    expect(result2).to.match(mockDataArray[0]);
  });

  it('should return data if present in cache', async () => {
    //extra call to store data in cache
    await repositroy.find();
    const result1 = await repositroy.find();
    expect(result1).to.match(mockDataArray);
    const result2 = await repositroy.findById(mockDataArray[0].id);
    expect(result2).to.match(mockDataArray[0]);
  });

  it('should delete from cache after ttl expires', async () => {
    //extra call to store data in cache
    await repositroy.find();

    await new Promise(resolve => setTimeout(resolve, 5000));

    const result = await executeRedisCommand('GET', [repositroy.getKey()]);
    expect(result).to.be.undefined();
  });

  it('should save data in cache on calling find and findById', async () => {
    //extra call to store data in cache
    await repositroy.find();
    const result1 = await executeRedisCommand('GET', [repositroy.getKey()]);
    expect(JSON.parse(decoder.decode(result1 as Buffer))).to.match(
      mockDataArray,
    );

    await repositroy.findById(mockDataArray[0].id);
    const result2 = await executeRedisCommand('GET', [repositroy.getKey(1)]);
    expect(JSON.parse(decoder.decode(result2 as Buffer))).to.match(
      mockDataArray[0],
    );
  });

  it('should delete all entries from cache', async () => {
    //extra call to store data in cache
    await repositroy.find();
    await repositroy.findById(mockDataArray[0].id);
    const calls = 2;

    const numberOfEntries = await repositroy.clearCache();
    expect(numberOfEntries).to.be.equal(calls);
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
