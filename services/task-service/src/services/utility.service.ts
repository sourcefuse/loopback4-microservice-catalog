import {BindingScope, Getter, inject, injectable} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {
  WorkflowServiceBindings,
  WorkerMap,
  WorkerNameCmdPair,
} from '@sourceloop/bpmn-service';

import {v4 as uuidv4} from 'uuid';

@injectable({scope: BindingScope.TRANSIENT})
export class UtilityService {
  constructor(
    @inject.getter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapGetter: Getter<WorkerMap>,
  ) {}

  public transformObject(obj?: AnyObject) {
    const transformed: AnyObject = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        transformed[key] = {value: obj[key]};
      }
    }

    return transformed;
  }

  public async iterateWorkerMap(
    workflowName: string,
    callback: (
      worker: WorkerNameCmdPair<AnyObject, AnyObject>,
    ) => Promise<boolean>,
  ): Promise<boolean> {
    const workerMap = await this.workerMapGetter();
    if (workerMap?.[workflowName]) {
      for (const worker of workerMap[workflowName]) {
        const result = await callback(worker);
        if (result) {
          return true;
        }
      }
    }
    return false;
  }

  public generateApiKeyAndSecret(): {apiKey: string; apiSecret: string} {
    const apiKey = uuidv4();
    const apiSecret = uuidv4();
    return {apiKey, apiSecret};
  }
}
