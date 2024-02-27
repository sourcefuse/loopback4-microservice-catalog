import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'state_tracking',
  description: 'This model represents a state tracking for the ingested data',
})
export class StateTracking extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    description: 'The unique identifier for a state tracking',
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    description: 'The state of the ingested data',
  })
  state: string;

  @property({
    type: 'string',
    description: 'The payload of the ingested data',
  })
  payload?: string;

  @property({
    type: 'string',
    required: true,
    name: 'record_type',
    description: 'The type of the ingested data',
  })
  recordType: string;

  @property({
    type: 'date',
    required: true,
    description: 'The timestamp of the ingested data',
  })
  timestamp: Date;

  @property({
    type: 'string',
    description: 'The error of the ingested data if any',
  })
  error?: string;

  @property({
    type: 'string',
    required: true,
    name: 'record_id',
    description: 'The id of the ingested data',
  })
  recordId: string;
}
