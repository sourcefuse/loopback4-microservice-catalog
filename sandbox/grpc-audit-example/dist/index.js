"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const tslib_1 = require("tslib");
const application_1 = require("./application");
tslib_1.__exportStar(require("./application"), exports);
async function main(options = {}) {
    const app = new application_1.GrpcTestApplication(options);
    await app.boot();
    await app.start();
    console.log(`Server is running...`);
    return app;
}
exports.main = main;
if (require.main === module) {
    // Run the application
    const config = {
        grpc: {},
    };
    main(config).catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map