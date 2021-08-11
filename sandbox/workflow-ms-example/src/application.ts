import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  BPMTask,
  WorkflowServiceBindings,
  WorkflowServiceComponent,
} from '@sourceloop/bpmn-service';
import path from 'path';
import {SayHelloCommand} from './commands/sayhello.command';
import {BpmnProvider} from './providers/bpmn.provider';

export {ApplicationConfig};

export class WorkflowHelloworldApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(WorkflowServiceBindings.Config).toDynamicValue(() => {
      return {
        useCustomSequence: false,
        workflowEngineBaseUrl: process.env.CAMUNDA_URL,
      };
    });
    this.component(WorkflowServiceComponent);

    this.bind(WorkflowServiceBindings.WorkflowManager).toProvider(BpmnProvider);
    this.registerWorkers().catch(err => {
      throw new Error('Error while registering workers.');
    });

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

  private async registerWorkers() {
    const registerFn = await this.getValueOrPromise(
      WorkflowServiceBindings.RegisterWorkerFunction,
    );
    if (registerFn) {
      const cmd = new SayHelloCommand();
      await registerFn('hello_world', cmd.topic, new BPMTask(cmd));
    } else {
      throw new Error('No worker register function in the context');
    }
  }
}
