"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const const_1 = require("../const");
const keys_1 = require("../keys");
const models_1 = require("../models");
const types_1 = require("../types");
let SearchProvider = class SearchProvider {
    constructor(config, datasource, mySQLBuilder, psqlBuilder) {
        this.config = config;
        this.datasource = datasource;
        this.mySQLBuilder = mySQLBuilder;
        this.psqlBuilder = psqlBuilder;
    }
    value() {
        return search => {
            var _a;
            let queryBuilder;
            if (!search.match) {
                throw new rest_1.HttpErrors.BadRequest(const_1.Errors.MISSING_MATCH);
            }
            switch (this.datasource.settings.connector) {
                case const_1.CONNECTORS.POSTGRESQL:
                    queryBuilder = new this.psqlBuilder(search, this.datasource.settings.schema);
                    break;
                case const_1.CONNECTORS.MYSQL:
                    queryBuilder = new this.mySQLBuilder(search);
                    break;
                default:
                    throw new rest_1.HttpErrors.InternalServerError(const_1.Errors.UNSUPPORTED_CONNECTOR);
            }
            let models;
            if (search.sources && search.sources.length > 0) {
                const sources = search.sources;
                models = this.config.models.filter(model => {
                    if (types_1.isSearchableModel(model)) {
                        return sources.includes(model.model.name);
                    }
                    else {
                        return sources.includes(model.name);
                    }
                });
            }
            else {
                models = this.config.models;
            }
            const type = (_a = this.config.type) !== null && _a !== void 0 ? _a : models_1.SearchResult;
            const { query, params } = queryBuilder.build(models, type);
            try {
                return this.datasource.execute(query, params);
            }
            catch (e) {
                throw new rest_1.HttpErrors.InternalServerError(const_1.Errors.FAILED);
            }
        };
    }
};
SearchProvider = tslib_1.__decorate([
    core_1.injectable({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, core_1.inject(keys_1.SearchServiceBindings.Config)),
    tslib_1.__param(1, core_1.inject(`datasources.${keys_1.SearchServiceBindings.DATASOURCE_NAME}`)),
    tslib_1.__param(2, core_1.inject(keys_1.SearchServiceBindings.MySQLQueryBuilder)),
    tslib_1.__param(3, core_1.inject(keys_1.SearchServiceBindings.PostgreSQLQueryBuilder)),
    tslib_1.__metadata("design:paramtypes", [Object, repository_1.juggler.DataSource, Object, Object])
], SearchProvider);
exports.SearchProvider = SearchProvider;
//# sourceMappingURL=search.provider.js.map