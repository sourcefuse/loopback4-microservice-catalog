import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'jobs',
  settings: {
    strict: false,
  },
})
export class Job extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;
  @property({
    name: 'filter_used',
    type: 'object',
  })
  filterUsed: Object;

  @property({
    type: 'string',
  })
  result: string;

  constructor(data?: Partial<Job>) {
    super(data);
  }
}

export type JobWithRelations = Job;
