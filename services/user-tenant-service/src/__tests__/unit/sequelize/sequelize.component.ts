import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {
  GroupUserController,
  TenantController,
  TenantGroupController,
  TenantRoleController,
  TenantTenantConfigController,
  TenantUserController,
  UserTenantController,
  UserTenantPrefsController,
  UserTenantUserGroupController,
  UserTenantUserLevelPermissionController,
} from '../../../controllers';
import {
  GroupRepository,
  RoleRepository,
  TenantConfigRepository,
  TenantRepository,
  UserRepository,
  UserTenantPrefsRepository,
  UserTenantRepository,
} from '../../../repositories/sequelize';
import {getBaseClass} from '../utils/get-base-class';
import {UserTenantServiceSequelizeApplication} from './sequelize.application';
let sequelizeApp: UserTenantServiceSequelizeApplication;

const setup = async () => {
  sequelizeApp = new UserTenantServiceSequelizeApplication({
    name: 'SequelizeApp',
  });
  await sequelizeApp.boot();
};

beforeEach(setup);

describe('Sequelize Component', () => {
  describe('Component binds correct artifacts', () => {
    it('Does not contain classes extending DefaultCrudRepository', async () => {
      /**
       * Bound controller classes in `sequelizeApp` (rest app using sequelize component bound)
       */
      const boundRepositoryClasses = sequelizeApp
        .findByTag('repository')
        .map(e => e.source?.value);

      for (const repo of boundRepositoryClasses) {
        // No bound repository classes should extend `DefaultCrudRepository`
        expect(getBaseClass(repo)).to.not.be.eql(DefaultCrudRepository);
      }
    });
    it('Uses the sequelize compatible repository in GroupUserController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: GroupUserController,
          repository: GroupRepository,
          prop: 'groupRepository',
        },
        {
          controller: GroupUserController,
          repository: GroupRepository,
          prop: 'groupRepository',
        },
      ];

      for (const {controller, repository, prop} of expectedBindings) {
        const controllerInstance: ControllerInstance = sequelizeApp.getSync(
          sequelizeApp.controller(controller).key,
        );
        expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
          boundControllerClasses.map(e => e.source?.value),
        );
        expect(controllerInstance[prop]).to.be.instanceOf(repository);
      }
    });
    it('Uses the sequelize compatible repository in  TenantGroupController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: TenantGroupController,
          repository: TenantRepository,
          prop: 'tenantRepository',
        },
        {
          controller: TenantGroupController,
          repository: GroupRepository,
          prop: 'groupRepository',
        },
      ];

      for (const {controller, repository, prop} of expectedBindings) {
        const controllerInstance: ControllerInstance = sequelizeApp.getSync(
          sequelizeApp.controller(controller).key,
        );
        expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
          boundControllerClasses.map(e => e.source?.value),
        );
        expect(controllerInstance[prop]).to.be.instanceOf(repository);
      }
    });
    it('Uses the sequelize compatible repository in  TenantRoleController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: TenantRoleController,
          repository: TenantRepository,
          prop: 'tenantRepository',
        },
        {
          controller: TenantRoleController,
          repository: RoleRepository,
          prop: 'roleRepository',
        },
      ];

      for (const {controller, repository, prop} of expectedBindings) {
        const controllerInstance: ControllerInstance = sequelizeApp.getSync(
          sequelizeApp.controller(controller).key,
        );
        expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
          boundControllerClasses.map(e => e.source?.value),
        );
        expect(controllerInstance[prop]).to.be.instanceOf(repository);
      }
    });
    it('Uses the sequelize compatible repository in UserTenantController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: UserTenantController,
          repository: TenantRepository,
          prop: 'tenantRepository',
        },
        {
          controller: UserTenantController,
          repository: UserTenantRepository,
          prop: 'userTenantRepository',
        },
      ];

      for (const {controller, repository, prop} of expectedBindings) {
        const controllerInstance: ControllerInstance = sequelizeApp.getSync(
          sequelizeApp.controller(controller).key,
        );
        expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
          boundControllerClasses.map(e => e.source?.value),
        );
        expect(controllerInstance[prop]).to.be.instanceOf(repository);
      }
    });
  });
  it('Uses the sequelize compatible repository in UserTenantUserLevelPermissionController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: UserTenantUserLevelPermissionController,
        repository: UserTenantRepository,
        prop: 'userTenantRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in UserTenantUserGroupController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: UserTenantUserGroupController,
        repository: UserTenantRepository,
        prop: 'userTenantRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in UserTenantPrefsController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: UserTenantPrefsController,
        repository: UserTenantPrefsRepository,
        prop: 'userTenantPrefsRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in TenantController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: TenantController,
        repository: TenantRepository,
        prop: 'tenantRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in TenantUserController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: TenantUserController,
        repository: TenantRepository,
        prop: 'tenantRepository',
      },
      {
        controller: TenantUserController,
        repository: UserRepository,
        prop: 'userRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
  it('Uses the sequelize compatible repository in TenantTenantConfigController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: TenantTenantConfigController,
        repository: TenantRepository,
        prop: 'tenantRepository',
      },
      {
        controller: TenantTenantConfigController,
        repository: TenantConfigRepository,
        prop: 'tenantConfigRepository',
      },
    ];

    for (const {controller, repository, prop} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );
      expect(controllerInstance[prop]).to.be.instanceOf(repository);
    }
  });
});
