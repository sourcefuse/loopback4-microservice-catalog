// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {HttpErrors} from '@loopback/rest';
import {TestQueryBuilder} from '../fixtures';
import {Errors} from '../../const';
import {BuilderTest} from './types';
import {buildTestsRunner} from './runner';
import {testModelList} from '../const';
import {TestSearched} from '..';

describe('QueryBuilder', () => {
  const offset = 3;
  const limit = 2;
  const order = 'description DESC';
  const limitByType = true;
  //base queries without order or limit
  const BASE_QUERY_FIRST_TABLE =
    '(SELECT description, name from TestSearched where description = $1, name = $1)';
  const BASE_QUERY_SECOND_TABLE =
    '(SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1)';

  const BASE_QUERY_FIRST_TABLE_WITH_IN =
    '(SELECT description, name from TestSearched where description = $1, name = $1 AND name IN ($2, $3) AND description NOT IN ($4, $5))';

  const BASE_QUERY_FIRST_TABLE_WITH_AND_GT_NEQ =
    '(SELECT description, name from TestSearched where description = $1, name = $1 AND ((name>$2) AND (((description!=$3) OR (description BETWEEN $4 AND $5)))))';
  const multiModeltestList: Array<BuilderTest> = [
    {
      params: {},
      it: 'should build a query with no options',
      expects: `${BASE_QUERY_FIRST_TABLE} UNION ALL ${BASE_QUERY_SECOND_TABLE} ORDER BY rank DESC`,
    },
    {
      params: {
        offset,
      },
      it: 'should throw an error with only offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITHOUT_LIMIT,
    },
    {
      params: {
        limitByType,
      },
      it: 'should throw an error with only limitByType',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        limitByType,
        offset,
      },
      it: 'should throw an error with offset and limitByType',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        order,
      },
      it: 'should build a query with only order',
      expects: `${BASE_QUERY_FIRST_TABLE} UNION ALL ${BASE_QUERY_SECOND_TABLE} ORDER BY description DESC`,
    },
    {
      params: {
        order: 'DESC description',
      },
      it: 'should throw an error with invalid order',
      error: HttpErrors.BadRequest,
      message: Errors.INVALID_ORDER,
    },
    {
      params: {
        order,
        offset,
      },
      it: 'should throw an error with order and offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITHOUT_LIMIT,
    },
    {
      params: {
        order,
        limitByType,
      },
      it: 'should throw an error with order, limitByType ',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        order,
        limitByType,
        offset,
      },
      it: 'should throw an error with limitByType, order and offset',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        limit,
      },
      it: 'should build a query with only limit',
      expects: `${BASE_QUERY_FIRST_TABLE} UNION ALL ${BASE_QUERY_SECOND_TABLE} ORDER BY rank DESC LIMIT 2 OFFSET 0`,
    },
    {
      params: {
        limit,
        offset,
      },
      it: 'should build a query with limit and offset',
      expects: `${BASE_QUERY_FIRST_TABLE} UNION ALL ${BASE_QUERY_SECOND_TABLE} ORDER BY rank DESC LIMIT 2 OFFSET 3`,
    },
    {
      params: {
        limit,
        limitByType,
      },
      it: 'should build a query with limit and limitByType',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY rank DESC LIMIT 2)' +
        ' UNION ALL ' +
        '(SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1 ORDER BY rank DESC LIMIT 2)' +
        ' ORDER BY rank DESC',
    },
    {
      params: {
        limit,
        limitByType,
        offset,
      },
      it: 'should throw an error with limit, limitByType and offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITH_TYPE,
    },
    {
      params: {
        limit,
        order,
      },
      it: 'should build a query with limit and order',
      expects: `${BASE_QUERY_FIRST_TABLE} UNION ALL ${BASE_QUERY_SECOND_TABLE} ORDER BY description DESC LIMIT 2 OFFSET 0`,
    },
    {
      params: {
        limit,
        order,
        offset,
      },
      it: 'should build a query with limit, order and offset',
      expects: `${BASE_QUERY_FIRST_TABLE} UNION ALL ${BASE_QUERY_SECOND_TABLE} ORDER BY description DESC LIMIT 2 OFFSET 3`,
    },
    {
      params: {
        limit,
        order,
        limitByType,
      },
      it: 'should build a query with limit, order and limitByType',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY description DESC LIMIT 2)' +
        ' UNION ALL ' +
        '(SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1 ORDER BY description DESC LIMIT 2)' +
        ' ORDER BY description DESC',
    },
    {
      params: {
        limit,
        order,
        limitByType,
        offset,
      },
      it: 'should throw an error with limit, order, limitByType and offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITH_TYPE,
    },
  ];

  const singleModelTestList: Array<BuilderTest> = [
    {
      params: {},
      it: 'should build a query with no options',
      expects: `${BASE_QUERY_FIRST_TABLE} ORDER BY rank DESC`,
    },
    {
      params: {
        offset,
      },
      it: 'should throw an error with only offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITHOUT_LIMIT,
    },
    {
      params: {
        limitByType,
      },
      it: 'should throw an error with only limitByType',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        limitByType,
        offset,
      },
      it: 'should throw an error with offset and limitByType',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        order,
      },
      it: 'should build a query with only order',
      expects: `${BASE_QUERY_FIRST_TABLE} ORDER BY description DESC`,
    },
    {
      params: {
        order: 'DESC description',
      },
      it: 'should throw an error with invalid order',
      error: HttpErrors.BadRequest,
      message: Errors.INVALID_ORDER,
    },
    {
      params: {
        order,
        offset,
      },
      it: 'should throw an error with order and offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITHOUT_LIMIT,
    },
    {
      params: {
        order,
        limitByType,
      },
      it: 'should throw an error with order, limitByType ',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        order,
        limitByType,
        offset,
      },
      it: 'should throw an error with limitByType, order and offset',
      error: HttpErrors.BadRequest,
      message: Errors.TYPE_WITHOUT_LIMIT,
    },
    {
      params: {
        limit,
      },
      it: 'should build a query with only limit',
      expects: `${BASE_QUERY_FIRST_TABLE} ORDER BY rank DESC LIMIT 2 OFFSET 0`,
    },
    {
      params: {
        limit,
        offset,
      },
      it: 'should build a query with limit and offset',
      expects: `${BASE_QUERY_FIRST_TABLE} ORDER BY rank DESC LIMIT 2 OFFSET 3`,
    },
    {
      params: {
        limit,
        limitByType,
      },
      it: 'should build a query with limit and limitByType',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY rank DESC LIMIT 2)',
    },
    {
      params: {
        limit,
        limitByType,
        offset,
      },
      it: 'should throw an error with limit, limitByType and offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITH_TYPE,
    },
    {
      params: {
        limit,
        order,
      },
      it: 'should build a query with limit and order',
      expects: `${BASE_QUERY_FIRST_TABLE} ORDER BY description DESC LIMIT 2 OFFSET 0`,
    },
    {
      params: {
        limit,
        order,
        offset,
      },
      it: 'should build a query with limit, order and offset',
      expects: `${BASE_QUERY_FIRST_TABLE} ORDER BY description DESC LIMIT 2 OFFSET 3`,
    },
    {
      params: {
        limit,
        order,
        limitByType,
      },
      it: 'should build a query with limit, order and limitByType',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY description DESC LIMIT 2)',
    },
    {
      params: {
        limit,
        order,
        limitByType,
        offset,
      },
      it: 'should throw an error with limit, order, limitByType and offset',
      error: HttpErrors.BadRequest,
      message: Errors.OFFSET_WITH_TYPE,
    },
  ];

  const testWithWhereClause: Array<BuilderTest> = [
    {
      params: {
        where: {
          TestSearched: {
            name: {
              inq: ['name1', 'name2'],
            },
            description: {
              nin: ['name3', 'name4'],
            },
          },
        },
      },
      it: 'should build a query using inq and nin operators',
      expects: `${BASE_QUERY_FIRST_TABLE_WITH_IN} ORDER BY rank DESC`,
    },
    {
      params: {
        where: {
          TestSearched: {
            and: [
              {
                name: {
                  gt: 'name1',
                },
              },
              {
                or: [
                  {
                    description: {
                      neq: 'name2',
                    },
                  },
                  {
                    description: {
                      between: ['name3', 'name4'],
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      it: 'should build a query with and and or operators',
      expects: `${BASE_QUERY_FIRST_TABLE_WITH_AND_GT_NEQ} ORDER BY rank DESC`,
    },
  ];
  describe(
    'with match parameter, two models',
    buildTestsRunner(
      TestQueryBuilder,
      multiModeltestList,
      'match',
      ['match'],
      expect,
      testModelList,
    ),
  );

  describe(
    'with match parameter, single model',
    buildTestsRunner(
      TestQueryBuilder,
      singleModelTestList,
      'match',
      ['match'],
      expect,
      [TestSearched],
    ),
  );

  describe(
    'with match and where parameter, single model',
    buildTestsRunner(
      TestQueryBuilder,
      testWithWhereClause,
      'match',
      ['match', 'name1', 'name2', 'name3', 'name4'],
      expect,
      [TestSearched],
    ),
  );

  const testWithoutMatch: Array<BuilderTest> = [
    {
      params: {},
      it: 'throw an error without match parameters',
      message: Errors.MISSING_MATCH,
      error: HttpErrors.BadRequest,
    },
  ];
  describe(
    'without match parameter',
    buildTestsRunner(
      TestQueryBuilder,
      testWithoutMatch,
      '',
      [''],
      expect,
      testModelList,
    ),
  );
});
