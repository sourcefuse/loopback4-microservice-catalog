// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {
  SectionRepository,
  SurveyQuestionRepository,
  SurveyRepository,
} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {Section, SurveyQuestionDto} from '../../models';
import moment from 'moment';
import {SurveyStatus} from '../../enum';

describe('Survey Section Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let sectionRepo: SectionRepository;
  let surveyRepo: SurveyRepository;
  const basePath = '/surveys/1/sections';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);
  it('it gives 200 and adds a section as response', async () => {
    const surveySectionToCreate = new Section({
      name: 'test section',
    });
    await createSurvey();
    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveySectionToCreate)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

  it('will return all the values with status 200', async () => {
    await createSurvey();
    await addSection();

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.length).to.be.greaterThan(0);
  });

  it('will return where the id matches and status 200', async () => {
    await createSurvey();
    const section = await addSection();

    const response = await client
      .get(`${basePath}/${section.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${section.body.id}`);
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('should return count', async () => {
    await createSurvey();
    await addSection();
    const response = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.count).to.be.equal(1);
  });
  it('will update the survey  section where id matches and return 204', async () => {
    const surveyToUpdate = {
      name: 'test section patch',
    };
    await createSurvey();
    const surveySection = await addSection();

    await client
      .patch(`${basePath}/${surveySection.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${surveySection.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.name).to.be.equal('test section patch');
  });

  it('deletes a survey section successfully', async () => {
    await createSurvey();
    const reqToAddSurveySection = await addSection();
    await client
      .del(`${basePath}/${reqToAddSurveySection.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  async function addSection() {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      name: 'test section',
    });
  }

  async function deleteMockData() {
    await sectionRepo.deleteAllHard();
    await surveyRepo.deleteAllHard();
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
        isPeriodicReassessment: false,
        surveyText:
          'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
        status: SurveyStatus.DRAFT,
      },
    ]);
  }

  async function givenRepositories() {
    sectionRepo = await app.getRepository(SectionRepository);
    surveyRepo = await app.getRepository(SurveyRepository);
  }
});
