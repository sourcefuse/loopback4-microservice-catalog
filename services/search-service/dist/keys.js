"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServiceBindings = void 0;
const core_1 = require("@loopback/core");
var SearchServiceBindings;
(function (SearchServiceBindings) {
    SearchServiceBindings.DATASOURCE_NAME = 'SearchServiceDb';
    SearchServiceBindings.SearchFunction = core_1.BindingKey.create('sf.search.function');
    SearchServiceBindings.MySQLQueryBuilder = core_1.BindingKey.create('sf.search.builder.mysql');
    SearchServiceBindings.PostgreSQLQueryBuilder = core_1.BindingKey.create('sf.search.builder.psql');
    SearchServiceBindings.Config = core_1.BindingKey.create('sf.search.config');
    SearchServiceBindings.FetchedColumns = core_1.BindingKey.create('sf.search.columns');
})(SearchServiceBindings = exports.SearchServiceBindings || (exports.SearchServiceBindings = {}));
//# sourceMappingURL=keys.js.map