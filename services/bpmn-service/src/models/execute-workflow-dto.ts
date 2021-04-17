import {AnyObject, Model, model, property} from '@loopback/repository';

@model()
export class ExecuteWorkflowDto<T = AnyObject> extends Model {
  @property({
    type: 'number',
  })
  workflowVersion?: number;

  @property({
    type: 'object',
    required: true,
  })
  input: T;

  constructor(data?: Partial<ExecuteWorkflowDto<T>>) {
    super(data);
  }
}
