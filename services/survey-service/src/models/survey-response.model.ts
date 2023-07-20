import {
  AnyObject,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {SurveyCycle} from './survey-cycle.model';
import {SurveyResponder} from './survey-responder.model';
import {SurveyResponseDetail} from './survey-response-detail.model';

@model({name: 'survey_cycle_responses'})
export class SurveyResponse extends UserModifiableEntity<SurveyResponse> {
  @property({
    type: 'string',
    id: true,
    generated: true,
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
      type: 'string',
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
      type: 'string',
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
}

export interface SurveyResponseRelations {
  surveyCycle?: SurveyCycle;
  surveyResponseDetails?: SurveyResponseDetail[];
}

export type SurveyResponseWithRelations = SurveyResponse &
  SurveyResponseRelations;
