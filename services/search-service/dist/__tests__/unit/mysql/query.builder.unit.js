"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("../runner");
const classes_1 = require("../../../classes");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('MySQL QueryBuilder', () => {
    const testList = [
        {
            params: {},
            it: 'should build a query with no options',
            expects: "(SELECT description, name, 'TestSearched' as source, MATCH (description, name) AGAINST (':0') AS rank" +
                " from TestSearched where MATCH (description, name) AGAINST (':0'))" +
                ' UNION ALL ' +
                "(SELECT about as description, identifier as name, 'TestSearchedCustom' as source, MATCH (about, identifier) AGAINST (':0') AS rank" +
                " from TestSearchedCustom where MATCH (about, identifier) AGAINST (':0'))" +
                ' ORDER BY rank DESC',
        },
    ];
    describe('with match parameter', runner_1.buildTestsRunner(classes_1.MySqlQueryBuilder, testList, 'match', testlab_1.expect, __1.testModelList));
});
//# sourceMappingURL=query.builder.unit.js.map