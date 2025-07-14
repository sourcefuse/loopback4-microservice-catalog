// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, Entity} from '@loopback/repository';
import {ModelConstructor, RestRelationConfig} from './services';
export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ProxyBuilderConfig = Array<{
  /**
   * The `configs` property in the `ProxyBuilderConfig` type is an array of either {@link EntityRestConfig} objects
   * or constructor of Entities.
   */
  configs: (EntityRestConfig | ModelConstructor<Entity>)[];
  /**
   * The `baseUrl` property in the `ProxyBuilderConfig` type is a string that represents the base URL for
   * the REST API endpoints associated with the configured entities. It is used to define the URL prefix for all the
   * endpoints related to the configured entities.
   * */
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
  /**
   * The `model` property in the `EntityRestConfig` type is used to specify the constructor function of
   * the entity model. It represents the data structure and behavior of the entity in your application.
   * */
  model: ModelConstructor<Entity>;

  /**
   * The `basePath?: string;` property in the `EntityRestConfig` type is an optional property that
   * represents the base path for the REST API endpoints associated with the entity. It is used to
   * define the URL prefix for all the endpoints related to this entity.
   */
  basePath?: string;

  /**
   * The `relations?: RestRelationConfig[];` property in the `EntityRestConfig` type is used to define
   * the relations between the current entity and an entity of another microservice.
   */
  relations?: RestRelationConfig[];

  /**
   * The `restOperations` property in the `EntityRestConfig` type is an optional array of
   * `RestOperationTemplate` objects. These objects define the REST operations that can be performed on
   * the entity. Each `RestOperationTemplate` object contains a `template` property that defines the
   * details of a REST operation, such as the method, URL, headers, path, query, options, body, and
   * response configuration. The `functions` property in the `RestOperationTemplate` object maps
   * function names to an array of strings, where each string represents a specific argument for the request
   */
  restOperations?: RestOperationTemplate[];
};

/**
 * The above type defines a template for a REST operation, including the method, URL, headers, path,
 * query, options, body, and response configuration.
 * @property template - The `template` property is an object that defines the details of a REST
 * operation like method, url, headers, etc.
 * @property functions - The `functions` property is an object that maps function names to an array of
 * arguments for the request. Each of these arguments replaces a value in the `template` property that is
 * written between `{}` .
 */
export type RestOperationTemplate = {
  /**
   *  The `template` property is an object that defines the details of a REST
   *  operation like method, url, headers, etc
   */
  template: {
    method: HttpMethods;
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
  /**
   * The `functions` property is an object that maps function names to an array of
   * arguments for the request. Each of these arguments replaces a value in the `template` property that is
   * written between `{}`
   */
  functions: {
    [key: string]: string[];
  };
};
