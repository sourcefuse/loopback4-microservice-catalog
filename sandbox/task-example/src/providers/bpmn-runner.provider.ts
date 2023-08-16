import {BindingScope, Provider, bind} from '@loopback/core';
import {Variables} from 'camunda-external-task-client-js';
import {
  ProccessorFunction,
  Task,
  TaskKey,
  TaskPriority,
  TaskReturnMap,
  TaskSeverity,
  TaskStatus,
  TaskType,
  // @ts-ignore
} from '@sourceloop/task-service';

@bind({scope: BindingScope.SINGLETON})
export class BpmnRunner implements Provider<TaskReturnMap> {
  tasksArray: Task[] = [];

  value(): TaskReturnMap {
    const returnMap: TaskReturnMap = {
      workerFunctions: this.getWorkerFunctions(),
      tasksArray: this.tasksArray,
    };
    return returnMap;
  }

  private getWorkerFunctions(): Record<string, ProccessorFunction> {
    return {
      'read-payload': (task: any, taskService: any, payload?: any) => {
        return {payload, vars: null};
      },
      'check-vars': (task: any, taskService: any, payload?: any) => {
        const vars = new Variables();
        vars.set('payload_users', payload['payload_users']);
        vars.set('payload_user_groups', payload['payload_user_groups']);
        vars.set('payload_user_roles', payload['payload_user_roles']);
        return {payload, vars};
      },
      'fetch-users-from-group': (
        task: any,
        taskService: any,
        payload?: any,
      ) => {
        return {payload, vars: null};
      },
      'fetch-users-from-role': (task: any, taskService: any, payload?: any) => {
        return {payload, vars: null};
      },
      'create-tasks': (task: any, taskService: any, payload?: any) => {
        this.tasksArray.push({
          name: 'task1',
          key: TaskKey.sample_key,
          assigneeId: '05b496c7-c3b8-3b45-afc1-98ff4e395416',
          status: TaskStatus.pending,
          priority: TaskPriority.high,
          severity: TaskSeverity.high,
          type: TaskType.user,
        });
        return {payload, vars: null};
      },
    };
  }
}
