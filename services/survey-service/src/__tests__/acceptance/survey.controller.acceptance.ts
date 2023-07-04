// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {SurveyRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {surveyRequestBody} from '../datasources/mockdata';
import {SurveyStatus} from '../../enum';
import moment from 'moment';
import {Survey} from '../../models';

describe('Survey Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let surveyRepo: SurveyRepository;
  const basePath = '/surveys';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  beforeEach(givenRepositories);
  afterEach(deleteMockData);
  it('it gives 200 and adds a survey as response', async () => {
    const currentDate = new Date();

    const surveyToCreate = new Survey({
      name: 'Survey Test 1',
      startDate: moment(currentDate).format(),
      endDate: moment(currentDate.setDate(currentDate.getDate() + 10)).format(),
      isPeriodicReassessment: false,
      surveyText:
        'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
      status: SurveyStatus.DRAFT,
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
    const reqToAddSurvey = await addSurvey();

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('will return where the id matches and status 200', async () => {
    const reqToAddSurvey = await addSurvey();
    const response = await client
      .get(`${basePath}/${reqToAddSurvey.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${reqToAddSurvey.body.id}`);
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
    const reqToAddSurvey = await addSurvey();
    await client
      .del(`${basePath}/${reqToAddSurvey.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  async function addSurvey() {
    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(surveyRequestBody);
  }

  async function deleteMockData() {
    await surveyRepo.deleteAllHard();
  }

  async function givenRepositories() {
    surveyRepo = await app.getRepository(SurveyRepository);
    const currentDate = new Date();
    await surveyRepo.createAll([
      {
        id: '1',
        name: 'Survey 1',
        startDate: moment(currentDate).format(),
        endDate: moment(
          currentDate.setDate(currentDate.getDate() + 10),
        ).format(),
        isPeriodicReassessment: false,
        surveyText:
          'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
        status: SurveyStatus.DRAFT,
      },
    ]);
  }
});
