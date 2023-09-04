// in task-service
import {Provider} from '@loopback/core';
import {TaskReturnMap, ProccessorFunction} from '../types';

export abstract class BaseBpmnRunner implements Provider<TaskReturnMap> {
  // must a return a map of functions
  // each fn is mapped to a service-task topic in a
  // bpmn. more info at examples/task-example
  abstract getWorkerFunctions(): Record<string, ProccessorFunction>;

  value(): TaskReturnMap {
    return {
      workerFunctions: this.getWorkerFunctions(),
      tasksArray: [],
    };
  }
}
