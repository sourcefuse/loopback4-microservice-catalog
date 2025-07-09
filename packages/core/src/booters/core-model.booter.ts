import {loadClassesFromFiles} from '@loopback/boot';
import {
  BindingScope,
  Component,
  Context,
  inject,
  injectable,
  MetadataInspector,
} from '@loopback/core';
import {glob} from 'glob';
import path from 'path';
import {OVERRIDE_MODEL_SCHEMA_KEY} from '../build-schema';
import {BaseBooter} from './base.booter';

@injectable({scope: BindingScope.SINGLETON})
export class CoreModelBooter extends BaseBooter {
  constructor(
    @inject.context()
    protected readonly context: Context,
  ) {
    super();
  }

  async discover(): Promise<void> {
    const pattern = path.join(this.projectRoot, '**', '*component.js');
    const filePaths = glob.sync(pattern, {nodir: true});
    this.classes = loadClassesFromFiles(filePaths, this.projectRoot);
  }

  async load(): Promise<void> {
    this.classes.forEach(cls => {
      let componentInstance: Component;
      try {
        componentInstance = this.context.getSync<Component>(
          `components.${cls.name}`,
        );
      } catch (_) {
        // If the component is not found, we skip it
        return;
      }

      const models = componentInstance?.models;

      if (models && Array.isArray(models)) {
        for (const model of models) {
          const newModel = this.context.getSync<Function>(
            'models.' + model.name,
          );
          MetadataInspector.defineMetadata(
            OVERRIDE_MODEL_SCHEMA_KEY,
            newModel,
            model,
          );
        }
      }
    });
  }
}
