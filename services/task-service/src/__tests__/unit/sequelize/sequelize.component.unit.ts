// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';

import {DefaultCrudRepository} from '@loopback/repository';

import {WorkflowRepository} from '@sourceloop/bpmn-service/sequelize';
import {
  EventController,
  TaskController,
  TaskUserTaskController,
} from '../../../controllers';
import {
  EventRepository,
  EventWorkflowRepository,
  TaskRepository,
  TaskWorkFlowRepository,
  UserTaskRepository,
} from '../../../repositories/sequelize';
import {getBaseClass} from '../utils/getBaseClass';
import {TaskServiceSequelizeApplication} from './sequelize.application';
let sequelizeApp: TaskServiceSequelizeApplication;

const setup = async () => {
  sequelizeApp = new TaskServiceSequelizeApplication({
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
    it('Uses the sequelize compatible repository in Event Controller ', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: EventController,
          repository: EventWorkflowRepository,
          prop: 'eventWorkflowMapping',
        },
        {
          controller: EventController,
          repository: EventRepository,
          prop: 'eventRepository',
        },
        {
          controller: EventController,
          repository: WorkflowRepository,
          prop: 'workflowRepository',
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
    it('Uses the sequelize compatible repository in TaskUserTaskController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');

      const expectedBindings = [
        {
          controller: TaskUserTaskController,
          repository: TaskRepository,
          prop: 'taskRepo',
        },
        {
          controller: TaskUserTaskController,
          repository: UserTaskRepository,
          prop: 'userTaskRepo',
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
    it('Uses the sequelize compatible repository in Task Controller ', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');

      const expectedBindings = [
        {
          controller: TaskController,
          repository: TaskRepository,
          prop: 'taskRepo',
        },
        {
          controller: TaskController,
          repository: UserTaskRepository,
          prop: 'userTaskRepository',
        },
        {
          controller: TaskController,
          repository: TaskWorkFlowRepository,
          prop: 'taskWorkflowMapping',
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
});
