import {AnyObject, Model} from '@loopback/repository';
import {api, get, param} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  SearchControllerConfig,
  SearchFunctionType,
  SearchServiceConfig,
} from '../types';
import {response} from '../utils';
import {SearchControllerBase, SearchControllerCtor} from './types';
import {STATUS_CODE} from '@sourceloop/core';
import assert = require('assert');

export function defineSearchController<T extends Model>(
  modelCtor: typeof Model,
  options?: SearchControllerConfig,
): SearchControllerCtor<T> {
  const name = options?.name ?? '';
  @api({
    basePath: options?.basePath ?? `/${name.toLocaleLowerCase()}/search`,
    paths: {},
  })
  class SearchControllerImpl implements SearchControllerBase<T> {
    constructor(
      public readonly searchFn: SearchFunctionType<T>,
      public readonly config: SearchServiceConfig,
    ) {}

    @authorize({permissions: options?.authorizations ?? ['*']})
    @get('/', {
      ...response.array(
        STATUS_CODE.OK,
        `Array of ${modelCtor.name} instances`,
        modelCtor,
      ),
    })
    async search(
      @param.query.string('match')
      match: string,
      @param.query.number('limit')
      limit?: number,
      @param.query.string('order')
      order?: string,
      @param.query.string('limitByType')
      limitByType?: boolean,
    ): Promise<T[]> {
      return this.searchFn({
        match,
        limit,
        order,
        limitByType,
      });
    }
  }

  const controllerName = name + 'SearchController';
  const defineNameController = () => {
    const temp: AnyObject = {
      [controllerName]: class extends SearchControllerImpl {},
    };
    return temp[controllerName];
  };
  const controller = defineNameController();
  assert.equal(controller.name, controllerName);
  return controller;
}
