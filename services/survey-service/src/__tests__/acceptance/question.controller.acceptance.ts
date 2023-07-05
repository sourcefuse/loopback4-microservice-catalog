// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {QuestionRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {QuestionDto} from '../../models';
import {QuestionStatus, QuestionType} from '../../enum';
import {token} from '../datasources/userCredsAndPermission';

describe('Question Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let questionRepo: QuestionRepository;
  const basePath = '/questions';

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

  it('deletes a question successfully', async () => {
    const reqToAddMessage = await addQuestion();
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

  it('it gives 401 and returns error', async () => {
    const question = new QuestionDto({
      name: 'Question one',
      questionType: QuestionType.SINGLE_SELECTION,
    });

    const response = await client
      .post(`${basePath}`)
      .send(question)
      .expect(401);
    expect(response.statusCode).have.equal(401);
    expect(response).to.have.property('error');
  });

  it('it gives 200 and returns created question as response', async () => {
    const question = new QuestionDto({
      name: 'Question one',
      questionType: QuestionType.SINGLE_SELECTION,
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(question)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('it gives 200 and returns created duplicate question as response', async () => {
    const createdQuestion = await addQuestion();
    const question = new QuestionDto({});

    const response = await client
      .post(`${basePath}/${createdQuestion.body.id}/duplicate`)
      .set('Authorization', `Bearer ${token}`)
      .send(question)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('it gives status 200 and data of the respective id', async () => {
    const question = await addQuestion();
    const response = await client
      .get(`${basePath}/${question.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${question.body.id}`);
  });

  it('it gives 200 and updates the data respective to entity id', async () => {
    const question = await addQuestion();
    const questionValueToUpdate = {
      name: 'test question patch',
    };
    await client
      .patch(`${basePath}/${question.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(questionValueToUpdate)
      .expect(200);

    const response = await client
      .get(`${basePath}/${question.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.name).to.be.equal('test question patch');
  });

  async function addQuestion() {
    const questionToAdd = {
      questionType: 'Single Selection',
      name: 'Question 1',
    };
    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(questionToAdd);
  }

  async function deleteMockData() {
    await questionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    questionRepo = await app.getRepository(QuestionRepository);
    await questionRepo.createAll([
      {
        id: '1',
        name: 'Question 1',
        questionType: QuestionType.MULTI_SELECTION,
        uid: 'QR000001',
        status: QuestionStatus.DRAFT,
      },
      {
        id: '2',
        name: 'Question 2',
        questionType: QuestionType.DROPDOWN,
        uid: 'QR000002',
        status: QuestionStatus.DRAFT,
      },
    ]);
  }
});
