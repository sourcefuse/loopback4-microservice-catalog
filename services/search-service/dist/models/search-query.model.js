"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchQuery = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const recent_search_model_1 = require("./recent-search.model");
let SearchQuery = class SearchQuery extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        id: true,
        type: 'String',
        required: false,
        // settings below are needed
        generated: true,
        useDefaultIdType: false,
        postgresql: {
            dataType: 'uuid',
        },
    }),
    tslib_1.__metadata("design:type", String)
], SearchQuery.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], SearchQuery.prototype, "match", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], SearchQuery.prototype, "limit", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], SearchQuery.prototype, "order", void 0);
tslib_1.__decorate([
    repository_1.property({
        name: 'limit_by_type',
        type: 'boolean',
    }),
    tslib_1.__metadata("design:type", Boolean)
], SearchQuery.prototype, "limitByType", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], SearchQuery.prototype, "offset", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'array',
        itemType: 'string',
    }),
    tslib_1.__metadata("design:type", Array)
], SearchQuery.prototype, "sources", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => recent_search_model_1.RecentSearch, { name: 'recentSearch' }, { name: 'recent_search_id' }),
    tslib_1.__metadata("design:type", String)
], SearchQuery.prototype, "recentSearchId", void 0);
SearchQuery = tslib_1.__decorate([
    repository_1.model({
        name: 'search_query',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], SearchQuery);
exports.SearchQuery = SearchQuery;
//# sourceMappingURL=search-query.model.js.map