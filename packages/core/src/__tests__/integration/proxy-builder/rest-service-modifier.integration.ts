import {Context} from '@loopback/core';
import {AnyObject, DataObject} from '@loopback/repository';
import {RestBindings} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {ModifiedRestService} from '../../../components/proxy-builder';
import {
  Child,
  ChildRelations,
  Parent,
  ParentConfig,
  ParentRelations,
} from './fixtures';
import {
  ChildRepository,
  ParentConfigRepository,
  ParentRepository,
  SiblingRepository,
} from './fixtures/repositories';
import {TestApp} from './fixtures/test.application';
import {setupApplication} from './test-helper';

describe('RestServiceModifier', () => {
  let childProxy: ModifiedRestService<Child & ChildRelations>;
  let parentProxy: ModifiedRestService<Parent>;
  let parentRepo: ParentRepository;
  let childRepo: ChildRepository;
  let siblingRepo: SiblingRepository;
  let parentConfigRepo: ParentConfigRepository;
  let dummyParents: DataObject<Parent>[] = [];
  let dummyChildren: DataObject<Child>[] = [];
  let dummyConfigs: DataObject<ParentConfig>[] = [];
  let secondDummyChildrens: DataObject<Child>[] = [];
  let app: TestApp;
  before('setupApplication', async () => {
    ({app} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    const requestContext = new Context(app);
    requestContext.bind<AnyObject>(RestBindings.Http.REQUEST).to({
      headers: {
        authorization: 'token',
      },
    });
    childProxy = await requestContext.get<
      ModifiedRestService<Child & ChildRelations>
    >('services.ChildProxy');
    parentProxy = await requestContext.get<
      ModifiedRestService<Parent & ParentRelations>
    >('services.ParentProxy');
    parentRepo = await requestContext.get<ParentRepository>(
      'repositories.ParentRepository',
    );
    childRepo = await requestContext.get<ChildRepository>(
      'repositories.ChildRepository',
    );
    parentConfigRepo = await requestContext.get<ParentConfigRepository>(
      'repositories.ParentConfigRepository',
    );
    siblingRepo = await requestContext.get<SiblingRepository>(
      'repositories.SiblingRepository',
    );
    await seedData();
  });
  afterEach(async () => {
    await parentRepo.deleteAll();
    await childRepo.deleteAll();
    await parentConfigRepo.deleteAll();
    await siblingRepo.deleteAll();
  });

  it('should not require token for a get request', async () => {
    const result = await childProxy.find();
    expect(result).to.have.length(6);
  });

  it('should not require token for a get by id request', async () => {
    const result = await childProxy.findById('childId-0');
    expect(result).to.not.be.undefined();
  });

  it('should not require token for a count request', async () => {
    const result = await childProxy.count();
    expect(result).to.be.deepEqual({count: 6});
  });

  it('should require token for a post request', async () => {
    const result = await childProxy.create({
      name: 'child-4',
      parentId: 'id-0',
    });
    expect(result).to.not.be.undefined();
    const child = await childRepo.findById(result.id);
    expect(child).to.not.be.undefined();
    expect(child.name).to.be.equal('child-4');
  });

  it('should require token for a patch request', async () => {
    await childProxy.updateById('childId-0', {
      name: 'child-4',
    });
    const result = await childProxy.findById('childId-0');
    expect(result).to.not.be.undefined();
    expect(result.name).to.be.equal('child-4');
  });

  describe('BelongsTo', () => {
    it('should fetch related model data if a rest relation name is included', async () => {
      const result = await childProxy.find({
        include: ['parent'],
      });
      expect(result).to.have.length(6);
      expect(result[0]).to.have.property('parent');
      expect(result[0].parent).to.deepEqual(dummyParents[0]);
      expect(result[1].parent).to.not.be.undefined();
    });
    it('should fetch related model data if a rest relation object is included', async () => {
      const result = await childProxy.find({
        include: [
          {
            relation: 'parent',
            scope: {
              where: {
                id: 'id-0',
              },
            },
          },
        ],
      });
      expect(result).to.have.length(6);
      expect(result[0]).to.have.property('parent');
      expect(result[0].parent).to.deepEqual(dummyParents[0]);
      expect(result[1].parent).to.be.undefined();
      expect(result[2].parent).to.be.undefined();
    });
  });

  describe('HasMany', () => {
    it('should fetch related model data if a rest relation name is included', async () => {
      const result = await parentProxy.find({
        include: ['children'],
      });
      expect(result).to.have.length(3);
      expect(result[0]).to.have.property('children');
      expect(result[0].children).to.have.length(2);
      expect(result[0].children[0]).to.deepEqual(dummyChildren[0]);
      expect(result[0].children[1]).to.deepEqual(secondDummyChildrens[0]);
    });
    it('should fetch related model data if a rest relation object is included', async () => {
      const result = await parentProxy.find({
        include: [
          {
            relation: 'children',
          },
        ],
      });
      expect(result).to.have.length(3);
      expect(result[0]).to.have.property('children');
      expect(result[0].children).to.have.length(2);
      expect(result[0].children[0]).to.deepEqual(dummyChildren[0]);
      expect(result[0].children[1]).to.deepEqual(secondDummyChildrens[0]);
    });
  });

  describe('HasManyThrough', () => {
    it('should fetch related model data if a rest relation name is included', async () => {
      const result = await childProxy.find({
        include: ['siblings'],
      });
      expect(result).to.have.length(6);
      expect(result[0]).to.have.property('siblings');
    });
    it('should fetch related model data if a rest relation object is included', async () => {
      const result = await childProxy.find({
        include: [
          {
            relation: 'siblings',
          },
        ],
      });
      expect(result).to.have.length(6);
      expect(result[0]).to.have.property('siblings');
      expect(result[0].siblings).to.have.length(1);
    });
  });

  describe('HasOne', () => {
    it('should fetch related model data if a rest relation name is included', async () => {
      const result = await parentProxy.find({
        include: ['config'],
      });
      expect(result).to.have.length(3);
      expect(result[0]).to.have.property('config');
      expect(result[0].config).to.deepEqual(dummyConfigs[0]);
    });
    it('should fetch related model data if a rest relation object is included', async () => {
      const result = await parentProxy.find({
        include: [
          {
            relation: 'config',
          },
        ],
      });
      expect(result).to.have.length(3);
      expect(result[0]).to.have.property('config');
      expect(result[0].config).to.deepEqual(dummyConfigs[0]);
    });
  });

  async function seedData() {
    dummyParents = dummyParentBuilder(3);
    dummyChildren = dummyChildBuilder(3);
    secondDummyChildrens = dummyChildBuilder(3, 'secondChildId');
    dummyConfigs = dummyConfigBuilder(3);
    await parentRepo.createAll(dummyParents);
    await childRepo.createAll(dummyChildren);
    await childRepo.createAll(secondDummyChildrens);
    await parentConfigRepo.createAll(dummyConfigs);
    await siblingRepo.create({
      firstChildId: dummyChildren[0].id,
      secondChildId: secondDummyChildrens[0].id,
    });
  }

  function dummyParentBuilder(count = 1) {
    return new Array(count).fill(0).map((_, i) => {
      return {
        id: `id-${i}`,
        name: `parent ${i}`,
      };
    });
  }
  function dummyChildBuilder(count = 1, idPrefix = 'childId') {
    return new Array(count).fill(0).map((_, i) => {
      return {
        id: `${idPrefix}-${i}`,
        name: `child ${i}`,
        parentId: `id-${i}`,
      };
    });
  }
  function dummyConfigBuilder(count = 1) {
    return new Array(count).fill(0).map((_, i) => {
      return {
        id: `configId-${i}`,
        config: `config ${i}`,
        parentId: `id-${i}`,
      };
    });
  }
});
