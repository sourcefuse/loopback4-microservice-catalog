import {DataObject, DefaultCrudRepository} from '@loopback/repository';
import {expect} from '@loopback/testlab';
import {Test} from '../fixtures/models';

type TickPromise = (time: number) => Promise<void>;
type TestCase = {
  title: string;
  test: (
    repo: DefaultCrudRepository<Test, number, {}>,
    mockData: DataObject<Test>[],
    cacheStoreGetSpy: sinon.SinonSpy,
    cacheStoreSetSpy: sinon.SinonSpy,
    secondRepo?: DefaultCrudRepository<Test, number, {}>,
    tick?: TickPromise,
  ) => Promise<void>;
};

type TestSuite = {
  title: string;
  tests: TestCase[];
};

export function repoTestBuilder(
  flushPromises: () => Promise<void>,
): TestSuite[] {
  return [
    {
      title: 'find',
      tests: [
        {
          title: 'should find all records from repo for first call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const result = await repo.find();
            expect(result).to.match(mockData);
            await flushPromises();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // one call for value and one for insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title: 'should find all records from cache for second call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.find();
            expect(result).to.be.match(mockData);
            await flushPromises();
            result = await repo.find();
            expect(result).to.be.match(mockData);
            expect(cacheStoreGetSpy.callCount).to.equal(1);
            // one call for value and one for insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should find all records from cache if the second call is after invalidation',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.find();
            expect(result).to.be.match(mockData);
            await flushPromises();
            expect(cacheStoreSetSpy.callCount).to.equal(2);
            await repo.updateAll({});
            await flushPromises();
            result = await repo.find();
            await flushPromises();
            expect(result).to.be.match(mockData);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // two calls each for value and insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title:
            'should find all records from cache if the second call is made with forceUpdate',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.find();
            expect(result).to.be.match(mockData);
            await flushPromises();
            result = await repo.find(undefined, {
              forceUpdate: true,
            });
            expect(result).to.be.match(mockData);
            await flushPromises();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // two calls each for value and insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title: 'should find all records from repo with filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const result = await repo.find({where: {id: 1}});
            expect(result).to.match([mockData[0]]);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            await flushPromises();
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should find all records from cache with filter on second call with same filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.find({where: {id: 1}});
            expect(result).to.be.match([mockData[0]]);
            await flushPromises();
            await repo.updateAll({});
            await flushPromises();
            result = await repo.find({where: {id: 1}});
            await flushPromises();
            expect(result).to.be.match([mockData[0]]);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // two calls each for value and insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title: 'should find all records from repo after cache expiry',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
            secondRepo: DefaultCrudRepository<Test, number, {}> | undefined,
            tick?: TickPromise,
          ) {
            let result = await repo.find();
            await flushPromises();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(result).to.be.match(mockData);
            await flushPromises();
            // ttl is 1s for tests
            await tick?.(1001);
            result = await repo.find();
            await flushPromises();
            expect(result).to.be.match(mockData);
            // it should be zero as the data is expired and the code exits from check
            // instead of reaching the cache get call
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // one call for value and one for insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'findById',
      tests: [
        {
          title: 'should find record from repo for first call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const result = await repo.findById(1);
            expect(result).to.match(mockData[0]);
            await flushPromises();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // two calls each for value and insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title: 'should find a record by id from cache for second call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.findById(1);
            expect(result).to.be.match(mockData[0]);
            await flushPromises();
            result = await repo.findById(1);
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            expect(cacheStoreGetSpy.callCount).to.equal(1);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should find a record by id from repo if the second call is after invalidation',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.findById(1);
            expect(result).to.be.match(mockData[0]);
            await flushPromises();
            await repo.updateAll({});
            await flushPromises();
            result = await repo.findById(1);
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'findOne',
      tests: [
        {
          title: 'should find the record from repo for first call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const result = await repo.findOne();
            expect(result).to.match(mockData[0]);
            await flushPromises();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // one call for value and one for insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title: 'should find the record from cache for second call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.findOne();
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            result = await repo.findOne();
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            expect(cacheStoreGetSpy.callCount).to.equal(1);
            // one call for value and one for insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should find the record from cache if the second call is after invalidation',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.findOne();
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            await repo.updateAll({});
            await flushPromises();
            result = await repo.findOne();
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // two calls each for value and insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title:
            'should find the record from cache if the second call is made with forceUpdate',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.findOne();
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            result = await repo.findOne(undefined, {
              forceUpdate: true,
            });
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // two calls each for value and insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title: 'should find the record from repo with filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const result = await repo.findOne({where: {id: 1}});
            expect(result).to.match(mockData[0]);
            await flushPromises();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should find the records from cache with filter on second call with same filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.findOne({where: {id: 1}});
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            await repo.updateAll({});
            await flushPromises();
            result = await repo.findOne({where: {id: 1}});
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // two calls each for value and insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title: 'should find the record from repo after cache expiry',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
            secondRepo: DefaultCrudRepository<Test, number, {}> | undefined,
            tick?: TickPromise,
          ) {
            let result = await repo.findOne();
            await flushPromises();
            // ttl is 1s for tests
            await tick?.(1001);
            expect(result).to.be.match(mockData[0]);
            result = await repo.findOne();
            await flushPromises();
            expect(result).to.be.match(mockData[0]);
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            // one call for value and one for insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'count',
      tests: [
        {
          title: 'should give count from repo for first call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.count();
            await flushPromises();
            expect(result).to.be.match({count: mockData.length});
            result = await repo.count();
            await flushPromises();
            expect(result).to.be.match({count: mockData.length});
            expect(cacheStoreGetSpy.callCount).to.equal(1);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title: 'should give count from cache for second call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.count();
            await flushPromises();
            expect(result).to.be.match({count: mockData.length});
            result = await repo.count();
            await flushPromises();
            expect(result).to.be.match({count: mockData.length});
            expect(cacheStoreGetSpy.callCount).to.equal(1);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should give count from repo if the second call is after invalidation',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.count();
            await flushPromises();
            expect(result).to.be.match({count: mockData.length});
            await repo.updateAll({});
            await flushPromises();
            result = await repo.count();
            await flushPromises();
            expect(result).to.be.match({count: mockData.length});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title: 'should count all records from repo with filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const result = await repo.count({id: 1});
            await flushPromises();
            expect(result).to.match({count: 1});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should count all records from cache with filter on second call with same filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.count({id: 1});
            await flushPromises();
            expect(result).to.be.match({count: 1});
            await repo.updateAll({});
            await flushPromises();
            result = await repo.count({id: 1});
            await flushPromises();
            expect(result).to.be.match({count: 1});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'exists',
      tests: [
        {
          title: 'should give exists from repo for first call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            expect(cacheStoreGetSpy.callCount).to.equal(1);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title: 'should give exists from cache for second call',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            expect(cacheStoreGetSpy.callCount).to.equal(1);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should give exists from repo if the second call is after invalidation',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            await repo.updateAll({});
            await flushPromises();
            result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title: 'should give exists from repo with filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(2);
          },
        },
        {
          title:
            'should give exists from cache with filter on second call with same filter',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            await repo.updateAll({});
            await flushPromises();
            result = await repo.exists(1);
            await flushPromises();
            expect(result).to.be.true();
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'create',
      tests: [
        {
          title: 'should invalidate cache after create',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length});
            await repo.create({id: 10, name: 'test'});
            await flushPromises();
            count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length + 1});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'save',
      tests: [
        {
          title: 'should invalidate cache after save',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const existing = await repo.findById(1);
            await flushPromises();
            expect(existing).to.match(mockData[0]);
            await repo.save(new Test({id: 1, name: 'test-new'}));
            await flushPromises();
            const updated = await repo.findById(1);
            await flushPromises();
            expect(updated).to.match({id: 1, name: 'test-new'});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'createAll',
      tests: [
        {
          title: 'should invalidate cache after createAll',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length});
            await repo.createAll([{id: 10, name: 'test'}]);
            await flushPromises();
            count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length + 1});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'updateById',
      tests: [
        {
          title: 'should invalidate cache after updateById',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const existing = await repo.findById(1);
            await flushPromises();
            expect(existing).to.match(mockData[0]);
            await repo.updateById(1, {name: 'test-new'});
            await flushPromises();
            const updated = await repo.findById(1);
            await flushPromises();
            expect(updated).to.match({id: 1, name: 'test-new'});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
        {
          title:
            'should invalidate cache after updateById, and subsequent get with different argument should not effect this invalidation',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
            secondRepo?: DefaultCrudRepository<Test, number, {}>,
          ) {
            const existing1 = await repo.findById(1);
            await flushPromises();
            expect(existing1).to.match(mockData[0]);
            const existing2 = await repo.findById(2);
            await flushPromises();
            expect(existing2).to.match(mockData[1]);
            await repo.updateById(1, {name: 'test-new-1'});
            await flushPromises();
            await repo.updateById(2, {name: 'test-new-2'});
            await flushPromises();
            const updatedLast = await repo.findById(2);
            await flushPromises();
            const updatedFirst = await repo.findById(1);
            await flushPromises();
            expect(updatedLast).to.match({id: 2, name: 'test-new-2'});
            expect(updatedFirst).to.match({id: 1, name: 'test-new-1'});
          },
        },
        {
          title: 'should invalidate cache across repositories',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
            secondRepo?: DefaultCrudRepository<Test, number, {}>,
          ) {
            let result = await repo.find();
            await flushPromises();
            expect(result).to.match(mockData);
            // one call for value and one for insertion time
            expect(cacheStoreSetSpy.callCount).to.equal(2);
            // call invalidating method of second repo
            await secondRepo?.updateById(1, {
              name: 'test-new',
            });
            await flushPromises();
            result = await repo.find();
            await flushPromises();
            expect(result).to.match(mockData);
            // there should be two new calls due to invalidation
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'replaceById',
      tests: [
        {
          title: 'should invalidate cache after replaceById',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const existing = await repo.findById(1);
            await flushPromises();
            expect(existing).to.match(mockData[0]);
            await repo.replaceById(1, {name: 'test-new'});
            await flushPromises();
            const updated = await repo.findById(1);
            await flushPromises();
            expect(updated).to.match({id: 1, name: 'test-new'});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'update',
      tests: [
        {
          title: 'should invalidate cache after update',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const existing = await repo.findById(1);
            await flushPromises();
            expect(existing).to.match(mockData[0]);
            await repo.update(new Test({id: 1, name: 'test-new'}));
            await flushPromises();
            const updated = await repo.findById(1);
            await flushPromises();
            expect(updated).to.match({id: 1, name: 'test-new'});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'updateAll',
      tests: [
        {
          title: 'should invalidate cache after updateAll',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const existing = await repo.findById(1);
            await flushPromises();
            expect(existing).to.match(mockData[0]);
            await repo.updateAll({name: 'test-new'}, {id: 1});
            await flushPromises();
            const updated = await repo.findById(1);
            await flushPromises();
            expect(updated).to.match({id: 1, name: 'test-new'});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'delete',
      tests: [
        {
          title: 'should invalidate cache after delete',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            const existing = await repo.findById(1);
            await flushPromises();
            await repo.delete(existing);
            await flushPromises();
            const count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length - 1});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'deleteAll',
      tests: [
        {
          title: 'should invalidate cache after deleteAll',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length});
            await repo.deleteAll({id: 1});
            await flushPromises();
            count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length - 1});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
    {
      title: 'deleteById',
      tests: [
        {
          title: 'should invalidate cache after deleteById',
          async test(
            repo: DefaultCrudRepository<Test, number, {}>,
            mockData: DataObject<Test>[],
            cacheStoreGetSpy: sinon.SinonSpy,
            cacheStoreSetSpy: sinon.SinonSpy,
          ) {
            let count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length});
            await repo.deleteById(1);
            await flushPromises();
            count = await repo.count();
            await flushPromises();
            expect(count).to.match({count: mockData.length - 1});
            expect(cacheStoreGetSpy.callCount).to.equal(0);
            expect(cacheStoreSetSpy.callCount).to.equal(4);
          },
        },
      ],
    },
  ];
}
