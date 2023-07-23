import {
  AnyObject,
  DataObject,
  Model,
  belongsTo,
  model,
  property,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Question} from './questions.model';
import {Section} from './section.model';
import {Survey} from './survey.model';

@model({name: 'survey_questions'})
export class SurveyQuestion<T = DataObject<Model>> extends UserModifiableEntity<
  T & SurveyQuestion
> {
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
  @belongsTo(
    () => Section,
    {
      keyFrom: 'sectionId',
      name: 'section',
    },
    {
      name: 'section_id',
    },
  )
  sectionId: string;

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

export type SurveyQuestionWithRelations = SurveyQuestion;
