import {property, PropertyDefinition} from '@loopback/repository';
import {IFileRequestMetadata} from '../types';

export function fileProperty<T>(
  definition: Partial<PropertyDefinition & IFileRequestMetadata<T>>,
) {
  return property(definition);
}
