"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentSearchRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const const_1 = require("../const");
const keys_1 = require("../keys");
const models_1 = require("../models");
let RecentSearchRepository = class RecentSearchRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, queryRepositoryGetter, config) {
        super(models_1.RecentSearch, dataSource);
        this.config = config;
        this.params = this.createHasManyRepositoryFactoryFor('params', queryRepositoryGetter);
        this.registerInclusionResolver('params', this.params.inclusionResolver);
    }
    async create(query, user) {
        var _a, _b;
        if (!user) {
            throw new rest_1.HttpErrors.BadRequest(const_1.Errors.USER_MISSING);
        }
        let saved = await super.findOne({
            where: {
                userId: user.userTenantId,
            },
        });
        if (saved === null || saved === void 0 ? void 0 : saved.id) {
            const prev = await this.params(saved.id).find({
                order: ['created_on DESC'],
            });
            const recentCount = (_b = (_a = this.config.controller) === null || _a === void 0 ? void 0 : _a.recentCount) !== null && _b !== void 0 ? _b : const_1.DEFAULT_RECENTS;
            if (prev.length >= recentCount) {
                await this.params(saved.id).delete({
                    id: prev[recentCount - 1].id,
                });
            }
        }
        else {
            saved = await super.create({
                userId: user.id,
            });
        }
        if (saved === null || saved === void 0 ? void 0 : saved.id) {
            await this.params(saved.id).create({
                ...query,
                recentSearchId: saved.id,
            });
        }
        else {
            throw new rest_1.HttpErrors.InternalServerError(const_1.Errors.FAILED);
        }
        return saved;
    }
};
RecentSearchRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(`datasources.${keys_1.SearchServiceBindings.DATASOURCE_NAME}`)),
    tslib_1.__param(1, repository_1.repository.getter('SearchQueryRepository')),
    tslib_1.__param(2, core_1.inject(keys_1.SearchServiceBindings.Config)),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource, Function, Object])
], RecentSearchRepository);
exports.RecentSearchRepository = RecentSearchRepository;
//# sourceMappingURL=recent-search.repository.js.map