import {model, property, hasMany} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Question} from './questions.model';
import {SurveyRecurrenceFrequency, SurveyStatus} from '../enum/question.enum';
import {SurveyCycle} from './survey-cycle.model';
import {SurveyResponder} from './survey-responder.model';
import {Section} from './section.model';
import {SurveyQuestion} from './survey-question.model';

@model({name: 'surveys'})
export class Survey extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
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
    type: 'string',
    required: true,
  })
  status: SurveyStatus;

  @property({
    type: 'boolean',
    required: true,
    name: 'is_periodic_reassessment',
  })
  isPeriodicReassessment: boolean;

  @property({
    name: 'recurrence_frequency',
    type: 'string',
    jsonSchema: {
      nullable: true,
      enum: [...Object.values(SurveyRecurrenceFrequency), null],
    },
  })
  recurrenceFrequency?: SurveyRecurrenceFrequency | null;

  @property({
    type: 'string',
    name: 'recurrence_end_date',
    jsonSchema: {nullable: true},
  })
  recurrenceEndDate?: string | null;

  @property({
    type: 'number',
    name: 'recurrence_end_after_occurrences',
    jsonSchema: {
      minimum: 0,
      maximum: 25,
    },
  })
  recurrenceEndAfterOccurrences?: number | null;

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

  constructor(data?: Partial<Survey>) {
    super(data);
  }
}

export interface SurveyRelations {
  sections?: Section[];
  questions?: Question[];
}

export type SurveyWithRelations = Survey & SurveyRelations;
