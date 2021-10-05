"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlQueryBuilder = void 0;
const base_1 = require("../base");
class MySqlQueryBuilder extends base_1.SearchQueryBuilder {
    constructor(query) {
        super(query);
        this.unionString = ' UNION ALL ';
    }
    search(model, columns) {
        let selectors, columnList;
        if (Array.isArray(columns)) {
            columnList = columns.join(', ');
            selectors = columns.join(', ');
        }
        else {
            columnList = Object.values(columns).join(', ');
            selectors = Object.keys(columns)
                .map(column => `${columns[column]} as ${column}`)
                .join(', ');
        }
        this.baseQueryList.push(`SELECT ${selectors}, '${model}' as source, MATCH (${columnList}) AGAINST (':0') AS rank from ${model} where MATCH (${columnList}) AGAINST (':0')`);
    }
}
exports.MySqlQueryBuilder = MySqlQueryBuilder;
//# sourceMappingURL=query.builder.js.map