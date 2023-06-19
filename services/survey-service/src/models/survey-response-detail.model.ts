import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {SurveyResponse} from './survey-response.model';
import {Question} from './questions.model';
import {QuestionType} from '../enum/question.enum';
import {Options} from './options.model';

@model({name: 'survey_response_detail'})
export class SurveyResponseDetail extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @belongsTo(
    () => SurveyResponse,
    {
      keyFrom: 'surveyResponseId',
      name: 'surveyResponse',
    },
    {
      type: 'string',
      name: 'survey_response_id',
      required: true,
    },
  )
  surveyResponseId: string;

  @belongsTo(
    () => Question,
    {
      keyFrom: 'questionId',
      name: 'question',
    },
    {
      type: 'string',
      name: 'question_id',
      required: true,
    },
  )
  questionId: string;

  @property({
    type: 'string',
    jsonSchema: {
      maximum: 100,
      minimum: 0,
    },
  })
  score?: number;

  @property({
    type: 'string',
    required: true,
    name: 'response_type',
    jsonSchema: {
      enum: [...Object.values(QuestionType), null],
    },
  })
  responseType: QuestionType;

  @property({
    type: 'string',
    name: 'text_answer',
  })
  textAnswer?: string;

  @belongsTo(
    () => Options,
    {
      keyFrom: 'optionId',
      name: 'option',
    },
    {
      type: 'string',
      name: 'option_id',
    },
  )
  optionId: string;

  constructor(data?: Partial<SurveyResponseDetail>) {
    super(data);
  }
}
