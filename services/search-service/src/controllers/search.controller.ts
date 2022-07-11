// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, Model} from '@loopback/repository';
import {api, get, getModelSchemaRef, HttpErrors, param} from '@loopback/rest';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {SearchQuery} from '../models';
import {
  SearchControllerConfig,
  SearchFunctionType,
  SearchServiceConfig,
} from '../types';
import {dynamicModelSchemaRef, response} from '../utils';
import {SearchControllerBase, SearchControllerCtor} from './types';
import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import assert = require('assert');
import {Errors} from '../const';
import {RecentSearchRepository} from '../repositories/recent-search.repository';
import {authenticateOnCondition, getOnCondition} from '../decorators';
import {SearchFilter} from '..';

const EXCLUDED_COLUMNS: (keyof SearchQuery)[] = ['id', 'recentSearchId'];

const RECENT_COUNT = 3;
export function defineSearchController<T extends Model>(
  modelCtor: typeof Model,
  options?: SearchControllerConfig,
): SearchControllerCtor<T> {
  const name = options?.name;
  const authorizations = options?.authorizations ?? ['*'];
  const recentsConfig = options?.recents ?? false;
  const recentCount = options?.recentCount ?? RECENT_COUNT;
  @api({
    basePath: options?.basePath,
    paths: {},
  })
  class SearchControllerImpl implements SearchControllerBase<T> {
    constructor(
      public readonly searchFn: SearchFunctionType<T>,
      public readonly config: SearchServiceConfig,
      public readonly recents: RecentSearchRepository,
      public readonly filter: SearchFilter,
    ) {}

    @authenticateOnCondition(options?.authenticate)
    @authorize({permissions: authorizations})
    @get('/', {
      security: options?.authenticate ? OPERATION_SECURITY_SPEC : undefined,
      ...response.array(
        STATUS_CODE.OK,
        `Array of ${modelCtor.name} instances`,
        modelCtor,
      ),
    })
    async search(
      @param.query.object(
        'query',
        dynamicModelSchemaRef(SearchQuery, {
          exclude: ['recentSearchId', 'id'],
        }),
      )
      query: SearchQuery,
      @param.query.boolean('saveInRecents')
      saveInRecents: boolean,
      @inject.getter(AuthenticationBindings.CURRENT_USER, {optional: true})
      getUser: Getter<IAuthUserWithPermissions>,
    ): Promise<T[]> {
      if (!query) {
        throw new HttpErrors.BadRequest(Errors.QUERY_MISSING);
      }
      const user = await getUser();
      const filter = await this.filter(query, user);
      query.match = query.match.trim();
      if (recentsConfig && saveInRecents && query.match) {
        if (!user) {
          throw new HttpErrors.BadRequest(Errors.USER_MISSING);
        } else {
          await this.recents.create(query, user);
        }
      }
      query.where = filter;
      return this.searchFn(query);
    }

    @authenticateOnCondition(options?.authenticate)
    @authorize({permissions: authorizations})
    @getOnCondition(recentsConfig, '/recents', {
      security: OPERATION_SECURITY_SPEC,
      responses: {
        [STATUS_CODE.OK]: {
          description: 'RecentQuery model instance',
          content: {
            [CONTENT_TYPE.JSON]: {
              schema: getModelSchemaRef(SearchQuery, {
                exclude: EXCLUDED_COLUMNS,
              }),
            },
          },
        },
      },
    })
    async list(
      @inject(AuthenticationBindings.CURRENT_USER)
      user: IAuthUserWithPermissions,
    ) {
      const result = await this.recents.findOne({
        where: {
          userId: user.userTenantId,
        },
        include: [
          {
            relation: 'params',
            scope: {
              fields: {
                where: false,
                deleted: false,
                deletedOn: false,
                deletedBy: false,
                createdBy: false,
                createdOn: false,
                modifiedBy: false,
                modifiedOn: false,
              },
              order: ['created_on DESC'],
              limit: recentCount,
            },
          },
        ],
      });
      return result?.params;
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
