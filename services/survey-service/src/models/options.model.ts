import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Question} from './questions.model';

@model({name: 'question_options'})
export class Options extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
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
    name: 'item_id',
    type: 'string',
    jsonSchema: {
      nullable: true,
    },
  })
  itemId?: string;

  constructor(data?: Partial<Options>) {
    super(data);
  }
}

export interface OptionsRelations {
  folloUpQuestion: Question;
}

export type OptionsWithRelations = Options & OptionsRelations;
