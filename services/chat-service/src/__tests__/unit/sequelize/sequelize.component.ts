// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DefaultCrudRepository} from '@loopback/repository';
import {ControllerInstance} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {
  AttachmentFileController,
  MessageController,
  MessageRecipientMessageController,
} from '../../../controllers';
import {
  AttachmentFileRepository as SequelizeAttachmentFileRepository,
  MessageRecipientRepository as SequelizeMessageRecipientRepository,
  MessageRepository as SequelizeMessageRepository,
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

    it('Uses the sequelize compatible repository in Message-Attachment controller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: AttachmentFileController,
          repository: SequelizeAttachmentFileRepository,
          prop: 'attachmentFileRepository',
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

    it('Uses the sequelize compatible repository in Message controller', async () => {
      const boundControllerClasses = sequelizeApp.findByTag('controller');
      const expectedBindings = [
        {
          controller: MessageController,
          repository: SequelizeMessageRepository,
          prop: 'messageRepository',
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

  it('Uses the sequelize compatible repository in Message Recipient controller', async () => {
    const boundControllerClasses = sequelizeApp.findByTag('controller');
    const expectedBindings = [
      {
        controller: MessageRecipientMessageController,
        repository: SequelizeMessageRecipientRepository,
        prop: 'messageRecipientRepository',
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
