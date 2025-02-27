// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {Client, logger} from 'camunda-external-task-client-js';
import {WorkflowServiceBindings} from '../keys';
import {IWorkflowServiceConfig, WorkerImplementationFn} from '../types';

export class WorkerImplementationProvider
  implements Provider<WorkerImplementationFn>
{
  client: Client;
  constructor(
    @inject(WorkflowServiceBindings.Config)
    config: IWorkflowServiceConfig,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly ilogger: ILogger,
  ) {
    if (config.workflowEngineBaseUrl) {
      this.client = new Client({
        baseUrl: config.workflowEngineBaseUrl,
        use: logger,
      });
    } else {
      throw new Error('Invalid workflowEngine Config');
    }
  }
  value(): WorkerImplementationFn {
    return async worker => {
      if (this.client) {
        worker.isInProgress = false;
        worker.running = true;
        const subscription = this.client.subscribe(
          worker.topic,
          ({task, taskService}) => {
            if (worker.isInProgress) return;
            worker.isInProgress = true;
            worker.command.operation(
              {task, taskService},
              (result: AnyObject) => {
                if (result) {
                  this.ilogger.info(`Worker task completed - ${worker.topic}`);
                }
                worker.isInProgress = false;
              },
            );
          },
        );
        this.client.on('poll:error', () => {
          worker.running = false;
          worker.isInProgress = false;
          subscription.unsubscribe();
        });
      } else {
        throw new Error('Workflow client not connected');
      }
    };
  }
}
