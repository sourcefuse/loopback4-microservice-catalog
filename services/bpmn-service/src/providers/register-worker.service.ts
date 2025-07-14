// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject, Provider, Setter} from '@loopback/context';
import {WorkflowServiceBindings} from '../keys';
import {WorkerMap, WorkerRegisterFn} from '../types';

export class WorkerRegisterFnProvider implements Provider<WorkerRegisterFn> {
  constructor(
    @inject.getter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapGetter: Getter<WorkerMap>,
    @inject.setter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapSetter: Setter<WorkerMap>,
  ) {}

  value(): WorkerRegisterFn {
    return async (workflowName, topic, command) => {
      let workerMap = await this.workerMapGetter();
      workerMap ??= {};
      if (workerMap[workflowName]) {
        workerMap[workflowName].push({
          topic,
          command,
          running: false,
          isInProgress: false,
        });
      } else {
        workerMap[workflowName] = [
          {topic, command, running: false, isInProgress: false},
        ];
        this.workerMapSetter(workerMap);
      }
    };
  }
}
