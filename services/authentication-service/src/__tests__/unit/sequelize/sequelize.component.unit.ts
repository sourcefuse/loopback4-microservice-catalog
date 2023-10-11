// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {
  LoginActivityController,
  LoginController,
  OtpController,
} from '../../../controllers/sequelize';
import {
  AuthClientRepository as SequelizeAuthClientRepository,
  LoginActivityRepository as SequelizeLoginActivityRepository,
  RoleRepository as SequelizeRoleRepository,
  TenantConfigRepository as SequelizeTenantConfigRepository,
  UserCredentialsRepository as SequelizeUserCredentialsRepository,
  UserLevelPermissionRepository as SequelizeUserLevelPermissionRepository,
  UserLevelResourceRepository as SequelizeUserLevelResourceRepository,
  UserRepository as SequelizeUserRepository,
  UserTenantRepository as SequelizeUserTenantRepository,
} from '../../../repositories/sequelize';

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
          repository: SequelizeLoginActivityRepository,
          prop: 'loginActivityRepo',
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
    it('Uses the sequelize compatible artifacts in Otpcontroller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: OtpController,
          repositories: [
            SequelizeAuthClientRepository,
            SequelizeUserRepository,
            SequelizeUserCredentialsRepository,
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
    it('Uses the sequelize compatible artifacts in Login controller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: LoginController,

          repositories: [
            SequelizeAuthClientRepository,
            SequelizeUserRepository,
            SequelizeRoleRepository,
            SequelizeTenantConfigRepository,
            SequelizeUserCredentialsRepository,
            SequelizeUserLevelResourceRepository,
            SequelizeUserLevelPermissionRepository,
            SequelizeUserTenantRepository,
            SequelizeLoginActivityRepository,
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
});
