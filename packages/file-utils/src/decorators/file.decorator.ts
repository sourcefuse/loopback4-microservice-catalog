// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, ParameterDecoratorFactory} from '@loopback/core';
import {requestBody, SchemaObject} from '@loopback/rest';
import {cloneDeep} from 'lodash';

import {AnyObject} from '@loopback/repository';
import {FileUtilBindings} from '../keys';
import {IFileRequestMetadata, IFileStorageOptions} from '../types';

/**
 * Decorator for handling file uploads in a multipart/form-data request.
 *
 * @param {SchemaObject} schema - The schema object for the request body. It is useful in cases where
 * you have multiple fields and you want to handle this data in a structured way. For example, if your
 * request has a file field and a name field, you can define a schema object with these fields and pass
 * it to the decorator. The file field will be marked as binary in the schema.
 * @param {string[]} fileFields - The fields in the schema that represent file uploads. So as per the above
 * example, you can pass ['file'] to this parameter. This will mark the file field as binary in the schema.
 * @param {string[]} allowedExtensions - The allowed file extensions for the uploaded files.
 * @param {IFileStorageOptions<T>} storageOptions - The options for file storage. This supports any multer storage engine class.
 * By default, this uses in memory storage, and the package also provides an S3 storage engine.
 *
 * @returns {Function} - The decorator function that can be used to decorate a controller parameter, it would add the relevant metadata
 * for the multer middleware and the OpenAPI specification.
 */
export function file<T = AnyObject>(
  schema?: SchemaObject,
  fileFields: string[] = [],
  allowedExtensions: string[] = [],
  storageOptions?: IFileStorageOptions<T>,
) {
  return function (target: object, member: string, index: number) {
    const defaultSchema: SchemaObject = {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    };
    if ((schema && !fileFields.length) ?? (!schema && fileFields.length)) {
      throw new Error('schema and fileFields must be provided together');
    }
    if (schema && fileFields.length) {
      const newSchema = cloneDeep(schema);
      for (const field of fileFields) {
        if (newSchema.properties?.[field]) {
          (newSchema.properties?.[field] as SchemaObject).format = 'binary';
        }
      }
      defaultSchema.properties = {
        ...defaultSchema.properties,
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
    ParameterDecoratorFactory.createDecorator<IFileRequestMetadata<T>>(
      FileUtilBindings.FILE_REQUEST_METADATA,
      {
        extensions: allowedExtensions,
        storageOptions,
      },
    )(target, member, index);
  };
}
