import {AnyObject, Model, model, property} from '@loopback/repository';

@model()
export class ExecutionRequestDto extends Model {

  @property({
    type: 'number',
  })
  workflowVersion?: number;

  @property({
    type: 'object',
    required: true,
  })
  input: AnyObject;

  constructor(data?: Partial<ExecutionRequestDto>) {
    super(data);
  }
}
