// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {
  WorkflowCacheSourceName,
  WorkflowServiceBindings,
} from '@sourceloop/bpmn-service';

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface Message {
  message: string;
  key: string;
  payload?: AnyObject;
  eventKey: string;
  taskKey: string;
}

export type ProccessorFunction = (
  task: AnyObject,
  taskService: AnyObject,
  payload: AnyObject,
) => {
  payload: AnyObject;
  vars: AnyObject | null;
};

export enum Source {
  TaskService = 'task-service',
  Kafka = 'kafka',
}

export type HttpOptions = {
  query?: AnyObject;
  urlParams?: AnyObject;
  headers?: AnyObject;
};

export enum EventType {
  SubTaskCompleted = 'sub-task-completed',
  TaskCreated = 'task-created',
  TaskCompleted = 'task-completed',
}

export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in progress',
  Completed = 'completed',
}

export enum SubTaskStatus {
  Pending = 'pending',
  Completed = 'completed',
}

export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum TaskSeverity {
  high = 'high',
  medium = 'medium',
  low = 'low',
}

export interface CamundaTask {
  id: string;
  name: string;
  created: string;
  description: string;
  processDefinitionId: string;
  processInstanceId: string;
  // it also has other properties but they are not relevant
}

export const TaskDbSourceName = 'taskdb';
export const WorkflowServiceSourceName = WorkflowCacheSourceName;
export const ExportedWorkflowServiceBindingConfig =
  WorkflowServiceBindings.Config;
