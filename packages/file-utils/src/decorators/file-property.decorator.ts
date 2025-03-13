import {property, PropertyDefinition} from '@loopback/repository';
import {IFileRequestMetadata} from '../types';

/**
 * A decorator function that adds multipart file property metadata to a model property.
 *
 * @template T - The type of the file request metadata.
 * @param {Partial<PropertyDefinition & IFileRequestMetadata<T>>} definition - The partial definition of the property and file request metadata.
 * @returns {PropertyDecorator} The property decorator function.
 */
export function fileProperty<T>(
  definition: Partial<PropertyDefinition & IFileRequestMetadata<T>>,
) {
  return property({...definition, file: true});
}
