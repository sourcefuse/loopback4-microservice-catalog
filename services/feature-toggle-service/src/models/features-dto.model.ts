import {model, Model, property} from '@loopback/repository';
import {FeatureValues} from './feature-values.model';

@model()
export class FeaturesDTO extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  defaultValue: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'object',
  })
  metadata?: object;

  @property({
    type: 'object',
  })
  value?: FeatureValues;
}
