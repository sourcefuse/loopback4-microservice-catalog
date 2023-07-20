// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {
  QuestionRepository,
  SectionRepository,
  SurveyCycleRepository,
  SurveyQuestionRepository,
  SurveyRepository,
  SurveyResponderRepository,
} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {surveyRequestBody} from '../datasources/mockdata';
import {QuestionStatus, QuestionType, SurveyStatus} from '../../enum';
import moment from 'moment';
import {Survey} from '../../models';

const DATE_FORMAT = 'YYYY-MM-DD';
const surveyText =
  'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=';

describe('Survey Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let surveyRepo: SurveyRepository;
  let questionRepo: QuestionRepository;
  let surveyQuestionRepo: SurveyQuestionRepository;
  let surveyCycleRepo: SurveyCycleRepository;
  let sectionRepo: SectionRepository;
  let surveyResponderRepo: SurveyResponderRepository;

  const basePath = '/surveys';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  after(deleteMockData);
  it('it gives 200 and adds a survey as response', async () => {
    const surveyToCreate = new Survey({
      name: 'Survey Test 1',
      startDate: moment().utc().format(DATE_FORMAT),
      endDate: moment().utc().add(10, 'days').format(DATE_FORMAT),
      surveyText: surveyText,
      status: SurveyStatus.ACTIVE,
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveyToCreate)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('will return all the values with status 200', async () => {
    await addSurvey();
    await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

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
  it('will update the survey where id matches and return 204', async () => {
    const surveyToUpdate = {
      name: 'test patch',
    };
    await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.name).to.be.equal('test patch');
  });

  it('deletes a survey successfully', async () => {
    await client
      .del(`${basePath}/3`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('gives 400 on delete if status is not draft', async () => {
    await client
      .del(`${basePath}/2`)
      .set('authorization', `Bearer ${token}`)
      .expect(400);
  });
  it('deletes survey questions on survey deletion', async () => {
    await addSurvey();
    await surveyQuestionRepo.create({
      surveyId: '4',
      questionId: '2',
      displayOrder: 2,
    });
    await client
      .del(`${basePath}/4`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
    const ques = await surveyQuestionRepo.findOne({where: {surveyId: '4'}});
    expect(ques).to.be.equal(null);
  });
  it('will return 400 if status in patch request is active and no start date is added', async () => {
    const surveyToUpdate = {
      status: SurveyStatus.ACTIVE,
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('will return 400 if end date is less than start date', async () => {
    const surveyToUpdate = {
      startDate: moment().format(DATE_FORMAT),
      endDate: moment().subtract(10, 'd').format(DATE_FORMAT),
      status: SurveyStatus.ACTIVE,
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('will return 400 if status in post request is active and no start date is added', async () => {
    const surveyBody = new Survey({
      name: 'Survey Test',
      surveyText: surveyText,
      status: SurveyStatus.ACTIVE,
    });
    const response = await client
      .post(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyBody)
      .expect(400);
    expect(response).to.have.property('error');
  });

  it('will return 400 if start date is added and status is draft', async () => {
    const surveyToUpdate = {
      startDate: moment().format(DATE_FORMAT),
      status: SurveyStatus.DRAFT,
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('will return 400 if start date is added and no status is added', async () => {
    const surveyToUpdate = {
      startDate: moment().format(DATE_FORMAT),
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('it gives 400 when name property has all spaces added', async () => {
    const surveyToUpdate = {
      name: '        ',
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('it gives 400 when only end date and status are added to activate survey', async () => {
    const surveyToUpdate = {
      endDate: moment().add(10, 'd').format(DATE_FORMAT),
      status: 'Active',
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('it gives 400 when start date and status are added to activate survey but start date is not current date', async () => {
    const surveyToUpdate = {
      startDate: moment().add(10, 'd').format(DATE_FORMAT),
      status: 'Active',
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('it gives 400 when end date is a past date', async () => {
    const surveyToUpdate = {
      endDate: moment().subtract(10, 'days').format(DATE_FORMAT),
    };
    const response = await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('it gives 400 when trying to activate survey without a start date', async () => {
    const surveyToAdd = {
      endDate: moment().add(10, 'd').format(DATE_FORMAT),
      status: 'Active',
      name: 'Survey dummy',
      surveyText: surveyText,
    };
    const response = await client
      .post(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToAdd)
      .expect(400);

    expect(response).to.have.property('error');
  });

  it('it gives 200 when passing baseSurveyId', async () => {
    const surveyToAdd = {
      endDate: moment().add(10, 'd').format(DATE_FORMAT),
      status: 'Draft',
      name: 'Survey Base',
      surveyText: surveyText,
      baseSurveyId: '1',
    };
    const response = await client
      .post(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToAdd)
      .expect(200);

    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('it gives 200 and added base survey ID', async () => {
    await addQuestion();
    await addSurvey();
    await addSectionWithRepo();
    await addSurveyQuestions();
    await addSurveyCycle();
    await addSurveyResponder();
    const surveyToAdd = {
      endDate: moment().utc().add(10, 'd').format(DATE_FORMAT),
      startDate: moment().utc().format(DATE_FORMAT),
      status: 'Active',
      name: 'Survey Base',
      surveyText: surveyText,
      baseSurveyId: '5',
    };

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveyToAdd)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  async function addSurvey(surveyBody = surveyRequestBody) {
    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(surveyBody);
  }

  async function deleteMockData() {
    await surveyRepo.deleteAllHard();
  }

  async function addSectionWithRepo() {
    return sectionRepo.createAll([
      {
        name: 'test section 1',
        displayOrder: 1,
        surveyId: '1',
      },

      {
        name: 'test section 2',
        displayOrder: 3,
        surveyId: '1',
      },
      {
        name: 'test section',
        surveyId: '1',
      },
    ]);
  }

  async function givenRepositories() {
    questionRepo = await app.getRepository(QuestionRepository);
    surveyRepo = await app.getRepository(SurveyRepository);
    surveyQuestionRepo = await app.getRepository(SurveyQuestionRepository);
    surveyResponderRepo = await app.getRepository(SurveyResponderRepository);
    surveyCycleRepo = await app.getRepository(SurveyCycleRepository);
    surveyQuestionRepo = await app.getRepository(SurveyQuestionRepository);
    sectionRepo = await app.getRepository(SectionRepository);
    return surveyRepo.createAll([
      {
        name: 'Survey 1',
        surveyText: surveyText,
        status: SurveyStatus.DRAFT,
      },
    ]);
  }

  async function addSurveyCycle() {
    await surveyCycleRepo.createAll([
      {
        startDate: '2023-07-26 05:29:57.293',
        endDate: '2023-07-29 05:29:57.293',
        isActivated: true,
        surveyId: '1',
      },
    ]);
  }
  async function addSurveyQuestions() {
    await surveyQuestionRepo.createAll([
      {
        surveyId: '1',
        questionId: '3',
        displayOrder: 3,
      },
    ]);
  }

  async function addSurveyResponder() {
    await surveyResponderRepo.create({
      firstName: 'test',
      lastName: 'user',
      email: 'testuser+test@sourcefuse.com',
      userId: 'test123',
      surveyCycleId: 'cycleId',
      surveyId: '1',
    });
  }

  async function addQuestion() {
    await questionRepo.create({
      uid: 'QR00001',
      questionType: QuestionType.SINGLE_SELECTION,
      name: 'Question 101',
      status: QuestionStatus.ADDED_TO_SURVEY,
    });
  }
});
