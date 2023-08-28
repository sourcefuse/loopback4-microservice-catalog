// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {
  SurveyCycleRepository,
  SurveyRepository,
  SurveyResponderRepository,
} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {SurveyResponder} from '../../models';
import moment from 'moment';
import {SurveyStatus} from '../../enum';
import '../../load-env';
const testEmail = 'testuser+test@sourcefuse.com';

describe('Survey Responder Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let surveyResponderRepo: SurveyResponderRepository;
  let surveyRepo: SurveyRepository;
  let surveyCycleRepo: SurveyCycleRepository;
  const basePath = '/surveys/1/survey-responders';
  const cyclebasePath = '/surveys/1/survey-cycles';
  const basePathSurvey = '/surveys';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  after(deleteMockData);
  it('it gives 200 and adds a survey responder as response', async () => {
    await createSurvey();
    const cycle = await addSurveyCycle();
    const surveyResponderToCreate = new SurveyResponder({
      firstName: 'test',
      lastName: 'user',
      email: testEmail,
      userId: 'test123',
      surveyCycleId: `${cycle.body.id}`,
      surveyId: '1',
    });

    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveyResponderToCreate)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('it gives 400 if surveyId does not match in path and payload', async () => {
    await createSurvey();
    const cycle = await addSurveyCycle();
    const surveyResponderToCreate = new SurveyResponder({
      firstName: 'test',
      lastName: 'user',
      email: testEmail,
      userId: 'test123',
      surveyCycleId: `${cycle.body.id}`,
      surveyId: '2',
    });

    await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveyResponderToCreate)
      .expect(400);
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });
  it('gives access token for responders and verify it at the time of get survey', async () => {
    const responders = await surveyResponderRepo.findOne();
    const responderIds = [];
    responderIds.push(responders?.id);
    const response = await client
      .post(`${basePath}/token`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        surveyResponderIds: responderIds,
      })
      .expect(200);

    expect(response.body.tokens.length).to.be.equal(1);
    await client
      .get(`${basePathSurvey}/1`)
      .set('authorization', `Bearer ${response.body.tokens[0]}`)
      .expect(200);
  });
  it('gives 401 if responder is not added to survey', async () => {
    const responders = await surveyResponderRepo.findOne();
    const responderIds = [];
    responderIds.push(responders?.id);
    const response = await client
      .post(`${basePath}/token`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        surveyResponderIds: responderIds,
      })
      .expect(200);
    expect(response.body.tokens.length).to.be.equal(1);
    await client
      .get(`${basePathSurvey}/2`)
      .set('authorization', `Bearer ${response.body.tokens[0]}`)
      .expect(401);
  });

  it('will return all the values with status 200', async () => {
    await createSurvey();
    const cycle = await addSurveyCycle();
    await addSurveyResponder(cycle.body.id);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.length).to.be.greaterThan(0);
  });

  it('should return count', async () => {
    await createSurvey();
    const cycle = await addSurveyCycle();
    await addSurveyResponder(cycle.body.id);
    const response = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.count).to.be.equal(1);
  });

  it('will update the survey responder where id matches and return 204', async () => {
    const surveyResponderToUpdate = {
      firstName: 'testPatch',
    };
    const responders = await surveyResponderRepo.findOne();
    await client
      .patch(`${basePath}/${responders?.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyResponderToUpdate)
      .expect(200);
    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body[0].firstName).to.be.equal('testPatch');
  });

  it('deletes a survey responder successfully', async () => {
    await createSurvey();
    const reqToAddSurveyCycle = await addSurveyCycle();
    await addSurveyResponder(reqToAddSurveyCycle.body.id);
    await client
      .del(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addSurveyCycle() {
    const currentDate = new Date();
    return client
      .post(cyclebasePath)
      .set('authorization', `Bearer ${token}`)
      .send({
        startDate: moment(currentDate).format(),
        endDate: moment(
          currentDate.setDate(currentDate.getDate() + 10),
        ).format(),
        isActivated: true,
        surveyId: '1',
      });
  }

  async function addSurveyResponder(cycleId: string) {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      firstName: 'test',
      lastName: 'user',
      email: testEmail,
      userId: 'test123',
      surveyCycleId: cycleId,
      surveyId: '1',
    });
  }

  async function deleteMockData() {
    await surveyResponderRepo.deleteAllHard();
    await surveyRepo.deleteAllHard();
    await surveyCycleRepo.deleteAllHard();
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
      {
        name: 'Survey 2',
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
    surveyResponderRepo = await app.getRepository(SurveyResponderRepository);
    surveyRepo = await app.getRepository(SurveyRepository);
    surveyCycleRepo = await app.getRepository(SurveyCycleRepository);
    await surveyCycleRepo.createAll([
      {
        startDate: moment().format(),
        endDate: moment().add(10, 'days').format(),
        isActivated: false,
        surveyId: '1',
      },
    ]);
  }
});
