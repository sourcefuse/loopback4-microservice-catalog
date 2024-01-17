// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {WorkflowDto} from '@sourceloop/bpmn-service';

export const MOCK_CAMUNDA = 'https://mock-camunda.api/engine-rest';

export const firstTestBpmn: WorkflowDto = new WorkflowDto({
  name: 'first-bpmn',
  bpmnFile: JSON.stringify(['topic1', 'topic2']),
  description: 'test description',
  inputSchema: {
    type: 'object',
    properties: {valueA: {type: 'string'}, valueB: {type: 'string'}},
    required: ['valueA', 'valueB'],
  },
});

export const firstTestBpmnInput = {
  valueA: 'string',
  valueB: 'string',
};
