import {BindingScope, Provider, bind} from '@loopback/core';
import {
  ProccessorFunction,
  Task,
  TaskPriority,
  TaskReturnMap,
  TaskSeverity,
  TaskStatus,
  TaskType,
} from '../types';
import {Variables} from 'camunda-external-task-client-js';
import {design_group_users, dev_group_users} from '../mock_users';

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

        // console.log(task.variables.getAll());

        if (payload['users'].length == 0) {
          vars.set('payload_users', 'false');
        } else {
          vars.set('payload_users', 'true');
        }

        if (payload['fetch_from_roles'].length == 0) {
          vars.set('payload_user_roles', 'false');
        } else {
          vars.set('payload_user_roles', 'true');
        }

        if (payload['fetch_from_groups'].length == 0) {
          vars.set('payload_user_groups', 'false');
        } else {
          vars.set('payload_user_groups', 'true');
        }

        // console.log(vars.getAll());

        return {payload, vars};
      },
      'fetch-users-from-group': (
        task: any,
        taskService: any,
        payload?: any,
      ) => {
        // mock an api call to an external service
        // and get users

        // got users from external db or
        // some service

        const userGroupsFromPayload = payload['fetch_from_groups'];
        let users: any[] = [];
        if (userGroupsFromPayload && userGroupsFromPayload.length > 0) {
          for (const group of userGroupsFromPayload) {
            // for example- make an api call to fetch users
            // here for demonstrations purposes, we just get
            // some static users

            if (group == 'dev_group') {
              users = [...users, ...dev_group_users];
            }

            if (group == 'design_group') {
              users = [...users, ...design_group_users];
            }
          }

          let assignedTasks = [];

          if (users.length > 0 && payload['tasks'].length > 0) {
            // assign tasks to the users
            // make an array and pass it in the payload
            for (const task of payload['tasks']) {
              for (const user of users) {
                if (task.assignee == user.name) {
                  assignedTasks.push({
                    assigneeId: user.id,
                    name: task.name,
                    key: task.key,
                    status: TaskStatus.pending,
                    priority: TaskPriority.high,
                    severity: TaskSeverity.high,
                    type: TaskType.user,
                  });
                }
              }
            }
          }

          if (assignedTasks.length > 0) {
            payload['assignedTasks'] = assignedTasks;
          }
        }

        return {payload, vars: null};
      },
      'fetch-users-from-role': (task: any, taskService: any, payload?: any) => {
        return {payload, vars: null};
      },
      'create-tasks': (task: any, taskService: any, payload?: any) => {
        console.log(task.variables.getAll());

        if (payload['assignedTasks'] && payload['assignedTasks'].length > 0) {
          for (const task of payload['assignedTasks']) {
            this.tasksArray.push(task);
          }
        }
        // console.log(payload);
        // console.log(this.tasksArray);
        return {payload, vars: null};
      },
    };
  }
}
