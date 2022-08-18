import {Client, expect} from '@loopback/testlab';
import {setUpApplication} from './helper';
import {dataMessageFile} from '../mockdata/mockdata';
import {ChatApplication} from '../application';
import {token} from '../mockdata/userCredsAndPermission';
import {AttachmentFileRepository} from '../../repositories/attachment.repository';
describe(`Acceptance Test Cases For ChatApplication's AttachmentFileController `, () => {
  let app: ChatApplication;
  let client: Client;
  const basePath = `/attach-files`;
  const fakeId = 1;
  let attachmentRepo: AttachmentFileRepository;
  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => {
    await app.stop();
  });

  before(givenRepositories);
  afterEach(deleteMockData);
  it('Post call for AttachmentFileController to create message files.', async () => {
    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dataMessageFile)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('get call for AttachmentFileController to count.', async () => {
    const response = await client
      .get(`${basePath}/count`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.property('body');
    expect(response.statusCode).have.equal(200);
  });

  it('gets call for AttachmentFileController to list or to get Array of MessageFile.', async () => {
    const response = await client
      .get(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.property('body');
    expect(response.statusCode).have.equal(200);
  });

  it('Patch call for AttachmentFileController to update all message files.', async () => {
    const response = await client
      .patch(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dataMessageFile)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('gets call for MessageFile by id returns 404 not found on providing fake id', async () => {
    const response = await client
      .get(`${basePath}/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    expect(response).to.have.property('body');
    expect(response.statusCode).have.equal(404);
  });

  it('Patch call for message file by id returns 404 not found on providing fake id', async () => {
    const response = await client
      .patch(`${basePath}/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dataMessageFile)
      .expect(404);
    expect(response.statusCode).have.equal(404);
    expect(response).to.have.property('body');
  });

  it('Delete call for message file returns 404 not found on providing fake id', async () => {
    const response = await client
      .delete(`${basePath}/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    expect(response.statusCode).have.equal(404);
  });
  async function deleteMockData() {
    await attachmentRepo.deleteAllHard();
  }
  async function givenRepositories() {
    attachmentRepo = await app.getRepository(AttachmentFileRepository);
  }
});
