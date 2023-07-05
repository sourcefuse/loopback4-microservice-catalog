import {REGEX} from '../utils';
import {SurveyCycle} from './survey-cycle.model';
import {Survey} from './survey.model';
import {model, property, belongsTo, AnyObject} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({name: 'survey_responders'})
export class SurveyResponder extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'first_name',
    jsonSchema: {
      nullable: true,
    },
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
    jsonSchema: {
      nullable: true,
    },
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: REGEX.EMAIL,
      minLength: 3,
      maxLength: 150,
    },
  })
  email: string;

  @property({
    type: 'string',
    name: 'full_name',
  })
  readonly fullName: string;

  @property({
    type: 'string',
    name: 'user_id',
    jsonSchema: {
      nullable: true,
    },
  })
  userId?: string;

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

  @belongsTo(
    () => SurveyCycle,
    {
      keyFrom: 'surveyCycleId',
      name: 'surveyCycle',
    },
    {
      name: 'survey_cycle_id',
    },
  )
  surveyCycleId?: string;

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

  constructor(data?: Partial<SurveyResponder>) {
    super(data);
  }
}

export interface SurveyResponderRelations {
  survey: Survey;
  surveyCycle: SurveyCycle;
}

export type SurveyResponderWithRelations = SurveyResponder &
  SurveyResponderRelations;
