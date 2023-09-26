// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */

import {AnyObject} from '@loopback/repository';
import {
  WorkflowCacheSourceName,
  WorkflowServiceBindings,
} from '@sourceloop/bpmn-service';

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface EventQueueConnector {
  name: string;
  settings: {[key: string]: AnyObject};
  connect(settings: {[key: string]: AnyObject}): Promise<AnyObject>;
  disconnect(settings: {[key: string]: AnyObject}): Promise<void>;
  ping(): Promise<HealthResponse>;
}

export interface HealthResponse {
  greeting: string;
  date: string;
  url: string;
  headers: {
    [key: string]: string;
  };
}

export enum TaskServiceNames {
  EVENT = 'event',
  TASK = 'task',
  UPDATE = 'update',
  CHECK = 'check',
}

export interface EventPayload {
  workflowId: string;
  command: string;
  commandParams: AnyObject;
}

export interface Workflow {
  key: WorkflowKey;
  name: string;
  description: string;
  provider: string;
  inputSchema: AnyObject;
}

export interface EventWorkflowMapping {
  eventKey: EventKey;
  workflowKey: WorkflowKey;
  config: AnyObject;
}

export interface Task {
  id?: string;
  key: TaskKey;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  severity: TaskSeverity;
  type: TaskType;
  startDate?: Date;
  dueDate?: Date;
  endDate?: Date;
  assigneeId: string;
}

export interface Message {
  message: string;
  key: string;
  payload?: AnyObject;
  eventKey: EventKey;
  taskKey: TaskKey;
}

export type TaskReturnMap = {
  workerFunctions: Record<string, ProccessorFunction>;
  tasksArray: Task[];
};

export type ProccessorFunction = (
  task: AnyObject,
  taskService: AnyObject,
  payload: AnyObject,
) => {
  payload: AnyObject;
  vars: AnyObject | null;
};

export enum EventKey {}
// Define your event keys as an enum

export enum EventSource {}
// Define your event sources as an enum

export enum TaskKey {
  sample_key = 'sample',
}
// Define your task keys as an enum

export enum WorkflowKey {}
// Define your workflow keys as an enum

export enum TaskStatus {
  pending = 'pending',
  in_progress = 'in progress',
  completed = 'completed',
}
// Define your task statuses as an enum

export enum TaskPriority {
  high = 'high',
}
// Define your task priorities as an enum

export enum TaskSeverity {
  high = 'high',
}
// Define your task severities as an enum

export enum TaskType {
  user = 'user',
  workflow = 'workflow',
}
// Define your task types as an enum

export const TaskDbSourceName = 'taskdb';
export const WorkflowServiceSourceName = WorkflowCacheSourceName;
export const ExportedWorkflowServiceBindingConfig =
  WorkflowServiceBindings.Config;
