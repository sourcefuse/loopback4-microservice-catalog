import {BindingScope, Provider, bind} from '@loopback/core';
import {Variables} from 'camunda-external-task-client-js';

@bind({scope: BindingScope.TRANSIENT})
export class BpmnRunner implements Provider<any> {
  value() {
    // custom methods
    return {
      wf: this.getWorkerFunctions(),
      ta: this.getTasksArray(),
    };
  }

  private getWorkerFunctions() {
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
        const tasksArray = this.getTasksArray();
        tasksArray.push({
          name: 'task1',
          assignee: 'testuser',
        });
        return {payload, vars: null};
      },
    };
  }

  private getTasksArray(): any[] {
    return [
      // You can initialize with some default tasks if needed
    ];
  }
}
