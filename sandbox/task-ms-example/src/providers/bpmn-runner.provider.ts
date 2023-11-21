import {bind, BindingScope} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  BaseBpmnRunner,
  ProccessorFunction,
  Task,
  TaskPriority,
  TaskReturnMap,
  TaskSeverity,
  TaskStatus,
  TaskType,
} from '@sourceloop/task-service';
import {Variables} from 'camunda-external-task-client-js';
import {designGroupUsers, devGroupUsers} from '../mock_users';

@bind({scope: BindingScope.SINGLETON})
export class CustomBpmnRunner extends BaseBpmnRunner {
  tasksArray: Task[] = [];

  value(): TaskReturnMap {
    const returnMap: TaskReturnMap = {
      workerFunctions: this.getWorkerFunctions(),
      tasksArray: this.tasksArray,
    };
    return returnMap;
  }

  /* eslint-disable */
  getWorkerFunctions(): Record<string, ProccessorFunction> {
    return {
      'read-payload': (
        task: AnyObject,
        taskService: AnyObject,
        payload: AnyObject,
      ) => {
        return {payload, vars: null};
      },
      'check-vars': (
        task: AnyObject,
        taskService: AnyObject,
        payload: AnyObject,
      ) => {
        const vars = new Variables();

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

        return {payload, vars};
      },
      'fetch-users-from-group': (
        task: AnyObject,
        taskService: AnyObject,
        payload: AnyObject,
      ) => {
        const userGroupsFromPayload = payload['fetch_from_groups'];
        let users: AnyObject[] = this.getUsersFromGroups(userGroupsFromPayload);
        let assignedTasks = this.assignTasksToUsers(users, payload['tasks']);

        if (assignedTasks.length > 0) {
          payload['assignedTasks'] = assignedTasks;
        }

        return {payload, vars: null};
      },
      'fetch-users-from-role': (
        task: AnyObject,
        taskService: AnyObject,
        payload: AnyObject,
      ) => {
        return {payload, vars: null};
      },
      'create-tasks': (
        task: AnyObject,
        taskService: AnyObject,
        payload: AnyObject,
      ) => {
        if (payload['assignedTasks'] && payload['assignedTasks'].length > 0) {
          for (const task of payload['assignedTasks']) {
            this.tasksArray.push(task);
          }
        }

        return {payload, vars: null};
      },
    };
  }

  getUsersFromGroups(groups: string[]): AnyObject[] {
    let users: AnyObject[] = [];
    if (groups && groups.length > 0) {
      for (const group of groups) {
        switch (group) {
          case 'dev_group':
            users = [...users, ...devGroupUsers];
            break;
          case 'design_group':
            users = [...users, ...designGroupUsers];
            break;
          // Add more groups if needed
        }
      }
    }
    return users;
  }

  assignTasksToUsers(users: AnyObject[], tasks: AnyObject[]): AnyObject[] {
    if (!users.length || !tasks.length) return [];

    return tasks.flatMap(task =>
      users
        .filter(user => task.assignee === user.name)
        .map(user => ({
          assigneeId: user.id,
          name: task.name,
          key: task.key,
          status: TaskStatus.pending,
          priority: TaskPriority.high,
          severity: TaskSeverity.high,
          type: TaskType.user,
        })),
    );
  }
}
