import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {QuestionTemplate} from './question-template.model';
import {Question} from './questions.model';

@model({name: 'template_questions'})
export class TemplateQuestion extends UserModifiableEntity<TemplateQuestion> {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'number',
    name: 'display_order',
  })
  displayOrder?: number;

  @property({
    type: 'boolean',
    name: 'is_mandatory',
  })
  isMandatory?: boolean;

  @property({
    type: 'number',
    jsonSchema: {
      maximum: 100,
      minimum: 0,
    },
  })
  weight?: number;

  @belongsTo(
    () => QuestionTemplate,
    {
      keyFrom: 'templateId',
      name: 'template',
    },
    {
      name: 'template_id',
    },
  )
  templateId: string;

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
    () => TemplateQuestion,
    {
      keyFrom: 'dependentOnQuestionId',
      name: 'dependentOnQuestion',
    },
    {
      name: 'dependent_on_question_id',
      jsonSchema: {nullable: true},
    },
  )
  dependentOnQuestionId: string;

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

export interface TemplateQuestionRelations {
  question: Question;
}

export type TemplateQuestionWithRelations = TemplateQuestion &
  TemplateQuestionRelations;
