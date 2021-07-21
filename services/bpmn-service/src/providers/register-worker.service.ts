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
      if (!workerMap) {
        workerMap = {};
      }
      if (workerMap[workflowName]) {
        workerMap[workflowName].push({topic, command, running: false});
      } else {
        workerMap[workflowName] = [{topic, command, running: false}];
        this.workerMapSetter(workerMap);
      }
    };
  }
}
