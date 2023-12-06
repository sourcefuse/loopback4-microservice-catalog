// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';

import {
  NotificationController,
  NotificationUserController,
  NotificationUserNotificationController,
} from '../../../controllers';
import {
  NotificationRepository,
  NotificationUserRepository,
} from '../../../repositories/sequelize';
import {getBaseClass} from '../../utils/get-base-class';
import {SequelizeChatApplication} from './sequelize.application';
let sequelizeApp: SequelizeChatApplication;

const setup = async () => {
  sequelizeApp = new SequelizeChatApplication({
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

    it('Uses the sequelize compatible repository in Notification controller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: NotificationController,
          repository: NotificationRepository,
          prop: 'notificationRepository',
        },
        {
          controller: NotificationController,
          repository: NotificationUserRepository,
          prop: 'notificationUserRepository',
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

    it('Uses the sequelize compatible repository in NotificationUser Controller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: NotificationUserController,
          repository: NotificationUserRepository,
          prop: 'notificationUserRepository',
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

  it('Uses the sequelize compatible repository in NotificationUserNotification controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: NotificationUserNotificationController,
        repository: NotificationUserRepository,
        prop: 'notificationUserRepository',
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
