// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {AuditController} from '../../controllers';

import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from '../../repositories/sequelize';
import {getBaseClass} from '../utils/getBaseClass';
import {SequelizeAuditServiceApplication} from './sequelize.application';
let sequelizeApp: SequelizeAuditServiceApplication;

const setup = async () => {
  sequelizeApp = new SequelizeAuditServiceApplication({
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

    it('Uses the sequelize compatible repository in  Audit controller', async () => {
      /**
       * Bound controller classes in `sequelizeApp` (rest app using sequelize component bound)
       */
      const boundControllerClasses = sequelizeApp.findByTag('controller');

      /**
       * Array containing list of controllers and their repository bindings bound in sequelize component
       */
      const expectedBindings = [
        {
          controller: AuditController,
          repository: AuditLogRepository,
          prop: 'auditLogRepository',
        },
        {
          controller: AuditController,
          repository: JobRepository,
          prop: 'jobRepository',
        },
        {
          controller: AuditController,
          repository: MappingLogRepository,
          prop: 'mappingLogRepository',
        },
      ];

      for (const {controller, repository, prop} of expectedBindings) {
        const controllerInstance: ControllerInstance = sequelizeApp.getSync(
          sequelizeApp.controller(controller).key,
        );

        expect(sequelizeApp.controller(controller).source?.value).to.be.oneOf(
          boundControllerClasses.map(e => e.source?.value),
        );

        // Verify the injected repository in the controller is an instance of sequelize repository
        expect(controllerInstance[prop]).to.be.instanceOf(repository);
      }
    });
  });
});
