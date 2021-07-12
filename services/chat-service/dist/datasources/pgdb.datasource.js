"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgdbDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'chatDb',
    connector: 'postgresql',
    url: '',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};
let PgdbDataSource = class PgdbDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
    /**
     * Start the datasource when application is started
     */
    start() {
        // Add your logic here to be invoked when the application is started
    }
    /**
     * Disconnect the datasource when application is stopped. This allows the
     * application to be shut down gracefully.
     */
    stop() {
        return super.disconnect();
    }
};
PgdbDataSource.dataSourceName = 'chatDb';
PgdbDataSource = tslib_1.__decorate([
    core_1.lifeCycleObserver('datasource'),
    tslib_1.__param(0, core_1.inject('datasources.config.Chat', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], PgdbDataSource);
exports.PgdbDataSource = PgdbDataSource;
//# sourceMappingURL=pgdb.datasource.js.map