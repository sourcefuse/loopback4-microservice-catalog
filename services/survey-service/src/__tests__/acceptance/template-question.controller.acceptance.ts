// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {
  QuestionTemplateRepository,
  TemplateQuestionRepository,
} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {QuestionTemplateStatus} from '../../enum';
import {TemplateQuestion} from '../../models';

describe('TemplateQuestionController', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let templateQuestionRepo: TemplateQuestionRepository;
  let templateRepo: QuestionTemplateRepository;
  const basePath = '/question-template/1/template-questions';

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

  it('it gives 200 and returns templateQuestion created', async () => {
    const question = await addQuestion();
    const templateQuestion = new TemplateQuestion({
      questionId: `${question.body.id}`,
      displayOrder: 1,
    });
    await addTemplate();
    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(templateQuestion)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('it gives 400 if questionId does not exist', async () => {
    await addQuestion();
    const templateQuestion = new TemplateQuestion({
      questionId: 'questiondId',
      displayOrder: 1,
    });
    await addTemplate();
    await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(templateQuestion)
      .expect(400);
  });

  it('it gives 401 and returns error', async () => {
    const question = await addQuestion();
    const templateQuestion = new TemplateQuestion({
      questionId: `${question.body.id}`,
      displayOrder: 1,
    });
    await addTemplate();
    const response = await client
      .post(`${basePath}`)
      .send(templateQuestion)
      .expect(401);
    expect(response.statusCode).have.equal(401);
    expect(response).to.have.property('error');
  });

  it('it gives status 200 and data of the respective id', async () => {
    const templateQuestion = await addTemplateQuestion();
    const response = await client
      .get(`${basePath}/${templateQuestion.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${templateQuestion.body.id}`);
  });

  it('it gives status 404 if id does not exist', async () => {
    await addTemplateQuestion();
    const response = await client
      .get(`${basePath}/947`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
    expect(response).to.have.property('error');
  });

  it('it gives 204 and updates the data respective to entity id', async () => {
    const templateQuestionCreated = await addTemplateQuestion();
    const templateQuestionToUpdate = {
      displayOrder: 2,
    };
    await client
      .patch(`${basePath}/${templateQuestionCreated.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(templateQuestionToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${templateQuestionCreated.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.displayOrder).to.be.equal(2);
  });

  it('it gives 204 and updates the data respective to entities', async () => {
    const templateQuestionCreated = await addTemplateQuestion();
    const templateQuestionToUpdate = [
      {
        id: templateQuestionCreated.body.id,
        displayOrder: 2,
      },
    ];
    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(templateQuestionToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${templateQuestionCreated.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.displayOrder).to.be.equal(2);
  });

  it('it gives 404 if wrong id is passed to patch', async () => {
    await addTemplateQuestion();
    const templateQuestionToUpdate = {
      displayOrder: 2,
    };
    await client
      .patch(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .send(templateQuestionToUpdate)
      .expect(404);
  });

  it('deletes a template question successfully', async () => {
    const question = await addTemplateQuestion();
    await client
      .del(`${basePath}/${question.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('return 404 if id does not exist on deletion', async () => {
    await addTemplateQuestion();
    const response = await client
      .del(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
    expect(response.body.error.message).to.be.equal('Entity not found.');
  });

  async function addTemplate() {
    await templateRepo.createAll([
      {
        name: 'Template 1',
        status: QuestionTemplateStatus.DRAFT,
      },
      {
        name: 'Template 2',
        status: QuestionTemplateStatus.DRAFT,
      },
    ]);
  }

  async function addQuestion() {
    const questionToAdd = {
      questionType: 'Single Selection',
      name: 'Question 101',
    };
    return client
      .post(`/questions`)
      .set('authorization', `Bearer ${token}`)
      .send(questionToAdd);
  }

  async function addTemplateQuestion() {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      questionId: '1',
      displayOrder: 1,
    });
  }

  async function deleteMockData() {
    await templateQuestionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    templateQuestionRepo = await app.getRepository(TemplateQuestionRepository);
    templateRepo = await app.getRepository(QuestionTemplateRepository);
  }
});
