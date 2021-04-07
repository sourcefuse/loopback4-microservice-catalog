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

  constructor(data?: Partial<WorkflowDto>) {
    super(data);
  }
}
