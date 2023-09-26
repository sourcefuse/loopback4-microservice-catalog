import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  ProxyBuilderBindings,
  ProxyBuilderComponent,
} from '../../../../components/proxy-builder';
import {
  ParentController,
  RestChildController,
  RestParentConfigController,
  RestParentController,
} from './controllers';
import {Child, Parent, ParentConfig} from './models';

export class TestApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.model(Child);
    this.model(Parent);
    this.model(ParentConfig);
    this.bind(ProxyBuilderBindings.CONFIG).to([
      {
        baseUrl: `http://127.0.0.1:3000`,
        configs: [
          {
            model: Parent,
            basePath: '/rest-parents',
            relations: [
              {
                name: 'children',
                serviceKey: `services.ChildProxy`,
              },
              {
                name: 'config',
                serviceKey: `services.ParentConfigProxy`,
              },
            ],
          },
          {
            model: Child,
            relations: [
              {
                name: 'parent',
                modelClass: Parent,
              },
              {
                name: 'siblings',
                serviceKey: 'services.ChildProxy',
                throughRelation: 'siblingRelations',
              },
            ],
          },
          ParentConfig,
        ],
      },
    ]);
    this.component(ProxyBuilderComponent);
    this.controller(ParentController);
    this.controller(RestChildController);
    this.controller(RestParentController);
    this.controller(RestParentConfigController);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
