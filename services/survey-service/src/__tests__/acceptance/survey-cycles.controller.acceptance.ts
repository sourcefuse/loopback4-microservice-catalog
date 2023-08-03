// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {SurveyCycleRepository, SurveyRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {SurveyCycle} from '../../models';
import moment from 'moment';
import {SurveyStatus} from '../../enum';

describe('Survey Cycle Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let surveyCyclesRepo: SurveyCycleRepository;
  let surveyRepo: SurveyRepository;
  const basePath = '/surveys/1/survey-cycles';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  after(deleteMockData);
  it('it gives 200 and adds a survey cycle as response', async () => {
    const currentDate = new Date();
    const surveyCycleToCreate = new SurveyCycle({
      startDate: moment(currentDate).format(),
      endDate: moment(currentDate.setDate(currentDate.getDate() + 10)).format(),
      isActivated: true,
      surveyId: '1',
    });
    await createSurvey();
    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveyCycleToCreate)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('it gives 400 when wrong survey id is passed', async () => {
    const currentDate = new Date();
    const surveyCycleToCreate = new SurveyCycle({
      startDate: moment(currentDate).format(),
      endDate: moment(currentDate.setDate(currentDate.getDate() + 10)).format(),
      isActivated: true,
    });
    await createSurvey();
    await client
      .post(`/surveys/id/survey-cycles`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveyCycleToCreate)
      .expect(400);
  });

  it('will return all the values with status 200', async () => {
    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.length).to.be.greaterThan(0);
  });

  it('will return where the id matches and status 200', async () => {
    await createSurvey();
    const surveyCycle = await addSurveyCycle();

    const response = await client
      .get(`${basePath}/${surveyCycle.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${surveyCycle.body.id}`);
  });

  it('will return 404 if id does not matches', async () => {
    await createSurvey();
    await addSurveyCycle();

    const response = await client
      .get(`${basePath}/934`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
    expect(response).to.be.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('should return count', async () => {
    await createSurvey();
    await addSurveyCycle();
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });
  it('will update the survey cycle where id matches and return 204', async () => {
    const surveyCycleToUpdate = {
      isActivated: false,
    };
    await createSurvey();
    const surveyCycle = await addSurveyCycle();

    await client
      .patch(`${basePath}/${surveyCycle.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyCycleToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${surveyCycle.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.isActivated).to.be.equal(false);
  });

  it('will return 400 if wrong id is passed', async () => {
    const surveyCycleToUpdate = {
      isActivated: false,
    };
    await createSurvey();
    await addSurveyCycle();

    await client
      .patch(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyCycleToUpdate)
      .expect(400);
  });

  it('deletes a survey cycle successfully', async () => {
    await createSurvey();
    const reqToAddSurveyCycle = await addSurveyCycle();
    await client
      .del(`${basePath}/${reqToAddSurveyCycle.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('return 400 if wrong id is paased on deletion', async () => {
    await createSurvey();
    await addSurveyCycle();
    await client
      .del(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .expect(400);
  });

  async function addSurveyCycle() {
    const currentDate = new Date();

    return client
      .post(basePath)
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

  async function deleteMockData() {
    await surveyCyclesRepo.deleteAll();
    await surveyRepo.deleteAll();
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
    surveyCyclesRepo = await app.getRepository(SurveyCycleRepository);
    surveyRepo = await app.getRepository(SurveyRepository);
  }
});
