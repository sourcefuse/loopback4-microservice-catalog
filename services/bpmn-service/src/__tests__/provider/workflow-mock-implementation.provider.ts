// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {ILogger, LOGGER} from '@sourceloop/core';
import {IWorkflowServiceConfig, WorkerImplementationFn} from '../../types';
import {WorkflowServiceBindings} from '../../keys';
import {MOCK_BPMN_ENGINE_KEY} from '../types';
import {MockEngine} from '../mock-engine';

export class WorkerMockImplementationProvider
  implements Provider<WorkerImplementationFn>
{
  constructor(
    @inject(WorkflowServiceBindings.Config)
    config: IWorkflowServiceConfig,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly ilogger: ILogger,
    @inject(MOCK_BPMN_ENGINE_KEY)
    private readonly engine: MockEngine,
  ) {}
  value(): WorkerImplementationFn {
    return async worker => {
      worker.running = true;
      this.engine.subscribe(worker.topic, (data, finish) => {
        worker.command.operation(
          {
            data,
            finish,
          },
          () => {
            this.ilogger.info(`completed ${worker.topic}`);
          },
        );
      });
    };
  }
}
