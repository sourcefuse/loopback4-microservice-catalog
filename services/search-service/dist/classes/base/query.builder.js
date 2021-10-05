"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchQueryBuilder = void 0;
const rest_1 = require("@loopback/rest");
const const_1 = require("../../const");
const models_1 = require("../../models");
const types_1 = require("../../types");
class SearchQueryBuilder {
    constructor(query, schema) {
        this.query = query;
        this.schema = schema;
    }
    limit() {
        var _a;
        if (this.query.limit) {
            if (this.query.limitByType) {
                if (this.query.offset) {
                    throw new rest_1.HttpErrors.BadRequest(const_1.Errors.OFFSET_WITH_TYPE);
                }
                this.baseQueryList = this.baseQueryList.map(q => `${q} LIMIT ${this.query.limit}`);
            }
            else {
                this.limitQuery = `LIMIT ${this.query.limit} OFFSET ${(_a = this.query.offset) !== null && _a !== void 0 ? _a : 0}`;
            }
        }
        else {
            if (this.query.limitByType) {
                throw new rest_1.HttpErrors.BadRequest(const_1.Errors.TYPE_WITHOUT_LIMIT);
            }
            if (this.query.offset) {
                throw new rest_1.HttpErrors.BadRequest(const_1.Errors.OFFSET_WITHOUT_LIMIT);
            }
        }
    }
    order(columns) {
        let orderQuery;
        if (this.query.order) {
            const [column, sortOrder] = this.query.order.split(' ');
            if (!columns.includes(column) ||
                !(sortOrder === 'DESC' || sortOrder === 'ASC')) {
                throw new rest_1.HttpErrors.BadRequest(const_1.Errors.INVALID_ORDER);
            }
            orderQuery = `ORDER BY ${column} ${sortOrder}`;
        }
        else {
            orderQuery = 'ORDER BY rank DESC';
        }
        if (this.query.limitByType) {
            this.baseQueryList = this.baseQueryList.map(q => `${q} ${orderQuery}`);
        }
        if (this.baseQueryList.length === 1 && this.query.limitByType) {
            this.orderQuery = '';
        }
        else {
            this.orderQuery = orderQuery;
        }
    }
    build(models, type) {
        if (!this.query.match) {
            throw new rest_1.HttpErrors.BadRequest(const_1.Errors.MISSING_MATCH);
        }
        if (!(models && models.length > 0)) {
            throw new rest_1.HttpErrors.BadRequest(const_1.Errors.NO_COLUMNS_TO_MATCH);
        }
        return {
            query: this.queryBuild(models, type),
            params: this.paramsBuild(this.query.match),
        };
    }
    paramsBuild(param) {
        return [param];
    }
    queryBuild(models, type) {
        this.baseQueryList = [];
        this.limitQuery = '';
        this.orderQuery = '';
        if (!type) {
            type = models_1.SearchResult;
        }
        const defaultColumns = Object.keys(type.definition.properties);
        models.forEach(model => {
            if (types_1.isSearchableModel(model)) {
                this.search(model.model.modelName, model.columns);
            }
            else {
                this.search(model.modelName, defaultColumns);
            }
        });
        this.order(defaultColumns);
        this.limit();
        const mainQuery = this.baseQueryList
            .map(query => `(${query})`)
            .join(this.unionString);
        return [mainQuery, this.orderQuery, this.limitQuery]
            .filter(q => (q === null || q === void 0 ? void 0 : q.length) > 0)
            .join(' ');
    }
}
exports.SearchQueryBuilder = SearchQueryBuilder;
//# sourceMappingURL=query.builder.js.map