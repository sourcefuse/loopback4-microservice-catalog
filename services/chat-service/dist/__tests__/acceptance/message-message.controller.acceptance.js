"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const repositories_1 = require("../../repositories");
const helper_1 = require("./helper");
describe('Message-Message Controller', () => {
    let app;
    let client;
    let messageRepo;
    const basePath = '/messages/{id}/messages';
    before('setupApplication', async () => {
        ({ app, client } = await helper_1.setUpApplication());
    });
    after(async () => app.stop());
    before(givenRepositories);
    afterEach(deleteMockData);
    it('gives status 401 when no token is passed', async () => {
        const response = await client.get(basePath).expect(401);
        testlab_1.expect(response).to.have.property('error');
    });
    async function deleteMockData() {
        await messageRepo.deleteAllHard();
    }
    async function givenRepositories() {
        messageRepo = await app.getRepository(repositories_1.MessageRepository);
    }
});
//# sourceMappingURL=message-message.controller.acceptance.js.map