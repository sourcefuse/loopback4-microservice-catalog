import {model, property, belongsTo, hasMany} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {SurveyResponder} from './survey-responder.model';
import {SurveyCycle} from './survey-cycle.model';
import {SurveyResponseDetail} from './survey-response-detail.model';

@model({name: 'survey_response'})
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

  @hasMany(() => SurveyResponseDetail)
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
