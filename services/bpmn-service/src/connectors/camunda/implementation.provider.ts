// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {TopicSubscription} from 'camunda-external-task-client-js';
import {WorkerImplementationFn, WorkerNameCmdPair} from '../../types';
import {CLIENT} from './keys';
import {ClientWithSubscriptions} from './types';

export class CamundaImplementationProvider
  implements Provider<WorkerImplementationFn>
{
  private subscriptions: TopicSubscription[] = [];
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    private readonly ilogger: ILogger,
    @inject(CLIENT)
    private readonly camunda: ClientWithSubscriptions,
  ) {}
  value(): WorkerImplementationFn {
    return async worker => {
      if (this.camunda.client) {
        worker.running = true;
        this.camunda.subscriptions.push(this.subscribeToTopic(worker));
      } else {
        throw new Error('Workflow client not connected');
      }
    };
  }

  private subscribeToTopic(worker: WorkerNameCmdPair) {
    worker.running = true;
    return this.camunda.client.subscribe(
      worker.topic,
      ({task, taskService}: {task: AnyObject; taskService: AnyObject}) => {
        worker.command.operation({task, taskService}, (result: AnyObject) => {
          if (result) {
            this.ilogger.info(`Worker task completed - ${worker.topic}`);
          }
        });
      },
    );
  }
}
