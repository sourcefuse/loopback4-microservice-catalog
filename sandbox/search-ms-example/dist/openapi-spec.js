"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
const DEFAULT_PORT = 3000;
const ARGVI = 2;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec() {
    var _a, _b, _c;
    const config = {
        rest: {
            port: +((_a = process.env.PORT) !== null && _a !== void 0 ? _a : DEFAULT_PORT),
            host: (_b = process.env.HOST) !== null && _b !== void 0 ? _b : 'localhost',
        },
    };
    const outFile = (_c = process.argv[ARGVI]) !== null && _c !== void 0 ? _c : '';
    const app = new application_1.SearchMsExampleApplication(config);
    await app.boot();
    await app.exportOpenApiSpec(outFile);
}
exportOpenApiSpec().catch(err => {
    console.error('Fail to export OpenAPI spec from the application.', err);
    process.exit(1);
});
//# sourceMappingURL=openapi-spec.js.map