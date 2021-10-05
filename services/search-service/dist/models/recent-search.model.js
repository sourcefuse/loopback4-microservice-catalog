"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentSearch = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const core_1 = require("@sourceloop/core");
const search_query_model_1 = require("./search-query.model");
let RecentSearch = class RecentSearch extends core_1.UserModifiableEntity {
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
], RecentSearch.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        name: 'user_id',
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], RecentSearch.prototype, "userId", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => search_query_model_1.SearchQuery),
    tslib_1.__metadata("design:type", Array)
], RecentSearch.prototype, "params", void 0);
RecentSearch = tslib_1.__decorate([
    repository_1.model({
        name: 'recent_search',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], RecentSearch);
exports.RecentSearch = RecentSearch;
//# sourceMappingURL=recent-search.model.js.map