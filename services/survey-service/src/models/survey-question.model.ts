import {model, property, hasOne, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Survey} from './survey.model';
import {Question} from './questions.model';

@model({name: 'survey_questions'})
export class SurveyQuestion extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
    name: 'display_order',
  })
  displayOrder: number;

  @property({
    type: 'boolean',
    name: 'is_mandatory',
    default: false,
  })
  isMandatory: boolean;

  @belongsTo(
    () => SurveyQuestion,
    {
      keyFrom: 'dependentOnQuestionId',
      name: 'dependentOnQuestion',
    },
    {
      name: 'dependent_on_question_id',
      jsonSchema: {
        nullable: true,
      },
    },
  )
  dependentOnQuestionId?: string;

  @property({
    type: 'number',
    jsonSchema: {
      maximum: 100,
      minimum: 0,
    },
  })
  weight?: number;

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

  @belongsTo(
    () => Question,
    {
      keyFrom: 'questionId',
      name: 'question',
    },
    {
      name: 'question_id',
    },
  )
  questionId: string;

  constructor(data?: Partial<SurveyQuestion>) {
    super(data);
  }
}

export interface SurveyQuestionRelations {}

export type SurveyQuestionWithRelations = SurveyQuestion &
  SurveyQuestionRelations;
