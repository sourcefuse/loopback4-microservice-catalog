// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import {testUser} from '../helpers/db.helper';
import {SimpleAuditServiceApplication} from './simple-application';
let sequelizeApp: SimpleAuditServiceApplication;

const setup = async () => {
  sequelizeApp = new SimpleAuditServiceApplication({
    name: 'app',
  });
  sequelizeApp.bind(AuthenticationBindings.CURRENT_USER).to(testUser);

  await sequelizeApp.boot();
};

beforeEach(setup);

describe('Simple Component', () => {
  describe('Component binds correct artifacts', () => {
    it('should refer to model without tenant id', async () => {
      const appModels = sequelizeApp
        .findByTag('model')
        .map(e => e.source?.value);

      for (const model of appModels) {
        expect(model.definition.properties).not.to.have.property('tenantId');
      }
    });
  });
});
