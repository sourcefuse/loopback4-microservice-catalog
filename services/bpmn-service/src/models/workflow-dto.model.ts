// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model({
  settings: {
    strict: false,
  },
})
export class WorkflowDto extends CoreModel<WorkflowDto> {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  bpmnFile: string;

  @property({
    type: 'object',
    required: true,
  })
  inputSchema: AnyObject;

  @property({
    type: 'string',
  })
  description: string;
}
