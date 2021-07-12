"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
const repositories_1 = require("../../repositories");
const helper_1 = require("./helper");
describe('Message-Recipient Message Controller', () => {
    let app;
    let client;
    let messageRecipientRepo;
    const basePath = '/message-recipients/{id}/message';
    const pass = 'test_password';
    const testUser = {
        id: 1,
        username: 'test_user',
        password: pass,
        permissions: [
            'ViewMessageRecipient',
            'CreateMessageRecipient',
            'UpdateMessageRecipient',
            'DeleteMessageRecipient',
        ],
    };
    const token = jwt.sign(testUser, 'kdskssdkdfs', {
        expiresIn: 180000,
        issuer: 'sf',
    });
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
    it('gives status 403 when token is passed and message id not present', async () => {
        await client
            .get(basePath)
            .set('authorization', `Bearer ${token}`)
            .expect(403);
    });
    async function deleteMockData() {
        await messageRecipientRepo.deleteAllHard();
    }
    async function givenRepositories() {
        messageRecipientRepo = await app.getRepository(repositories_1.MessageRecipientRepository);
    }
});
//# sourceMappingURL=message-recipient-message.controller.acceptance.js.map