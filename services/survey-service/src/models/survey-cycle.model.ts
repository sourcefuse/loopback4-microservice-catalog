import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Survey} from './survey.model';

@model({name: 'survey_cycles'})
export class SurveyCycle extends UserModifiableEntity<SurveyCycle> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'start_date',
    description: 'Start date of the first survey cycle',
  })
  startDate: string;

  @property({
    type: 'string',
    name: 'end_date',
    description: 'End date of the first survey cycle',
  })
  endDate: string;

  @property({
    type: 'boolean',
    name: 'is_activated',
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
}

export interface SurveyCycleRelations {
  survey?: Survey;
}

export type SurveyCycleWithRelations = SurveyCycle & SurveyCycleRelations;
