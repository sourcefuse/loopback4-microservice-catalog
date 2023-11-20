import {AnyObject} from '@loopback/repository';

export interface TaskOperationServiceInterface {
  processTask: (
    id: string,
    name: string,
    key: string,
    payload?: AnyObject,
  ) => Promise<void>;

  taskUpdateFlow: (taskKey: string, payload?: AnyObject) => Promise<void>;
}
