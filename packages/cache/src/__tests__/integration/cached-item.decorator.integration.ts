import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
  sinon,
} from '@loopback/testlab';
import {TestWithoutCachingRepository} from '../fixtures/repositories';
import {TestApp} from '../fixtures/test-app';
import {InMemoryStoreStrategy} from '../../services';
import * as dotenv from 'dotenv';
import {setupEnv} from '../helpers';

dotenv.config();

describe('Caching Decorators: Integration', () => {
  let app: TestApp;
  let repo: TestWithoutCachingRepository;
  const mockData = [
    {id: 1, name: 'test-1'},
    {id: 2, name: 'test-2'},
    {id: 3, name: 'test-3'},
  ];
  let cacheStore: InMemoryStoreStrategy;
  let cacheStoreGetSpy: sinon.SinonSpy;
  let cacheStoreSetSpy: sinon.SinonSpy;
  let findSpy: sinon.SinonSpy;
  let client: Client;
  beforeEach(async () => {
    setupEnv();
    const restConfig = givenHttpServerConfig();

    app = new TestApp({
      rest: restConfig,
      redisDisabled: true,
    });
    await app.boot();
    await app.start();
    client = createRestAppClient(app);

    cacheStore = app.getSync(`services.${InMemoryStoreStrategy.name}`);
    repo = app.getSync<TestWithoutCachingRepository>(
      'repositories.TestWithoutCachingRepository',
    );
    await seedData();
    findSpy = sinon.spy(repo, 'find');
    cacheStoreGetSpy = sinon.spy(cacheStore, 'get');
    cacheStoreSetSpy = sinon.spy(cacheStore, 'set');
  });
  afterEach(async () => {
    await flushPromises();
    cacheStoreGetSpy.resetHistory();
    cacheStoreSetSpy.resetHistory();
    await app.stop();
  });
  it('should cache result of a method decorated with @cachedItem', async () => {
    const {body} = await client.get('/tests').expect(200);
    expect(body).to.eql(mockData);
    expect(findSpy.calledOnce).to.be.true();
    expect(cacheStoreGetSpy.callCount).to.equal(0);
    expect(cacheStoreSetSpy.callCount).to.equal(2);
  });
  it('should give cached result of a method decorated with @cachedItem on multiple calls', async () => {
    const {body} = await client.get('/tests').expect(200);
    expect(body).to.eql(mockData);
    expect(findSpy.calledOnce).to.be.true();
    expect(cacheStoreGetSpy.callCount).to.equal(0);
    expect(cacheStoreSetSpy.callCount).to.equal(2);
    findSpy.resetHistory();
    cacheStoreGetSpy.resetHistory();
    cacheStoreSetSpy.resetHistory();
    const {body: body2} = await client.get('/tests').expect(200);
    expect(body2).to.eql(mockData);
    expect(findSpy.called).to.be.false();
    expect(cacheStoreGetSpy.callCount).to.equal(1);
    expect(cacheStoreSetSpy.callCount).to.equal(0);
  });
  it('should give fresh result after a method decorated with @cacheInvalidator', async () => {
    const {body} = await client.get('/tests').expect(200);
    expect(body).to.eql(mockData);
    expect(findSpy.calledOnce).to.be.true();
    expect(cacheStoreGetSpy.callCount).to.equal(0);
    expect(cacheStoreSetSpy.callCount).to.equal(2);
    findSpy.resetHistory();
    cacheStoreGetSpy.resetHistory();
    cacheStoreSetSpy.resetHistory();
    await client.patch('/tests/1').send({name: 'testName'}).expect(204);
    const {body: body2} = await client.get('/tests').expect(200);
    expect(body2).to.eql([
      {
        ...mockData[0],
        name: 'testName',
      },
      mockData[1],
      mockData[2],
    ]);

    expect(findSpy.called).to.be.true();
    expect(cacheStoreGetSpy.callCount).to.equal(0);
    expect(cacheStoreSetSpy.callCount).to.equal(2);
  });
  function seedData() {
    return repo.createAll(mockData);
  }

  const flushPromises = () => new Promise(resolve => setImmediate(resolve));
});
