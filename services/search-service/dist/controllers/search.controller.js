"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineSearchController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const core_1 = require("@sourceloop/core");
const loopback4_authorization_1 = require("loopback4-authorization");
const models_1 = require("../models");
const utils_1 = require("../utils");
const core_2 = require("@loopback/core");
const loopback4_authentication_1 = require("loopback4-authentication");
const assert = require("assert");
const const_1 = require("../const");
const recent_search_repository_1 = require("../repositories/recent-search.repository");
const decorators_1 = require("../decorators");
const EXCLUDED_COLUMNS = ['id', 'recentSearchId'];
function defineSearchController(modelCtor, options) {
    var _a, _b, _c, _d, _e;
    const name = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : '';
    let SearchControllerImpl = class SearchControllerImpl {
        constructor(searchFn, config, recents) {
            this.searchFn = searchFn;
            this.config = config;
            this.recents = recents;
        }
        async search(query, saveInRecents, getUser) {
            var _a;
            const user = await getUser();
            if (((_a = this.config.controller) === null || _a === void 0 ? void 0 : _a.recents) && saveInRecents) {
                if (!user) {
                    throw new rest_1.HttpErrors.BadRequest(const_1.Errors.USER_MISSING);
                }
                else {
                    await this.recents.create(query, user);
                }
            }
            return this.searchFn(query);
        }
        async list(user) {
            const result = await this.recents.findOne({
                where: {
                    userId: user.userTenantId,
                },
                fields: ['params'],
                include: [
                    {
                        relation: 'params',
                        scope: {
                            order: ['created_on DESC'],
                            fields: [
                                'match',
                                'limit',
                                'limitByType',
                                'order',
                                'offset',
                                'sources',
                            ],
                        },
                    },
                ],
            });
            if (result) {
                return result.params;
            }
            else {
                throw new rest_1.HttpErrors.NotFound(const_1.Errors.NO_RECENT);
            }
        }
    };
    tslib_1.__decorate([
        decorators_1.authenticateOnCondition(options === null || options === void 0 ? void 0 : options.authenticate),
        loopback4_authorization_1.authorize({ permissions: (_b = options === null || options === void 0 ? void 0 : options.authorizations) !== null && _b !== void 0 ? _b : ['*'] }),
        rest_1.get('/', {
            security: (options === null || options === void 0 ? void 0 : options.authenticate) ? core_1.OPERATION_SECURITY_SPEC : undefined,
            ...utils_1.response.array(200 /* OK */, `Array of ${modelCtor.name} instances`, modelCtor),
        }),
        tslib_1.__param(0, rest_1.param.query.object('query', utils_1.dynamicModelSchemaRef(models_1.SearchQuery, {
            exclude: ['recentSearchId', 'id'],
        }))),
        tslib_1.__param(1, rest_1.param.query.boolean('saveInRecents')),
        tslib_1.__param(2, core_2.inject.getter(loopback4_authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [models_1.SearchQuery, Boolean, Function]),
        tslib_1.__metadata("design:returntype", Promise)
    ], SearchControllerImpl.prototype, "search", null);
    tslib_1.__decorate([
        decorators_1.authenticateOnCondition(options === null || options === void 0 ? void 0 : options.authenticate),
        loopback4_authorization_1.authorize({ permissions: (_c = options === null || options === void 0 ? void 0 : options.authorizations) !== null && _c !== void 0 ? _c : ['*'] }),
        decorators_1.getOnCondition((_d = options === null || options === void 0 ? void 0 : options.recents) !== null && _d !== void 0 ? _d : false, '/recents', {
            security: core_1.OPERATION_SECURITY_SPEC,
            responses: {
                [200 /* OK */]: {
                    description: 'RecentQuery model instance',
                    content: {
                        [core_1.CONTENT_TYPE.JSON]: {
                            schema: rest_1.getModelSchemaRef(models_1.SearchQuery, {
                                exclude: EXCLUDED_COLUMNS,
                            }),
                        },
                    },
                },
            },
        }),
        tslib_1.__param(0, core_2.inject(loopback4_authentication_1.AuthenticationBindings.CURRENT_USER)),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], SearchControllerImpl.prototype, "list", null);
    SearchControllerImpl = tslib_1.__decorate([
        rest_1.api({
            basePath: (_e = options === null || options === void 0 ? void 0 : options.basePath) !== null && _e !== void 0 ? _e : `/${name.toLocaleLowerCase()}/search`,
            paths: {},
        }),
        tslib_1.__metadata("design:paramtypes", [Function, Object, recent_search_repository_1.RecentSearchRepository])
    ], SearchControllerImpl);
    const controllerName = name + 'SearchController';
    const defineNameController = () => {
        const temp = {
            [controllerName]: class extends SearchControllerImpl {
            },
        };
        return temp[controllerName];
    };
    const controller = defineNameController();
    assert.equal(controller.name, controllerName);
    return controller;
}
exports.defineSearchController = defineSearchController;
//# sourceMappingURL=search.controller.js.map