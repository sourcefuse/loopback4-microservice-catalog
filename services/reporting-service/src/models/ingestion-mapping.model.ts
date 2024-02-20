import {Entity, model, property} from '@loopback/repository';
import {ColumnMappings} from '../interfaces/column-mappings.interface';

@model({
  name: 'ingestion_mapping',
  description:
    'This model represents a ingestion mapping, it maps the datasource to the record type',
})
export class IngestionMapping extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    name: 'datasource_name',
    description: 'The datasource name for the ingestion mapping',
  })
  dataSourceName: string;

  @property({
    type: 'string',
    required: true,
    name: 'record_type',
    description: 'The record type for the ingestion mapping',
  })
  recordType: string;

  @property({
    type: 'string',
    required: true,
    name: 'primary_column',
    description: 'The primary column for the ingestion mapping',
  })
  primaryColumn: string;

  @property({
    type: 'object',
    required: false,
    jsonSchema: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          typeConversion: {
            type: 'object',
            properties: {
              expectedType: {type: 'string'},
              dataStoreKey: {type: 'string'},
              customHandler: {type: 'string'},
              ConversionOptions: {type: 'object'},
            },
          },
          dataStoreKey: {type: 'string'},
          skip: {type: 'boolean'},
        },
      },
      description:
        'The column transformations for the ingestion mapping, refer to ColumnMappings interface',
    },
    name: 'column_transformations',
  })
  columnTransformations: ColumnMappings;

  @property({
    type: 'object',
    required: false,
    jsonSchema: {
      type: 'object',
    },
    description: 'The permissions for the ingestion mapping',
  })
  permissions?: object;
}
