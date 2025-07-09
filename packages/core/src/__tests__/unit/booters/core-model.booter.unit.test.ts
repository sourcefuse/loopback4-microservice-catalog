import {Component, Context, MetadataInspector} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {sinon} from '@loopback/testlab';
import {CoreModelBooter} from '../../../booters/core-model.booter';
import {OVERRIDE_MODEL_SCHEMA_KEY} from '../../../build-schema';

describe('CoreModelBooter', () => {
  let app: RestApplication;
  let ctx: Context;

  class DummyBooter extends CoreModelBooter {
    constructor(context: Context) {
      super(context);
    }

    // Override discover to prevent requiring real files
    async discover(): Promise<void> {
      // simulate discovery of classes
      this.classes = [class MyComponent {}];
    }
  }

  beforeEach(() => {
    app = new RestApplication();
    ctx = new Context(app);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should skip load when component is not found', async () => {
    const getSyncSpy = sinon.spy(ctx, 'getSync');
    const booter = new DummyBooter(ctx);
    await booter.discover();
    await booter.load();

    // Assert context tried to get the component, but failed silently
    sinon.assert.calledWith(getSyncSpy, 'components.MyComponent');
  });

  it('should skip load when component has no models', async () => {
    class NoModelComponent implements Component {}

    ctx.bind('components.MyComponent').to(new NoModelComponent());

    const defineSpy = sinon.spy(MetadataInspector, 'defineMetadata');

    const booter = new DummyBooter(ctx);
    await booter.discover();
    await booter.load();

    sinon.assert.notCalled(defineSpy);
  });

  it('should load models and define metadata', async () => {
    class MyModel {}
    class OverriddenModel {}

    class MyComponent implements Component {
      models = [MyModel];
    }

    ctx.bind('components.MyComponent').to(new MyComponent());
    ctx.bind('models.MyModel').to(OverriddenModel);

    const spy = sinon.spy(MetadataInspector, 'defineMetadata');

    const booter = new DummyBooter(ctx);
    await booter.discover(); // sets MyComponent
    await booter.load();

    sinon.assert.calledOnceWithExactly(
      spy,
      OVERRIDE_MODEL_SCHEMA_KEY,
      OverriddenModel,
      MyModel,
    );
  });
});
