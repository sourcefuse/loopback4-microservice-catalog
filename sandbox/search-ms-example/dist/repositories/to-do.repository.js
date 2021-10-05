"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDoRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const datasources_1 = require("../datasources");
const search_service_1 = require("@sourceloop/search-service");
let ToDoRepository = class ToDoRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.ToDo, dataSource);
    }
};
ToDoRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(`datasources.${search_service_1.SearchServiceBindings.DATASOURCE_NAME}`)),
    tslib_1.__metadata("design:paramtypes", [datasources_1.DynamicDataSource])
], ToDoRepository);
exports.ToDoRepository = ToDoRepository;
//# sourceMappingURL=to-do.repository.js.map