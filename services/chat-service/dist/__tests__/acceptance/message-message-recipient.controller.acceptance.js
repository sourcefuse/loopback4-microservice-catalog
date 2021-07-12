"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
const repositories_1 = require("../../repositories");
const helper_1 = require("./helper");
describe('Message-Message Recipient Controller', () => {
    let app;
    let client;
    let messageRepo;
    const basePath = '/messages/{id}/message-recipients';
    const pass = 'test_password';
    const testUser = {
        id: 1,
        username: 'test_user',
        password: pass,
        permissions: [
            'ViewMessage',
            'CreateMessage',
            'UpdateMessage',
            'DeleteMessage',
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
    it('gives status 200 when token is passed', async () => {
        await client
            .get(basePath)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
    });
    it('gives status 200 and an array of message that has many message recipients', async () => {
        const reqToAddRecipientId = await addRecipientId();
        testlab_1.expect(reqToAddRecipientId.status).to.be.equal(200);
        const response = await client
            .get(`${basePath}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
        testlab_1.expect(response.body[0]).to.have.properties(['channelId']);
        testlab_1.expect(response.body[0].channelId).to.be.equal('test_channel');
    });
    it('updates enitity successfully using PATCH request', async () => {
        const messageToUpdate = {
            deletedBy: 'update_delete',
            createdBy: 'update_create',
            modifiedBy: 'update_modify',
        };
        await client
            .patch(`${basePath}`)
            .set('authorization', `Bearer ${token}`)
            .send(messageToUpdate)
            .expect(200);
        const response = await client
            .get(`${basePath}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
        testlab_1.expect(response.body[0]).to.have.properties(['createdBy']);
        testlab_1.expect(response.body[0].createdBy).to.be.equal('update_create');
    });
    it('deletes a message successfully', async () => {
        await client
            .del(`${basePath}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
    });
    async function addRecipientId() {
        const messageToAdd = {
            deletedBy: 'test_delete',
            createdBy: 'test_create',
            modifiedBy: 'test_modify',
            channelId: 'test_channel',
            forwardedBy: 'test_forward',
            recipientId: 'test_recipient',
        };
        return client
            .post(basePath)
            .set('authorization', `Bearer ${token}`)
            .send(messageToAdd);
    }
    async function deleteMockData() {
        await messageRepo.deleteAllHard();
    }
    async function givenRepositories() {
        messageRepo = await app.getRepository(repositories_1.MessageRepository);
    }
});
//# sourceMappingURL=message-message-recipient.controller.acceptance.js.map