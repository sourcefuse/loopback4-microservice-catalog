import {inject, ParameterDecoratorFactory} from '@loopback/core';
import {requestBody, SchemaObject} from '@loopback/rest';
import {cloneDeep} from 'lodash';

import {FileUtilBindings} from '../keys';
import {
  IBaseMetadata,
  IFileRequestMetadata,
  IFileStorageOptions,
} from '../types';
import {AnyObject} from '@loopback/repository';

export function file<T = AnyObject>(
  schema?: SchemaObject,
  fileFields: string[] = [],
  allowedExtensions: string[] = [],
  storageOptions?: IFileStorageOptions<T>,
  others?: Omit<IBaseMetadata<T>, 'extensions' | 'storageOptions'>,
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
        ...others,
      },
    )(target, member, index);
  };
}
