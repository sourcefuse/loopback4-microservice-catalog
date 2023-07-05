import {Survey} from './survey.model';
import {model, property, belongsTo, AnyObject} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({name: 'survey_cycles'})
export class SurveyCycle extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'start_date',
    description: 'Start date of the first survey cycle',
  })
  startDate: string;

  @property({
    type: 'string',
    required: true,
    name: 'end_date',
    description: 'End date of the first survey cycle',
  })
  endDate: string;

  @property({
    type: 'boolean',
    name: 'is_activated',
    default: false,
  })
  isActivated: boolean;

  createdByUser?: string;

  modifiedByUser?: string;

  @belongsTo(
    () => Survey,
    {
      keyFrom: 'surveyId',
      name: 'survey',
    },
    {
      name: 'survey_id',
    },
  )
  surveyId: string;

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

  constructor(data?: Partial<SurveyCycle>) {
    super(data);
  }
}

export interface SurveyCycleRelations {
  survey?: Survey;
}

export type SurveyCycleWithRelations = SurveyCycle & SurveyCycleRelations;
