import {ArtifactOptions} from '@loopback/boot';
import {
  BindingScope,
  ControllerClass,
  CoreBindings,
  inject,
  injectable,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {BaseBooter} from './base.booter';

@injectable({scope: BindingScope.SINGLETON})
export class CoreControllerBooter extends BaseBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected application: RestApplication,
  ) {
    super();
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
