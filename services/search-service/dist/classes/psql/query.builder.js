"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsqlQueryBuilder = void 0;
const rest_1 = require("@loopback/rest");
const const_1 = require("../../const");
const base_1 = require("../base");
class PsqlQueryBuilder extends base_1.SearchQueryBuilder {
    constructor(query, schema) {
        super(query, schema);
        this.unionString = ' UNION ALL ';
    }
    search(model, columns) {
        let selectors, columnList;
        if (Array.isArray(columns)) {
            columnList = columns.join(" || ' ' || ");
            selectors = columns.join(', ');
        }
        else {
            columnList = Object.values(columns).join(" || ' ' || ");
            selectors = Object.keys(columns)
                .map(column => `${columns[column]} as ${column}`)
                .join(', ');
        }
        if (!columnList) {
            throw new rest_1.HttpErrors.BadRequest(const_1.Errors.NO_COLUMNS_TO_MATCH);
        }
        this.baseQueryList.push(`SELECT ${selectors}, '${model}' as source, ts_rank_cd(to_tsvector(${columnList}), plainto_tsquery($1)) as rank from ${this.schema || 'public'}.${model} where to_tsvector(${columnList}) @@ plainto_tsquery($1)`);
    }
}
exports.PsqlQueryBuilder = PsqlQueryBuilder;
//# sourceMappingURL=query.builder.js.map