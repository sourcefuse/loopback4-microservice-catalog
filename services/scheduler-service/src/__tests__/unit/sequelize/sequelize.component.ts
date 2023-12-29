// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {
  AttachmentController,
  AttendeeController,
  CalendarController,
  CalendarEventController,
  CalendarSubscriptionController,
  CalendarWorkingHourController,
  EventAttendeeController,
  EventController,
  SettingsController,
  SubscriptionController,
  WorkingHourController,
} from '../../../controllers';
import {EventAttachmentController} from '../../../controllers/event-attachment.controller';
import {
  AttachmentRepository,
  AttendeeRepository,
  CalendarRepository,
  EventAttendeeViewRepository,
  EventRepository,
  SettingsRepository,
  SubscriptionRepository,
  WorkingHourRepository,
} from '../../../repositories/sequelize';
import {getBaseClass} from '../utils/get-base-class';
import {SchedulerSequelizeApplication} from './sequelize.application';

let sequelizeApp: SchedulerSequelizeApplication;

const setup = async () => {
  sequelizeApp = new SchedulerSequelizeApplication({
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
    it('Uses the sequelize compatible repository in SubscriptionController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: SubscriptionController,
          repository: SubscriptionRepository,
          prop: 'subscriptionRepository',
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
    it('Uses the sequelize compatible repository in WorkingHourController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: WorkingHourController,
          repository: WorkingHourRepository,
          prop: 'workingHourRepository',
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
    it('Uses the sequelize compatible repository in SettingsController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: SettingsController,
          repository: SettingsRepository,
          prop: 'settingsRepository',
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

    it('Uses the sequelize compatible repository in Attachment controller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: AttachmentController,
          repository: AttachmentRepository,
          prop: 'attachmentRepository',
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
    it('Uses the sequelize compatible repository in AttendeeController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: AttendeeController,
          repository: AttendeeRepository,
          prop: 'attendeeRepository',
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
    it('Uses the sequelize compatible repository in CalendarEventController', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: CalendarEventController,
          repository: CalendarRepository,
          prop: 'calendarRepository',
        },
        {
          controller: CalendarEventController,
          repository: SubscriptionRepository,
          prop: 'subscriptionRepository',
        },
        {
          controller: CalendarEventController,
          repository: EventAttendeeViewRepository,
          prop: 'eventAttendeeViewRepository',
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
  it('Uses the sequelize compatible repository in CalendarSubscriptionController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: CalendarSubscriptionController,
        repository: CalendarRepository,
        prop: 'calendarRepository',
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
  it('Uses the sequelize compatible repository in CalendarWorkingHourController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: CalendarWorkingHourController,
        repository: CalendarRepository,
        prop: 'calendarRepository',
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
  it('Uses the sequelize compatible repository in CalendarController ', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: CalendarController,
        repository: CalendarRepository,
        prop: 'calendarRepository',
      },
      {
        controller: CalendarController,
        repository: WorkingHourRepository,
        prop: 'workingHourRepository',
      },
      {
        controller: CalendarController,
        repository: SubscriptionRepository,
        prop: 'subscriptionRepository',
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
  it('Uses the sequelize compatible repository in EventAttachmentController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: EventAttachmentController,
        repository: EventRepository,
        prop: 'eventRepository',
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
  it('Uses the sequelize compatible repository in EventAttendeeController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: EventAttendeeController,
        repository: EventRepository,
        prop: 'eventRepository',
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
  it('Uses the sequelize compatible repository in EventController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: EventController,
        repository: AttachmentRepository,
        prop: 'attachmentRepository',
      },
      {
        controller: EventController,
        repository: AttendeeRepository,
        prop: 'attendeeRepository',
      },
      {
        controller: EventController,
        repository: EventAttendeeViewRepository,
        prop: 'eventAttendeeViewRepository',
      },
      {
        controller: EventController,
        repository: EventRepository,
        prop: 'eventRepository',
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
