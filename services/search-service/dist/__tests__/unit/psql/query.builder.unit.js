"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner_1 = require("../runner");
const classes_1 = require("../../../classes");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('PostgreSQL QueryBuilder', () => {
    const testList = [
        {
            params: {},
            it: 'should build a query with no options',
            expects: "(SELECT description, name, 'TestSearched' as source, ts_rank_cd(to_tsvector(description || ' ' || name), plainto_tsquery($1)) as rank" +
                " from public.TestSearched where to_tsvector(description || ' ' || name) @@ plainto_tsquery($1))" +
                ' UNION ALL ' +
                "(SELECT about as description, identifier as name, 'TestSearchedCustom' as source, ts_rank_cd(to_tsvector(about || ' ' || identifier), plainto_tsquery($1)) as rank" +
                " from public.TestSearchedCustom where to_tsvector(about || ' ' || identifier) @@ plainto_tsquery($1))" +
                ' ORDER BY rank DESC',
        },
    ];
    describe('with match parameter', runner_1.buildTestsRunner(classes_1.PsqlQueryBuilder, testList, 'match', testlab_1.expect, __1.testModelList));
});
//# sourceMappingURL=query.builder.unit.js.map