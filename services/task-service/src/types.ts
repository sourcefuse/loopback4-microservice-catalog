﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {
  WorkflowCacheSourceName,
  WorkflowServiceBindings,
} from '@sourceloop/bpmn-service';
import {
  TaskService as CamundaTaskService,
  Task,
} from 'camunda-external-task-client-js';
import {IEvent} from './interfaces';

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
  UserTaskCompleted = 'user-task-completed',
  TaskCreated = 'task-created',
  TaskCompleted = 'task-completed',
}

export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in progress',
  Completed = 'completed',
}

export enum UserTaskStatus {
  Pending = 'pending',
  Completed = 'completed',
}

export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum TaskSeverity {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
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

export type EventFilter = (event: IEvent) => boolean;

export type CamundaTaskParameters = {
  task: Task;
  taskService: CamundaTaskService;
};

export type TaskServiceConfig = {
  useCustomSequence: boolean;
};

export type User = {
  username: string;
  userTenantId: string;
};
