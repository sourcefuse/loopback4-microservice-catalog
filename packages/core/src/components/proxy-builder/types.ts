// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, Entity} from '@loopback/repository';
import {ModelConstructor, RestRelationConfig} from './services';

export type ProxyBuilderConfig = Array<{
  configs: (EntityRestConfig | ModelConstructor<Entity>)[];
  baseUrl: string;
}>;

export function isEntityRestConfig(
  config: EntityRestConfig | ModelConstructor<Entity>,
): config is EntityRestConfig {
  return (config as EntityRestConfig).model !== undefined;
}

/**
 * The `EntityRestConfig` type defines the configuration options for a RESTful entity.
 * @property model - The "model" property is a reference to the constructor function of the entity
 * model. It represents the data structure and behavior of the entity in your application.
 * @property {string} basePath - The `basePath` property is an optional string that represents the base
 * path for the REST API endpoints associated with the entity. It is used to define the URL prefix for
 * all the endpoints related to this entity.
 * @property {RestRelationConfig[]} relations - The `relations` property is an optional array of
 * `RestRelationConfig` objects. Each `RestRelationConfig` object represents a relation between the
 * current entity and another entity. It defines how the relation should be handled in the REST API.
 * @property {RestOperationTemplate[]} restOperations - The `restOperations` property is an optional
 * array of `RestOperationTemplate` objects. These objects define the REST operations that can be
 * performed on the entity.
 */
export type EntityRestConfig = {
  model: ModelConstructor<Entity>;
  basePath?: string;
  relations?: RestRelationConfig[];
  restOperations?: RestOperationTemplate[];
};

/**
 * The above type defines a template for a REST operation, including the method, URL, headers, path,
 * query, options, body, and response configuration.
 * @property template - The `template` property is an object that defines the details of a REST
 * operation like method, url, headers, etc.
 * @property functions - The `functions` property is an object that maps function names to an array of
 * strings. Each string represents a path to a specific property in the response object. This allows
 * you to extract specific data from the response and use it in your code.
 */
export type RestOperationTemplate = {
  template: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: {
      Authorization?: '{token}' | string;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'content-type'?: 'application/json' | string;
      [key: string]: string | undefined;
    };
    path?: AnyObject;
    query?: AnyObject;
    options?: AnyObject & {
      maxRedirects?: number;
    };
    body?: string | AnyObject;
    fullResponse?: boolean;
    responsePath?: string;
  };
  functions: {
    [key: string]: string[];
  };
};
