// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {
  SurveyQuestionRepository,
  SurveyRepository,
  SurveyResponderRepository,
  SurveyResponseRepository,
} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {SurveyResponseDto} from '../../models';
import moment from 'moment';
import {SurveyStatus} from '../../enum';

describe('Survey Cycle Response Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let surveyCycleResponseRepo: SurveyResponseRepository;
  let surveyRepo: SurveyRepository;
  let surveyResponderRepo: SurveyResponderRepository;
  let surveyQuestionRepo: SurveyQuestionRepository;
  const basePath = '/surveys/1/survey-responses';
  const cyclebasePath = '/surveys/1/survey-cycles';
  const basePathQuestions = '/questions';
  const basePathResponders = '/surveys/1/survey-responders';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  after(deleteMockData);
  it('it gives 200 and adds a survey response as response', async () => {
    const question = await addQuestion();
    await createSurvey();
    await addSurveyQuestion(question.body.id);
    const cycle = await addSurveyCycle();

    const surveyResponse = new SurveyResponseDto({
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

    await addSurveyResponder(cycle.body.id);
    const responseToken = await client
      .post(`${basePathResponders}/token`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        surveyResponderIds: ['1'],
      })
      .expect(200);

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${responseToken.body.tokens[0]}`)
      .send(surveyResponse)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('will return all the values with status 200', async () => {
    await createSurvey();
    await addSurveyResponse();

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.length).to.be.greaterThan(0);
  });

  it('will return where the id matches and status 200', async () => {
    await createSurvey();
    const surveyResponse = await addSurveyResponse();

    const response = await client
      .get(`${basePath}/${surveyResponse.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${surveyResponse.body.id}`);
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('should return count', async () => {
    await createSurvey();
    await addSurveyResponse();
    const response = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.count).to.be.greaterThanOrEqual(1);
  });

  async function addSurveyResponse() {
    return client
      .post(basePath)
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
    await surveyCycleResponseRepo.deleteAll();
    await surveyRepo.deleteAll();
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
    return surveyRepo.createAll([
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

  async function addSurveyResponder(cycleId = '1') {
    return surveyResponderRepo.createAll([
      {
        firstName: 'test',
        lastName: 'user',
        email: 'testuser+test@sourcefuse.com',
        userId: 'test123',
        surveyId: '1',
        surveyCycleId: cycleId,
      },
    ]);
  }
  async function addSurveyQuestion(id: string) {
    return surveyQuestionRepo.createAll([
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
    surveyCycleResponseRepo = await app.getRepository(SurveyResponseRepository);
    surveyRepo = await app.getRepository(SurveyRepository);
    surveyResponderRepo = await app.getRepository(SurveyResponderRepository);
    surveyQuestionRepo = await app.getRepository(SurveyQuestionRepository);
  }
});
