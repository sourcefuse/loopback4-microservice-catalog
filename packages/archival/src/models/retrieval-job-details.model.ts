import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';
import {JobStatus} from '../types';

@model({
  name: 'retrieval_job_details',
  settings: {
    strict: false,
  },
})
export class RetrievalJobDetails extends CoreEntity<RetrievalJobDetails> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['Failed', 'Success', 'In Progress'],
    },
  })
  status: JobStatus;

  @property({
    name: 'filter',
    type: 'object',
  })
  filter: Object;

  @property({
    name: 'entity',
    type: 'string',
  })
  entity: string; //Entity Name

  @property({
    type: 'string',
  })
  result: string;
}

export type RetrievalJobDetailsWithRelations = RetrievalJobDetails;
