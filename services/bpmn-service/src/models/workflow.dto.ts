import {AnyObject, Model, model, property} from '@loopback/repository';

@model()
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
  params: AnyObject;

  constructor(data?: Partial<WorkflowDto>) {
    super(data);
  }
}
