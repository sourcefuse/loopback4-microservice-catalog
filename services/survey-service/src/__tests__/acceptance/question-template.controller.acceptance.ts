// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {
  QuestionRepository,
  QuestionTemplateRepository,
  TemplateQuestionRepository,
} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {QuestionStatus, QuestionTemplateStatus, QuestionType} from '../../enum';
import {QuestionTemplate, QuestionTemplatesDto} from '../../models';

describe('Template Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let templateRepo: QuestionTemplateRepository;
  let templateQuestionRepo: TemplateQuestionRepository;
  let questionRepo: QuestionRepository;

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
    await addQuestion();
    await givenRepositories();
    await addTemplateQuestion();
    const questionTemplate = new QuestionTemplatesDto({
      name: 'Question Template one',
      status: QuestionTemplateStatus.DRAFT,
      existingTemplateId: '1',
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

  it('it gives status 400 if wromg id passed', async () => {
    await addQuestionTemplate();
    const response = await client
      .get(`${basePath}/458`)
      .set('authorization', `Bearer ${token}`)
      .expect(400);
    expect(response).to.be.have.property('error');
  });

  it('it gives 204 and updates the data respective to entity id', async () => {
    await givenRepositories();
    const questionTemplate = await addQuestionTemplate();
    const questionTemplateValueToUpdate = {
      name: 'test question template patch01',
      existingTemplateId: '1',
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
    expect(response.body.name).to.be.equal('test question template patch01');
  });

  it('it gives 400 if try to update approved template', async () => {
    await givenRepositories();
    const questionTemplateValueToUpdate = {
      name: 'test question template patch 02',
    };
    await client
      .patch(`${basePath}/2`)
      .set('authorization', `Bearer ${token}`)
      .send(questionTemplateValueToUpdate)
      .expect(400);
  });

  it('it gives 404 if try to update with wrong id', async () => {
    await givenRepositories();
    const questionTemplateValueToUpdate = {
      name: 'test question template patch 03',
    };
    await client
      .patch(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .send(questionTemplateValueToUpdate)
      .expect(404);
  });

  it('it gives 404 if try to update with wrong existingTemplateId id', async () => {
    await givenRepositories();
    const questionTemplateValueToUpdate = {
      name: 'test question template patch 04',
      existingTemplateId: 'existingTemplateId',
    };
    await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(questionTemplateValueToUpdate)
      .expect(404);
  });

  async function addTemplateQuestion() {
    await templateQuestionRepo.create({
      id: '1',
      questionId: 'questionId',
      displayOrder: 1,
      templateId: '1',
    });
  }

  async function addQuestion() {
    await questionRepo.create({
      id: 'questionId',
      questionType: QuestionType.SINGLE_SELECTION,
      name: 'Question 101',
      uid: 'QR0000012',
      status: QuestionStatus.DRAFT,
    });
  }

  async function addQuestionTemplate() {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      name: 'Question Template 1',
      status: QuestionTemplateStatus.DRAFT,
    });
  }

  async function deleteMockData() {
    await templateRepo.deleteAllHard();
    await questionRepo.deleteAllHard();
    await templateQuestionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    templateRepo = await app.getRepository(QuestionTemplateRepository);
    questionRepo = await app.getRepository(QuestionRepository);

    templateQuestionRepo = await app.getRepository(TemplateQuestionRepository);

    await templateRepo.createAll([
      {
        id: '1',
        name: 'Question Template 1',
        status: QuestionTemplateStatus.DRAFT,
      },
      {
        id: '2',
        name: 'Question Template 2',
        status: QuestionTemplateStatus.APPROVED,
      },
    ]);
  }
});
