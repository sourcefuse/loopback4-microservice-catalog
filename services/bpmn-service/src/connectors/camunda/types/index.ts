// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, TopicSubscription} from 'camunda-external-task-client-js';

export * from './case-definition';
export * from './decision-definition';
export * from './decision-requirements-definition';
export * from './deployement-with-definitions';
export * from './process';
export * from './process-definition';
export * from './types';
export * from './variable';

export interface CamundaTask {
  id: string;
  name: string;
  created: string;
  description: string;
  processDefinitionId: string;
  processInstanceId: string;
  // it also has other properties but they are not relevant
}

export type ClientWithSubscriptions = {
  client: Client;
  subscriptions: TopicSubscription[];
};
