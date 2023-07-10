import {Options} from './options.model';
import {
  model,
  property,
  belongsTo,
  hasMany,
  hasOne,
  AnyObject,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {QuestionType} from '../enum/question.enum';
import {Survey} from './survey.model';
import {SurveyResponseDetail} from './survey-response-detail.model';

@model({name: 'questions'})
export class Question extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'uid',
  })
  uid: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 1000,
    },
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
    required: true,
    name: 'question_type',
    jsonSchema: {
      enum: [...Object.values(QuestionType), null],
    },
  })
  questionType: QuestionType;

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

  @property({
    type: 'boolean',
    default: false,
    name: 'is_score_enabled',
  })
  isScoreEnabled?: boolean;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_followup_enabled',
  })
  isFollowupEnabled?: boolean;

  @property({
    type: 'object',
  })
  validation?: object;

  @belongsTo(
    () => Question,
    {
      keyFrom: 'rootQuestionId',
      name: 'rootQuestion',
    },
    {
      name: 'root_question_id',
    },
  )
  rootQuestionId?: string;

  @belongsTo(
    () => Question,
    {
      keyFrom: 'parentQuestionId',
      name: 'parentQuestion',
    },
    {
      name: 'parent_question_id',
      jsonSchema: {nullable: true},
    },
  )
  parentQuestionId?: string;

  @hasMany(() => Options, {keyTo: 'questionId', keyFrom: 'id'})
  options: Options[];

  @hasMany(() => Question, {keyTo: 'parentQuestionId'})
  followUpQuestions: Question[];

  createdByName?: string;
  modifiedByName?: string;
  @hasOne(() => SurveyResponseDetail)
  surveyResponseDetail?: SurveyResponseDetail;

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

  constructor(data?: Partial<Question>) {
    super(data);
  }
}

export interface QuestionRelations {
  parentQuestion: Question;
  rootQuestion: Question;
  options?: Options[];
  survey?: Survey;
}

export type QuestionWithRelations = Question & QuestionRelations;
