"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const rest_1 = require("@loopback/rest");
const fixtures_1 = require("../fixtures");
const const_1 = require("../../const");
const runner_1 = require("./runner");
const const_2 = require("../const");
const __1 = require("..");
describe('QueryBuilder', () => {
    const offset = 3;
    const limit = 2;
    const order = 'description DESC';
    const limitByType = true;
    //base queries without order or limit
    const BASE_QUERY_FIRST_TABLE = '(SELECT description, name from TestSearched where description = $1, name = $1)';
    const BASE_QUERY_SECOND_TABLE = '(SELECT about as description, identifier as name from TestSearchedCustom where description = $1, name = $1)';
    const multiModeltestList = [
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
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITHOUT_LIMIT,
        },
        {
            params: {
                limitByType,
            },
            it: 'should throw an error with only limitByType',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
        },
        {
            params: {
                limitByType,
                offset,
            },
            it: 'should throw an error with offset and limitByType',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
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
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.INVALID_ORDER,
        },
        {
            params: {
                order,
                offset,
            },
            it: 'should throw an error with order and offset',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITHOUT_LIMIT,
        },
        {
            params: {
                order,
                limitByType,
            },
            it: 'should throw an error with order, limitByType ',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
        },
        {
            params: {
                order,
                limitByType,
                offset,
            },
            it: 'should throw an error with limitByType, order and offset',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
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
            expects: '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY rank DESC LIMIT 2)' +
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
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITH_TYPE,
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
            expects: '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY description DESC LIMIT 2)' +
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
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITH_TYPE,
        },
    ];
    const singleModelTestList = [
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
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITHOUT_LIMIT,
        },
        {
            params: {
                limitByType,
            },
            it: 'should throw an error with only limitByType',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
        },
        {
            params: {
                limitByType,
                offset,
            },
            it: 'should throw an error with offset and limitByType',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
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
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.INVALID_ORDER,
        },
        {
            params: {
                order,
                offset,
            },
            it: 'should throw an error with order and offset',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITHOUT_LIMIT,
        },
        {
            params: {
                order,
                limitByType,
            },
            it: 'should throw an error with order, limitByType ',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
        },
        {
            params: {
                order,
                limitByType,
                offset,
            },
            it: 'should throw an error with limitByType, order and offset',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.TYPE_WITHOUT_LIMIT,
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
            expects: '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY rank DESC LIMIT 2)',
        },
        {
            params: {
                limit,
                limitByType,
                offset,
            },
            it: 'should throw an error with limit, limitByType and offset',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITH_TYPE,
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
            expects: '(SELECT description, name from TestSearched where description = $1, name = $1 ORDER BY description DESC LIMIT 2)',
        },
        {
            params: {
                limit,
                order,
                limitByType,
                offset,
            },
            it: 'should throw an error with limit, order, limitByType and offset',
            error: rest_1.HttpErrors.BadRequest,
            message: const_1.Errors.OFFSET_WITH_TYPE,
        },
    ];
    describe('with match parameter, two models', runner_1.buildTestsRunner(fixtures_1.TestQueryBuilder, multiModeltestList, 'match', testlab_1.expect, const_2.testModelList));
    describe('with match parameter, single model', runner_1.buildTestsRunner(fixtures_1.TestQueryBuilder, singleModelTestList, 'match', testlab_1.expect, [
        __1.TestSearched,
    ]));
    const testWithoutMatch = [
        {
            params: {},
            it: 'throw an error without match parameters',
            message: const_1.Errors.MISSING_MATCH,
            error: rest_1.HttpErrors.BadRequest,
        },
    ];
    describe('without match parameter', runner_1.buildTestsRunner(fixtures_1.TestQueryBuilder, testWithoutMatch, '', testlab_1.expect, const_2.testModelList));
});
//# sourceMappingURL=builder.unit.js.map