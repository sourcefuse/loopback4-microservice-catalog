import {
  DefaultCrudRepository,
  FilterExcludingWhere,
  juggler,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {fail} from 'assert';
import {TenantUtilitiesErrorKeys} from '../../../components/tenant-utilities/error-keys';
import {TenantGuardMixin} from '../../../components/tenant-utilities/mixins';
import {TenantGuardService} from '../../../components/tenant-utilities/services';
import {ITenantGuard} from '../../../components/tenant-utilities/types';
import {
  mockSuperAdmin,
  mockUser1,
  mockUser2,
  mockUserWithoutTenantId,
} from '../../const';
import {TestModel} from '../../fixtures/tenant-utilities/test.model';
import {TestRepo} from '../../fixtures/tenant-utilities/test.repository';
const NOT_FOUND_CODE = 'ENTITY_NOT_FOUND';
describe('TenantGuardMixin', () => {
  let ds: juggler.DataSource;
  let tenantGuard1: ITenantGuard<TestModel, string>;
  let tenantGuard2: ITenantGuard<TestModel, string>;
  let tenantGuardWithoutTenant: ITenantGuard<TestModel, string>;
  let tenantGuardForSuperAdmin: ITenantGuard<TestModel, string>;
  let repo1: TestRepo;
  let repo2: TestRepo;
  let superAdminRepo: TestRepo;
  let repoWithoutTenant: TestRepo;
  let rawRepo: DefaultCrudRepository<TestModel, string>;
  beforeEach(async () => {
    await init();
  });
  it('should work with default crud repository', async () => {
    class TestDefaultRepo extends TenantGuardMixin(
      DefaultCrudRepository<TestModel, string, {}>,
    ) {
      tenantGuardService: ITenantGuard<TestModel, string>;
    }

    const instance = new TestDefaultRepo(TestModel, ds);
    expect(instance).to.have.property('create');
    expect(instance).to.have.property('createAll');
    expect(instance).to.have.property('save');
    expect(instance).to.have.property('update');
    expect(instance).to.have.property('updateAll');
    expect(instance).to.have.property('updateById');
    expect(instance).to.have.property('replaceById');
    expect(instance).to.have.property('delete');
    expect(instance).to.have.property('deleteAll');
  });
  it('should work with default transactional crud repository', async () => {
    const instance = new TestRepo(ds, tenantGuard1);
    expect(instance).to.have.property('create');
    expect(instance).to.have.property('createAll');
    expect(instance).to.have.property('save');
    expect(instance).to.have.property('update');
    expect(instance).to.have.property('updateAll');
    expect(instance).to.have.property('updateById');
    expect(instance).to.have.property('replaceById');
    expect(instance).to.have.property('delete');
    expect(instance).to.have.property('deleteAll');
    expect(instance).to.have.property('beginTransaction');
  });

  describe('findById', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.findById('test');
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('it should throw not found error if trying to find record of different tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      try {
        await repo2.findById(result.id);
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('it should return record if tenant id of user matches', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      const result2 = await repo1.findById(result.id);
      expect(result2).to.have.property('id', result.id);
    });
    it('it should override tenantId even if present in filter', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      await repo2.create({
        name: 'test',
      });
      try {
        await repo1.findById(result.id, {
          fields: ['name'],
          where: {
            tenantId: mockUser2.tenantId,
          },
        } as FilterExcludingWhere<TestModel>);
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('it should find any tenant record for super admin', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      const result2 = await superAdminRepo.findById(result.id);
      expect(result2).to.have.property('id', result.id);
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.find();
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('it should return records if tenant id of user matches', async () => {
      await repo1.create({
        name: 'test',
      });
      await repo1.create({
        name: 'test',
      });
      await repo2.create({
        name: 'test',
      });
      const result = await repo1.find();
      expect(result).to.have.length(2);
    });
    it('it should return records if tenant id of user matches and filter is passed', async () => {
      await repo1.create({
        name: 'test',
      });
      await repo1.create({
        name: 'test1',
      });
      const result = await repo1.find({
        where: {
          name: 'test',
        },
      });
      expect(result).to.have.length(1);
      expect(result[0]).to.have.property('name', 'test');
    });
    it('it should override tenantId even if present in filter', async () => {
      await repo1.create({
        name: 'test',
      });
      await repo2.create({
        name: 'test',
      });
      const result = await repo1.find({
        where: {
          tenantId: mockUser2.tenantId,
        },
      } as FilterExcludingWhere<TestModel>);
      expect(result).to.have.length(0);
    });
    it('it should find any tenant record for super admin', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      const [result2] = await superAdminRepo.find({where: {id: result.id}});
      expect(result2).to.have.property('id', result.id);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.findOne();
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('it should return record if tenant id of user matches with filter', async () => {
      await repo1.create({
        name: 'test',
      });
      await repo1.create({
        name: 'test1',
      });
      await repo2.create({
        name: 'test',
      });
      const result = await repo1.findOne({
        where: {
          name: 'test',
        },
      });
      expect(result).to.have.property('name', 'test');
      expect(result).to.have.property('tenantId', mockUser1.tenantId);
    });
    it('it should return record if tenant id of user matches and filter is passed', async () => {
      await repo1.create({
        name: 'test',
      });
      await repo1.create({
        name: 'test',
      });
      const result = await repo1.findOne({
        where: {
          name: 'test',
        },
      });
      expect(result).to.have.property('name', 'test');
      expect(result).to.have.property('tenantId', mockUser1.tenantId);
    });
    it('it should override tenantId even if present in filter', async () => {
      await repo1.create({
        name: 'test',
      });
      await repo2.create({
        name: 'test',
      });
      const result = await repo1.findOne({
        where: {
          name: 'test',
          tenantId: mockUser2.tenantId,
        },
      } as FilterExcludingWhere<TestModel>);
      expect(result).to.be.null();
    });
    it('it should find any tenant record for super admin', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      const result2 = await superAdminRepo.findOne({where: {id: result.id}});
      expect(result2).to.have.property('id', result.id);
    });
  });

  describe('count', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.count();
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('it should return count if tenant id of user matches', async () => {
      await repo1.create({
        name: 'test',
      });
      await repo1.create({
        name: 'test',
      });
      await repo2.create({
        name: 'test',
      });
      const result = await repo1.count();
      expect(result.count).to.equal(2);
    });
    it('it should return count if tenant id of user matches and filter is passed', async () => {
      await repo1.create({
        name: 'test1',
      });
      await repo1.create({
        name: 'test',
      });
      await repo2.create({
        name: 'test2',
      });
      const result = await repo1.count({
        name: 'test',
      });
      expect(result.count).to.equal(1);
    });
    it('it should give count for any tenant record for super admin', async () => {
      await repo1.create({
        name: 'test',
      });
      const result2 = await superAdminRepo.count({name: 'test'});
      expect(result2.count).to.equal(1);
    });
  });

  describe('exists', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.exists('1');
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('it should return true if tenant id of user matches and record exists', async () => {
      const result = await repo1.create({
        name: 'test1',
      });
      const output = await repo1.exists(result.id);
      expect(output).to.be.true();
    });
    it('it should return false if tenant id of user matches and record does not exists', async () => {
      const result = await repo1.create({
        name: 'test1',
      });
      const output = await repo1.exists(result.id + 1);
      expect(output).to.be.false();
    });
    it('it should return false if trying to find record of different tenant', async () => {
      const result = await repo1.create({
        name: 'test1',
      });
      const output = await repo2.exists(result.id);
      expect(output).to.be.false();
    });
    it('it should check existance for any tenant record for super admin', async () => {
      const result1 = await repo1.create({
        name: 'test',
      });
      const result2 = await superAdminRepo.exists(result1.id);
      expect(result2).to.be.true();
    });
  });

  describe('create', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should add tenant id on create call if not present', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      expect(result).to.have.property('tenantId', 'test');
      expect(result.tenantId).to.equal(mockUser1.tenantId);
    });
    it('it should throw error if tenant id in create call data does not match user tenant', async () => {
      try {
        await repo1.create({
          name: 'test',
          tenantId: 'newid',
        });
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Forbidden);
        expect(e.message).to.equal(
          TenantUtilitiesErrorKeys.TenantIdDoesNotMatch,
        );
      }
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.create({
          name: 'test1',
        });
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('it should create any tenant record for super admin', async () => {
      const result = await superAdminRepo.create({
        name: 'test',
        tenantId: 'newId',
      });
      expect(result).to.have.property('id');
      expect(result).to.have.property('name', 'test');
      expect(result).to.have.property('tenantId', 'newId');
    });
  });
  describe('createAll', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should add tenant id on createAll call if not present', async () => {
      const result = await repo1.createAll([
        {
          name: 'test1',
        },
        {
          name: 'test2',
        },
      ]);
      expect(result).to.have.length(2);
      expect(result[0]).to.have.property('tenantId').equal(mockUser1.tenantId);
      expect(result[1]).to.have.property('tenantId').equal(mockUser1.tenantId);
    });
    it('it should throw error if tenant id in createAll call data does not match user tenant', async () => {
      const wrongId = 'randomId';
      try {
        await repo1.createAll([
          {
            name: 'test1',
            tenantId: mockUser1.tenantId,
          },
          {
            name: 'test2',
            tenantId: wrongId,
          },
        ]);
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Forbidden);
        expect(e.message).to.equal(
          `${TenantUtilitiesErrorKeys.TenantIdDoesNotMatch}: ${wrongId}`,
        );
      }
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.createAll([
          {
            name: 'test1',
          },
          {
            name: 'test2',
          },
        ]);
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('it should create any tenant record for super admin', async () => {
      const results = await superAdminRepo.createAll([
        {
          name: 'test1',
          tenantId: 'newId1',
        },
        {
          name: 'test2',
          tenantId: 'newId2',
        },
      ]);
      expect(results).to.have.length(2);
      expect(results[0]).to.have.property('id');
      expect(results[0]).to.have.property('name', 'test1');
      expect(results[0]).to.have.property('tenantId', 'newId1');
      expect(results[1]).to.have.property('id');
      expect(results[1]).to.have.property('name', 'test2');
      expect(results[1]).to.have.property('tenantId', 'newId2');
    });
  });
  describe('save', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should add tenant id on save call if not present', async () => {
      const result = await repo1.save(new TestModel({name: 'test'}));
      expect(result).to.have.property('tenantId', 'test');
      expect(result.tenantId).to.equal(mockUser1.tenantId);
    });
    it('it should check tenant id on save call if already present in data', async () => {
      const result = await repo1.save(
        new TestModel({
          tenantId: mockUser1.tenantId,
          name: 'test',
        }),
      );
      expect(result).to.have.property('tenantId', 'test');
      expect(result.tenantId).to.equal(mockUser1.tenantId);
    });
    it('it should check tenant id on save call if already present in db', async () => {
      const data = await repo1.create({
        tenantId: mockUser1.tenantId,
        name: 'test',
      });
      const result = await repo1.save(
        new TestModel({
          id: data.id,
          tenantId: mockUser1.tenantId,
          name: 'testUpdated',
        }),
      );
      expect(result).to.have.property('tenantId', 'test');
      expect(result.name).to.equal('testUpdated');
      expect(result.tenantId).to.equal(mockUser1.tenantId);
    });
    it('it should throw error if tenant id on save call does not match the users id', async () => {
      try {
        await repo1.save(
          new TestModel({
            tenantId: mockUser2.tenantId,
            name: 'testUpdated',
          }),
        );
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Forbidden);
        expect(e.message).to.equal(
          TenantUtilitiesErrorKeys.TenantIdDoesNotMatch,
        );
      }
    });
    it('it should throw not found if id on save call belongs to a different tenant than the user', async () => {
      const data = await repo2.create({
        name: 'test',
      });
      try {
        await repo1.save(
          new TestModel({
            id: data.id,
            name: 'testUpdated',
          }),
        );
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('should save a record of different tenant for super admin', async () => {
      const result = await superAdminRepo.save(
        new TestModel({
          tenantId: 'newId',
          name: 'test',
        }),
      );
      expect(result).to.have.property('tenantId', 'newId');
      expect(result.name).to.equal('test');
      const newResult = await superAdminRepo.save(
        new TestModel({
          id: result.id,
          tenantId: 'newId',
          name: 'testUpdated',
        }),
      );
      expect(newResult).to.have.property('tenantId', 'newId');
      expect(newResult.name).to.equal('testUpdated');
    });
  });
  describe('update', () => {
    beforeEach(async () => {
      await init();
    });
    it('it should update a record for a tenant even if tenantId not present in payload', async () => {
      // dummy record
      const result = await repo1.create({
        name: 'test',
      });

      await repo1.update(
        new TestModel({
          id: result.id,
          name: 'testUpdated',
        }),
      );

      const updated = await rawRepo.findById(result.id);
      expect(updated).to.have.property('name', 'testUpdated');
    });
    it('it should throw not found error if update is on record of some other tenant', async () => {
      // dummy record
      const result = await repo2.create({
        name: 'test',
      });

      try {
        await repo1.update(
          new TestModel({
            id: result.id,
            name: 'testUpdated',
          }),
        );
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('it should throw forbidden error if update tries to change tenant', async () => {
      // dummy record
      const result = await repo1.create({
        name: 'test',
      });

      try {
        await repo1.update(
          new TestModel({
            id: result.id,
            name: 'testUpdated',
            tenantId: mockUser2.tenantId,
          }),
        );
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Forbidden);
      }
    });
    it('it should throw error if tenant id of user is not found', async () => {
      try {
        await repoWithoutTenant.update(
          new TestModel({
            name: 'test1',
          }),
        );
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Unauthorized);
        expect(e.message).to.equal(TenantUtilitiesErrorKeys.TenantIdMissing);
      }
    });
    it('should update a record of different tenant for super admin', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      expect(result).to.have.property('tenantId', mockUser1.tenantId);
      expect(result.name).to.equal('test');
      await superAdminRepo.update(
        new TestModel({
          id: result.id,
          name: 'testUpdated',
        }),
      );
      const updated = await rawRepo.findById(result.id);
      expect(updated).to.have.property('tenantId', mockUser1.tenantId);
      expect(updated.name).to.equal('testUpdated');
    });
  });
  describe('updateAll', () => {
    beforeEach(async () => {
      await init();
    });
    it('should update all records for a tenant even if tenantId not present in payload', async () => {
      // dummy record
      const result = await repo1.create({
        name: 'test2',
      });

      await repo1.updateAll(
        {
          name: 'testUpdated',
        },
        {
          id: result.id,
        },
      );

      const updated = await rawRepo.findById(result.id);

      expect(updated).to.have.property('name', 'testUpdated');
    });

    it('should not effect records of other tenants', async () => {
      const resultOfDifferentTenant = await repo2.create({
        name: 'test1',
      });

      // dummy record
      const result = await repo1.create({
        name: 'test2',
      });

      await repo1.updateAll({
        name: 'testUpdated',
      });

      const updated = await rawRepo.findById(result.id);
      const differentTenantRecord = await rawRepo.findById(
        resultOfDifferentTenant.id,
      );

      expect(updated).to.have.property('name', 'testUpdated');
      expect(differentTenantRecord).to.have.property('name', 'test1');
    });

    it('should throw when update to tenantId does not match users tenantId', async () => {
      // dummy record
      await repo1.create({
        name: 'test2',
      });

      try {
        await repo1.updateAll({
          name: 'testUpdated',
          tenantId: mockUser2.tenantId,
        });
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Forbidden);
      }
    });
    it('should allow updates to records of different tenant for super admin', async () => {
      const result1 = await repo1.create({
        name: 'test1',
      });
      const result2 = await repo2.create({
        name: 'test2',
      });
      await superAdminRepo.updateAll(
        {
          name: 'testUpdated',
        },
        {
          id: {
            inq: [result1.id, result2.id],
          },
        },
      );
      const updated1 = await rawRepo.findById(result1.id);
      const updated2 = await rawRepo.findById(result2.id);
      expect(updated1).to.have.property('name', 'testUpdated');
      expect(updated2).to.have.property('name', 'testUpdated');
    });
  });
  describe('updateById', () => {
    beforeEach(async () => {
      await init();
    });
    it('should update a record for a tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      await repo1.updateById(result.id, {
        id: result.id,
        name: 'testUpdated',
      });

      const updated = await rawRepo.findById(result.id);
      expect(updated).to.have.property('name', 'testUpdated');
    });
    it('should throw not found for update on a record of a different tenant', async () => {
      const result = await repo2.create({
        name: 'test',
      });

      try {
        await repo1.updateById(result.id, {
          id: result.id,
          name: 'testUpdated',
        });
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('should throw forbidden if trying to update tenantId to one not matching users', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      try {
        await repo1.updateById(result.id, {
          id: result.id,
          name: 'testUpdated',
          tenantId: mockUser2.tenantId,
        });
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Forbidden);
        expect(e.message).to.equal(
          TenantUtilitiesErrorKeys.TenantIdDoesNotMatch,
        );
      }
    });
    it('should allow updates to records of different tenant for super admin', async () => {
      const record1 = await repo1.create({
        name: 'test',
      });
      await superAdminRepo.updateById(record1.id, {
        name: 'testUpdated',
      });
      const updated1 = await rawRepo.findById(record1.id);
      expect(updated1).to.have.property('name', 'testUpdated');
    });
  });
  describe('replaceById', () => {
    beforeEach(async () => {
      await init();
    });
    it('should replace a record for a tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      await repo1.replaceById(result.id, {
        name: 'testUpdated',
        tenantId: mockUser1.tenantId,
      });

      const updated = await rawRepo.findById(result.id);
      expect(updated).to.have.property('name', 'testUpdated');
    });
    it('should throw not found error if replacing a record of a different tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      try {
        await repo2.replaceById(result.id, {
          name: 'testUpdated',
        });
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('should throw forbidden error if tenantId of record does not match users tenantId', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      try {
        await repo1.replaceById(result.id, {
          name: 'testUpdated',
          tenantId: mockUser2.tenantId,
        });
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.Forbidden);
      }
    });
    it('should allow updates to records of different tenant for super admin', async () => {
      const record1 = await repo1.create({
        name: 'test',
      });
      await superAdminRepo.replaceById(record1.id, {
        name: 'testUpdated',
        tenantId: mockUser2.tenantId,
      });
      const updated1 = await rawRepo.findById(record1.id);
      expect(updated1).to.have.property('name', 'testUpdated');
      expect(updated1).to.have.property('tenantId', mockUser2.tenantId);
    });
  });
  describe('delete', () => {
    beforeEach(async () => {
      await init();
    });
    it('should delete a record for a tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      await repo1.delete(result);

      try {
        await rawRepo.findById(result.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
    });
    it('should throw not found error if deleting a record of a different tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      try {
        await repo2.delete(
          new TestModel({
            id: result.id,
          }),
        );
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('should allow delete of records of different tenant for super admin', async () => {
      const record1 = await repo1.create({
        name: 'test',
      });
      await superAdminRepo.delete(
        new TestModel({
          id: record1.id,
        }),
      );
      try {
        await rawRepo.findById(record1.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
    });
  });
  describe('deleteAll', () => {
    beforeEach(async () => {
      await init();
    });
    it('should delete all records for a tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      await repo1.deleteAll();

      try {
        await rawRepo.findById(result.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
    });
    it('should not affect records of other tenants', async () => {
      const tenant1Data = await repo1.create({
        name: 'test',
      });
      const tenant2Data = await repo2.create({
        name: 'test1',
      });
      await repo1.deleteAll();
      try {
        await rawRepo.findById(tenant1Data.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
      const tenant2DataAfterDelete = await repo2.findById(tenant2Data.id);
      expect(tenant2DataAfterDelete).to.have.property('name', 'test1');
    });
    it('should not affect records of other tenants when using deleteAll with where', async () => {
      const tenant1Data = await repo1.create({
        name: 'test',
      });
      const tenant2Data = await repo2.create({
        name: 'test',
      });
      await repo1.deleteAll({name: 'test'});
      try {
        await rawRepo.findById(tenant1Data.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
      const tenant2DataAfterDelete = await repo2.findById(tenant2Data.id);
      expect(tenant2DataAfterDelete).to.have.property('name', 'test');
    });
    it('should allow delete of records of different tenant for super admin', async () => {
      const record1 = await repo1.create({
        name: 'test',
      });
      const record2 = await repo2.create({
        name: 'test',
      });
      await superAdminRepo.deleteAll();
      try {
        await rawRepo.findById(record1.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
      try {
        await rawRepo.findById(record2.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
    });
  });
  describe('deleteById', () => {
    beforeEach(async () => {
      await init();
    });
    it('should delete a record for a tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });

      await repo1.deleteById(result.id);

      try {
        await rawRepo.findById(result.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
    });
    it('should throw not found error if deleting a record of a different tenant', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      try {
        await repo2.deleteById(result.id);
        fail();
      } catch (e) {
        expect(e).to.be.instanceOf(HttpErrors.NotFound);
      }
    });
    it('should allow delete of records of different tenant for super admin', async () => {
      const result = await repo1.create({
        name: 'test',
      });
      await superAdminRepo.deleteById(result.id);
      try {
        await rawRepo.findById(result.id);
        fail();
      } catch (e) {
        expect(e.code).to.be.equal(NOT_FOUND_CODE);
      }
    });
  });

  async function init() {
    ds = new juggler.DataSource({
      name: 'db',
      connector: 'memory',
    });
    tenantGuard1 = new TenantGuardService(async () => mockUser1);
    tenantGuard2 = new TenantGuardService(async () => mockUser2);
    tenantGuardWithoutTenant = new TenantGuardService(
      async () => mockUserWithoutTenantId,
    );
    tenantGuardForSuperAdmin = new TenantGuardService(
      async () => mockSuperAdmin,
    );
    repo1 = new TestRepo(ds, tenantGuard1);
    repo2 = new TestRepo(ds, tenantGuard2);
    repoWithoutTenant = new TestRepo(ds, tenantGuardWithoutTenant);
    superAdminRepo = new TestRepo(ds, tenantGuardForSuperAdmin);
    rawRepo = new DefaultCrudRepository(TestModel, ds);
  }
});
