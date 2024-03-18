import {AnyObject, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';

@model({
  name: 'widgets',
  description: 'This model represents a widget',
})
export class Widget
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
  @property({
    type: 'string',
    id: true,
    generated: true,
    description: 'The unique identifier for a widget',
  })
  id?: string;

  @property({
    type: 'string',
    length: 100,
    description: 'The name of the widget',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    name: 'dataset_id',
    description: 'The id of the dataset that is to be used for the widget',
  })
  datasetId: string;

  @property({
    type: 'string',
    name: 'visualization_type',
    description: 'The type of visualization to be used for the widget',
  })
  visualizationType: string;

  @property({
    type: 'string',
    name: 'ext_id',
    description: 'The external id of the widget',
  })
  extId: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
    description: 'The external metadata of the widget',
  })
  extMetadata?: AnyObject;
}
