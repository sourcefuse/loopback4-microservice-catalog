import {
  ArtifactOptions,
  BaseArtifactBooter,
  loadClassesFromFiles,
} from '@loopback/boot';
import {
  BindingScope,
  Component,
  config,
  Context,
  CoreBindings,
  inject,
  injectable,
  MetadataInspector,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {glob} from 'glob';
import path from 'path';
import {OVERRIDE_MODEL_SCHEMA_KEY} from '../build-schema';

@injectable({scope: BindingScope.SINGLETON})
export class CoreModelBooter extends BaseArtifactBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected application: RestApplication,
    @inject('paths.base', {optional: true})
    protected basePath: string = path.resolve(__dirname, '..'),
    @config()
    public artifactConfig: ArtifactOptions = {},
    @inject.context()
    protected readonly context: Context,
  ) {
    super(basePath, Object.assign({}, artifactConfig));
  }

  async discover(): Promise<void> {
    const pattern = path.join(this.projectRoot, '**', '*component.js');
    const filePaths = glob.sync(pattern, {nodir: true});
    this.classes = loadClassesFromFiles(filePaths, this.basePath);
  }

  async load(): Promise<void> {
    await this.discover();
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
