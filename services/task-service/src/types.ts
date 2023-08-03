// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */

import {AnyObject} from '@loopback/repository';

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface EventQueueConnector {
  name: string;
  settings: {[key: string]: any};
  connect(settings: {[key: string]: any}): Promise<any>;
  disconnect(settings: {[key: string]: any}): Promise<any>;
  ping(): Promise<any>;
}

export interface Event {
  key: EventKey;
  description: string;
  source: EventSource;
  payload: EventPayload;
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
  inputSchema: any;
}

export interface EventWorkflowMapping {
  eventKey: EventKey;
  workflowKey: WorkflowKey;
  config: any;
}

export interface Task {
  id: string;
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
  payload?: any;
  eventKey: EventKey;
  taskKey: TaskKey;
}

export enum EventKey {}
// Define your event keys as an enum

export enum EventSource {}
// Define your event sources as an enum

export enum TaskKey {}
// Define your task keys as an enum

export enum WorkflowKey {}
// Define your workflow keys as an enum

export enum EventKey {}
// Define your event keys as an enum

export enum EventSource {}
// Define your event sources as an enum

export enum TaskKey {}
// Define your task keys as an enum

export enum TaskStatus {}
// Define your task statuses as an enum

export enum TaskPriority {}
// Define your task priorities as an enum

export enum TaskSeverity {}
// Define your task severities as an enum

export enum TaskType {}
// Define your task types as an enum

export const TaskDbSourceName = 'taskdb';
