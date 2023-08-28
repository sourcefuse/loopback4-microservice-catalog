// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {SurveyQuestionRepository, SurveyRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {SurveyQuestionDto} from '../../models';
import moment from 'moment';
import {SurveyStatus} from '../../enum';

describe('Survey Question Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let surveyQuestionRepo: SurveyQuestionRepository;
  let surveyRepo: SurveyRepository;

  const basePath = '/surveys/1/survey-questions';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  after(deleteMockData);
  it('it gives 200 and adds a survey  question as response', async () => {
    const surveyQuestionToCreate = new SurveyQuestionDto({
      questionId: '2',
      displayOrder: 2,
    });
    await createSurvey();
    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveyQuestionToCreate)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('will return all the values with status 200', async () => {
    await createSurvey();
    await addSurveyQuestion();

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.length).to.be.greaterThan(0);
  });

  it('will return where the id matches and status 200', async () => {
    await createSurvey();
    const surveyQuestion = await addSurveyQuestion();

    const response = await client
      .get(`${basePath}/${surveyQuestion.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${surveyQuestion.body.id}`);
  });
  it('will throw error if id does not matches', async () => {
    await createSurvey();
    await client
      .get(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .query({filter: {where: {id: 'id'}}})
      .expect(404);
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('should return count', async () => {
    await createSurvey();
    await addSurveyQuestion();
    const response = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.count).to.be.greaterThanOrEqual(1);
  });
  it('will update the survey  question where id matches and return 204', async () => {
    const surveyToUpdate = {
      displayOrder: 4,
    };
    await createSurvey();
    const surveyQuestion = await addSurveyQuestion();

    await client
      .patch(`${basePath}/${surveyQuestion.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${surveyQuestion.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.displayOrder).to.be.equal(4);
  });
  it('will return 404 if no survey question found', async () => {
    const surveyToUpdate = {
      displayOrder: 4,
    };
    await createSurvey();
    await addSurveyQuestion();

    await client
      .patch(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);
  });

  it('will update all the survey question and return 200', async () => {
    const questionToUpdate = {
      createdBy: 'update_by',
      modifiedBy: 'update_by',
    };
    await createSurvey();
    await addSurveyQuestion();
    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(questionToUpdate)
      .expect(200);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body[0]).to.have.properties(['createdBy']);
    expect(response.body[0].createdBy).to.be.equal('update_by');
  });

  it('deletes a survey questions successfully', async () => {
    await createSurvey();
    const reqToAddSurveyQuestion = await addSurveyQuestion();
    await client
      .del(`${basePath}/${reqToAddSurveyQuestion.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });
  it('return 400 if entity not found', async () => {
    await createSurvey();
    await addSurveyQuestion();
    await client
      .del(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should increase display order by 1', async () => {
    await createSurvey();
    const surveyQuestion = await addSurveyQuestion();
    await client
      .patch(`${basePath}/reorder`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyQuestion.body)
      .expect(204);
    await client
      .get(`${basePath}/${surveyQuestion.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });
  it('should return 400 if no display order exist for survey question', async () => {
    await createSurvey();
    const surveyQuestion = surveyQuestionRepo.create({
      questionId: '3',
    });
    await client
      .patch(`${basePath}/reorder`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyQuestion)
      .expect(400);
  });

  async function addSurveyQuestion() {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      questionId: '3',
      displayOrder: 3,
    });
  }

  async function deleteMockData() {
    await surveyQuestionRepo.deleteAllHard();
    await surveyRepo.deleteAllHard();
  }

  async function createSurvey() {
    const currentDate = new Date();
    await surveyRepo.createAll([
      {
        name: 'Survey 1',
        startDate: moment(currentDate).format(),
        endDate: moment(
          currentDate.setDate(currentDate.getDate() + 10),
        ).format(),
        surveyText:
          'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
        status: SurveyStatus.DRAFT,
      },
    ]);
  }

  async function givenRepositories() {
    surveyQuestionRepo = await app.getRepository(SurveyQuestionRepository);
    surveyRepo = await app.getRepository(SurveyRepository);
  }
});
