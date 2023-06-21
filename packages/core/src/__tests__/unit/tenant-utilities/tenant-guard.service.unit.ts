import {Filter, FilterExcludingWhere} from '@loopback/repository';
import {expect} from '@loopback/testlab';
import {TenantGuardService} from '../../../components/tenant-utilities/services';
import {mockUser1} from '../../const';
import {TestModel} from '../../fixtures/tenant-utilities';

describe('TenantGuardService', () => {
  let service: TenantGuardService<TestModel, string>;
  const mockInstance = new TestModel({
    id: 'some-id',
  });

  describe('if filter/where is passed', () => {
    const mockFilter: Filter<TestModel> = {
      where: {
        id: mockInstance.id,
      },
      fields: ['name'],
    };
    const expectedFilter = {
      where: {
        and: [
          {
            id: mockInstance.id,
          },
          {
            tenantId: mockUser1.tenantId,
          },
        ],
      },
      fields: ['name'],
    };
    const mockFilterWithoutWhere: FilterExcludingWhere<TestModel> = {
      fields: ['name'],
    };
    const expectedFilterWithoutWhere = {
      fields: ['name'],
      where: {
        tenantId: mockUser1.tenantId,
        id: mockInstance.id,
      },
    };
    beforeEach(async () => {
      service = new TenantGuardService<TestModel, string>(
        async () => mockUser1,
      );
    });
    it('should return a new filter with tenantId for find', async () => {
      const filter = await service.find(mockFilter);
      expect(filter).to.have.deepEqual(expectedFilter);
    });
    it('should return a new filter with tenantId for findOne', async () => {
      const filter = await service.findOne(mockFilter);
      expect(filter).to.deepEqual(expectedFilter);
    });
    it('should return a new filter with tenantId for findById', async () => {
      const filter = await service.findById(
        mockInstance.id,
        mockFilterWithoutWhere,
      );
      expect(filter).to.have.deepEqual(expectedFilterWithoutWhere);
    });
    it('should return a new where with tenantId for count', async () => {
      const where = await service.count(mockFilter.where);
      expect(where).to.have.deepEqual(expectedFilter.where);
    });
    it('should return a new where with tenantId for exists', async () => {
      const where = await service.exists(mockInstance.id);
      expect(where).to.have.deepEqual(expectedFilterWithoutWhere.where);
    });
    it('should return a new data with tenantId for create', async () => {
      const data = await service.create(mockInstance);
      expect(data).to.have.property('tenantId', mockUser1.tenantId);
    });
    it('should return a new data with tenantId for createAll', async () => {
      const data = await service.createAll([mockInstance]);
      expect(data[0]).to.have.property('tenantId', mockUser1.tenantId);
    });
    it('should return a new data with tenantId for save', async () => {
      const data = await service.save(mockInstance);
      expect(data).to.have.property('tenantId', mockUser1.tenantId);
    });
    it('should return a new data with tenantId for replaceById', async () => {
      const newInstance = {
        ...mockInstance,
        name: 'new name',
      };
      const data = await service.replaceById(mockInstance.id, newInstance);
      expect(data.where).to.deepEqual(expectedFilterWithoutWhere.where);
      expect(data.data).to.deepEqual({
        ...newInstance,
        tenantId: mockUser1.tenantId,
      });
    });
    it('should return a new data with tenantId for updateById', async () => {
      const newInstance = {
        ...mockInstance,
        name: 'new name',
      };
      const data = await service.updateById(mockInstance.id, newInstance);
      expect(data.where).to.deepEqual(expectedFilterWithoutWhere.where);
      expect(data.data).to.deepEqual({
        ...newInstance,
        tenantId: mockUser1.tenantId,
      });
    });
    it('should return a new data with tenantId for update', async () => {
      const newInstance = new TestModel({
        ...mockInstance,
        name: 'new name',
      });
      const data = await service.update(newInstance);
      expect(data.where).to.deepEqual(expectedFilterWithoutWhere.where);
      expect(data.data).to.deepEqual(
        new TestModel({
          ...newInstance,
          tenantId: mockUser1.tenantId,
        }),
      );
    });
    it('should return a new data with tenantId for updateAll', async () => {
      const newInstance = {
        ...mockInstance,
        name: 'new name',
      };
      const data = await service.updateAll(newInstance, mockFilter.where);
      expect(data.where).to.deepEqual(expectedFilter.where);
      expect(data.data).to.deepEqual({
        ...newInstance,
        tenantId: mockUser1.tenantId,
      });
    });
    it('should return a new data with tenantId for deleteById', async () => {
      const where = await service.deleteById(mockInstance.id);
      expect(where).to.deepEqual(expectedFilterWithoutWhere.where);
    });
    it('should return a new data with tenantId for delete', async () => {
      const data = await service.delete(mockInstance);
      expect(data.where).to.deepEqual(expectedFilterWithoutWhere.where);
      expect(data.entity).to.deepEqual(
        new TestModel({
          ...mockInstance,
          tenantId: mockUser1.tenantId,
        }),
      );
    });
    it('should return a new data with tenantId for deleteAll', async () => {
      const where = await service.deleteAll(mockFilter.where);
      expect(where).to.deepEqual(expectedFilter.where);
    });
  });
  describe('if filter/where is not passed', () => {
    const expectedFilter = {
      where: {
        tenantId: mockUser1.tenantId,
      },
    };
    beforeEach(async () => {
      service = new TenantGuardService<TestModel, string>(
        async () => mockUser1,
      );
    });
    it('should return a new filter with tenantId for find', async () => {
      const filter = await service.find();
      expect(filter).to.have.deepEqual(expectedFilter);
    });
    it('should return a new filter with tenantId for findOne', async () => {
      const filter = await service.findOne();
      expect(filter).to.deepEqual(expectedFilter);
    });
    it('should return a new where with tenantId for count', async () => {
      const where = await service.count();
      expect(where).to.have.deepEqual(expectedFilter.where);
    });
    it('should return a new data with tenantId for updateAll', async () => {
      const newInstance = {
        ...mockInstance,
        name: 'new name',
      };
      const data = await service.updateAll(newInstance);
      expect(data.where).to.deepEqual(expectedFilter.where);
      expect(data.data).to.deepEqual({
        ...newInstance,
        tenantId: mockUser1.tenantId,
      });
    });
    it('should return a new data with tenantId for deleteAll', async () => {
      const where = await service.deleteAll();
      expect(where).to.deepEqual(expectedFilter.where);
    });
  });
});
