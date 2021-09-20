// from here -
// https://github.com/loopbackio/loopback-next/blob/00917f5a06ea8a51e1f452f228a6b0b7314809be/packages/rest-crud/src/crud-rest.controller.ts#L129-L269

// Temporary workaround for a missing `@response` decorator
// See https://github.com/strongloop/loopback-next/issues/1672
// Please note this is just a workaround, the real helper should be implemented
// as a decorator that contributes OpenAPI metadata in a way that allows
// `@post` to merge the responses with the metadata provided at operation level

import {Model} from '@loopback/repository';
import {
  getModelSchemaRef,
  JsonSchemaOptions,
  MediaTypeObject,
  ResponsesObject,
} from '@loopback/rest';

export function response(
  statusCode: number,
  description: string,
  payload: MediaTypeObject,
): {responses: ResponsesObject} {
  return {
    responses: {
      [`${statusCode}`]: {
        description,
        content: {
          'application/json': payload,
        },
      },
    },
  };
}

export namespace response {
  export function model<T extends Model>(
    statusCode: number,
    description: string,
    modelCtor: Function & {prototype: T},
    options?: JsonSchemaOptions<T>,
  ) {
    return response(statusCode, description, {
      schema: getModelSchemaRef(modelCtor, options),
    });
  }

  export function array<T extends Model>(
    statusCode: number,
    description: string,
    modelCtor: Function & {prototype: T},
    options?: JsonSchemaOptions<T>,
  ) {
    return response(statusCode, description, {
      schema: {
        type: 'array',
        items: getModelSchemaRef(modelCtor, options),
      },
    });
  }
}
