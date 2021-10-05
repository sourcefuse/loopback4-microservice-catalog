"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchServiceComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const core_2 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const const_1 = require("./const");
const controllers_1 = require("./controllers");
const keys_1 = require("./keys");
const models_1 = require("./models");
const classes_1 = require("./classes");
const services_1 = require("./services");
const recent_search_repository_1 = require("./repositories/recent-search.repository");
const search_query_repository_1 = require("./repositories/search-query.repository");
const _1 = require(".");
const utils_1 = require("./utils");
let SearchServiceComponent = class SearchServiceComponent {
    constructor(application, config) {
        var _a;
        this.application = application;
        this.config = config;
        this.providers = {};
        this.bindings = [];
        this.bindings = [];
        this.providers = {};
        // Mount core component
        this.application.component(core_2.CoreComponent);
        if (!((_a = this.config) === null || _a === void 0 ? void 0 : _a.useCustomSequence)) {
            this.setupSequence();
        }
        this.models = [models_1.SearchQuery];
        this.providers = {
            [keys_1.SearchServiceBindings.SearchFunction.key]: services_1.SearchProvider,
        };
        this.application
            .bind(keys_1.SearchServiceBindings.MySQLQueryBuilder)
            .to(classes_1.MySqlQueryBuilder);
        this.application
            .bind(keys_1.SearchServiceBindings.PostgreSQLQueryBuilder)
            .to(classes_1.PsqlQueryBuilder);
        this.application
            .bind(keys_1.SearchServiceBindings.FetchedColumns)
            .to(const_1.DEFAULT_COLUMNS);
        let controllerCtor = controllers_1.defineSearchController(models_1.SearchResult);
        if (this.config) {
            if (!this.config.useCustomSequence) {
                this.setupSequence();
            }
            const models = this.config.models.map(model => {
                if (_1.isSearchableModel(model)) {
                    return model.model.name;
                }
                else {
                    return model.name;
                }
            });
            if (this.config.type) {
                controllerCtor = controllers_1.defineSearchController(this.createResultModel(this.config.type, models), this.config.controller);
            }
            else if (this.config.controller) {
                this.models = [models_1.SearchResult];
                controllerCtor = controllers_1.defineSearchController(this.createResultModel(models_1.SearchResult, models), this.config.controller);
            }
            else {
                // do nothing
            }
        }
        core_1.inject(keys_1.SearchServiceBindings.SearchFunction)(controllerCtor, undefined, 0);
        core_1.inject(keys_1.SearchServiceBindings.Config)(controllerCtor, undefined, 1);
        repository_1.repository(recent_search_repository_1.RecentSearchRepository)(controllerCtor, undefined, 2);
        this.controllers = [controllerCtor];
        this.repositories = [recent_search_repository_1.RecentSearchRepository, search_query_repository_1.SearchQueryRepository];
    }
    /**
     * Setup ServiceSequence by default if no other sequnce provided
     *
     * @param bindings Binding array
     */
    setupSequence() {
        var _a;
        if (!((_a = this.config.controller) === null || _a === void 0 ? void 0 : _a.authenticate) ||
            !this.config.controller.authorizations) {
            throw new rest_1.HttpErrors.InternalServerError(const_1.Errors.AUTHENTICATION_SETUP);
        }
        this.application.sequence(core_2.ServiceSequence);
        // Mount authentication component for default sequence
        this.application.component(loopback4_authentication_1.AuthenticationComponent);
        // Mount bearer verifier component
        this.application.bind(core_2.BearerVerifierBindings.Config).to({
            authServiceUrl: '',
            type: core_2.BearerVerifierType.service,
        });
        this.application.component(core_2.BearerVerifierComponent);
        // Mount authorization component for default sequence
        this.application.bind(loopback4_authorization_1.AuthorizationBindings.CONFIG).to({
            allowAlwaysPaths: ['/explorer'],
        });
        this.application.component(loopback4_authorization_1.AuthorizationComponent);
    }
    createResultModel(base, models) {
        const modelDef = new repository_1.ModelDefinition({
            name: 'SearchResults',
            properties: {
                rank: {
                    type: 'Number',
                    required: true,
                },
                source: {
                    type: 'string',
                    jsonSchema: {
                        enum: models,
                    },
                },
            },
        });
        return utils_1.defineModelClass(base, modelDef);
    }
};
SearchServiceComponent = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, core_1.inject(keys_1.SearchServiceBindings.Config)),
    tslib_1.__metadata("design:paramtypes", [rest_1.RestApplication, Object])
], SearchServiceComponent);
exports.SearchServiceComponent = SearchServiceComponent;
//# sourceMappingURL=component.js.map