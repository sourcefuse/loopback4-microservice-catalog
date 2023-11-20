import {AnyObject} from '@loopback/repository';
import {WorkerNameCmdPair} from '@sourceloop/bpmn-service';
import {ClientAppDTO} from '../models';

export interface UtilityServiceInterface {
  transformObject(obj?: AnyObject): AnyObject;
  iterateWorkerMap(
    workflowName: string,
    callback: (
      worker: WorkerNameCmdPair<AnyObject, AnyObject>,
    ) => Promise<boolean>,
  ): Promise<boolean>;
  generateApiKeyAndSecret(clientApp: ClientAppDTO): {
    apiKey: string;
    apiSecret: string;
  };
}
