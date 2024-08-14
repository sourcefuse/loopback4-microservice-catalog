import {AnyObject} from '@loopback/repository';
import {givenHttpServerConfig, sinon} from '@loopback/testlab';
import * as dotenv from 'dotenv';
import {RedisStoreStrategy} from '../../services';
import {
  Test2WithMixinRepository,
  TestWithMixinRepository,
} from '../fixtures/repositories';
import {TestApp} from '../fixtures/test-app';
import {setupEnv} from '../helpers';
import {repoTestBuilder} from '../helpers/test-builder';

dotenv.config();
const DEFAULT_TIMEOUT = 5000;

describe('CachedRepository: Acceptance', () => {
  let app: TestApp;
  let repo: TestWithMixinRepository;
  let secondRepo: Test2WithMixinRepository;
  const mockData = [
    {id: 1, name: 'test-1'},
    {id: 2, name: 'test-2'},
    {id: 3, name: 'test-3'},
  ];
  let cacheStore: RedisStoreStrategy;
  let cacheStoreGetSpy: sinon.SinonSpy;
  let cacheStoreSetSpy: sinon.SinonSpy;
  let redisClient: AnyObject;
  let mochaContext: Mocha.Context;
  before(function () {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this, @typescript-eslint/no-this-alias
    mochaContext = this;
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.skip();
    }
  });
  beforeEach(async () => {
    setupEnv();
    const restConfig = givenHttpServerConfig();

    app = new TestApp({
      rest: restConfig,
    });
    await app.boot();
    await app.start();
    repo = app.getSync('repositories.TestWithMixinRepository');
    secondRepo = app.getSync('repositories.Test2WithMixinRepository');
    await seedData();
    cacheStore = app.getSync(`services.${RedisStoreStrategy.name}`);
    cacheStoreGetSpy = sinon.spy(cacheStore, 'get');
    cacheStoreSetSpy = sinon.spy(cacheStore, 'set');
    redisClient = cacheStore.datasource.connector?._client;
  });
  afterEach(async () => {
    await flushPromises();
    await cacheStore.executeCommand('FLUSHALL', []);
    cacheStoreGetSpy.resetHistory();
    cacheStoreSetSpy.resetHistory();
    await app.stop();
  });

  const waitFor = (ms: number) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };
  const flushPromises = () => {
    return new Promise<void>((resolve, reject) => {
      const waiter = async () => {
        while (redisClient.commandQueue.length > 0) {
          await waitFor(10);
        }
        resolve();
      };
      waiter().catch(reject);
    });
  };

  const tick = async (ms: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  };

  repoTestBuilder(flushPromises).forEach(testSuite => {
    describe(testSuite.title, () => {
      testSuite.tests.forEach(test => {
        it(test.title, async function () {
          if (test.timeout) {
            mochaContext.timeout(test.timeout);
          } else {
            mochaContext.timeout(DEFAULT_TIMEOUT);
          }
          await test.test(
            repo,
            mockData,
            cacheStoreGetSpy,
            cacheStoreSetSpy,
            secondRepo,
            tick,
          );
        });
      });
    });
  });

  async function seedData() {
    await secondRepo.createAll(mockData);
    await repo.createAll(mockData);
  }
});
