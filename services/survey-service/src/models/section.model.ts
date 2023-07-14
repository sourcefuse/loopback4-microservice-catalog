import {AnyObject, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({name: 'section'})
export class Section extends UserModifiableEntity {
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
  name: string;

  @property({
    type: 'number',
    name: 'display_order',
  })
  displayOrder: number;

  @property({
    type: 'string',
    name: 'survey_id',
  })
  surveyId: string;

  createdByName?: string;
  modifiedByName?: string;

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

  constructor(data?: Partial<Section>) {
    super(data);
  }
}
