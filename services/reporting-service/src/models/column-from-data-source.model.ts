import {Model, model, property} from '@loopback/repository';
import {ResponseDataType} from '../enums/response-data-type.enum';

@model({description: 'Schema for ColumnForDataSource'})
export class ColumnForDataSourceModel extends Model {
  @property({
    type: 'string',
    description: 'The name of the column',
  })
  columnName: string;

  @property({
    type: 'string',
    description: 'Name of the data source',
  })
  dataSourceName: string;

  @property({
    type: 'string',
    description: 'Display name of the column',
  })
  displayName: string;

  @property({
    type: 'string',
    description: 'Original data type of the column',
  })
  originalDataType: string;

  @property({
    type: 'string',
    description: 'Data type of the column',
    jsonSchema: {enum: Object.values(ResponseDataType)},
  })
  dataType: string;
}
