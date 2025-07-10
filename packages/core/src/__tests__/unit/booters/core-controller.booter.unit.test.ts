import {RestApplication} from '@loopback/rest';
import {expect, sinon} from '@loopback/testlab';
import {CoreControllerBooter} from '../../../booters/core-controller.booter';

describe('CoreControllerBooter', () => {
  let app: RestApplication;

  class DummyController {}

  class TestBooter extends CoreControllerBooter {
    constructor(application: RestApplication) {
      super(application);
    }

    async load(): Promise<void> {
      this.classes = [DummyController];
      this.classes.forEach(cls => this.bindController(cls));
    }
  }

  beforeEach(() => {
    app = new RestApplication();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should bind discovered controllers', async () => {
    const controllerSpy = sinon.spy(app, 'controller');

    const booter = new TestBooter(app);
    await booter.load();

    sinon.assert.calledWith(controllerSpy, DummyController);
    expect(app.isBound('controllers.DummyController')).to.be.true();
  });

  it('should skip controller binding if already bound', async () => {
    app.controller(DummyController); // Pre-bind it

    const spy = sinon.spy(app, 'controller');
    const booter = new TestBooter(app);
    await booter.load();

    sinon.assert.notCalled(spy);
  });
});
