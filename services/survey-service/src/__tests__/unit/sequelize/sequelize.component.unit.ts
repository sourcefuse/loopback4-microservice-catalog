// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {
  OptionController,
  QuestionController,
  SectionController,
  SurveyController,
  SurveyCycleController,
  SurveyQuestionController,
  SurveyResponderController,
  TemplateController,
} from '../../../controllers';
import {SurveyResponseDetailViewController} from '../../../controllers/survey-response-detail.controller';
import {SurveyResponseController} from '../../../controllers/survey-response.controller';
import {
  OptionsRepository,
  QuestionRepository,
  QuestionTemplateRepository,
  SectionRepository,
  SurveyCycleRepository,
  SurveyQuestionRepository,
  SurveyRepository,
  SurveyResponderRepository,
  SurveyResponseDetailRepository,
  SurveyResponseRepository,
} from '../../../repositories/sequelize';
import {getBaseClass} from '../utils/getBaseClass';
import {SurveyServiceSequelizeApplication} from './sequelize.application';

let sequelizeApp: SurveyServiceSequelizeApplication;

const setup = async () => {
  sequelizeApp = new SurveyServiceSequelizeApplication({
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
    it('Uses the sequelize compatible repository in OptionController ', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: OptionController,
          repository: OptionsRepository,
          prop: 'optionsRepository',
        },
        {
          controller: OptionController,
          repository: QuestionRepository,
          prop: 'questionRepository',
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
    it('Uses the sequelize compatible repository in TemplateController ', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: TemplateController,
          repository: QuestionTemplateRepository,
          prop: 'questionTemplateRepository',
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
    it('Uses the sequelize compatible repository in QuestionController ', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: QuestionController,
          repository: QuestionRepository,
          prop: 'questionRepository',
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
    it('Uses the sequelize compatible repository in SectionController ', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: SectionController,
          repository: SectionRepository,
          prop: 'sectionRepository',
        },
        {
          controller: SectionController,
          repository: SurveyQuestionRepository,
          prop: 'surveyQuestionRepository',
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
  it('Uses the sequelize compatible repository in SurveyCycleController ', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SurveyCycleController,
        repository: SurveyCycleRepository,
        prop: 'surveyCycleRepository',
      },
      {
        controller: SurveyCycleController,
        repository: SurveyRepository,
        prop: 'surveyRepository',
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
  it('Uses the sequelize compatible repository in SurveyQuestionController ', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SurveyQuestionController,
        repository: SurveyQuestionRepository,
        prop: 'surveyQuestionRepository',
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
  it('Uses the sequelize compatible repository in SurveyResponderController ', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SurveyResponderController,
        repository: SurveyRepository,
        prop: 'surveyRepository',
      },
      {
        controller: SurveyResponderController,
        repository: SurveyResponderRepository,
        prop: 'surveyResponderRepository',
      },
      {
        controller: SurveyResponderController,
        repository: SurveyResponseRepository,
        prop: 'surveyResponseRepository',
      },
      {
        controller: SurveyResponderController,
        repository: SurveyCycleRepository,
        prop: 'surveyCycleRepository',
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
  it('Uses the sequelize compatible repository in SurveyResponseDetailViewController ', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SurveyResponseDetailViewController,
        repository: SurveyResponseDetailRepository,
        prop: 'surveyResponseDetailRepository',
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
  it('Uses the sequelize compatible repository in SurveyResponseController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SurveyResponseController,
        repository: SurveyResponseRepository,
        prop: 'surveyResponseRepository',
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
  it('Uses the sequelize compatible repository in SurveyController', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SurveyController,
        repository: SurveyRepository,
        prop: 'surveyRepository',
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
  it('Uses the sequelize compatible repository inTemplateQuestionController ', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: SurveyController,
        repository: SurveyRepository,
        prop: 'surveyRepository',
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
