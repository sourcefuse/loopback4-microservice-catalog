// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {OptionsRepository, QuestionRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {QuestionDto} from '../../models';
import {QuestionStatus, QuestionType} from '../../enum';
import {token} from '../datasources/userCredsAndPermission';

describe('Question Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let questionRepo: QuestionRepository;
  let questionOptionRepo: OptionsRepository;
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
      name: 'Question one1',
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
      name: 'Question one2',
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

  it('it gives 400 and throws error NOT ALLOWED ACCESS', async () => {
    const question = new QuestionDto({
      name: 'Question one3',
      questionType: QuestionType.SINGLE_SELECTION,
      status: QuestionStatus.APPROVED,
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(question)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('it gives 200 and returns created  data(SCALE TYPE)', async () => {
    const question = new QuestionDto({
      questionType: QuestionType.SCALE,
      name: 'Scale Question',
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(question)
      .expect(200);

    expect(response).to.have.property('body');
  });

  it('it gives 200 and returns created data', async () => {
    const question = new QuestionDto({
      name: 'Question one4',
      questionType: QuestionType.SINGLE_SELECTION,
      status: QuestionStatus.ADDED_TO_SURVEY,
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(question)
      .expect(200);

    expect(response).to.have.property('body');
  });

  it('it gives 200 and returns created follow up question data', async () => {
    const questionCreated = await addQuestion();
    const createdQuestionDetail = await client
      .patch(`${basePath}/${questionCreated.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({name: 'Ques'})
      .expect(200);
    const question = new QuestionDto({
      questionType: QuestionType.SINGLE_SELECTION,
      parentQuestionId: `${createdQuestionDetail.body.id}`,
      rootQuestionId: `${createdQuestionDetail.body.id}`,
      optionId: `${createdQuestionDetail.body.options[0].id}`,
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(question)
      .expect(200);

    expect(response).to.have.property('body');
  });

  it('it gives 200 and returns created data when updating question type', async () => {
    const questionCreated = await addQuestion();
    const response = await client
      .patch(`${basePath}/${questionCreated.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({questionType: QuestionType.MULTI_SELECTION})
      .expect(200);

    expect(response).to.have.property('body');
  });

  it('it gives 200 and returns created data when adding isScoreEnabled', async () => {
    const questionCreated = await addQuestion();
    const response = await client
      .patch(`${basePath}/${questionCreated.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({isScoreEnabled: false})
      .expect(200);

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

  it('it gives 200 and returns created data when status is approved', async () => {
    const questionCreated = await addQuestion();
    const createdQuestionDetail = await client
      .patch(`${basePath}/${questionCreated.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({status: QuestionStatus.APPROVED})
      .expect(200);

    expect(createdQuestionDetail).to.have.property('body');
  });

  it('returns the data created and status code 200 when status in request body is approved', async () => {
    const questionCreated = new QuestionDto({
      questionType: QuestionType.SINGLE_SELECTION,
      status: QuestionStatus.ADDED_TO_SURVEY,
      surveyId: '1',
    });
    const createdQuestionDetail = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(questionCreated)
      .expect(200);

    expect(createdQuestionDetail).to.have.property('body');
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
    await questionOptionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    questionRepo = await app.getRepository(QuestionRepository);
    questionOptionRepo = await app.getRepository(OptionsRepository);
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
