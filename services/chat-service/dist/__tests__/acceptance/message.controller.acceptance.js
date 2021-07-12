"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
const repositories_1 = require("../../repositories");
const helper_1 = require("./helper");
describe('Message Controller', () => {
    let app;
    let client;
    let messageRepo;
    const basePath = '/messages';
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
    it('gives status 200 and an array of messages', async () => {
        const reqToAddMessage = await addMessage();
        testlab_1.expect(reqToAddMessage.status).to.be.equal(200);
        const response = await client
            .get(`${basePath}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
        testlab_1.expect(response.body[0]).to.have.properties(['body']);
        testlab_1.expect(response.body[0].body).to.be.equal('test_body');
    });
    it('updates message successfully using PATCH request', async () => {
        const reqToAddMessage = await addMessage();
        const messageToUpdate = {
            body: 'updated_body',
        };
        await client
            .patch(`${basePath}/${reqToAddMessage.body.id}`)
            .set('authorization', `Bearer ${token}`)
            .send(messageToUpdate)
            .expect(204);
        const response = await client
            .get(`${basePath}/${reqToAddMessage.body.id}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
        testlab_1.expect(response.body).to.have.properties(['body']);
        testlab_1.expect(response.body.body).to.be.equal('updated_body');
    });
    it('updates message successfully using PUT request', async () => {
        const reqToAddMessage = await addMessage();
        const messageToUpdate = {
            deletedBy: 'updated_delete',
            createdBy: 'updated_create',
            modifiedBy: 'updated_modify',
            body: 'updated_body',
            channelId: 'updated_channel',
            channelType: 'updated_channel_type',
            subject: 'updated_subject',
        };
        await client
            .put(`${basePath}/${reqToAddMessage.body.id}`)
            .set('authorization', `Bearer ${token}`)
            .send(messageToUpdate)
            .expect(204);
        const response = await client
            .get(`${basePath}/${reqToAddMessage.body.id}`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
        testlab_1.expect(response.body).to.have.properties(['body']);
        testlab_1.expect(response.body.body).to.be.equal('updated_body');
    });
    it('deletes a message successfully', async () => {
        const reqToAddMessage = await addMessage();
        await client
            .del(`${basePath}/${reqToAddMessage.body.id}`)
            .set('authorization', `Bearer ${token}`)
            .expect(204);
    });
    it('should return count', async () => {
        await client
            .get(`${basePath}/count`)
            .set('authorization', `Bearer ${token}`)
            .expect(200);
    });
    async function addMessage() {
        const messageToAdd = {
            deletedBy: 'test_delete',
            createdBy: 'test_create',
            modifiedBy: 'test_modify',
            body: 'test_body',
            channelId: 'test_channel',
            channelType: 'test_channel_type',
            subject: 'test_subject',
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
//# sourceMappingURL=message.controller.acceptance.js.map