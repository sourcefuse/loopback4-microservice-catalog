import {AnyObject, Model, model, property} from '@loopback/repository';

@model()
export class MessageDTO extends Model {
  @property({
    type: 'string',
    required: true,
    description:
      'A short status message indicating the progress of the task service',
  })
  message: string;

  @property({
    type: 'string',
    required: true,
    description: 'An identifier for a particular message sent by the service',
  })
  key: string;

  @property({
    type: 'object',
    required: false,
    description: 'A dynamic object with no fixed structure',
  })
  payload?: AnyObject;

  @property({
    type: 'string',
    required: true,
    description:
      'An identifier for a particular event queued by a service or a user',
  })
  eventKey: string;

  @property({
    type: 'string',
    required: true,
    description:
      'An identifier for a particular task, which is part of an event',
  })
  taskKey: string;
}
