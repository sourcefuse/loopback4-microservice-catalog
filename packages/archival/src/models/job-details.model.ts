import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';
import {JobStatus} from '../types';

@model({
  name: 'job_details',
  settings: {
    strict: false,
  },
})
export class JobDetails extends CoreEntity<JobDetails> {
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
    name: 'filter_inquired',
    type: 'object',
  })
  filterInquired: Object;

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

export type JobDetailsWithRelations = JobDetails;
