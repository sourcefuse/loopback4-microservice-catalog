import {inject, ParameterDecoratorFactory} from '@loopback/core';
import {
  getJsonSchema,
  ReferenceObject,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {cloneDeep} from 'lodash';

import {AnyObject, Entity} from '@loopback/repository';
import {ModelConstructor} from '@sourceloop/core';
import {isSchemaObject} from '../constant';
import {FileUtilBindings} from '../keys';
import {IModelWithFileMetadata} from '../types';

function updateSchema(fieldSchema: SchemaObject | ReferenceObject | undefined) {
  if (isSchemaObject(fieldSchema)) {
    if (fieldSchema.type === 'array') {
      fieldSchema.items = {
        ...fieldSchema.items,
        format: 'binary',
      };
    } else {
      fieldSchema.format = 'binary';
    }
  }
}
/**
 * Decorator for handling multipart/form-data requests with file uploads and JSON data.
 *
 * This decorator is used on controller methods to handle requests that include file uploads
 * along with other JSON data. It's particularly useful for models that have properties
 * decorated with the `@fileProperty` decorator.
 *
 * Key features:
 * - Automatically generates the schema for the model, including file properties.
 * - Allows property-level configuration for handling file data.
 * - Sets up the request body for multipart/form-data with the appropriate schema.
 * - Injects the parsed data into the method parameters.
 *
 * @template S - Type extending Entity
 * @template T - Type for additional metadata (default: AnyObject)
 *
 * @param {ModelConstructor<S>} model - The model constructor for which to generate the schema
 *
 * @returns A method decorator that sets up the multipart request handling
 *
 * @example
 * ```ts
 * class MyController {
 *   @post('/upload')
 *   async uploadFile(
 *     @multipartRequestBody(MyModel) data: MyModel,
 *   ) {
 *     // Handle the uploaded file and other data
 *   }
 * }
 * ```
 *
 * @remarks
 * This decorator should be used in conjunction with models that have properties
 * decorated with `@fileProperty`. It will automatically detect these properties
 * and set up the appropriate schema for file uploads.
 */
export function multipartRequestBody<S extends Entity, T = AnyObject>(
  model: ModelConstructor<S>,
) {
  return function (target: object, member: string, index: number) {
    const defaultSchema: SchemaObject = {
      type: 'object',
      properties: {},
    };
    const schema = getJsonSchema(model) as SchemaObject;
    const fileFields = Object.entries(model.definition.properties)
      .filter(([_, definition]) => definition['file'])
      .map(([key, _]) => key);
    if (schema && fileFields.length) {
      const newSchema = cloneDeep(schema);
      for (const field of fileFields) {
        const fieldSchema = newSchema.properties?.[field];
        updateSchema(fieldSchema);
      }
      defaultSchema.properties = {
        ...schema.properties,
        ...newSchema.properties,
      };
    }

    requestBody({
      description: 'Request body for multipart/form-data based file upload',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: defaultSchema,
        },
      },
    })(target, member, index);
    inject(FileUtilBindings.PARSED_DATA)(target, member, index);
    ParameterDecoratorFactory.createDecorator<IModelWithFileMetadata<T>>(
      FileUtilBindings.FILE_REQUEST_METADATA,
      {
        definition: model.definition.properties,
        multerConfig: model.definition.settings['multer'],
      },
    )(target, member, index);
  };
}
