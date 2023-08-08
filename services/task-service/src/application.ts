// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import * as path from 'path';
import {TaskServiceComponent} from './component';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {
  WorkflowServiceComponent,
  WorkflowServiceBindings,
} from '@sourceloop/bpmn-service';
import {BpmnProvider} from './providers/bpmn.provider';

export {ApplicationConfig};

export class TaskServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.component(TaskServiceComponent);

    this.projectRoot = __dirname;

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(WorkflowServiceComponent);

    this.bind(WorkflowServiceBindings.Config).to({
      useCustomSequence: true,
      workflowEngineBaseUrl: process.env.CAMUNDA_URL,
    });

    this.bind(WorkflowServiceBindings.WorkflowManager).toProvider(BpmnProvider);

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
