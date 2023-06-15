import {AnyObject, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

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
  })
  status: string;

  @property({
    type: 'boolean',
    name: 'is_enable_weight',
    default: false,
  })
  isEnableWeight: boolean;

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

  constructor(data?: Partial<QuestionTemplate>) {
    super(data);
  }
}

export type QuestionTemplateWithRelations = QuestionTemplate;
