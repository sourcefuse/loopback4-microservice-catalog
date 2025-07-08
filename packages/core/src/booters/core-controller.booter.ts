import {ArtifactOptions, BaseArtifactBooter} from '@loopback/boot';
import {
  BindingScope,
  config,
  ControllerClass,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import path from 'path';

@injectable({scope: BindingScope.SINGLETON})
export class CoreControllerBooter extends BaseArtifactBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected application: RestApplication,
    @inject('paths.base', {optional: true})
    protected basePath: string = path.resolve(__dirname, '..'),
    @config()
    public controllerConfig: ArtifactOptions = {},
  ) {
    super(
      basePath,
      // Set Controller Booter Options if passed in via bootConfig
      Object.assign({}, ControllerDefaults, controllerConfig),
    );
  }

  async load(): Promise<void> {
    await super.load();
    this.classes.forEach(cls => {
      this.bindController(cls);
    });
  }

  bindController(controllerClass: ControllerClass<unknown>) {
    const bindingKey = `controllers.${controllerClass.name}`;
    if (!this.application.isBound(bindingKey)) {
      this.application.controller(controllerClass);
    } else {
      return; // If already bound, skip
    }
  }
}

/**
 * Default ArtifactOptions for ControllerBooter.
 */
export const ControllerDefaults: ArtifactOptions = {
  dirs: ['controllers'],
  extensions: ['.controller.js'],
  nested: true,
};
