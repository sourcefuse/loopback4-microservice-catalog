// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {RestApplication, RestServer} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {AuthenticationServiceComponent} from '../../component';
import {AuthServiceBindings} from '../../keys';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from './test-helper';

const CONTROLLER_KEY = 'controllers.SamlLogoutController';
const SLO_PATHS = ['/saml/logout', '/auth/saml/logout'];

describe('SAML Single Logout opt-in', () => {
  describe('default configuration', () => {
    let app: TestingApplication;

    before('setupApplication', async () => {
      ({app} = await setupApplication());
    });

    after(async () => {
      await app?.stop();
    });

    it('does not mount the SAML Single Logout routes', async () => {
      const spec = await (await app.getServer(RestServer)).getApiSpec();

      expect(app.isBound(CONTROLLER_KEY)).to.be.false();
      for (const path of SLO_PATHS) {
        expect(spec.paths).to.not.have.property(path);
      }
    });
  });

  /** An app with the component mounted under the given config. */
  function appWith(samlSingleLogout: boolean): RestApplication {
    const app = new RestApplication();
    app.bind(AuthServiceBindings.Config).to({samlSingleLogout});
    app.component(AuthenticationServiceComponent);
    return app;
  }

  describe('samlSingleLogout: false', () => {
    it('does not mount the SAML Single Logout controller or service', () => {
      const app = appWith(false);

      expect(app.isBound(CONTROLLER_KEY)).to.be.false();
      expect(app.isBound('services.SamlLogoutService')).to.be.false();
    });
  });

  describe('samlSingleLogout: true', () => {
    it('mounts the SAML Single Logout controller, service and routes', async () => {
      const app = appWith(true);
      const spec = await (await app.getServer(RestServer)).getApiSpec();

      expect(app.isBound(CONTROLLER_KEY)).to.be.true();
      expect(app.isBound('services.SamlLogoutService')).to.be.true();
      expect(spec.paths['/saml/logout']).to.have.property('post');
      expect(spec.paths['/auth/saml/logout']).to.have.properties([
        'post',
        'get',
      ]);
    });
  });
});
