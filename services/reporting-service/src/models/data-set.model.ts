import {AnyObject, model, property} from '@loopback/repository';
import {
  ExternalIdentifierEnabledEntity,
  UserModifiableEntity,
} from '@sourceloop/core';
import {StructuredQueryInterface} from '../interfaces';

@model({
  name: 'data_sets',
  description: 'This model represents a data set',
})
export class DataSet
  extends UserModifiableEntity
  implements ExternalIdentifierEnabledEntity
{
  @property({
    type: 'string',
    id: true,
    description: 'The unique identifier for a data set',
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    description: 'The name of the data set',
  })
  name: string;

  @property({
    type: 'object',
    name: 'data_set_query',
    description: `The query for the data set refer to StructuredQueryInterface`,
  })
  dataSetQuery?: StructuredQueryInterface;
  @property({
    type: 'string',
    name: 'data_set_query_sql',
    description: 'The query for the data set refer to standard SQL ',
  })
  dataSetQuerySQL?: string;

  @property({
    type: 'string',
    name: 'data_set_query_hash',
    description: 'The hash of the query for the data set',
  })
  dataSetQueryHash?: string;
  @property({
    type: 'string',
    name: 'ext_id',
    description: 'The external id of the data set',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
    description: 'The external metadata of the data set',
  })
  extMetadata?: AnyObject;
}
