import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'event_workflow_mapping',
})
export class EventWorkflowMapping extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'event_key',
  })
  eventKey: string;

  @property({
    type: 'string',
    required: true,
    name: 'workflow_key',
  })
  workflowKey: string;
}
