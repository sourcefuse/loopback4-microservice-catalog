"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpApplication = void 0;
const testlab_1 = require("@loopback/testlab");
const application_1 = require("../application");
async function setUpApplication() {
    const app = new application_1.ChatApplication({
        rest: testlab_1.givenHttpServerConfig(),
    });
    await app.boot();
    app.bind('datasources.config.Chat').to({
        name: 'chatDb',
        connector: 'memory',
    });
    await app.start();
    const client = testlab_1.createRestAppClient(app);
    return { app, client };
}
exports.setUpApplication = setUpApplication;
//# sourceMappingURL=helper.js.map