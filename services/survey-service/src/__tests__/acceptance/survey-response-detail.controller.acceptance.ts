// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {
  SurveyQuestionRepository,
  SurveyRepository,
  SurveyResponderRepository,
  SurveyResponseDetailRepository,
  SurveyResponseRepository,
} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import moment from 'moment';
import {SurveyStatus} from '../../enum';

describe('SurveyResponseDetailViewController', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let surveyResponseDetailRepo: SurveyResponseDetailRepository;
  let surveyResponseRepo: SurveyResponseRepository;
  let surveyRepo: SurveyRepository;
  let surveyResponderRepo: SurveyResponderRepository;
  let surveyQuestionRepo: SurveyQuestionRepository;
  const cyclebasePath = '/surveys/1/survey-cycles';
  const basePathQuestions = '/questions';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

  it('will return all the values with status 200', async () => {
    const question = await addQuestion();
    await createSurvey();
    await addSurveyQuestion(question.body.id);
    const cycle = await addSurveyCycle();
    await addSurveyResponder();
    await addSurveyResponse();

    const response = await client
      .get(`/survey-cycles/${cycle.body.id}/survey-response-detail-view`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.property('body');
  });

  it('will return where the id matches and status 200', async () => {
    const question = await addQuestion();
    await createSurvey();
    await addSurveyQuestion(question.body.id);
    const cycle = await addSurveyCycle();
    await addSurveyResponder();
    const surveyResponse = await addSurveyResponse();

    const response = await client
      .get(
        `/survey-cycles/${cycle.body.id}/survey-response-detail-view/${surveyResponse.body.id}`,
      )
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${surveyResponse.body.id}`);
  });

  it('should return count', async () => {
    const question = await addQuestion();
    await createSurvey();
    await addSurveyQuestion(question.body.id);
    const cycle = await addSurveyCycle();
    await addSurveyResponder();

    await addSurveyResponse();
    const response = await client
      .get(`/survey-cycles/${cycle.body.id}/survey-response-detail-view//count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.count).to.be.equal(1);
  });

  async function addSurveyResponse() {
    return client
      .post(`/surveys/1/survey-responses`)
      .set('authorization', `Bearer ${token}`)
      .send({
        surveyResponseDetailArray: [
          {
            questionId: '1',
            answer: {
              optionId: '2',
            },
          },
        ],
        surveyResponderId: '1',
      });
  }

  async function deleteMockData() {
    await surveyResponderRepo.deleteAllHard();
    await surveyQuestionRepo.deleteAllHard();
    await surveyResponseRepo.deleteAllHard();
    await surveyResponseDetailRepo.deleteAllHard();
    await surveyRepo.deleteAllHard();
  }

  async function addQuestion() {
    const questionToAdd = {
      questionType: 'Single Selection',
      name: 'Question 1',
    };
    return client
      .post(basePathQuestions)
      .set('authorization', `Bearer ${token}`)
      .send(questionToAdd);
  }

  async function createSurvey() {
    const currentDate = new Date();
    await surveyRepo.createAll([
      {
        id: '1',
        name: 'Survey 1',
        startDate: moment(currentDate).format(),
        endDate: moment(
          currentDate.setDate(currentDate.getDate() + 10),
        ).format(),
        surveyText:
          'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
        status: SurveyStatus.ACTIVE,
      },
    ]);
  }

  async function addSurveyResponder() {
    await surveyResponderRepo.createAll([
      {
        firstName: 'test',
        lastName: 'user',
        email: 'testuser+test@sourcefuse.com',
        userId: 'test123',
        surveyId: '1',
        id: '1',
        surveyCycleId: '1',
      },
    ]);
  }
  async function addSurveyQuestion(id: string) {
    await surveyQuestionRepo.createAll([
      {
        questionId: id,
        displayOrder: 1,
        surveyId: '1',
      },
    ]);
  }
  async function addSurveyCycle() {
    const currentDate = new Date();
    return client
      .post(cyclebasePath)
      .set('authorization', `Bearer ${token}`)
      .send({
        startDate: moment(
          currentDate.setDate(currentDate.getDate() - 5),
        ).format(),
        endDate: moment(
          currentDate.setDate(currentDate.getDate() + 5),
        ).format(),
        isActivated: true,
        surveyId: '1',
      });
  }

  async function givenRepositories() {
    surveyResponseRepo = await app.getRepository(SurveyResponseRepository);
    surveyResponseDetailRepo = await app.getRepository(
      SurveyResponseDetailRepository,
    );
    surveyRepo = await app.getRepository(SurveyRepository);
    surveyResponderRepo = await app.getRepository(SurveyResponderRepository);
    surveyQuestionRepo = await app.getRepository(SurveyQuestionRepository);
  }
});
