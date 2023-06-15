import {
  model,
  property,
  belongsTo,
  hasMany,
  AnyObject,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {SurveyResponder} from './survey-responder.model';
import {SurveyCycle} from './survey-cycle.model';
import {SurveyResponseDetail} from './survey-response-detail.model';

@model({name: 'survey_cycle_responses'})
export class SurveyResponse extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @belongsTo(
    () => SurveyResponder,
    {
      keyFrom: 'surveyResponderId',
      name: 'surveyResponder',
    },
    {
      name: 'survey_responder_id',
      required: true,
    },
  )
  surveyResponderId: string;

  @belongsTo(
    () => SurveyCycle,
    {
      keyFrom: 'surveyCycleId',
      name: 'surveyCycle',
    },
    {
      name: 'survey_cycle_id',
      required: true,
    },
  )
  surveyCycleId: string;

  createdByUser?: string;

  modifiedByUser?: string;

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

  @hasMany(() => SurveyResponseDetail, {
    keyTo: 'surveyResponseId',
    keyFrom: 'id',
  })
  surveyResponseDetails?: SurveyResponseDetail[];

  constructor(data?: Partial<SurveyResponse>) {
    super(data);
  }
}

export interface SurveyResponseRelations {
  surveyCycle?: SurveyCycle;
  surveyResponseDetails?: SurveyResponseDetail[];
}

export type SurveyResponseWithRelations = SurveyResponse &
  SurveyResponseRelations;
