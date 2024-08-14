import {givenHttpServerConfig, sinon} from '@loopback/testlab';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {randomBytes} from 'crypto';
import * as dotenv from 'dotenv';
import {AUTH_USER_KEY} from '../../keys';
import {InMemoryStoreStrategy} from '../../services';
import {
  Test2WithMixinRepository,
  TestWithMixinRepository,
} from '../fixtures/repositories';
import {TestApp} from '../fixtures/test-app';
import {flushPromises, setupEnv} from '../helpers';
import {repoTestBuilder} from '../helpers/test-builder';

dotenv.config();

describe('CachedRepository: Integration', () => {
  let app: TestApp;
  let repo: TestWithMixinRepository;
  let secondRepo: Test2WithMixinRepository;
  const mockData = [
    {id: 1, name: 'test-1'},
    {id: 2, name: 'test-2'},
    {id: 3, name: 'test-3'},
  ];
  let cacheStore: InMemoryStoreStrategy;
  let cacheStoreGetSpy: sinon.SinonSpy;
  let cacheStoreSetSpy: sinon.SinonSpy;
  let clock: sinon.SinonFakeTimers | undefined = undefined;
  let mochaContext: Mocha.Context;

  before(function () {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this, @typescript-eslint/no-this-alias
    mochaContext = this;
  });

  beforeEach(async () => {
    setupEnv();
    clock = sinon.useFakeTimers({
      now: Date.now(),
      shouldAdvanceTime: true,
    });
    const restConfig = givenHttpServerConfig();

    app = new TestApp({
      rest: restConfig,
      redisDisabled: true,
    });
    await app.boot();
    await app.start();
    app.bind(AUTH_USER_KEY).to({
      tenantId: randomBytes(32).toString('utf-8'),
      username: 'test',
    } as unknown as IAuthUserWithPermissions);
    repo = app.getSync('repositories.TestWithMixinRepository');
    secondRepo = app.getSync('repositories.Test2WithMixinRepository');
    await seedData();
    await flushPromises();
    cacheStore = app.getSync(`services.${InMemoryStoreStrategy.name}`);
    cacheStoreGetSpy = sinon.spy(cacheStore, 'get');
    cacheStoreSetSpy = sinon.spy(cacheStore, 'set');
  });
  afterEach(async () => {
    clock?.restore();
    await flushPromises();
    cacheStoreGetSpy.resetHistory();
    cacheStoreSetSpy.resetHistory();
    await app.stop();
  });

  repoTestBuilder(flushPromises).forEach(testSuite => {
    describe(testSuite.title, () => {
      testSuite.tests.forEach(test => {
        it(test.title, async function () {
          if (test.timeout) {
            mochaContext.timeout(test.timeout);
          }
          await test.test(
            repo,
            mockData,
            cacheStoreGetSpy,
            cacheStoreSetSpy,
            secondRepo,
            async (time: number) => {
              clock?.tick(time);
            },
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
