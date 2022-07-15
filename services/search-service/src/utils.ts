// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// from here -
// https://github.com/loopbackio/loopback-next/blob/00917f5a06ea8a51e1f452f228a6b0b7314809be/packages/rest-crud/src/crud-rest.controller.ts#L129-L269

// Temporary workaround for a missing `@response` decorator
// See https://github.com/strongloop/loopback-next/issues/1672
// Please note this is just a workaround, the real helper should be implemented
// as a decorator that contributes OpenAPI metadata in a way that allows
// `@post` to merge the responses with the metadata provided at operation level

import {Constructor} from '@loopback/context';
import {
  AnyObject,
  model as modelDecorator,
  Model,
  ModelDefinition,
} from '@loopback/repository';
import {
  JsonSchemaOptions,
  jsonToSchemaObject,
  MediaTypeObject,
  modelToJsonSchema,
  ResponsesObject,
} from '@loopback/rest';
import {CONTENT_TYPE} from '@sourceloop/core';
import assert = require('assert');

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
          [CONTENT_TYPE.JSON]: payload,
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
      schema: dynamicModelSchemaRef(modelCtor, options),
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
        items: dynamicModelSchemaRef(modelCtor, options),
      },
    });
  }
}

export function dynamicModelSchemaRef<T extends object>(
  ctor: Function & {
    prototype: T;
  },
  jsonSchemaOptions?: JsonSchemaOptions<T> | undefined,
) {
  return jsonToSchemaObject(modelToJsonSchema(ctor, jsonSchemaOptions));
}

export function defineModelClass<BaseCtor extends Constructor<Model>>(
  base: BaseCtor /* Model or Entity */,
  definition: ModelDefinition,
): typeof Model {
  const modelName = definition.name;
  const defineNamedModelClass = () => {
    const temp: AnyObject = {
      [modelName]: class extends base {},
    };
    return temp[modelName];
  };
  const modelClass = defineNamedModelClass() as typeof Model;
  assert.equal(modelClass.name, modelName);

  // Apply `@model(definition)` to the generated class
  modelDecorator(definition)(modelClass);
  return modelClass;
}
