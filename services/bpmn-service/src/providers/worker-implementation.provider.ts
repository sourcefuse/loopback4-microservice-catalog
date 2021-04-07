import {inject, Provider} from '@loopback/context';
import {IWorkflowServiceConfig, WorkerImplementationFn} from '../types';
import {Client} from 'camunda-external-task-client-js';
import {WorkflowServiceBindings} from '../keys';
import {AnyObject} from '@loopback/repository';

export class WorkerImplementationProvider
  implements Provider<WorkerImplementationFn> {
  client: Client;
  constructor(
    @inject(WorkflowServiceBindings.Config)
    config: IWorkflowServiceConfig,
  ) {
    if (config.workflowEngineBaseUrl) {
      this.client = new Client({baseUrl: config.workflowEngineBaseUrl});
    } else {
      throw new Error('Invalid workflowEngine Config');
    }
  }
  value(): WorkerImplementationFn {
    return async (topic, cmd) => {
      if (this.client) {
        this.client.subscribe(topic, ({task, taskService}) => {
          cmd.operation({task, taskService}, (result: AnyObject) => {
            taskService.complete(task).catch(err => {
              throw err;
            });
          });
        });
      } else {
        throw new Error('Workflow client not connected');
      }
    };
  }
}
