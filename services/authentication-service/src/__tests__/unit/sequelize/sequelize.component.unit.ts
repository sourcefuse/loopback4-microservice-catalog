// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {
  LoginActivityController,
  LoginController,
  OtpController,
} from '../../../controllers';
import {AppleLoginController} from '../../../modules/auth/controllers';
import {
  AuthClientRepository,
  LoginActivityRepository,
  RoleRepository,
  TenantConfigRepository,
  UserCredentialsRepository,
  UserLevelPermissionRepository,
  UserLevelResourceRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../repositories/sequelize';
import {
  ActiveUserFilterBuilderService,
  LoginActivityHelperService,
  LoginHelperService,
  OtpService,
} from '../../../services';
import {getBaseClass} from '../../utils/getBaseClass';
import {SequelizeAuthenticationServiceApplication} from './sequelize.application';
let sequelizeApp: SequelizeAuthenticationServiceApplication;

const setup = async () => {
  sequelizeApp = new SequelizeAuthenticationServiceApplication({
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
    it('Uses the sequelize compatible repository in LoginActivity controller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: LoginActivityController,
          services: [
            LoginActivityHelperService,
            ActiveUserFilterBuilderService,
          ],
          props: ['loginActivityHelperService', 'filterBuilder'],
        },
      ];

      for (const {controller, services, props} of expectedBindings) {
        const controllerInstance: ControllerInstance = sequelizeApp.getSync(
          sequelizeApp.controller(controller).key,
        );
        expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
          boundControllerClasses.map(e => e.source?.value),
        );
        for (let i = 0; i < props.length; i++) {
          expect(controllerInstance[props[i]]).to.be.instanceOf(services[i]);
        }
      }
    });
    it('Uses the sequelize compatible repository in Otpcontroller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: OtpController,
          repositories: [
            AuthClientRepository,
            UserRepository,
            UserCredentialsRepository,
          ],
          props: ['authClientRepository', 'userRepo', 'userCredsRepository'],
        },
      ];
      for (const {controller, repositories, props} of expectedBindings) {
        const controllerInstance: ControllerInstance = sequelizeApp.getSync(
          sequelizeApp.controller(controller).key,
        );
        expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
          boundControllerClasses.map(e => e.source?.value),
        );

        for (let i = 0; i < repositories.length; i++) {
          const repository = repositories[i];
          const prop = props[i];
          expect(controllerInstance[prop]).to.be.instanceOf(repository);
        }
      }
    });
    it('Uses the sequelize compatible repository in AppleLogincontroller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: AppleLoginController,
          repository: AuthClientRepository,
          prop: 'authClientRepository',
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
  it('Uses the sequelize compatible repository in Login controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: LoginController,

        repositories: [
          AuthClientRepository,
          UserRepository,
          RoleRepository,
          TenantConfigRepository,
          UserCredentialsRepository,
          UserLevelResourceRepository,
          UserLevelPermissionRepository,
          UserTenantRepository,
          LoginActivityRepository,
        ],
        props: [
          'authClientRepository',
          'userRepo',
          'roleRepo',
          'tenantConfigRepo',
          'userCredsRepository',
          'userResourcesRepository',
          'utPermsRepo',
          'userTenantRepo',
          'loginActivityRepo',
        ],
      },
    ];
    for (const {controller, repositories, props} of expectedBindings) {
      const controllerInstance: ControllerInstance = sequelizeApp.getSync(
        sequelizeApp.controller(controller).key,
      );
      expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
        boundControllerClasses.map(e => e.source?.value),
      );

      for (let i = 0; i < repositories.length; i++) {
        const repository = repositories[i];
        const prop = props[i];
        expect(controllerInstance[prop]).to.be.instanceOf(repository);
      }
    }
  });
});

it('Uses the sequelize compatible repository in LoginHelperService', async () => {
  const expectedBindings = [
    {
      service: LoginHelperService,
      repository: UserTenantRepository,
      prop: 'userTenantRepo',
    },
  ];

  for (const {service, repository, prop} of expectedBindings) {
    const instance: AnyObject = sequelizeApp.getSync(
      sequelizeApp.service(service).key,
    );
    expect(instance[prop]).to.be.instanceOf(repository);
  }
});
it('Uses the sequelize compatible repository in OtpService', async () => {
  const expectedBindings = [
    {
      service: OtpService,
      repository: UserRepository,
      prop: 'userRepository',
    },
  ];
  for (const {service, repository, prop} of expectedBindings) {
    const instance: AnyObject = sequelizeApp.getSync(
      sequelizeApp.service(service).key,
    );
    expect(instance[prop]).to.be.instanceOf(repository);
  }
});
