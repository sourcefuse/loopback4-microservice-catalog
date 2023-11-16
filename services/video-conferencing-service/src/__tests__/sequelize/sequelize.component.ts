// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, DefaultCrudRepository} from '@loopback/repository';
import {expect} from '@loopback/testlab';

import {TwilioService} from '../../providers/twilio/twilio.service';
import {VonageService} from '../../providers/vonage/vonage.service';
import {SessionAttendeesRepository} from '../../repositories/sequelize';
import {VideoChatSessionRepository} from '../../repositories/sequelize/video-chat-session.repository';
import {VideoConfServiceApplication} from './sequelize.application';
import {getBaseClass} from './utils/get-base-class';

let sequelizeApp: VideoConfServiceApplication;

const setup = async () => {
  sequelizeApp = new VideoConfServiceApplication({
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

    it('Uses the sequelize compatible repository in TwilioService', async () => {
      const boundServiceClasses = sequelizeApp.findByTag('service');
      const expectedBindings = [
        {
          service: TwilioService,
          repository: VideoChatSessionRepository,
          prop: 'videoChatSessionRepository',
        },
        {
          service: TwilioService,
          repository: SessionAttendeesRepository,
          prop: 'sessionAttendeesRepository',
        },
      ];

      for (const {service, repository, prop} of expectedBindings) {
        const instance: AnyObject = sequelizeApp.getSync(
          sequelizeApp.service(service).key,
        );

        expect(sequelizeApp.service(service).source?.value).to.be.oneOf(
          boundServiceClasses.map(e => e.source?.value),
        );
        expect(instance[prop]).to.be.instanceOf(repository);
      }
    });
  });
  it('Uses the sequelize compatible repository in VonageService', async () => {
    const boundServiceClasses = sequelizeApp.findByTag('service');
    const expectedBindings = [
      {
        service: VonageService,
        repository: SessionAttendeesRepository,
        prop: 'sessionAttendeesRepository',
      },
    ];

    for (const {service, repository, prop} of expectedBindings) {
      const instance: AnyObject = sequelizeApp.getSync(
        sequelizeApp.service(service).key,
      );

      expect(sequelizeApp.service(service).source?.value).to.be.oneOf(
        boundServiceClasses.map(e => e.source?.value),
      );
      expect(instance[prop]).to.be.instanceOf(repository);
    }
  });
});
