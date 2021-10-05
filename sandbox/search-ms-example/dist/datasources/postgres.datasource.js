"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const search_service_1 = require("@sourceloop/search-service");
const config = {
    name: search_service_1.SearchServiceBindings.DATASOURCE_NAME,
    connector: (_a = process.env.DB_CONNECTOR) !== null && _a !== void 0 ? _a : 'postgresql',
    url: '',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: 'main',
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let DynamicDataSource = class DynamicDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
DynamicDataSource.dataSourceName = search_service_1.SearchServiceBindings.DATASOURCE_NAME;
DynamicDataSource.defaultConfig = config;
DynamicDataSource = tslib_1.__decorate([
    core_1.lifeCycleObserver('datasource'),
    tslib_1.__param(0, core_1.inject('datasources.config.Dynamic', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], DynamicDataSource);
exports.DynamicDataSource = DynamicDataSource;
//# sourceMappingURL=postgres.datasource.js.map