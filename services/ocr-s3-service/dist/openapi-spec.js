"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
const ARGV_INDEX = 2;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec() {
    var _a, _b, _c;
    const config = {
        rest: {
            port: +((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000),
            host: (_b = process.env.HOST) !== null && _b !== void 0 ? _b : 'localhost',
        },
    };
    const outFile = (_c = process.argv[ARGV_INDEX]) !== null && _c !== void 0 ? _c : './src/openapi.json';
    const app = new application_1.ClmS3ServiceApplication(config);
    await app.boot();
    await app.exportOpenApiSpec(outFile);
}
exportOpenApiSpec()
    .then(() => {
    process.exit(0);
})
    .catch(err => {
    console.error('Fail to export OpenAPI spec from the application.', err);
    process.exit(1);
});
//# sourceMappingURL=openapi-spec.js.map