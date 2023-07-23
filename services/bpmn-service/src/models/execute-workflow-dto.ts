// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class ExecuteWorkflowDto<T = AnyObject> extends CoreModel<
  ExecuteWorkflowDto<T>
> {
  @property({
    type: 'number',
  })
  workflowVersion?: number;

  @property({
    type: 'object',
    required: true,
  })
  input: T;
}
