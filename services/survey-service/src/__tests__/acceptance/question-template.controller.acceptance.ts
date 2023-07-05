// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {QuestionTemplateRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {QuestionTemplateStatus} from '../../enum';
import {QuestionTemplate} from '../../models';

describe('TemplateController', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let templateRepo: QuestionTemplateRepository;
  const basePath = '/templates';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('it gives 200 and returns created question template as response', async () => {
    const questionTemplate = new QuestionTemplate({
      name: 'Question Template one',
      status: QuestionTemplateStatus.DRAFT,
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(questionTemplate)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('it gives 401 when passed without token and returns error', async () => {
    const questionTemplate = new QuestionTemplate({
      name: 'Question one',
      status: QuestionTemplateStatus.DRAFT,
    });

    const response = await client
      .post(`${basePath}`)
      .send(questionTemplate)
      .expect(401);
    expect(response.statusCode).have.equal(401);
    expect(response).to.have.property('error');
  });

  it('it gives 204 and deletes a question template successfully', async () => {
    const reqToAddMessage = await addQuestionTemplate();
    await client
      .del(`${basePath}/${reqToAddMessage.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('it gives status 200 and data of the respective id', async () => {
    const questionTemplate = await addQuestionTemplate();
    const response = await client
      .get(`${basePath}/${questionTemplate.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${questionTemplate.body.id}`);
  });

  it('it gives 204 and updates the data respective to entity id', async () => {
    const questionTemplate = await addQuestionTemplate();
    const questionTemplateValueToUpdate = {
      name: 'test question template patch',
    };
    await client
      .patch(`${basePath}/${questionTemplate.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(questionTemplateValueToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${questionTemplate.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.name).to.be.equal('test question template patch');
  });

  async function addQuestionTemplate() {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      name: 'Question Template 1',
      status: QuestionTemplateStatus.DRAFT,
    });
  }

  async function deleteMockData() {
    await templateRepo.deleteAllHard();
  }

  async function givenRepositories() {
    templateRepo = await app.getRepository(QuestionTemplateRepository);
    await templateRepo.createAll([
      {
        id: '1',
        name: 'Question Template 1',
        status: QuestionTemplateStatus.DRAFT,
      },
      {
        id: '2',
        name: 'Question Template 2',
        status: QuestionTemplateStatus.DRAFT,
      },
    ]);
  }
});
