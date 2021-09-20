import {expect} from '@loopback/testlab';
import {HttpErrors} from '@loopback/rest';
import {TestQueryBuilder} from '../fixtures';
import {Errors} from '../../const';
import {BuilderTest} from './types';
import {buildTestsRunner} from './runner';

describe('QueryBuilder', () => {
  const offset = 3;
  const limit = 2;
  const order = 'description DESC';
  const limitByType = true;
  const testList: Array<BuilderTest> = [
    {
      params: {},
      it: 'should build a query with no options',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1) ORDER BY rank DESC',
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
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1) ORDER BY description DESC',
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
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1) ORDER BY rank DESC LIMIT 2 OFFSET 0',
    },
    {
      params: {
        limit,
        offset,
      },
      it: 'should build a query with limit and offset',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1) ORDER BY rank DESC LIMIT 2 OFFSET 3',
    },
    {
      params: {
        limit,
        limitByType,
      },
      it: 'should build a query with limit and limitByType',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY rank DESC LIMIT 2) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1 ORDER BY rank DESC LIMIT 2) ORDER BY rank DESC',
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
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1) ORDER BY description DESC LIMIT 2 OFFSET 0',
    },
    {
      params: {
        limit,
        order,
        offset,
      },
      it: 'should throw an error with limit, order and offset',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1) ORDER BY description DESC LIMIT 2 OFFSET 3',
    },
    {
      params: {
        limit,
        order,
        limitByType,
      },
      it: 'should build a query with limit, order and limitByType',
      expects:
        '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY description DESC LIMIT 2) UNION ALL (SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1 ORDER BY description DESC LIMIT 2) ORDER BY description DESC',
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

  describe(
    'with match parameter',
    buildTestsRunner(TestQueryBuilder, testList, 'match', expect),
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
    buildTestsRunner(TestQueryBuilder, testWithoutMatch, '', expect),
  );
});
