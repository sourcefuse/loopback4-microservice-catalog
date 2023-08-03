import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Question} from './questions.model';

@model({name: 'question_options'})
export class Options extends UserModifiableEntity<Options> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 500,
    },
  })
  name?: string;

  @property({
    type: 'number',
    required: true,
    name: 'display_order',
  })
  displayOrder: number;

  @property({
    type: 'number',
    jsonSchema: {
      nullable: true,
    },
  })
  score?: number;

  @belongsTo(
    () => Question,
    {
      keyFrom: 'questionId',
      keyTo: 'id',
      name: 'question',
    },
    {
      name: 'question_id',
    },
  )
  questionId: string;

  @belongsTo(
    () => Question,
    {
      keyFrom: 'followupQuestionId',
      name: 'followupQuestion',
    },
    {
      name: 'followup_question_id',
      jsonSchema: {
        nullable: true,
      },
    },
  )
  followupQuestionId?: string;

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

export interface OptionsRelations {
  folloUpQuestion: Question;
}

export type OptionsWithRelations = Options & OptionsRelations;
