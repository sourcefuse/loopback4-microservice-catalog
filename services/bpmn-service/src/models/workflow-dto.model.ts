// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, Model, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
  },
})
export class WorkflowDto extends Model {
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

  constructor(data?: Partial<WorkflowDto>) {
    super(data);
  }
}
