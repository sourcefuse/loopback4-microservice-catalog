import {Model, model, property} from '@loopback/repository';

@model()
export class TaskDto extends Model {
  @property({
    type: 'string',
    required: true,
    description: 'An identifier for a particular task within an event',
  })
  taskKey: string;

  @property({
    type: 'object',
    description:
      'A dynamic object that contains information to be run in the user task of a bpmn engine',
  })
  payload?: object;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
}
