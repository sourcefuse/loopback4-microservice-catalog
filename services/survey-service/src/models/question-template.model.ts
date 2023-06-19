import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {TemplateStatus} from '../enum/template.enum';

@model({name: 'question_templates'})
export class QuestionTemplate extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'uid',
    description: 'an identifier id to display in UI',
  })
  uid: string;

  @property({
    type: 'string',
    required: true,
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: [...Object.values(TemplateStatus), null],
    },
  })
  status: TemplateStatus;

  @property({
    type: 'boolean',
    name: 'is_enable_weight',
    default: false,
  })
  isEnableWeight: boolean;

  createdByUser?: string;

  modifiedByUser?: string;

  constructor(data?: Partial<QuestionTemplate>) {
    super(data);
  }
}

export interface QuestionTemplateRelations {}

export type QuestionTemplateWithRelations = QuestionTemplate &
  QuestionTemplateRelations;
