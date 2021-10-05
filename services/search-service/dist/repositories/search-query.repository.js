"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchQueryRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const keys_1 = require("../keys");
const models_1 = require("../models");
let SearchQueryRepository = class SearchQueryRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, config) {
        super(models_1.SearchQuery, dataSource);
        this.config = config;
    }
};
SearchQueryRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(`datasources.${keys_1.SearchServiceBindings.DATASOURCE_NAME}`)),
    tslib_1.__param(1, core_1.inject(keys_1.SearchServiceBindings.Config)),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource, Object])
], SearchQueryRepository);
exports.SearchQueryRepository = SearchQueryRepository;
//# sourceMappingURL=search-query.repository.js.map