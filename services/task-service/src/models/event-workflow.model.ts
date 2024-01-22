import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'event_workflows',
})
export class EventWorkflow extends UserModifiableEntity<EventWorkflow> {
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
    description:
      'An identifier for a particular event queued by a service or a user',
  })
  eventKey: string;

  @property({
    type: 'string',
    required: true,
    name: 'workflow_key',
    description: 'An identifier for a particular workflow',
  })
  workflowKey: string;
}
