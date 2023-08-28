import {
  AnyObject,
  DataObject,
  Model,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Question} from './questions.model';
import {Section} from './section.model';
import {SurveyCycle} from './survey-cycle.model';
import {SurveyQuestion} from './survey-question.model';
import {SurveyResponder} from './survey-responder.model';

@model({name: 'surveys'})
export class Survey<T = DataObject<Model>> extends UserModifiableEntity<
  T & Survey
> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'uid',
  })
  uid: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
      maxLength: 500,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    name: 'survey_text',
  })
  surveyText: string;

  @property({
    type: 'string',
    name: 'start_date',
    description: 'Start date of the survey',
  })
  startDate: string;

  @property({
    type: 'string',
    name: 'end_date',
    description: 'End date of the survey',
  })
  endDate: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'boolean',
    name: 'is_enable_weights',
    default: false,
  })
  isEnableWeights: boolean;

  @hasMany(() => Question, {
    through: {
      model: () => SurveyQuestion,
      keyFrom: 'surveyId',
      keyTo: 'questionId',
    },
  })
  questions: Question[];

  @hasMany(() => SurveyCycle, {
    keyTo: 'surveyId',
  })
  surveyCycles: SurveyCycle[];

  @hasMany(() => SurveyResponder, {
    keyTo: 'surveyId',
  })
  surveyResponders: SurveyResponder[];

  @hasMany(() => Section, {
    keyTo: 'surveyId',
  })
  sections: Section[];

  @property({
    type: 'string',
    name: 'base_survey_id',
    jsonSchema: {
      nullable: true,
    },
  })
  baseSurveyId?: string;

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
}

export interface SurveyRelations {
  sections?: Section[];
  questions?: Question[];
  surveyCycles?: SurveyCycle[];
}

export type SurveyWithRelations = Survey & SurveyRelations;
