// in task-service
import {Provider, bind, BindingScope} from '@loopback/core';
import {TaskReturnMap, ProccessorFunction} from '../types';

@bind({scope: BindingScope.SINGLETON})
export abstract class BaseBpmnRunner implements Provider<TaskReturnMap> {
  abstract getWorkerFunctions(): Record<string, ProccessorFunction>;

  value(): TaskReturnMap {
    return {
      workerFunctions: this.getWorkerFunctions(),
      tasksArray: [],
    };
  }
}
